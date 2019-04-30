sharkgame.decay = {
	
	get_decay: function (resource_name) { 
		if (sharkgame.decay.table.hasOwnProperty(resource_name) !== 0) { return sharkgame.decay.table[resource_name]; } 
		return 0;
	},
	
	table: {
		"resource_name": 	{ lambda: 0.001, scale: 1.000, default_offset: 1.0000 },
		"fish": 			{ lambda: 0.001, scale: 1.000, default_offset: 10.000 },
		"x":	 			{ lambda: 0.001, scale: 1.000, default_offset: 1.0000 }
	}

};



