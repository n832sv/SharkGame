

var sharkgame = sharkgame || {};

	/*
	 * 		variable					file
	 * 
	 *		sharkgame					header.js
	 * 
	 * 			.utilui:				util_ui.js
	 * 			.ui:					ui.js 
	 * 			.main:					main.js
	 * 			.titlebar				main.js
	 * 			.tabs					main.js				(init)
	 * 			.main.tick()			main_ticker.js
	 * 			.utilmath				mathutil.js
	 * 			.text					text.js
	 * 
	 * 			.resourcetable			data/resourcetable.js
	 * 			.resourcecategories		data/resourcetable.js
	 * 			.worldtypes				data/worldtypes.js
	 * 			.upgrades				data/upgrades.js
	 * 			.sprites				data/sprites.js
	 * 
	 * 			.resources				resources.js
	 *			.world					world.js
	 * 			.worldmodifiers			world.js
	 * 			.log					log.js
	 * 
	 * 			.save					save.js
	 * 		savedata.gateway			save.js
	 * 		savedata.world				save.js
	 * 
	 * 		(back to sharkgame object)
	 * 	
	 * 			.settings				settings.js
	 * 			.gateway				gateway.js
	 * 
	 * 			.home					tabs/home.js
	 * 			.tabs					tabs/home.js		(also)
	 * 			.homeactioncategories	tabs/home_actions.js
	 * 			.homeactions			tabs/home_actions.js
	 * 			.lab					tabs/lab.js
	 * 			.stats					tabs/stats.js
	 * 			.tabs					tabs/stats.js		(also)
	 * 			.gate					tabs/gate.js
	 * 			.tabs					tabs/gate.js		(also)
	 * 			.reflection				tabs/reflection.js
	 * 			.tabs					tabs/reflection.js	(also)
	 * 
	 * 
	 * 
	*/

// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(sharkgame, {
    GAME_NAMES: [
		"Five Seconds A Shark",
        "Fin Idle",
        "Ray of Dreams",
        "Shark saver",
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

    timestampLastsave: false,
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
    spritehomeEventPath: "img/sharkeventsprites.png",

    choose: 	function(choices) 	{	return choices[Math.floor(Math.random() * choices.length)];		},
    log10: 		function(val) 		{	return Math.log(val) / Math.LN10;								},
    plural: 	function(number) 	{	return (number === 1) ? "" : "s";								},

});
