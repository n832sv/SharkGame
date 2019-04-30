var sharkgame = sharkgame || {};


// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(sharkgame, {
    GAME_NAMES: [
		"Five Seconds A Shark",
        "Fin Idle",
        "Ray of Dreams",
        "Shark Saver",
        "Shoal Sharker",
        "Shark Souls",
        "Saucy Sharks",
        "Sharkfall",
        "Heart of Sharkness",
        "Sharks and Recreation",
        "Alone in the Shark",
        "Sharkpocalypse",
        "Shark of Darkness",
        "Strange Oceans"
    ],
    GAME_NAME: null,
    ACTUAL_GAME_NAME: "Shark Game",
    VERSION: 1.01,
    VERSION_NAME: "Ocean stranger",
    EPSILON: 1E-6, // floating point comparison is a joy

    INTERVAL: (1000 / 10), // 20 FPS
    dt: (1 / 10),
    before: new Date(),

    timestampLastSave: false,
    timestampGameStart: false,
    timestampRunStart: false,
    timestampRunEnd: false,

    sidebarHidden: true,
    paneGenerated: false,

    gameOver: false,
    wonGame: false,

    ending: "<p>Congratulations! You did it.<br/>You saved the sharks!</p>" +
    "<p>The gate leads away from this strange ocean...</p>" +
    "<p>Back home to the oceans you came from!</p>" +
    "<h3>Or are they?</h3>",

    help: "<p>This game is a game about discovery, resources, and does not demand your full attention. " +
    "You are free to pay as much attention to the game as you want. " +
    "It will happily run in the background, and works even while closed.</p>" +
    "<p>To begin, you should catch fish. Once you have some fish, more actions will become available. " +
    "If you have no idea what these actions do, click the \"Toggle descriptions\" button for more information.</p>" +
    "<p>If you are ever stuck, try actions you haven't yet tried. " +
    "Remember, though, that sometimes patience is the only way forward. Patience and ever escalating numbers.</p>",

    spriteIconPath: "img/sharksprites.png",
    spriteHomeEventPath: "img/sharkeventsprites.png",

    choose: function(choices) {
        return choices[Math.floor(Math.random() * choices.length)];
    },
    log10: function(val) {
        return Math.log(val) / Math.LN10;
    },
    plural: function(number) {
        return (number === 1) ? "" : "s";
    },

    getImageIconHTML: function(imagePath, width, height) {
        if(!imagePath) {
            imagePath = "http://placekitten.com/g/" + Math.floor(width) + "/" + Math.floor(height);
        }
        var imageHtml = "";
        if(sharkgame.Settings.current.iconPositions !== "off") {
            imageHtml += "<img width=" + width + " height=" + height + " src='" + imagePath + "' class='button-icon-" + sharkgame.Settings.current.iconPositions + "'>";
        }
        return imageHtml;
    },
    changeSprite: function(spritePath, imageName, imageDiv, backupImageName) {
        var spriteData = sharkgame.Sprites[imageName];
        if(!imageDiv) {
            imageDiv = $('<div>');
        }

        // if the original sprite data is undefined, try loading the backup
        if(!spriteData) {
            spriteData = sharkgame.Sprites[backupImageName];
        }

        if(spriteData) {
            imageDiv.css('background-image', 'url(' + spritePath + ')');
            //imageDiv.css('background-position', "-" + spriteData.frame.x + "px -" + spriteData.frame.y + "px");
            imageDiv.css('background-position', "-" + spriteData.frame.x + "px -" + spriteData.frame.y + "px");
            imageDiv.width(spriteData.frame.w);
            imageDiv.height(spriteData.frame.h);
        } else {
            imageDiv.css('background-image', 'url("//placehold.it/50x50")');
            imageDiv.width(50);
            imageDiv.height(50);
        }
        return imageDiv;
    }

});

