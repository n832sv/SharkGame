sharkgame.main.tick = function() {

	if(sharkgame.gameOver) {
		sharkgame.Gateway.update();
	} else {

		// tick main game stuff
		var now = new Date();
		var elapsedTime = (now.getTime() - sharkgame.before.getTime());
		var r = sharkgame.Resources;


		// check if the sidebar needs to come back
		// if(sharkgame.sidebarHidden) { m.showSidebarIfNeeded(); }

		if(elapsedTime > sharkgame.INTERVAL) {
			// Compensate for lost time.
			sharkgame.Resources.processIncomes(sharkgame.dt * (elapsedTime / sharkgame.INTERVAL));

		} else {
			sharkgame.Resources.processIncomes(sharkgame.dt);
		}

		sharkgame.Resources.updateResourcesTable();

		var tabCode = sharkgame.Tabs[sharkgame.Tabs.current].code;
		tabCode.update();

		sharkgame.main.checkTabUnlocks();

		sharkgame.before = new Date();
	}
};
