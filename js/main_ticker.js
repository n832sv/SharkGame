SharkGame.Main.tick = function() {

	if(SharkGame.gameOver) {
		SharkGame.Gateway.update();
	} else {
		
		// tick main game stuff
		var now = new Date();
		var elapsedTime = (now.getTime() - SharkGame.before.getTime());

		var r = SharkGame.Resources;
		var m = SharkGame.Main;

		// check if the sidebar needs to come back
		// if(SharkGame.sidebarHidden) { m.showSidebarIfNeeded(); }

		if(elapsedTime > SharkGame.INTERVAL) {
			// Compensate for lost time.
			m.processSimTime(SharkGame.dt * (elapsedTime / SharkGame.INTERVAL));

		} else {
			m.processSimTime(SharkGame.dt);
		}
		r.updateResourcesTable();

		var tabCode = SharkGame.Tabs[SharkGame.Tabs.current].code;
		tabCode.update();

		m.checkTabUnlocks();

		SharkGame.before = new Date();
	}
};