sharkgame.TitleBar = {
    saveLink: {
        name: "save",
        main: true,
        onClick: function() {
            try {
                try {
                    sharkgame.Save.saveGame();
                } catch(err) {
                    sharkgame.Log.addError(err);
                    console.log(err);
                }
                sharkgame.Log.addMessage("Saved game.");
            } catch(err) {
                sharkgame.Log.addError(err.message);
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

sharkgame.Tabs = {
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
        sharkgame.timestampLastSave = sharkgame.timestampLastSave || currDate.getTime();
        sharkgame.timestampGameStart = sharkgame.timestampGameStart || currDate.getTime();
        sharkgame.timestampRunStart = sharkgame.timestampRunStart || currDate.getTime();

        // preserve settings or set defaults
        $.each(sharkgame.Settings, function(k, v) {
            if(k === "current") {
                return;
            }
            var currentSetting = sharkgame.Settings.current[k];
            if(typeof(currentSetting) === "undefined") {
                sharkgame.Settings.current[k] = v.defaultSetting
            }
        });

        // initialise and reset resources
        sharkgame.Resources.init();

        // initialise world
        // MAKE SURE GATE IS INITIALISED AFTER WORLD!!
        sharkgame.World.init();
        sharkgame.World.apply();

        sharkgame.Gateway.init();
        sharkgame.Gateway.applyArtifacts(); // if there's any effects to carry over from a previous run

        // reset log
        sharkgame.Log.clearMessages();

        // initialise tabs
        sharkgame.Home.init();
        sharkgame.Lab.init();
        sharkgame.Stats.init();
        sharkgame.Recycler.init();
        sharkgame.Gate.init();
        sharkgame.Reflection.init();

        sharkgame.ui.setUpTitleBar();

        sharkgame.Tabs.current = "home";

        // load save game data if present
        if(sharkgame.Save.savedGameExists()) {
            try{
                sharkgame.Save.loadGame();
                sharkgame.Log.addMessage("Loaded game.");
            } catch(err) {
                sharkgame.Log.addError(err.message);
            }
        }

        // rename a game option if this is a first time run
        if(sharkgame.main.isFirstTime()) {
            sharkgame.TitleBar.skipLink.name = "reset";
            sharkgame.ui.setUpTitleBar();
        }

        // discover actions that were present in last save
        sharkgame.Home.discoverActions();

        // set up tab after load
        sharkgame.ui.setUpTab();


        if(sharkgame.main.tickHandler === -1) {
            sharkgame.main.tickHandler = setInterval(sharkgame.main.tick, sharkgame.INTERVAL);
        }

        if(sharkgame.main.autosaveHandler === -1) {
            sharkgame.main.autosaveHandler = setInterval(sharkgame.main.autosave, sharkgame.Settings.current.autosaveFrequency * 60000);
        }
    },

    checkTabUnlocks: function() {
        $.each(sharkgame.Tabs, function(k, v) {
            if(k === "current" || v.discovered) {
                return;
            }
            var reqsMet = true;

            // check resources
            if(v.discoverReq.resource) {
                reqsMet = reqsMet && sharkgame.Resources.checkResources(v.discoverReq.resource, true);
            }

            // check upgrades
            if(v.discoverReq.upgrade) {
                $.each(v.discoverReq.upgrade, function(_, value) {
                    if(sharkgame.Upgrades[value]) {
                        reqsMet = reqsMet && sharkgame.Upgrades[value].purchased;
                    } else {
                        reqsMet = false; // can't have a nonexistent upgrade
                    }
                });
            }

            if(reqsMet) {
                // unlock tab!
                sharkgame.ui.discoverTab(k);
                sharkgame.Log.addDiscovery("Discovered " + v.name + "!");
            }
        });
    },

    processSimTime: function(numberOfSeconds) {
        var r = sharkgame.Resources;

        // income calculation
        r.processIncomes(numberOfSeconds);
    },

    autosave: function() {
        try {
            sharkgame.Save.saveGame();
            sharkgame.Log.addMessage("Autosaved.");
        } catch(err) {
            sharkgame.Log.addError(err.message);
            console.log(err.trace);
        }
    },

    onOptionClick: function() {
        var buttonLabel = $(this).attr("id");
        var settingInfo = buttonLabel.split("-");
        var settingName = settingInfo[1];
        var optionIndex = parseInt(settingInfo[2]);

        // change setting to specified setting!
        sharkgame.Settings.current[settingName] = sharkgame.Settings[settingName].options[optionIndex];

        // update relevant table cell!
//        $('#option-' + settingName)
//            .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

        // enable all buttons
        $('button[id^="optionButton-' + settingName + '"]').prop("disabled", false);

        // disable this button
        $(this).attr("disabled", "true");

        // if there is a callback, call it, else call the no op
        (sharkgame.Settings[settingName].onChange || $.noop)();
    },

    endGame: function(loadingFromSave) {
        // stop autosaving
        clearInterval(sharkgame.main.autosaveHandler);
        sharkgame.main.autosaveHandler = -1;

        // flag game as over
        sharkgame.gameOver = true;

        // grab end game timestamp
        sharkgame.timestampRunEnd = (new Date()).getTime();

        // kick over to passage
        sharkgame.Gateway.enterGate(loadingFromSave);
    },

    purgeGame: function() {
        // empty out all the containers!
        $('#status').empty();
        sharkgame.Log.clearMessages();
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
            _.each(sharkgame.ResourceCategories.special.resources, function(resourceName) {
                backup[resourceName] = {amount: sharkgame.Resources.getResource(resourceName), totalAmount: sharkgame.Resources.getTotalResource(resourceName)};
            });

            sharkgame.Save.deleteSave(); // otherwise it will be loaded during main init and fuck up everything!!
            sharkgame.main.init();
            sharkgame.Log.addMessage(sharkgame.World.getWorldEntryMessage());

            // restore special resources
            $.each(backup, function(resourceName, resourceData) {
                sharkgame.Resources.setResource(resourceName, resourceData.amount);
                sharkgame.Resources.setTotalResource(resourceName, resourceData.totalAmount);
            });

            sharkgame.timestampRunStart = (new Date()).getTime();
            try {
                sharkgame.Save.saveGame();
                sharkgame.Log.addMessage("Game saved.");
            } catch(err) {
                sharkgame.Log.addError(err.message);
                console.log(err.trace);
            }
        }
    },

    isFirstTime: function() {
        return sharkgame.World.worldType === "start" && !(sharkgame.Resources.getTotalResource("essence") > 0);
    },

    // DEBUG FUNCTIONS
    discoverAll: function() {
        $.each(sharkgame.Tabs, function(k, v) {
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
                    sharkgame.Save.saveGame();
                    break;
                case 'o':
                    event.preventDefault();
                    sharkgame.ui.showOptions();
                    break;
            }
        }
    });
});
