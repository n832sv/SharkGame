var SharkGame = SharkGame || {};


// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(SharkGame, {
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
        if(SharkGame.Settings.current.iconPositions !== "off") {
            imageHtml += "<img width=" + width + " height=" + height + " src='" + imagePath + "' class='button-icon-" + SharkGame.Settings.current.iconPositions + "'>";
        }
        return imageHtml;
    },
    changeSprite: function(spritePath, imageName, imageDiv, backupImageName) {
        var spriteData = SharkGame.Sprites[imageName];
        if(!imageDiv) {
            imageDiv = $('<div>');
        }

        // if the original sprite data is undefined, try loading the backup
        if(!spriteData) {
            spriteData = SharkGame.Sprites[backupImageName];
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

SharkGame.TitleBar = {
    saveLink: {
        name: "save",
        main: true,
        onClick: function() {
            try {
                try {
                    SharkGame.Save.saveGame();
                } catch(err) {
                    SharkGame.Log.addError(err);
                    console.log(err);
                }
                SharkGame.Log.addMessage("Saved game.");
            } catch(err) {
                SharkGame.Log.addError(err.message);
            }

        }
    },

    optionsLink: {
        name: "options",
        main: true,
        onClick: function() {
            SharkGame.ui.showOptions();
        }
    },

    helpLink: {
        name: "help",
        main: true,
        onClick: function() {
            SharkGame.ui.showHelp();
        }
    },

    skipLink: {
        name: "skip",
        main: true,
        onClick: function() {
            if(SharkGame.Main.isFirstTime()) {  // save people stranded on home world
                if(confirm("Do you want to reset your game?")) {
                    // just reset
                    SharkGame.Main.init();
                }
            } else {
                if(confirm("Is this world causing you too much trouble? Want to go back to the gateway?")) {
                    SharkGame.wonGame = false;
                    SharkGame.Main.endGame();
                }
            }
        }
    }
};

SharkGame.Tabs = {
    current: 'home'
};

SharkGame.Main = {

    tickHandler: -1,
    autosaveHandler: -1,

    beautify: SharkGame.utilui.beautify,
    colorLum: SharkGame.utilui.colorLum,
    formatTime: SharkGame.utilui.formatTime,
    toTitleCase: SharkGame.utilui.toTitleCase,

    init: function() {

        var currDate = new Date();
        SharkGame.before = currDate;
        if(SharkGame.GAME_NAME === null) {
            SharkGame.GAME_NAME = SharkGame.choose(SharkGame.GAME_NAMES);
            document.title = SharkGame.ACTUAL_GAME_NAME + ": " + SharkGame.GAME_NAME;
        }
        // $('#sidebar').hide();
        var overlay = $('#overlay');
        overlay.hide();
        $('#gameName').html(SharkGame.GAME_NAME);
        $('#versionNumber').html("v " + SharkGame.VERSION + " — " + SharkGame.VERSION_NAME);
        // SharkGame.sidebarHidden = true;
        SharkGame.gameOver = false;

        // remove any errant classes
        $('#pane').removeClass("gateway");
        overlay.removeClass("gateway");

        // initialise timestamps to something sensible
        SharkGame.timestampLastSave = SharkGame.timestampLastSave || currDate.getTime();
        SharkGame.timestampGameStart = SharkGame.timestampGameStart || currDate.getTime();
        SharkGame.timestampRunStart = SharkGame.timestampRunStart || currDate.getTime();

        // preserve settings or set defaults
        $.each(SharkGame.Settings, function(k, v) {
            if(k === "current") {
                return;
            }
            var currentSetting = SharkGame.Settings.current[k];
            if(typeof(currentSetting) === "undefined") {
                SharkGame.Settings.current[k] = v.defaultSetting
            }
        });

        // initialise and reset resources
        SharkGame.Resources.init();

        // initialise world
        // MAKE SURE GATE IS INITIALISED AFTER WORLD!!
        SharkGame.World.init();
        SharkGame.World.apply();

        SharkGame.Gateway.init();
        SharkGame.Gateway.applyArtifacts(); // if there's any effects to carry over from a previous run

        // reset log
        SharkGame.Log.clearMessages();

        // initialise tabs
        SharkGame.Home.init();
        SharkGame.Lab.init();
        SharkGame.Stats.init();
        SharkGame.Recycler.init();
        SharkGame.Gate.init();
        SharkGame.Reflection.init();

        SharkGame.ui.setUpTitleBar();

        SharkGame.Tabs.current = "home";

        // load save game data if present
        if(SharkGame.Save.savedGameExists()) {
            try{
                SharkGame.Save.loadGame();
                SharkGame.Log.addMessage("Loaded game.");
            } catch(err) {
                SharkGame.Log.addError(err.message);
            }
        }

        // rename a game option if this is a first time run
        if(SharkGame.Main.isFirstTime()) {
            SharkGame.TitleBar.skipLink.name = "reset";
            SharkGame.ui.setUpTitleBar();
        }

        // discover actions that were present in last save
        SharkGame.Home.discoverActions();

        // set up tab after load
        SharkGame.ui.setUpTab();


        if(SharkGame.Main.tickHandler === -1) {
            SharkGame.Main.tickHandler = setInterval(SharkGame.Main.tick, SharkGame.INTERVAL);
        }

        if(SharkGame.Main.autosaveHandler === -1) {
            SharkGame.Main.autosaveHandler = setInterval(SharkGame.Main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
        }
    },

    checkTabUnlocks: function() {
        $.each(SharkGame.Tabs, function(k, v) {
            if(k === "current" || v.discovered) {
                return;
            }
            var reqsMet = true;

            // check resources
            if(v.discoverReq.resource) {
                reqsMet = reqsMet && SharkGame.Resources.checkResources(v.discoverReq.resource, true);
            }

            // check upgrades
            if(v.discoverReq.upgrade) {
                $.each(v.discoverReq.upgrade, function(_, value) {
                    if(SharkGame.Upgrades[value]) {
                        reqsMet = reqsMet && SharkGame.Upgrades[value].purchased;
                    } else {
                        reqsMet = false; // can't have a nonexistent upgrade
                    }
                });
            }

            if(reqsMet) {
                // unlock tab!
                SharkGame.ui.discoverTab(k);
                SharkGame.Log.addDiscovery("Discovered " + v.name + "!");
            }
        });
    },

    processSimTime: function(numberOfSeconds) {
        var r = SharkGame.Resources;

        // income calculation
        r.processIncomes(numberOfSeconds);
    },

    autosave: function() {
        try {
            SharkGame.Save.saveGame();
            SharkGame.Log.addMessage("Autosaved.");
        } catch(err) {
            SharkGame.Log.addError(err.message);
            console.log(err.trace);
        }
    },

    onOptionClick: function() {
        var buttonLabel = $(this).attr("id");
        var settingInfo = buttonLabel.split("-");
        var settingName = settingInfo[1];
        var optionIndex = parseInt(settingInfo[2]);

        // change setting to specified setting!
        SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].options[optionIndex];

        // update relevant table cell!
//        $('#option-' + settingName)
//            .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

        // enable all buttons
        $('button[id^="optionButton-' + settingName + '"]').prop("disabled", false);

        // disable this button
        $(this).attr("disabled", "true");

        // if there is a callback, call it, else call the no op
        (SharkGame.Settings[settingName].onChange || $.noop)();
    },

    endGame: function(loadingFromSave) {
        // stop autosaving
        clearInterval(SharkGame.Main.autosaveHandler);
        SharkGame.Main.autosaveHandler = -1;

        // flag game as over
        SharkGame.gameOver = true;

        // grab end game timestamp
        SharkGame.timestampRunEnd = (new Date()).getTime();

        // kick over to passage
        SharkGame.Gateway.enterGate(loadingFromSave);
    },

    purgeGame: function() {
        // empty out all the containers!
        $('#status').empty();
        SharkGame.Log.clearMessages();
        $('#content').empty();
    },

    loopGame: function() {
        if(SharkGame.gameOver) {
            SharkGame.gameOver = false;
            SharkGame.wonGame = false;
            SharkGame.ui.showPane();

            // copy over all special category resources
            // artifacts are preserved automatically within gateway file
            var backup = {};
            _.each(SharkGame.ResourceCategories.special.resources, function(resourceName) {
                backup[resourceName] = {amount: SharkGame.Resources.getResource(resourceName), totalAmount: SharkGame.Resources.getTotalResource(resourceName)};
            });

            SharkGame.Save.deleteSave(); // otherwise it will be loaded during main init and fuck up everything!!
            SharkGame.Main.init();
            SharkGame.Log.addMessage(SharkGame.World.getWorldEntryMessage());

            // restore special resources
            $.each(backup, function(resourceName, resourceData) {
                SharkGame.Resources.setResource(resourceName, resourceData.amount);
                SharkGame.Resources.setTotalResource(resourceName, resourceData.totalAmount);
            });

            SharkGame.timestampRunStart = (new Date()).getTime();
            try {
                SharkGame.Save.saveGame();
                SharkGame.Log.addMessage("Game saved.");
            } catch(err) {
                SharkGame.Log.addError(err.message);
                console.log(err.trace);
            }
        }
    },

    isFirstTime: function() {
        return SharkGame.World.worldType === "start" && !(SharkGame.Resources.getTotalResource("essence") > 0);
    },

    // DEBUG FUNCTIONS
    discoverAll: function() {
        $.each(SharkGame.Tabs, function(k, v) {
            if(k !== "current") {
                SharkGame.Main.discoverTab(k);
            }
        });
    }
};


$(document).ready(function() {
    $('#game').show();
    SharkGame.Main.init();

    // ctrl+s saves
    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's':
                    event.preventDefault();
                    SharkGame.Save.saveGame();
                    break;
                case 'o':
                    event.preventDefault();
                    SharkGame.ui.showOptions();
                    break;
            }
        }
    });
});
