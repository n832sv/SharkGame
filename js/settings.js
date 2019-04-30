sharkgame.settings = {

    current: {},

    buyAmount: {
        defaultSetting: 1,
        show: false,
        options: [
            1,
            10,
            100,
            -3,
            -2,
            -1
        ]
    },

    showTabHelp: {
        defaultSetting: true,
        show: false,
        options: [
            true,
            false
        ]
    },

    groupresources: {
        defaultSetting: true,
        name: "Group resources",
        desc: "Group resources in the table into categories for legibility.",
        show: true,
        options: [
            true,
            false
        ],
        onChange: function() {
            sharkgame.resources.rebuildTable = true;
        }
    },

    buttonDisplayType: {
        defaultSetting: "pile",
        name: "home Sea Button Display",
        desc: "Do you want a vertical list of buttons, or a more space-saving configuration?",
        show: true,
        options: [
            "list",
            "pile"
        ],
        onChange: function() {
            sharkgame.ui.changeTab(sharkgame.tabs.current);
        }
    },

    offlineModeActive: {
        defaultSetting: true,
        name: "Offline Mode",
        desc: "Let your numbers increase even with the game closed!",
        show: true,
        options: [
            true,
            false
        ]
    },

    autosaveFrequency: {
        // times given in minutes
        defaultSetting: 5,
        name: "Autosave Frequency",
        desc: "Number of minutes between autosaves.",
        show: true,
        options: [
            1,
            2,
            5,
            10,
            30
        ],
        onChange: function() {
            clearInterval(sharkgame.main.autosaveHandler);
            sharkgame.main.autosaveHandler = setInterval(sharkgame.main.autosave, sharkgame.settings.current.autosaveFrequency * 60000);
            sharkgame.log.addMessage("Now autosaving every " + sharkgame.settings.current.autosaveFrequency + " minute" + sharkgame.plural(sharkgame.settings.current.autosaveFrequency) + ".");
        }
    },

    logMessageMax: {
        defaultSetting: 20,
        name: "Max log Messages",
        desc: "How many messages to show before removing old ones.",
        show: true,
        options: [
            5,
            10,
            15,
            20,
            25,
            30,
            50
        ],
        onChange: function() {
            sharkgame.log.correctlogLength();
        }
    },

	/*
    sidebarWidth: {
        defaultSetting: "20%",
        name: "Sidebar Width",
        desc: "How much screen estate the sidebar should take.",
        show: true,
        options: [
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%"
        ],
        onChange: function() {
            var sidebar = $('#sidebar');
            if(sharkgame.settings.current.showAnimations) {
                sidebar.animate({width: sharkgame.settings.current.sidebarWidth}, "100");
            } else {
                sidebar.width(sharkgame.settings.current.sidebarWidth);
            }
        }
    },
    */

    showAnimations: {
        defaultSetting: true,
        name: "Show Animations",
        desc: "Show animations or don't. YOU DECIDE.",
        show: true,
        options: [
            true,
            false
        ]
    },

    colorCosts: {
        defaultSetting: true,
        name: "Color Resource Names",
        desc: "When displaying costs, color names of stuff.",
        show: true,
        options: [
            true,
            false
        ],
        onChange: function() {
            sharkgame.resources.rebuildTable = true;
            sharkgame.stats.recreateIncomeTable = true;
        }
    },

    iconPositions: {
        defaultSetting: "side",
        name: "Icon Positions",
        desc: "Where should icons go on the buttons?",
        show: true,
        options: [
            "top",
            "side",
            "off"
        ]
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Do you want the new header images or are they taking up precious screen real-estate?",
        show: true,
        options: [
            true,
            false
        ],
        onChange: function() {
            sharkgame.ui.changeTab(sharkgame.tabs.current);
        }
    }


};
