sharkgame.WorldModifiers = {
    planetaryIncome: {
        name: "Planetary Income",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.World.worldResources;
            wr[resourceName].income = level * amount;
        }
    },
    planetaryIncomeMultiplier: {
        name: "Planetary Income Multiplier",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.World.worldResources;
            wr[resourceName].incomeMultiplier = level * amount;
        }
    },
    planetaryIncomeReciprocalMultiplier: {
        name: "Planetary Income Reciprocal Multiplier",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.World.worldResources;
            wr[resourceName].incomeMultiplier = (1 / (level * amount));
        }
    },
    planetaryResourceBoost: {
        name: "Planetary Boost",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.World.worldResources;
            wr[resourceName].boostMultiplier = level * amount;
        }
    },
    planetaryResourceReciprocalBoost: {
        name: "Planetary Reciprocal Boost",
        apply: function(level, resourceName, amount) {
            var wr = sharkgame.World.worldResources;
            wr[resourceName].boostMultiplier = level * amount;
        }
    },
    planetaryStartingResources: {
        name: "Planetary Starting Resources",
        apply: function(level, resourceName, amount) {
            var bonus = level * amount;
            var res = sharkgame.Resources.getTotalResource(resourceName);
            if(res < bonus) {
                sharkgame.Resources.changeResource(resourceName, bonus);
            }
        }
    }
};

sharkgame.World = {

    worldType: "start",
    worldResources: {},
    planetLevel: 1,

    init: function() {
        var w = sharkgame.World;
        //w.worldType = "start";
        //w.planetLevel = 1;
        //w.worldResources = {};
        w.resetWorldProperties();
    },

    apply: function() {
        var w = sharkgame.World;
        w.applyWorldProperties(w.planetLevel);
        w.applyGateCosts(w.planetLevel);
    },

    resetWorldProperties: function() {
        var w = sharkgame.World;
        var wr = w.worldResources;
        var rt = sharkgame.ResourceTable;

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

    applyWorldProperties: function(level) {
        var w = sharkgame.World;
        var wr = w.worldResources;
        var worldInfo = sharkgame.WorldTypes[w.worldType];

        // get multiplier
        var terraformMultiplier = w.getTerraformMultiplier();
        var effectiveLevel = Math.max(Math.floor(level * terraformMultiplier), 1);

        // disable resources not allowed on planet
        $.each(worldInfo.absentResources, function(i, v) {
            wr[v].exists = false;
        });

        // apply world modifiers
        _.each(worldInfo.modifiers, function(modifierData) {
            if(sharkgame.Resources.isCategory(modifierData.resource)) {
                var resourceList = sharkgame.Resources.getResourcesInCategory(modifierData.resource);
                _.each(resourceList, function(resourceName) {
                    sharkgame.WorldModifiers[modifierData.modifier].apply(effectiveLevel, resourceName, modifierData.amount);
                });
            } else {
                sharkgame.WorldModifiers[modifierData.modifier].apply(effectiveLevel, modifierData.resource, modifierData.amount);
            }
        });
    },

    applyGateCosts: function(level) {
        var w = sharkgame.World;
        var g = sharkgame.Gate;
        var worldInfo = sharkgame.WorldTypes[w.worldType];

        // get multiplier
        var gateCostMultiplier = w.getGateCostMultiplier();

        sharkgame.Gate.createSlots(worldInfo.gateCosts, w.planetLevel, gateCostMultiplier);
    },

    getWorldEntryMessage: function() {
        var w = sharkgame.World;
        return sharkgame.WorldTypes[w.worldType].entry;
    },

    // does this resource exist on this planet?
    doesResourceExist: function(resourceName) {
        var info = sharkgame.World.worldResources[resourceName];
        return info.exists;
    },

    forceExistence: function(resourceName) {
        sharkgame.World.worldResources[resourceName].exists = true;
    },

    getWorldIncomeMultiplier: function(resourceName) {
        return sharkgame.World.worldResources[resourceName].incomeMultiplier;
    },

    getWorldBoostMultiplier: function(resourceName) {
        return sharkgame.World.worldResources[resourceName].boostMultiplier;
    },

    getArtifactMultiplier: function(resourceName) {
        var artifactMultiplier = sharkgame.World.worldResources[resourceName].artifactMultiplier;
        return artifactMultiplier;
    },

    // these things are only impacted by artifacts so far

    getTerraformMultiplier: function() {
        var ptLevel = sharkgame.Artifacts.planetTerraformer.level;
        return (ptLevel > 0) ? Math.pow(0.9, ptLevel) : 1;
    },

    getGateCostMultiplier: function() {
        var gcrLevel = sharkgame.Artifacts.gateCostReducer.level;
        return (gcrLevel > 0) ? Math.pow(0.9, gcrLevel) : 1;
    }
};
