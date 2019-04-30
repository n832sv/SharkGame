sharkgame.lab = {

    tabId: "lab",
    tabDiscovered: false,
    tabName: "laboratory",
    tabBg: "img/bg/bg-lab.png",

    sceneImage: "img/events/misc/scene-lab.png",
    sceneDoneImage: "img/events/misc/scene-lab-done.png",

    discoverReq: {
        resource: {
            science: 10
        }
    },

    message: "Sort of just off to the side, the science sharks congregate and discuss things with words you've never heard before.",
    messageDone: "Sort of just off to the side, the science sharks quietly wrap up their badly disguised party and pretend to work.<br/>" +
        "Looks like that's it! No more things to figure out.",



    init: function() {
        var l = sharkgame.lab;
        // register tab
        sharkgame.tabs[l.tabId] = {
            id: l.tabId,
            name: l.tabName,
            discovered: l.tabDiscovered,
            discoverReq: l.discoverReq,
            code: l
        };

        // add default purchased state to each upgrade
        $.each(sharkgame.upgrades, function(k, v) {
            sharkgame.upgrades[k].purchased = false;
        });
    },

    switchTo: function() {
        var l = sharkgame.lab;
        var content = $('#content');

        var allResearchDone = l.allResearchDone();
        var message = allResearchDone ? l.messageDone : l.message;
        var imgSrc = allResearchDone ? l.sceneDoneImage : l.sceneImage;
        var tabMessageSel = $('<div>').attr("id", "tabMessage");
        if(sharkgame.settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + imgSrc + "' id='tabsceneImage'>" + message;
            tabMessageSel.css("background-image", "url('" + l.tabBg + "')");
        }
        tabMessageSel.html(message);
        content.append(tabMessageSel);
        var buttonListContainer = $('<div>').attr("id", "buttonLeftContainer");
        buttonListContainer.append($('<div>').attr("id", "buttonList").append($("<h3>").html("Available upgrades")));
        content.append(buttonListContainer);
        content.append($('<div>').attr("id", "upgradeList"));
        content.append($('<div>').addClass("clear-fix"));


        l.updateUpgradeList();
        if(allResearchDone) {
            $('#buttonList').append($('<p>').html("All clear here!"));
        }
    },

    update: function() {
        var l = sharkgame.lab;


        // cache a selector
        var buttonList = $('#buttonList');

        // for each upgrade not yet bought
        $.each(sharkgame.upgrades, function(key, value) {
            if(value.purchased) {
                return; // skip this upgrade altogether
            }

            // check if a button exists
            var button = $('#' + key);
            if(button.length === 0) {
                // add it if prequisite upgrades have been completed
                var prereqsMet = true; // assume true until proven false

                // check upgrade prerequisites
                if(value.required) {
                    // check previous upgrades
                    if(value.required.upgrades) {
                        $.each(value.required.upgrades, function(_, v) {
                            // check previous upgrade research
                            if(sharkgame.upgrades[v]) {
                                prereqsMet = prereqsMet && sharkgame.upgrades[v].purchased;
                            } else {
                                prereqsMet = false; // if the required upgrade doesn't exist, we definitely don't have it
                            }
                        });
                    }
                    // validate if upgrade is possible
                    prereqsMet = prereqsMet && l.isUpgradePossible(key);
                }
                if(prereqsMet) {
                    // add button
                    var effects = sharkgame.lab.getResearchEffects(value);
                    var buttonSelector = sharkgame.ui.makeButton(key, value.name + "<br/>" + value.desc + "<br/>" + effects, buttonList, l.onlabButton, "buttonlaboratory");
                      l.updatelabButton(key);
                    if(sharkgame.settings.current.showAnimations) {
                        buttonSelector.hide()
                            .css("opacity", 0)
                            .slideDown(50)
                            .animate({opacity: 1.0}, 50);
                    }
                }
            } else {
                // button exists
                l.updatelabButton(key);
            }
        });
    },

    updatelabButton: function(upgradeName) {
        var r = sharkgame.resources;
        var button = $('#' + upgradeName);
        var upgradeData = sharkgame.upgrades[upgradeName];
        var upgradeCost = upgradeData.cost;


        var enableButton;
        if($.isEmptyObject(upgradeCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = r.checkresources(upgradeCost);
        }

        var effects = sharkgame.lab.getResearchEffects(upgradeData, !enableButton);
        var label = upgradeData.name + "<br/>" + upgradeData.desc + "<br/>" + effects;
        var costText = r.resourceListToString(upgradeCost, !enableButton);
        if(costText != "") {
            label += "<br/>Cost: " + costText;
        }
        button.prop("disabled", !enableButton).html(label);

        var spritename = "technologies/" + upgradeName;
        if(sharkgame.settings.current.iconPositions !== "off") {
            var iconDiv = sharkgame.ui.changeSprite(sharkgame.spriteIconPath, spritename, null, "general/missing-technology");
            if(iconDiv) {
                iconDiv.addClass("button-icon-" + sharkgame.settings.current.iconPositions);
                if(!enableButton) {
                    button.prepend($('<div>').append(iconDiv).addClass("tint"));
                } else {
                    button.prepend(iconDiv);
                }
            }
        }
    },

    onlabButton: function() {
        var r = sharkgame.resources;
        var l = sharkgame.lab;
        var u = sharkgame.upgrades;

        var upgradeId = $(this).attr("id");
        var upgrade = u[upgradeId];
        if(upgrade.purchased) {
            $(this).remove();
            return; // something went wrong don't even pay attention to this function
        }

        var upgradeCost = u[upgradeId].cost;

        if(r.checkresources(upgradeCost)) {
            // kill button
            $(this).remove();
            // take resources
            r.changeManyresources(upgradeCost, true);
            // purchase upgrade
            l.addUpgrade(upgradeId);
            // update upgrade list
            l.updateUpgradeList();

            if(upgrade.researchedMessage) {
                sharkgame.log.addMessage(upgrade.researchedMessage);
            }
        }
    },

    addUpgrade: function(upgradeId) {
        var l = sharkgame.lab;
        var r = sharkgame.resources;
        var u = sharkgame.upgrades;
        var upgrade = u[upgradeId];
        if(upgrade) {
            if(!upgrade.purchased) {
                upgrade.purchased = true;
                //l.updateResearchList();

                // if the upgrade has effects, do them
                if(upgrade.effect) {
                    if(upgrade.effect.multiplier) {
                        $.each(upgrade.effect.multiplier, function(k, v) {
                            var newMultiplier = v * r.getMultiplier(k);
                            r.setMultiplier(k, newMultiplier)
                        });
                    }
                }
            }
        }
    },

    allResearchDone: function() {
        var u = sharkgame.upgrades;
        var l = sharkgame.lab;
        var allDone = true;
        $.each(u, function(k, v) {
            if(l.isUpgradePossible(k)) {
                allDone = allDone && v.purchased;
            }
        });
        return allDone;
    },

    isUpgradePossible: function(upgradeName) {
        var w = sharkgame.world;
        var l = sharkgame.lab;
        var upgradeData = sharkgame.upgrades[upgradeName];
        var isPossible = true;

        if(upgradeData.required) {
            if(upgradeData.required.resources) {
                // check if any related resources exist in the world for this to make sense
                // unlike the costs where all resources in the cost must exist, this is an either/or scenario
                var relatedresourcesExist = false;
                _.each(upgradeData.required.resources, function(v) {
                    relatedresourcesExist = relatedresourcesExist || w.doesResourceExist(v);
                });
                isPossible = isPossible && relatedresourcesExist;
            }
            if(upgradeData.required.upgrades) {
                // RECURSIVE CHECK REQUISITE TECHS
                _.each(upgradeData.required.upgrades, function(v) {
                    isPossible = isPossible && l.isUpgradePossible(v);
                });
            }
            // check existence of resource cost
            // this is the final check, everything that was permitted previously will be made false
            $.each(upgradeData.cost, function(k, v) {
                isPossible = isPossible && w.doesResourceExist(k);
            });
        }

        return isPossible;
    },

    getResearchEffects: function(upgrade, darken) {
        var effects = "<span class='medDesc' class='click-passthrough'>(Effects: ";
        if(upgrade.effect) {
            if(upgrade.effect.multiplier) {
                $.each(upgrade.effect.multiplier, function(k, v) {
                    if(sharkgame.world.doesResourceExist(k)) {
                        effects += sharkgame.resources.getResourceName(k, darken, true) + " power x " + v + ", ";
                    }
                });
                // remove trailing suffix
                effects = effects.slice(0, -2);
            }
        } else {
            effects += "???";
        }
        effects += ")</span>";
        return effects;
    },

    updateUpgradeList: function() {
        var u = sharkgame.upgrades;
        var upgradeList = $('#upgradeList');
        upgradeList.empty();
        upgradeList.append($("<h3>").html("Researched upgrades"));
        var list = $('<ul>');
        $.each(u, function(k, v) {
            if(v.purchased) {
                list.append($("<li>")
                        .html(v.name + "<br/><span class='medDesc'>" + v.effectDesc + "</span>")
                );
            }
        });
        upgradeList.append(list);
    }
};
