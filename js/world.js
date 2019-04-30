sharkgame.worldmodifiers = {
    planetaryIncome: {
        name: "Planetary Income",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.world.worldresources;
            wr[resourceName].income = level * amount;
        }
    },
    planetaryIncomeMultiplier: {
        name: "Planetary Income Multiplier",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.world.worldresources;
            wr[resourceName].incomeMultiplier = level * amount;
        }
    },
    planetaryIncomeReciprocalMultiplier: {
        name: "Planetary Income Reciprocal Multiplier",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.world.worldresources;
            wr[resourceName].incomeMultiplier = (1 / (level * amount));
        }
    },
    planetaryResourceBoost: {
        name: "Planetary Boost",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.world.worldresources;
            wr[resourceName].boostMultiplier = level * amount;
        }
    },
    planetaryResourceReciprocalBoost: {
        name: "Planetary Reciprocal Boost",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.world.worldresources;
            wr[resourceName].boostMultiplier = level * amount;
        }
    },
    planetaryStartingresources: {
        name: "Planetary Starting resources",
        apply: function(level, resourceName, amount) {
            var bonus = level * amount;
            var res = sharkgame.resources.getTotalResource(resourceName);
            if(res < bonus) {
                sharkgame.resources.changeResource(resourceName, bonus);
            }
        }
    }
};

sharkgame.world = {

    worldType: "start",
    worldresources: {},
    planetLevel: 1,

    init: function() {
        var w = sharkgame.world;
        //w.worldType = "start";
        //w.planetLevel = 1;
        //w.worldresources = {};
        w.resetworldProperties();
    },

    apply: function() {
        var w = sharkgame.world;
        w.applyworldProperties(w.planetLevel);
        w.applygateCosts(w.planetLevel);
    },

    resetworldProperties: function() {
        var w = sharkgame.world;
        var wr = w.worldresources;
        var rt = sharkgame.resourcetable;

        // set up defaults
        $.each(rt, function(k, v) {
            wr[k] = {};
            wr[k].exists = true;
            wr[k].income = 0;
            wr[k].incomeMultiplier = 1;
            wr[k].boostMultiplier = 1;
            wr[k].artifactMultiplier = 1;
        });
    },

    applyworldProperties: function(level) {
        var w = sharkgame.world;
        var wr = w.worldresources;
        var worldInfo = sharkgame.worldtypes[w.worldType];

        // get multiplier
        var terraformMultiplier = w.getTerraformMultiplier();
        var effectiveLevel = Math.max(Math.floor(level * terraformMultiplier), 1);

        // disable resources not allowed on planet
        $.each(worldInfo.absentresources, function(i, v) {
            wr[v].exists = false;
        });

        // apply world modifiers
        _.each(worldInfo.modifiers, function(modifierData) {
            if(sharkgame.resources.isCategory(modifierData.resource)) {
                var resourceList = sharkgame.resources.getresourcesInCategory(modifierData.resource);
                _.each(resourceList, function(resourceName) {
                    sharkgame.worldmodifiers[modifierData.modifier].apply(effectiveLevel, resourceName, modifierData.amount);
                });
            } else {
                sharkgame.worldmodifiers[modifierData.modifier].apply(effectiveLevel, modifierData.resource, modifierData.amount);
            }
        });
    },

    applygateCosts: function(level) {
        var w = sharkgame.world;
        var g = sharkgame.gate;
        var worldInfo = sharkgame.worldtypes[w.worldType];

        // get multiplier
        var gateCostMultiplier = w.getgateCostMultiplier();

        sharkgame.gate.createSlots(worldInfo.gateCosts, w.planetLevel, gateCostMultiplier);
    },

    getworldEntryMessage: function() {
        var w = sharkgame.world;
        return sharkgame.worldtypes[w.worldType].entry;
    },

    // does this resource exist on this planet?
    doesResourceExist: function(resourceName) {
        var info = sharkgame.world.worldresources[resourceName];
        return info.exists;
    },

    forceExistence: function(resourceName) {
        sharkgame.world.worldresources[resourceName].exists = true;
    },

    getworldIncomeMultiplier: function(resourceName) {
        return sharkgame.world.worldresources[resourceName].incomeMultiplier;
    },

    getworldBoostMultiplier: function(resourceName) {
        return sharkgame.world.worldresources[resourceName].boostMultiplier;
    },

    getArtifactMultiplier: function(resourceName) {
        var artifactMultiplier = sharkgame.world.worldresources[resourceName].artifactMultiplier;
        return artifactMultiplier;
    },

    // these things are only impacted by artifacts so far

    getTerraformMultiplier: function() {
        var ptLevel = sharkgame.Artifacts.planetTerraformer.level;
        return (ptLevel > 0) ? Math.pow(0.9, ptLevel) : 1;
    },

    getgateCostMultiplier: function() {
        var gcrLevel = sharkgame.Artifacts.gateCostReducer.level;
        return (gcrLevel > 0) ? Math.pow(0.9, gcrLevel) : 1;
    }
};
