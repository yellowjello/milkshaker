function GameManager() {
    this.milk = 0;
    this.mv = 0;
    this.callbacks = [];
    this.turbulence = 0;
    this.MAX_TURBULENCE = 110;
    this.TURBULENCE_TIER = {0: 1, 10: 2, 25: 3, 50: 4, 90: 5 };
    this.MV_TIER = {1: 0.1, 2: 0.2, 3: 0.5, 4: 1, 5: 2};
    this.MV_COST = {0: 100, 1: 150, 2: 200, 3: 300, 4: 500, 5: 700, 6: 1000};
}

GameManager.prototype.shakeMilk = function (milk) {
    this.turbulence += milk;
    if (this.turbulence > this.MAX_TURBULENCE) {
        this.turbulence = this.MAX_TURBULENCE;
    }
    this.addMilk(milk);
};

GameManager.prototype.addMilk = function (milk) {
    this.milk += milk;
    this.notifyUpdate();
};

GameManager.prototype.decreaseTurbulence = function () {
    var amtDecrease = Math.pow(this.turbulence, 1.3) / 500 + 0.9;
    this.turbulence -= amtDecrease;
    if (this.turbulence < 0) {
        this.turbulence = 0;
    }
    this.notifyUpdate();
};

GameManager.prototype.getTurbulenceTier = function () {
    // Get the turbulence for the highest achieved tier
    var turbulence = Math.max.apply(null, Object.keys(this.TURBULENCE_TIER).filter(function (val) {
        return val <= this.turbulence;
    }, this));

    return this.TURBULENCE_TIER[turbulence];
};

GameManager.prototype.buyMV = function () {
    if (this.canBuyMV()) {
        // Subtract milk
        this.milk -= this.MV_COST[this.mv];
        // Add item
        this.mv += 1;
        this.notifyUpdate();
    }
};

GameManager.prototype.canBuyMV = function () {
    return this.MV_COST[this.mv] && this.milk >= this.MV_COST[this.mv];
};

GameManager.prototype.addUpdateListener = function (callback) {
    this.callbacks.push(callback);
};

GameManager.prototype.removeUpdateListener = function (callback) {
    var ind = this.callbacks.indexOf(callback);
    if (ind > -1) {
        this.callbacks.splice(ind,1);
    }
};

GameManager.prototype.notifyUpdate = function () {
    this.callbacks.forEach(function (callback) {
        callback();
    });
};
