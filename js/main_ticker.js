sharkgame.main.tick = function() {

	if(sharkgame.gameOver) {
		sharkgame.gateway.update();
	} else {

		// tick main game stuff
		var now = new Date();
		var elapsedTime = (now.getTime() - sharkgame.before.getTime());
		var r = sharkgame.resources;


		// check if the sidebar needs to come back
		// if(sharkgame.sidebarHidden) { m.showSidebarIfNeeded(); }

		if(elapsedTime > sharkgame.INTERVAL) {
			// Compensate for lost time.
			sharkgame.resources.processIncomes(sharkgame.dt * (elapsedTime / sharkgame.INTERVAL));

		} else {
			sharkgame.resources.processIncomes(sharkgame.dt);
		}

		sharkgame.resources.updateresourcesTable();

		var tabCode = sharkgame.tabs[sharkgame.tabs.current].code;
		tabCode.update();

		sharkgame.main.checkTabUnlocks();

		sharkgame.before = new Date();
	}
};
