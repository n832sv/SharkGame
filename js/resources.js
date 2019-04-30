sharkgame.playerresources = {};
sharkgame.playerincometable = {};


sharkgame.resources = {

    INCOME_COLOR: '#808080',
    TOTAL_INCOME_COLOR: '#A0A0A0',
    UPGRADE_MULTIPLIER_COLOR: '#606060',
    BOOST_MULTIPLIER_COLOR: '#60A060',
    world_MULTIPLIER_COLOR: '#6060A0',
    ARTIFACT_MULTIPLIER_COLOR: '#6F968A',

    specialMultiplier: null,
    rebuildTable: false,

    init: function() {
        // set all the amounts and total amounts of resources to 0
        $.each(sharkgame.resourcetable, function(k, v) {
            sharkgame.playerresources[k] = {};
            sharkgame.playerresources[k].amount = 0;
            sharkgame.playerresources[k].totalAmount = 0;
            sharkgame.playerresources[k].incomeMultiplier = 1;
        });

        // populate income table with an entry for each resource!!
        $.each(sharkgame.resourcetable, function(k, v) {
            sharkgame.playerincometable[k] = 0;
        });

        sharkgame.resources.specialMultiplier = 1;
    },

    processIncomes: function(timeDelta) {
        $.each(sharkgame.playerincometable, function(k, v) {
            sharkgame.resources.changeResource(k, v * timeDelta);
        });
    },
    
    process_decays: {
		/*
		for,each or something
		let lambda_scale = sharkgame.decay.get_decay(resource)
		if (lambda_scale === 0) , next 
		calculate decay, sharkgame.utilmaths.decay(u, resource_amount, lambda_scale.lambda, lambda_scale.scale)
		update resource, next
		*/
	},

    recalculateIncomeTable: function(resources) {

        var r = sharkgame.resources;
        var w = sharkgame.world;
        var worldresources = w.worldresources;

        // clear income table first
        $.each(sharkgame.resourcetable, function(k, v) {
            sharkgame.playerincometable[k] = 0;
        });

        $.each(sharkgame.resourcetable, function(name, resource) {

            var worldResourceInfo = worldresources[name];
            if(worldResourceInfo.exists) {
                var playerResource = sharkgame.playerresources[name];
                // for this resource, calculate the income it generates
                if(resource.income) {

                    var worldMultiplier = 1;
                    if(worldResourceInfo) {
                        worldMultiplier = worldResourceInfo.incomeMultiplier;
                    }


                    var costScaling = 1;
                    // run over all resources first to check if costs can be met
                    // if the cost can't be taken, scale the cost and output down to feasible levels
                    if(!resource.forceIncome) {
                        $.each(resource.income, function(k, v) {
                            var change = r.getProductAmountFromGeneratorResource(name, k);
                            if(change < 0) {
                                var resourceHeld = r.getResource(k);
                                if(resourceHeld + change <= 0) {
                                    var scaling = resourceHeld / -change;
                                    if(scaling >= 0 && scaling < 1) { // sanity checking
                                        costScaling = Math.min(costScaling, scaling);
                                    } else {
                                        costScaling = 0; // better to break this way than break explosively
                                    }
                                }
                            }
                        });
                    }

                    // if there is a cost and it can be taken (or if there is no cost)
                    // run over all resources to fill the income table
                    $.each(resource.income, function(k, v) {
                        var incomeChange = r.getProductAmountFromGeneratorResource(name, k, costScaling);
                        if(sharkgame.world.doesResourceExist(k)) {
                            sharkgame.playerincometable[k] += incomeChange;
                        }
                    });
                }

                // calculate the income that should be added to this resource
                if(worldResourceInfo) {
                    var worldResourceIncome = worldResourceInfo.income;
                    var affectedResourceBoostMultiplier = worldresources[name].boostMultiplier;
                    sharkgame.playerincometable[name] += worldResourceIncome * affectedResourceBoostMultiplier * r.getSpecialMultiplier();
                }
            }
        });
    },

    getProductAmountFromGeneratorResource: function(generator, product, costScaling) {
        var r = sharkgame.resources;
        var w = sharkgame.world;
        var playerResource = sharkgame.playerresources[generator];
        if(typeof(costScaling) !== "number") {
            costScaling = 1;
        }
        return sharkgame.resourcetable[generator].income[product] * r.getResource(generator) * costScaling *
            playerResource.incomeMultiplier * w.getworldIncomeMultiplier(generator) *
            w.getworldBoostMultiplier(product) * w.getArtifactMultiplier(generator) *
            r.getSpecialMultiplier();
    },

    getSpecialMultiplier: function() {
        return Math.max((sharkgame.resources.getResource("numen") * 10), 1) * sharkgame.resources.specialMultiplier;
    },

    getIncome: function(resource) {
        return sharkgame.playerincometable[resource]
    },

    getMultiplier: function(resource) {
        return sharkgame.playerresources[resource].incomeMultiplier;
    },

    setMultiplier: function(resource, multiplier) {
        sharkgame.playerresources[resource].incomeMultiplier = multiplier;
        sharkgame.resources.recalculateIncomeTable();
    },

    // Adds or subtracts resources based on amount given.
    changeResource: function(resource, amount) {
        if(Math.abs(amount) < sharkgame.EPSILON) {
            return; // ignore changes below epsilon
        }

        var resourcetable = sharkgame.playerresources[resource];
        var prevTotalAmount = resourcetable.totalAmount;

        if(!sharkgame.world.doesResourceExist(resource)) {
            return; // don't change resources that don't technically exist
        }

        resourcetable.amount += amount;
        if(resourcetable.amount < 0) {
            resourcetable.amount = 0;
        }

        if(amount > 0) {
            resourcetable.totalAmount += amount;
        }

        if(prevTotalAmount < sharkgame.EPSILON) {
            // we got a new resource
            sharkgame.resources.rebuildTable = true;
        }

        sharkgame.resources.recalculateIncomeTable();
    },

    setResource: function(resource, newValue) {
        var resourcetable = sharkgame.playerresources[resource];

        resourcetable.amount = newValue;
        if(resourcetable.amount < 0) {
            resourcetable.amount = 0;
        }
        sharkgame.resources.recalculateIncomeTable();
    },

    setTotalResource: function(resource, newValue) {
        sharkgame.playerresources[resource].totalAmount = newValue;
    },

    getResource: function(resource) {
        return sharkgame.playerresources[resource].amount;
    },

    getTotalResource: function(resource) {
        return sharkgame.playerresources[resource].totalAmount;
    },

    isCategoryVisible: function(category) {
        var visible = false;
        $.each(category.resources, function(_, v) {
            visible = visible || ((sharkgame.playerresources[v].totalAmount > 0) && sharkgame.world.doesResourceExist(v));
        });
        return visible;
    },

    getCategoryOfResource: function(resourceName) {
        var categoryName = "";
        $.each(sharkgame.resourcecategories, function(categoryKey, categoryValue) {
            if(categoryName !== "") {
                return;
            }
            $.each(categoryValue.resources, function(k, v) {
                if(categoryName !== "") {
                    return;
                }
                if(resourceName == v) {
                    categoryName = categoryKey;
                }
            });
        });
        return categoryName;
    },

    getresourcesInCategory: function(categoryName) {
        var resources = [];
        $.each(sharkgame.resourcecategories[categoryName].resources, function(i, v) {
            resources.push(v);
        });
        return resources;
    },

    isCategory: function(name) {
        return !(typeof(sharkgame.resourcecategories[name]) === 'undefined')
    },

    isInCategory: function(resource, category) {
        return sharkgame.resourcecategories[category].resources.indexOf(resource) !== -1;
    },

    getBaseOfResource: function(resourceName) {
        // if there are super-categories/base jobs of a resource, return that, otherwise return null
        var baseResourceName = null;
        $.each(sharkgame.resourcetable, function(key, value) {
            if(baseResourceName) {
                return;
            }
            if(value.jobs) {
                $.each(value.jobs, function(_, jobName) {
                    if(baseResourceName) {
                        return;
                    }
                    if(jobName === resourceName) {
                        baseResourceName = key;
                    }
                });
            }
        });
        return baseResourceName;
    },

    haveAnyresources: function() {
        var anyresources = false;
        $.each(sharkgame.playerresources, function(_, v) {
            if(!anyresources) {
                anyresources = v.totalAmount > 0;
            }
        });
        return anyresources;
    },

    // returns true if enough resources are held (>=)
    // false if they are not
    checkresources: function(resourceList, checkTotal) {
        var sufficientresources = true;
        $.each(sharkgame.resourcetable, function(k, v) {
            var currentResource;
            if(!checkTotal) {
                currentResource = sharkgame.resources.getResource(k);
            } else {
                currentResource = sharkgame.resources.getTotalResource(k);
            }
            var listResource = resourceList[k];
            // amend for unspecified resources (assume zero)
            if(typeof listResource === 'undefined') {
                listResource = 0;
            }
            if(currentResource < listResource) {
                sufficientresources = false;
            }
        });
        return sufficientresources;
    },

    changeManyresources: function(resourceList, subtract) {
        if(typeof subtract === 'undefined') {
            subtract = false;
        }

        $.each(resourceList, function(k, v) {
            var amount = v;
            if(subtract) {
                amount *= -1;
            }
            sharkgame.resources.changeResource(k, amount);
        });
    },

    scaleResourceList: function(resourceList, amount) {
        var newList = {};
        $.each(resourceList, function(k, v) {
            newList[k] = v * amount;
        });
        return newList;
    },

    // update values in table without adding rows
    updateresourcesTable: function() {
        var rTable = $('#resourcetable');
        var m = sharkgame.main;
        var r = sharkgame.resources;

        // if resource table does not exist, there are no resources, so do not construct table
        // if a resource became visible when it previously wasn't, reconstruct the table
        if(r.rebuildTable) {
            r.reconstructresourcesTable();
        } else {
            // loop over table rows, update values
            $.each(sharkgame.playerresources, function(k, v) {
                $('#amount-' + k).html(m.beautify(v.amount, true));

                var income = r.getIncome(k);
                if(Math.abs(income) > sharkgame.EPSILON) {
                    var changeChar = income > 0 ? "+" : "";
                    $('#income-' + k).html("<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautify(income) + "/s</span>");
                } else {
                    $('#income-' + k).html("");
                }
            });
        }
    },

    // add rows to table (more expensive than updating existing DOM elements)
    reconstructresourcesTable: function() {
        var rTable = $('#resourcetable');
        var m = sharkgame.main;
        var r = sharkgame.resources;
        var w = sharkgame.world;

        var statusDiv = $('#status');
        // if resource table does not exist, create
        if(rTable.length <= 0) {
            statusDiv.prepend('<h3>Inventory</h3>');
            var tableContainer = $('<div>').attr("id", "resourcetableContainer");
            tableContainer.append($('<table>').attr("id", 'resourcetable'));
            statusDiv.append(tableContainer);
            rTable = $('#resourcetable');
        }

        // remove the table contents entirely
        rTable.empty();

        var anyresourcesInTable = false;

        if(sharkgame.settings.current.groupresources) {
            $.each(sharkgame.resourcecategories, function(_, category) {
                if(r.isCategoryVisible(category)) {
                    var headerRow = $("<tr>").append($("<td>")
                        .attr("colSpan", 3)
                        .append($("<h3>")
                            .html(category.name)
                    ));
                    rTable.append(headerRow);
                    $.each(category.resources, function(k, v) {
                        if(r.getTotalResource(v) > 0) {
                            var row = r.constructresourcetableRow(v);
                            rTable.append(row);
                            anyresourcesInTable = true;
                        }
                    });
                }
            });
        } else {
            // iterate through data, if total amount > 0 add a row
            $.each(sharkgame.resourcetable, function(k, v) {
                if(r.getTotalResource(k) > 0 && w.doesResourceExist(k)) {
                    var row = r.constructresourcetableRow(k);
                    rTable.append(row);
                    anyresourcesInTable = true;
                }
            });
        }

        // if the table is still empty, hide the status div
        // otherwise show it
        if(!anyresourcesInTable) {
            statusDiv.hide();
        } else {
            statusDiv.show();
        }

        r.rebuildTable = false;
    },
    
    constructresourcetableRow: function (resource_key) {

		let resource_name 	= sharkgame.resources.getResourceName(resource_key)
        let amount 			= sharkgame.playerresources[resource_key].amount;
        let total_amount 	= sharkgame.playerresources[resource_key].totalAmount;
        let income 			= sharkgame.resources.getIncome(resource_key);
        let color			= sharkgame.resources.INCOME_COLOR;

        let row = sharkgame.ui.constructresourcetableRowHTML(resource_key, resource_name, income, amount, total_amount, color);

        return row;
	},

    getResourceName: function(resourceName, darken, forceSingle) {
        var resource = sharkgame.resourcetable[resourceName];
        var name = (((Math.floor(sharkgame.playerresources[resourceName].amount) - 1) < sharkgame.EPSILON) || forceSingle) ? resource.singleName : resource.name;

        if(sharkgame.settings.current.colorCosts) {
            var color = resource.color;
            if(darken) {
                color = sharkgame.utilui.colorLum(resource.color, -0.5);
            }
            name = "<span class='click-passthrough' style='color:" + color + "'>" + name + "</span>";
        }
        return name;
    },


    // make a resource list object into a string describing its contents
    resourceListToString: function(resourceList, darken) {
        if($.isEmptyObject(resourceList)) {
            return "";
        }
        var formattedResourceList = "";
        $.each(sharkgame.resourcetable, function(k, v) {
            var listResource = resourceList[k];
            // amend for unspecified resources (assume zero)
            if(listResource > 0 && sharkgame.world.doesResourceExist(k)) {
                var isSingular = (Math.floor(listResource) - 1) < sharkgame.EPSILON;
                formattedResourceList += sharkgame.utilui.beautify(listResource);
                formattedResourceList += " " + sharkgame.resources.getResourceName(k, darken, isSingular) + ", ";
            }
        });
        // snip off trailing suffix
        formattedResourceList = formattedResourceList.slice(0, -2);
        return formattedResourceList;
    },

    getresourcesources: function(resource) {
        var sources = {"income": [], "actions": []};
        // go through all incomes
        $.each(sharkgame.resourcetable, function(k, v) {
            if(v.income) {
                var incomeForResource = v.income[resource];
                if(incomeForResource > 0) {
                    sources.income.push(k);
                }
            }
        });
        // go through all actions
        $.each(sharkgame.homeactions, function(k, v) {
            var resourceEffect = v.effect.resource;
            if(resourceEffect) {
                if(resourceEffect[resource] > 0) {
                    sources.actions.push(k);
                }
            }
        });
        return sources;
    },

    // TESTING FUNCTIONS
    giveMeSomeOfEverything: function(amount) {
        $.each(sharkgame.resourcetable, function(k, v) {
            sharkgame.resources.changeResource(k, amount);
        });
    },


    // this was going to be used to randomise what resources were available but it needs better work to point out what is REQUIRED and what is OPTIONAL
    // create all chains that terminate only at a cost-free action to determine how to get to a resource
    // will return a weird vaguely tree structure of nested arrays (ughhh I need to learn how to OOP in javascript at some point, what a hack)
    getResourceDependencyChains: function(resource, alreadyKnownList) {
        var r = sharkgame.resources;
        var l = sharkgame.world;
        var dependencies = [];
        if(!alreadyKnownList) {
            alreadyKnownList = []; // tracks resources we've already seen, an effort to combat cyclic dependencies
        }

        var sources = r.getresourcesources(resource);
        // get resource costs for actions that directly get this
        // only care about the resource types required
        $.each(sources.actions, function(_, v) {
            var actionCost = sharkgame.homeactions[v].cost;
            $.each(actionCost, function(_, w) {
                var resource = w.resource;
                if(l.doesResourceExist(resource)) {
                    dependencies.push(resource);
                    alreadyKnownList.push(resource);
                }
            })
        });

        // get dependencies for income resources
        $.each(sources.income, function(_, v) {
            if(l.doesResourceExist(v)) {
                if(alreadyKnownList.indexOf(v) === -1) {
                    dependencies.push(r.getResourceDependencyChains(v, alreadyKnownList));
                }
            }
        });

        return dependencies;
    }
};
