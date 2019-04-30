
sharkgame.titlebar = {
    saveLink: {
        name: "save",
        main: true,
        onClick: function() {
            try {
                try {
                    sharkgame.save.saveGame();
                } catch(err) {
                    sharkgame.log.addError(err);
                    console.log(err);
                }
                sharkgame.log.addMessage("saved game.");
            } catch(err) {
                sharkgame.log.addError(err.message);
            }

        }
    },

    optionsLink: {
        name: "options",
        main: true,
        onClick: function() {
            sharkgame.ui.showOptions();
        }
    },

    helpLink: {
        name: "help",
        main: true,
        onClick: function() {
            sharkgame.ui.showHelp();
        }
    },

    skipLink: {
        name: "skip",
        main: true,
        onClick: function() {
            if(sharkgame.main.isFirstTime()) {  // save people stranded on home world
                if(confirm("Do you want to reset your game?")) {
                    // just reset
                    sharkgame.main.init();
                }
            } else {
                if(confirm("Is this world causing you too much trouble? Want to go back to the gateway?")) {
                    sharkgame.wonGame = false;
                    sharkgame.main.endGame();
                }
            }
        }
    }
};

sharkgame.tabs = {
    current: 'home'
};

sharkgame.main = {

    tickHandler: -1,
    autosaveHandler: -1,

    beautify: sharkgame.utilui.beautify,
    colorLum: sharkgame.utilui.colorLum,
    formatTime: sharkgame.utilui.formatTime,
    toTitleCase: sharkgame.utilui.toTitleCase,

    init: function() {

        var currDate = new Date();
        sharkgame.before = currDate;
        if(sharkgame.GAME_NAME === null) {
            sharkgame.GAME_NAME = sharkgame.choose(sharkgame.GAME_NAMES);
            document.title = sharkgame.ACTUAL_GAME_NAME + ": " + sharkgame.GAME_NAME;
        }
        // $('#sidebar').hide();
        var overlay = $('#overlay');
        overlay.hide();
        $('#gameName').html(sharkgame.GAME_NAME);
        $('#versionNumber').html("v " + sharkgame.VERSION + " — " + sharkgame.VERSION_NAME);
        // sharkgame.sidebarHidden = true;
        sharkgame.gameOver = false;

        // remove any errant classes
        $('#pane').removeClass("gateway");
        overlay.removeClass("gateway");

        // initialise timestamps to something sensible
        sharkgame.timestampLastsave = sharkgame.timestampLastsave || currDate.getTime();
        sharkgame.timestampGameStart = sharkgame.timestampGameStart || currDate.getTime();
        sharkgame.timestampRunStart = sharkgame.timestampRunStart || currDate.getTime();

        // preserve settings or set defaults
        $.each(sharkgame.settings, function(k, v) {
            if(k === "current") {
                return;
            }
            var currentSetting = sharkgame.settings.current[k];
            if(typeof(currentSetting) === "undefined") {
                sharkgame.settings.current[k] = v.defaultSetting
            }
        });

        // initialise and reset resources
        sharkgame.resources.init();

        // initialise world
        // MAKE SURE gate IS INITIALISED AFTER world!!
        sharkgame.world.init();
        sharkgame.world.apply();

        sharkgame.gateway.init();
        sharkgame.gateway.applyArtifacts(); // if there's any effects to carry over from a previous run

        // reset log
        sharkgame.log.clearMessages();

        // initialise tabs
        sharkgame.home.init();
        sharkgame.lab.init();
        sharkgame.stats.init();
        sharkgame.gate.init();
        sharkgame.reflection.init();

        sharkgame.ui.setUptitlebar();

        sharkgame.tabs.current = "home";

        // load save game data if present
        if(sharkgame.save.savedGameExists()) {
            try{
                sharkgame.save.loadGame();
                sharkgame.log.addMessage("Loaded game.");
            } catch(err) {
                sharkgame.log.addError(err.message);
            }
        }

        // rename a game option if this is a first time run
        if(sharkgame.main.isFirstTime()) {
            sharkgame.titlebar.skipLink.name = "reset";
            sharkgame.ui.setUptitlebar();
        }

        // discover actions that were present in last save
        sharkgame.home.discoverActions();

        // set up tab after load
        sharkgame.ui.setUpTab();


        if(sharkgame.main.tickHandler === -1) {
            sharkgame.main.tickHandler = setInterval(sharkgame.main.tick, sharkgame.INTERVAL);
        }

        if(sharkgame.main.autosaveHandler === -1) {
            sharkgame.main.autosaveHandler = setInterval(sharkgame.main.autosave, sharkgame.settings.current.autosaveFrequency * 60000);
        }
    },

    checkTabUnlocks: function() {
        $.each(sharkgame.tabs, function(k, v) {
            if(k === "current" || v.discovered) {
                return;
            }
            var reqsMet = true;

            // check resources
            if(v.discoverReq.resource) {
                reqsMet = reqsMet && sharkgame.resources.checkresources(v.discoverReq.resource, true);
            }

            // check upgrades
            if(v.discoverReq.upgrade) {
                $.each(v.discoverReq.upgrade, function(_, value) {
                    if(sharkgame.upgrades[value]) {
                        reqsMet = reqsMet && sharkgame.upgrades[value].purchased;
                    } else {
                        reqsMet = false; // can't have a nonexistent upgrade
                    }
                });
            }

            if(reqsMet) {
                // unlock tab!
                sharkgame.ui.discoverTab(k);
                sharkgame.log.addDiscovery("Discovered " + v.name + "!");
            }
        });
    },

    processSimTime: function(numberOfSeconds) {
        var r = sharkgame.resources;

        // income calculation
        r.processIncomes(numberOfSeconds);
    },

    autosave: function() {
        try {
            sharkgame.save.saveGame();
            sharkgame.log.addMessage("Autosaved.");
        } catch(err) {
            sharkgame.log.addError(err.message);
            console.log(err.trace);
        }
    },

    onOptionClick: function() {
        var buttonlabel = $(this).attr("id");
        var settingInfo = buttonlabel.split("-");
        var settingName = settingInfo[1];
        var optionIndex = parseInt(settingInfo[2]);

        // change setting to specified setting!
        sharkgame.settings.current[settingName] = sharkgame.settings[settingName].options[optionIndex];

        // update relevant table cell!
//        $('#option-' + settingName)
//            .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

        // enable all buttons
        $('button[id^="optionButton-' + settingName + '"]').prop("disabled", false);

        // disable this button
        $(this).attr("disabled", "true");

        // if there is a callback, call it, else call the no op
        (sharkgame.settings[settingName].onChange || $.noop)();
    },

    endGame: function(loadingFromsave) {
        // stop autosaving
        clearInterval(sharkgame.main.autosaveHandler);
        sharkgame.main.autosaveHandler = -1;

        // flag game as over
        sharkgame.gameOver = true;

        // grab end game timestamp
        sharkgame.timestampRunEnd = (new Date()).getTime();

        // kick over to passage
        sharkgame.gateway.entergate(loadingFromsave);
    },

    purgeGame: function() {
        // empty out all the containers!
        $('#status').empty();
        sharkgame.log.clearMessages();
        $('#content').empty();
    },

    loopGame: function() {
        if(sharkgame.gameOver) {
            sharkgame.gameOver = false;
            sharkgame.wonGame = false;
            sharkgame.ui.showPane();

            // copy over all special category resources
            // artifacts are preserved automatically within gateway file
            var backup = {};
            _.each(sharkgame.resourcecategories.special.resources, function(resourceName) {
                backup[resourceName] = {amount: sharkgame.resources.getResource(resourceName), totalAmount: sharkgame.resources.getTotalResource(resourceName)};
            });

            sharkgame.save.deletesave(); // otherwise it will be loaded during main init and fuck up everything!!
            sharkgame.main.init();
            sharkgame.log.addMessage(sharkgame.world.getworldEntryMessage());

            // restore special resources
            $.each(backup, function(resourceName, resourceData) {
                sharkgame.resources.setResource(resourceName, resourceData.amount);
                sharkgame.resources.setTotalResource(resourceName, resourceData.totalAmount);
            });

            sharkgame.timestampRunStart = (new Date()).getTime();
            try {
                sharkgame.save.saveGame();
                sharkgame.log.addMessage("Game saved.");
            } catch(err) {
                sharkgame.log.addError(err.message);
                console.log(err.trace);
            }
        }
    },

    isFirstTime: function() {
        return sharkgame.world.worldType === "start" && !(sharkgame.resources.getTotalResource("essence") > 0);
    },

    // DEBUG FUNCTIONS
    discoverAll: function() {
        $.each(sharkgame.tabs, function(k, v) {
            if(k !== "current") {
                sharkgame.main.discoverTab(k);
            }
        });
    }
};


$(document).ready(function() {
    $('#game').show();
    sharkgame.main.init();

    // ctrl+s saves
    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's':
                    event.preventDefault();
                    sharkgame.save.saveGame();
                    break;
                case 'o':
                    event.preventDefault();
                    sharkgame.ui.showOptions();
                    break;
            }
        }
    });
});
