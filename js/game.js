/* jshint indent:4, latedef:true, undef:true, strict: true, trailing: true, browser:true, jquery:true */
/* global GameManager, ShakeMonitor */
(function () {
    "use strict";

    /* ----- Executed at startup ----- */
    var sm, gm, testing = false;

    window.onload = function () {
        gm = new GameManager();
        sm = new ShakeMonitor(onInit);

        if (testing) {
            document.getElementById("browsersux").style.display = "none";
            document.getElementById("main").style.display = "block";
            document.getElementById("b_shake").style.display = "inline";
        }
        gm.addUpdateListener(renderUpdate);
        setInterval(decreaseTurbulence,1000);
        setInterval(mvBoost,1000);

        // Add click listeners
        document.getElementById("b_shake").addEventListener("click", function () {
            updateShake(0,4.27);
        }, false);
        document.getElementById("b_store").addEventListener("click", showStore, false);
        document.getElementById("b_buy").addEventListener("click", buyMV, false);
        document.getElementById("b_hide_store").addEventListener("click", hideStore, false);
    };

    /* ----- Event handlers ----- */
    function onInit() {
        document.getElementById("browsersux").style.display = "none";
        document.getElementById("main").style.display = "block";

        sm.start(onShake);
    }

    function onShake(e1, e2) {
        var x1 = e1.accelerationIncludingGravity.x,
            y1 = e1.accelerationIncludingGravity.y,
            z1 = e1.accelerationIncludingGravity.z,

            x2 = e2.accelerationIncludingGravity.x,
            y2 = e2.accelerationIncludingGravity.y,
            z2 = e2.accelerationIncludingGravity.z;

        updateShake(z1, z2);
    }

    function decreaseTurbulence() {
        gm.decreaseTurbulence();
    }

    function mvBoost() {
        var tt = gm.getTurbulenceTier();
        var bonus = gm.mv * gm.MV_TIER[tt];
        gm.addMilk(bonus);
    }

    /* ----- Button clicks ----- */
    function buyMV() {
        gm.buyMV();
    }

    function showStore() {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("store").style.display = "block";
    }

    function hideStore() {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("store").style.display = "none";
    }

    /* ----- Update rendering ----- */
    function updateShake(z1, z2) {
        var diff = Math.abs(z2 - z1);
        gm.shakeMilk(diff);

        document.getElementById("milk_overlay").innerHTML = "+ " + diff.toFixed(1) + " mL";
        anim_milk_overlay();
    }

    function anim_milk_overlay() {
        var $mo = $("#milk_overlay");
        $mo.css("left", 125 - $mo.width() / 2);

        $mo.removeClass("flash-move");
        $mo[0].offsetWidth = $mo[0].offsetWidth; // magic
        $mo.addClass("flash-move");
    }

    function renderUpdate() {
        document.getElementById("counter").innerHTML = Math.round(gm.milk)+" mL";
        document.getElementById("store_milk").innerHTML = Math.round(gm.milk)+" mL";
        renderTurbulence();
        renderMV();
    }

    function renderTurbulence() {
        var td = document.getElementById("turbulence_desc");
        switch (gm.getTurbulenceTier()) {
            case 1:
                td.innerHTML = "Shake to make some milk!";
                anim_milk("");
                break;
            case 2:
                td.innerHTML = "Slightly disturbed";
                anim_milk("wobble1");
                break;
            case 3:
                td.innerHTML = "Agitated";
                anim_milk("wobble2");
                break;
            case 4:
                td.innerHTML = "Getting there...";
                anim_milk("wobble3");
                break;
            case 5:
                td.innerHTML = "Milk Party!";
                anim_milk("wobble4");
                break;
            default:
                break;
        }
        anim_turbulence();
    }

    function renderMV() {
        var bb = document.getElementById("b_buy");
        if (gm.canBuyMV()) {
            bb.disabled = false;
        }
        else {
            bb.disabled = true;
        }

        if (gm.MV_COST[gm.mv]) {
            bb.innerHTML = "Buy one for "+gm.MV_COST[gm.mv]+" mL";
        }
        else {
            bb.innerHTML = "SOLD OUT";
        }

        if (gm.mv > 0) {
            var tt = gm.getTurbulenceTier();
            var bonus = gm.mv * gm.MV_TIER[tt];
            document.getElementById("bonus_desc").innerHTML = "+ "+bonus.toFixed(1)+"mL/s";
        }
    }

    function anim_turbulence() {
        var $td = $("#turbulence_desc");
        if (gm.getTurbulenceTier() != 5) {
            $td.removeClass();
        }
        else if (!$td.hasClass("rainbow")) {
            $td.removeClass();
            $td[0].offsetWidth = $td[0].offsetWidth; // magic
            $td.addClass("rainbow");
        }
    }

    function anim_milk(anim_class) {
        var $mo = $("#milk");
        if (!$mo.hasClass(anim_class)) {
            $mo.removeClass();
            $mo[0].offsetWidth = $mo[0].offsetWidth; // magic
            $mo.addClass(anim_class);
        }
    }

}());
