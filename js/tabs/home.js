sharkgame.Home = {

    tabId: "home",
    tabDiscovered: true,
    tabName: "Home Sea",
    tabBg: "img/bg/bg-homesea.png",

    currentButtonTab: null,
    currentExtraMessageIndex: null,

    // Priority: later messages display if available, otherwise earlier ones.

    init: function() {
        var h = sharkgame.Home;

        // rename home tab
        var tabName = sharkgame.WorldTypes[sharkgame.World.worldType].name + " Ocean";
        sharkgame.Home.tabName = tabName;

        // register tab
        sharkgame.Tabs[h.tabId] = {
            id: h.tabId,
            name: h.tabName,
            discovered: h.tabDiscovered,
            code: h
        };
        // populate action discoveries
        $.each(sharkgame.HomeActions, function(actionName, actionData) {
            actionData.discovered = false;
            actionData.newlyDiscovered = false;
        });

        h.currentExtraMessageIndex = -1;
        h.currentButtonTab = "all";
    },

    switchTo: function() {
        var h = sharkgame.Home;
        var content = $('#content');
        var tabMessage = $('<div>').attr("id", "tabMessage");
        content.append(tabMessage);
        h.currentExtraMessageIndex = -1;
        h.updateMessage(true);
        // button tabs
        var buttonTabDiv = $('<div>').attr("id", "homeTabs");
        content.append(buttonTabDiv);
        h.createButtonTabs();
        // help button
		/*
        var helpButtonDiv = $('<div>');
        helpButtonDiv.css({margin: "auto", clear: "both"});
        sharkgame.ui.makeButton("helpButton", "&nbsp Toggle descriptions &nbsp", helpButtonDiv, h.toggleHelp).addClass("min-block");
        content.append(helpButtonDiv);
		*/
        // button list
        var buttonList = $('<div>').attr("id", "buttonList");
        content.append(buttonList);
        if(sharkgame.Settings.current.buttonDisplayType === "pile") {
            buttonList.addClass("pileArrangement");
        } else {
            buttonList.removeClass("pileArrangement");
        }
        // background art!
        if(sharkgame.Settings.current.showTabImages) {
            tabMessage.css("background-image", "url('" + h.tabBg + "')");
        }
    },

    discoverActions: function() {
        var h = sharkgame.Home;
        $.each(sharkgame.HomeActions, function(actionName, actionData) {
            actionData.discovered = h.areActionPrereqsMet(actionName);
            actionData.newlyDiscovered = false;
        });
    },

    createButtonTabs: function() {
        var buttonTabDiv = $('#homeTabs');
        var buttonTabList = $('<ul>').attr("id", "homeTabsList");
        buttonTabDiv.empty();
        var tabAmount = 0;

        // add a header for each discovered category
        // make it a link if it's not the current tab
        $.each(sharkgame.HomeActionCategories, function(k, v) {
            var onThisTab = (sharkgame.Home.currentButtonTab === k);

            var categoryDiscovered = false;
            if(k === "all") {
                categoryDiscovered = true;
            } else {
                $.each(v.actions, function(_, actionName) {
                    categoryDiscovered = categoryDiscovered || sharkgame.HomeActions[actionName].discovered;
                });
            }

            if(categoryDiscovered) {
                var tabListItem = $('<li>');
                if(onThisTab) {
                    tabListItem.html(v.name);
                } else {
                    tabListItem.append($('<a>')
                            .attr("id", "buttonTab-" + k)
                            .attr("href", "javascript:;")
                            .html(v.name)
                            .click(function() {
                                var tab = ($(this).attr("id")).split("-")[1];
                                sharkgame.Home.changeButtonTab(tab);
                            })
                    );
                    if(v.hasNewItem) {
                        tabListItem.addClass("newItemAdded");
                    }
                }
                buttonTabList.append(tabListItem);
                tabAmount++;
            }
        });
        // finally at the very end just throw the damn list away if it only has two options
        // "all" + another category is completely pointless
        if(tabAmount > 2) {
            buttonTabDiv.append(buttonTabList);
        }
    },

    updateTab: function(tabToUpdate) {
        // return if we're looking at all buttons, no change there
        if(sharkgame.Home.currentButtonTab === "all") {
            return;
        }
        sharkgame.HomeActionCategories[tabToUpdate].hasNewItem = true;
        var tabItem = $('#buttonTab-' + tabToUpdate);
        if(tabItem.length > 0) {
            tabItem.parent().addClass("newItemAdded");
        } else {
            sharkgame.Home.createButtonTabs();
        }
    },

    changeButtonTab: function(tabToChangeTo) {
        var h = sharkgame.Home;
        sharkgame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
        if(tabToChangeTo === "all") {
            $.each(sharkgame.HomeActionCategories, function(k, v) {
                v.hasNewItem = false;
            })
        }
        h.currentButtonTab = tabToChangeTo;
        $('#buttonList').empty();
        h.createButtonTabs();
    },

    updateMessage: function(suppressAnimation) {
        var h = sharkgame.Home;
        var r = sharkgame.Resources;
        var u = sharkgame.Upgrades;
        var wi = sharkgame.WorldTypes[sharkgame.World.worldType];
        var selectedIndex = h.currentExtraMessageIndex;
        $.each(sharkgame.text.extra_messages, function(i, v) {
            var showThisMessage = true;
            // check if should show this message
            if(v.unlock) {
                if(v.unlock.resource) {
                    $.each(v.unlock.resource, function(k, v) {
                        showThisMessage = showThisMessage && (r.getResource(k) >= v);
                    });
                }
                if(v.unlock.upgrade) {
                    $.each(v.unlock.upgrade, function(i, v) {
                        showThisMessage = showThisMessage && u[v].purchased;
                    });
                }
                if(v.unlock.world) {
                    showThisMessage = showThisMessage && sharkgame.World.worldType === v.unlock.world;
                }
            }
            if(showThisMessage) {
                selectedIndex = i;
            }
        });
        // only edit DOM if necessary
        if(h.currentExtraMessageIndex !== selectedIndex) {
            h.currentExtraMessageIndex = selectedIndex;
            var tabMessage = $('#tabMessage');
            if(sharkgame.Settings.current.showTabImages) {
                var sceneDiv = $('#tabSceneImage');
                if(sceneDiv.size() === 0) {
                    sceneDiv = $('<div>').attr("id", "tabSceneImage");
                }
            }
            var message = "You are a shark in a " + wi.shortDesc + " sea.";
            message += "<br><span id='extraMessage' class='medDesc'>&nbsp<br>&nbsp</span>";
            tabMessage.html(message).prepend(sceneDiv);

            var extraMessageSel = $('#extraMessage');
            if(!suppressAnimation && sharkgame.Settings.current.showAnimations) {
                extraMessageSel.animate({opacity: 0}, 200, function() {
                    var thisSel = $(this);
                    thisSel.animate({opacity: 1}, 200).html(sharkgame.text.extra_messages[selectedIndex].message);
                });
                sceneDiv.animate({opacity: 0}, 500, function() {
                    var thisSel = $(this);
                    if(sharkgame.Settings.current.showTabImages) {
                        sharkgame.changeSprite(sharkgame.spriteHomeEventPath, "homesea-" + (selectedIndex + 1), sceneDiv, "homesea-missing");
                    }
                    thisSel.animate({opacity: 1}, 500);
                });
            } else {
                extraMessageSel.html(sharkgame.text.extra_messages[selectedIndex].message);
                if(sharkgame.Settings.current.showTabImages) {
                    sharkgame.changeSprite(sharkgame.spriteHomeEventPath, "homesea-" + (selectedIndex + 1), sceneDiv, "homesea-missing");
                }
            }
        }
    },

    update: function() {
        var h = sharkgame.Home;
        var r = sharkgame.Resources;
        var w = sharkgame.World;


        // for each button entry in the home tab,
        $.each(sharkgame.HomeActions, function(actionName, actionData) {
            var actionTab = h.getActionCategory(actionName);
            var onTab = (actionTab === h.currentButtonTab) || (h.currentButtonTab === "all");
            if(onTab) {
                var button = $('#' + actionName);
                if(button.length === 0) {
                    if(actionData.discovered || h.areActionPrereqsMet(actionName)) {
                        if(!actionData.discovered) {
                            actionData.discovered = true;
                            actionData.newlyDiscovered = true;
                        }
                        h.addButton(actionName);
                    }
                } else {
                    // button exists
                    h.updateButton(actionName);
                }
            } else {
                if(!actionData.discovered) {
                    if(h.areActionPrereqsMet(actionName)) {
                        actionData.discovered = true;
                        actionData.newlyDiscovered = true;
                        h.updateTab(actionTab);
                    }
                }
            }
        });

        // update home message
        h.updateMessage();
    },

    updateButton: function(actionName) {
        var h = sharkgame.Home;
        var r = sharkgame.Resources;
        var amountToBuy = sharkgame.Settings.current.buyAmount;

        var button = $('#' + actionName);
        var actionData = sharkgame.HomeActions[actionName];

        var amount = amountToBuy;
        var actionCost;
        if(amountToBuy < 0) {
            var max = Math.floor(h.getMax(actionData));
            // convert divisor from a negative number to a positive fraction
            var divisor = 1 / (Math.floor((amountToBuy)) * -1);
            amount = max * divisor;
            amount = Math.floor(amount);
            if(amount < 1) amount = 1;
            actionCost = h.getCost(actionData, amount);
        } else {
            actionCost = h.getCost(actionData, amountToBuy);
        }
        // disable button if resources can't be met
        var enableButton;
        if($.isEmptyObject(actionCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = r.checkResources(actionCost);
        }

        var label = actionData.name;
        if(!$.isEmptyObject(actionCost) && amount > 1) {
            label += " (" + sharkgame.main.beautify(amount) + ")";
        }

        // check for any infinite quantities
        var infinitePrice = false;
        _.each(actionCost, function(num) {
            if(num === Number.POSITIVE_INFINITY) {
                infinitePrice = true;
            }
        });
        if(infinitePrice) {
            label += "<br>Maxed out";
        } else {
            var costText = r.resourceListToString(actionCost, !enableButton);
            if(costText != "") {
                label += "<br>Cost: " + costText;
            }
        }

        if(sharkgame.Settings.current.showTabHelp) {
            if(actionData.helpText) {
                label += "<br><span class='medDesc'>" + actionData.helpText + "</span>";
            }
        }
        button.prop("disabled", !enableButton)
        button.html(label);


        var spritename = "actions/" + actionName;
        if(sharkgame.Settings.current.iconPositions !== "off") {
            var iconDiv = sharkgame.changeSprite(sharkgame.spriteIconPath, spritename, null, "general/missing-action");
            if(iconDiv) {
                iconDiv.addClass("button-icon-" + sharkgame.Settings.current.iconPositions);
                if(!enableButton) {
                    button.prepend($('<div>').append(iconDiv).addClass("tint"));
                } else {
                    button.prepend(iconDiv);
                }
            }
        }
    },

    areActionPrereqsMet: function(actionName) {
        var r = sharkgame.Resources;
        var w = sharkgame.World;
        var prereqsMet = true; // assume true until proven false
        var action = sharkgame.HomeActions[actionName];
        // check resource prerequisites
        if(action.prereq.resource) {
            prereqsMet = prereqsMet && r.checkResources(action.prereq.resource, true);
        }
        // check if resource cost exists
        if(action.cost) {
            $.each(action.cost, function(i, v) {
                var costResource = v.resource;
                prereqsMet = prereqsMet && w.doesResourceExist(costResource);
            })
        }
        // check special worldtype prereqs
        if(action.prereq.world) {
            prereqsMet = prereqsMet && w.worldType === action.prereq.world;
        }
        // check upgrade prerequisites
        if(action.prereq.upgrade) {
            $.each(action.prereq.upgrade, function(_, v) {
                prereqsMet = prereqsMet && sharkgame.Upgrades[v].purchased;
            });
        }
        // check if resulting resource exists
        if(action.effect.resource) {
            $.each(action.effect.resource, function(k, v) {
                prereqsMet = prereqsMet && w.doesResourceExist(k);
            })
        }
        return prereqsMet;
    },

    addButton: function(actionName) {
        var h = sharkgame.Home;
        var buttonListSel = $('#buttonList');
        var actionData = sharkgame.HomeActions[actionName];

        var buttonSelector = sharkgame.ui.makeButton(actionName, actionData.name, buttonListSel, h.onHomeButton, "buttonhome");
        h.updateButton(actionName);
        if(sharkgame.Settings.current.showAnimations) {
            buttonSelector.hide()
                .css("opacity", 0)
                .slideDown(50)
                .animate({opacity: 1.0}, 50);
        }
        if(actionData.newlyDiscovered) {
            buttonSelector.addClass("newlyDiscovered");
        }
    },

    getActionCategory: function(actionName) {
        var categoryName = "";
        $.each(sharkgame.HomeActionCategories, function(categoryKey, categoryValue) {
            if(categoryName !== "") {
                return;
            }
            $.each(categoryValue.actions, function(k, v) {
                if(categoryName !== "") {
                    return;
                }
                if(actionName == v) {
                    categoryName = categoryKey;
                }
            });
        });
        return categoryName;
    },

    onHomeButton: function() {
        var h = sharkgame.Home;
        var r = sharkgame.Resources;
        var amountToBuy = sharkgame.Settings.current.buyAmount;
        // get related entry in home button table
        var button = $(this);
        var buttonName = button.attr("id");
        var action = sharkgame.HomeActions[buttonName];
        var actionCost = {};
        var amount = 0;
        if(amountToBuy < 0) {
            // unlimited mode, calculate the highest we can go
            var max = h.getMax(action);
            // floor max
            max = Math.floor(max);
            if(max > 0) {
                // convert divisor from a negative number to a positive fraction
                var divisor = 1 / (Math.floor((amountToBuy)) * -1);
                amount = max * divisor;
                // floor amount
                amount = Math.floor(amount);
                // make it worth entering this function
                if(amount < 1) amount = 1;
                actionCost = h.getCost(action, amount);
            }
        } else {
            actionCost = h.getCost(action, amountToBuy);
            amount = amountToBuy;
        }

        if($.isEmptyObject(actionCost)) {
            // free action
            // do not repeat or check for costs
            if(action.effect.resource) {
                r.changeManyResources(action.effect.resource);
            }
            sharkgame.Log.addMessage(sharkgame.choose(action.outcomes));
        } else if(amount > 0) {
            // cost action
            // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
            if(r.checkResources(actionCost)) {
                // take cost
                r.changeManyResources(actionCost, true);
                // execute effects
                if(action.effect.resource) {
                    var resourceChange;
                    if(amount !== 1) {
                        resourceChange = r.scaleResourceList(action.effect.resource, amount);
                    } else {
                        resourceChange = action.effect.resource;
                    }
                    r.changeManyResources(resourceChange);
                }
                // print outcome to log
                if(!(action.multiOutcomes) || (amount == 1)) {
                    sharkgame.Log.addMessage(sharkgame.choose(action.outcomes));
                } else {
                    sharkgame.Log.addMessage(sharkgame.choose(action.multiOutcomes));
                }
            } else {
                sharkgame.Log.addMessage("You can't afford that!");
            }
        }
        if(button.hasClass("newlyDiscovered")) {
            action.newlyDiscovered = false;
            button.removeClass("newlyDiscovered");
        }
        // disable button until next frame
        button.prop("disabled", true);
    },

    getCost: function(action, amount) {
        var calcCost = {};
        var rawCost = action.cost;

        $.each(rawCost, function(i, v) {
            var resource = sharkgame.playerresources[action.max];
            var currAmount = resource.amount;
            if(resource.jobs) {
                $.each(resource.jobs, function(_, v) {
                    currAmount += sharkgame.Resources.getResource(v);
                });
            }
            var costFunction = v.costFunction;
            var k = v.priceIncrease;
            var cost = 0;
            switch(costFunction) {
                case "constant":
                    cost = sharkgame.MathUtil.constantCost(currAmount, currAmount + amount, k);
                    break;
                case "linear":
                    cost = sharkgame.MathUtil.linearCost(currAmount, currAmount + amount, k);
                    break;
                case "unique":
                    cost = sharkgame.MathUtil.uniqueCost(currAmount, currAmount + amount, k);
                    break;
            }
            calcCost[v.resource] = cost;
        });
        return calcCost;
    },


    getMax: function(action) {
        var max = 1;
        if(action.max) {
            var resource = sharkgame.playerresources[action.max];
            var currAmount = resource.amount;
            if(resource.jobs) {
                $.each(resource.jobs, function(_, v) {
                    currAmount += sharkgame.Resources.getResource(v);
                });
            }
            max = Number.MAX_VALUE;
            var rawCost = action.cost;
            $.each(rawCost, function(_, v) {
                var costResource = sharkgame.playerresources[v.resource];

                var costFunction = v.costFunction;
                var k = v.priceIncrease;
                var subMax = -1;
                switch(costFunction) {
                    case "constant":
                        subMax = sharkgame.MathUtil.constantMax(currAmount, costResource.amount, k) - currAmount;
                        break;
                    case "linear":
                        subMax = sharkgame.MathUtil.linearMax(currAmount, costResource.amount, k) - currAmount;
                        break;
                    case "unique":
                        subMax = sharkgame.MathUtil.uniqueMax(currAmount, costResource.amount, k) - currAmount;
                        break;
                }
                max = Math.min(max, subMax);
            });
        }
        return Math.floor(max);
    },

    toggleHelp: function() {
        sharkgame.Settings.current.showTabHelp = !sharkgame.Settings.current.showTabHelp;
    }
};
