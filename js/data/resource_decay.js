SharkGame.decay = {
	table: {
		"resource_name": { lambda: 0.001, scale: 1 }
	},
	get_decay: function (resource_name) { 
		if SharkGame.decay.table.hasOwnProperty(resource_name) { return SharkGame.decay.table[resource_name]; } 
		return 0;
	}
};



