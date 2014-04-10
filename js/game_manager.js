function GameManager() {
	this.milk = 0;
	this.items = {};
	// {"itemName": {"cost": cost, "max": amount}}
	this.ITEM_COSTS = {"mv": {"cost": 50}, "thing": {"cost": 50, "max": 2}}
}

GameManager.prototype.addMilk = function(milk) {
	this.milk += milk;
};

GameManager.prototype.purchase = function(item, callback) {
	if (this.canPurchase(item)) {
		// Subtract milk
		this.milk -= this.ITEM_COSTS[item]["cost"];
		// Add item
		if (!this.items[item]) {
			// No item, so create item
			this.items[item] = 0;
		}
		this.items[item] += 1;
	}
};

GameManager.prototype.canPurchase = function(item) {
	var enoughMilk = this.ITEM_COSTS[item] && this.milk >= this.ITEM_COSTS[item]["cost"];
	var belowLimit = !this.ITEM_COSTS[item]["max"] || !this.items[item] || this.items[item] < this.ITEM_COSTS[item]["max"];
	return enoughMilk && belowLimit;
};
