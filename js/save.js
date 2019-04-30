sharkgame.save = {

    saveFileName: "sharkgamesave",

    saveGame: function(suppressSavingToStorage, dontFlat) {
        // populate save data object
        var saveString = "";
        var savedata = {};
        savedata.version = sharkgame.VERSION;
        savedata.resources = {};
        savedata.tabs = {};
        savedata.settings = {};
        savedata.upgrades = {};
        savedata.gateCostsMet = [];
        savedata.world = {type: sharkgame.world.worldType, level: sharkgame.world.planetLevel};
        savedata.artifacts = {};
        savedata.gateway = {betweenRuns: sharkgame.gameOver, wonGame: sharkgame.wonGame};

        $.each(sharkgame.playerresources, function(k, v) {
            savedata.resources[k] = {
                amount: v.amount,
                totalAmount: v.totalAmount
            };
        });

        $.each(sharkgame.upgrades, function(k, v) {
            savedata.upgrades[k] = v.purchased;
        });

        $.each(sharkgame.tabs, function(k, v) {
            if(k !== "current") {
                savedata.tabs[k] = v.discovered;
            } else {
                savedata.tabs.current = v;
            }
        });

        var gateCostTypes = [];
        $.each(sharkgame.gate.costsMet, function(name, met) {
            gateCostTypes.push(name);
        });
        gateCostTypes.sort();

        $.each(gateCostTypes, function(i, name) {
            savedata.gateCostsMet[i] = sharkgame.gate.costsMet[name];
        });

        $.each(sharkgame.settings, function(k, v) {
            if(k !== "current") {
                savedata.settings[k] = sharkgame.settings.current[k];
            }
        });

        $.each(sharkgame.Artifacts, function(k, v) {
            savedata.artifacts[k] = v.level;
        });

        // add timestamp
        //savedata.timestamp = (new Date()).getTime();
        savedata.timestampLastsave = (new Date()).getTime();
        savedata.timestampGameStart = sharkgame.timestampGameStart;
        savedata.timestampRunStart = sharkgame.timestampRunStart;
        savedata.timestampRunEnd = sharkgame.timestampRunEnd;

        if(dontFlat) {
            savedata.saveVersion = sharkgame.save.saveUpdaters.length - 1;
            saveString = JSON.stringify(savedata);
        } else {
            //make a current-version template
            var saveVersion = sharkgame.save.saveUpdaters.length - 1;
            var template = {};
            for(var i = 0; i <= saveVersion; i++) {
                var updater = sharkgame.save.saveUpdaters[i];
                template = updater(template);
            }
            //flatten
            var flatData = sharkgame.save.flattenData(template, savedata);
            flatData.unshift(saveVersion);
            saveString = pako.deflate(JSON.stringify(flatData), {to: 'string'});
        }

        if(!suppressSavingToStorage) {
            try {
                // convert compressed data to ascii85 for friendlier browser support (IE11 doesn't like weird binary data)
                var convertedsaveString = ascii85.encode(saveString);
                localStorage.setItem(sharkgame.save.saveFileName, convertedsaveString);
            } catch(err) {
                throw new Error("Couldn't save to local storage. Reason: " + err.message);
            }
        }
        return saveString;
    },

    loadGame: function(importsavedata) {
        var savedata;
        var savedataString = importsavedata || localStorage.getItem(sharkgame.save.saveFileName);

        if(!savedataString) {
            throw new Error("Tried to load game, but no game to load.");
        }

        // if first letter of string is <, data is encoded in ascii85, decode it.
        if(savedataString.substring(0, 2) === "<~") {
            try {
                savedataString = ascii85.decode(savedataString);
            } catch(err) {
                throw new Error("saved data looked like it was encoded in ascii85, but it couldn't be decoded. Can't load. Your save: " + savedataString)
            }
        }

        // if first letter of string is x, data is compressed and needs uncompressing.
        if(savedataString.charAt(0) === 'x') {
            // decompress string
            try {
                savedataString = pako.inflate(savedataString, {to: 'string'});
            } catch(err) {
                throw new Error("saved data is compressed, but it can't be decompressed. Can't load. Your save: " + savedataString);
            }
        }

        // if first letter of string is { or [, data is json
        if(savedataString.charAt(0) === '{' || savedataString.charAt(0) === '[') {
            try {
                savedata = JSON.parse(savedataString);
            } catch(err) {
                var errMessage = "Couldn't load save data. It didn't parse correctly. Your save: " + savedataString;
                if(importsavedata) {
                    errMessage += " Did you paste the entire string?";
                }
                throw new Error(errMessage);
            }
        }

        // if first letter of string was [, data was packed, unpack it
        if(savedataString.charAt(0) === '[') {
            try {
                //check version
                var currentVersion = sharkgame.save.saveUpdaters.length - 1;
                var saveVersion = savedata.shift();
                if(typeof saveVersion !== "number" || saveVersion % 1 !== 0 || saveVersion < 0 || saveVersion > currentVersion) {
                    throw new Error("Invalid save version!");
                }
                //create matching template
                var template = {};
                for(var i = 0; i <= saveVersion; i++) {
                    var updater = sharkgame.save.saveUpdaters[i];
                    template = updater(template);
                }
                //unpack
                var savedataFlat = savedata;
                savedata = sharkgame.save.expandData(template, savedataFlat.slice());
                savedata.saveVersion = saveVersion;

                function checkTimes(data) {
                    return (data.timestampLastsave > 1e12 && data.timestampLastsave < 2e12 &&
                    data.timestampGameStart > 1e12 && data.timestampGameStart < 2e12 &&
                    data.timestampRunStart > 1e12 && data.timestampRunStart < 2e12)
                }

                //check if the template was sorted wrong when saving
                if(saveVersion <= 5 && !checkTimes(savedata)) {
                    savedata = sharkgame.save.expandData(template, savedataFlat.slice(), true);
                    savedata.saveVersion = saveVersion;
                }

                if(!checkTimes(savedata)) {
                    throw new Error("Order appears to be corrupt.");
                }
            } catch(err) {
                throw new Error("Couldn't unpack packed save data. Reason: " + err.message + ". Your save: " + savedataString);
            }
        }

        if(savedata) {
            // go through it

            //check for updates
            var currentVersion = sharkgame.save.saveUpdaters.length - 1;
            savedata.saveVersion = savedata.saveVersion || 0;
            if(savedata.saveVersion < currentVersion) {
                for(i = savedata.saveVersion + 1; i <= currentVersion; i++) {
                    var updater = sharkgame.save.saveUpdaters[i];
                    savedata = updater(savedata);
                    savedata.saveVersion = i;
                }
                // let player know update went fine
                sharkgame.log.addMessage("Updated save data from v " + savedata.version + " to " + sharkgame.VERSION + ".");
            }

            if(savedata.resources) {
                $.each(savedata.resources, function(k, v) {
                    // check that this isn't an old resource that's been removed from the game for whatever reason
                    if(sharkgame.playerresources[k]) {
                        sharkgame.playerresources[k].amount = isNaN(v.amount) ? 0 : v.amount;
                        sharkgame.playerresources[k].totalAmount = isNaN(v.totalAmount) ? 0 : v.totalAmount;
                    }
                });
            }

            // hacky kludge: force table creation
            sharkgame.resources.reconstructresourcesTable();

            if(savedata.upgrades) {
                $.each(savedata.upgrades, function(k, v) {
                    if(savedata.upgrades[k]) {
                        sharkgame.lab.addUpgrade(k);
                    }
                });
            }

            // load artifacts (need to have the terraformer and cost reducer loaded before world init)
            if(savedata.artifacts) {
                sharkgame.gateway.init();
                $.each(savedata.artifacts, function(k, v) {
                    sharkgame.Artifacts[k].level = v;
                });
            }

            // load world type and level and apply world properties
            if(savedata.world) {
                sharkgame.world.init();
                sharkgame.world.worldType = savedata.world.type;
                sharkgame.world.planetLevel = savedata.world.level;
                sharkgame.world.apply();
                sharkgame.home.init();
            }

            // apply artifacts (world needs to be init first before applying other artifacts, but special ones need to be _loaded_ first)
            if(savedata.artifacts) {
                sharkgame.gateway.applyArtifacts(true);
            }

            if(savedata.tabs) {
                $.each(savedata.tabs, function(k, v) {
                    if(sharkgame.tabs[k]) {
                        sharkgame.tabs[k].discovered = v;
                    }
                });
                if(savedata.tabs.current) {
                    sharkgame.tabs.current = savedata.tabs.current;
                }
            }

            var gateCostTypes = [];
            $.each(sharkgame.gate.costsMet, function(name, met) {
                gateCostTypes.push(name);
            });
            gateCostTypes.sort();

            if(gateCostTypes) {
                $.each(gateCostTypes, function(i, name) {
                    sharkgame.gate.costsMet[name] = savedata.gateCostsMet[i];
                });
            }

            if(savedata.settings) {
                $.each(savedata.settings, function(k, v) {
                    if(sharkgame.settings.current[k] !== undefined) {
                        sharkgame.settings.current[k] = v;
                        // update anything tied to this setting right off the bat
                        (sharkgame.settings[k].onChange || $.noop)();
                    }
                });
            }

            var currTimestamp = (new Date()).getTime();
            // create surrogate timestamps if necessary
            if((typeof savedata.timestampLastsave !== "number")) {
                savedata.timestampLastsave = currTimestamp;
            }
            if((typeof savedata.timestampGameStart !== "number")) {
                savedata.timestampGameStart = currTimestamp;
            }
            if((typeof savedata.timestampRunStart !== "number")) {
                savedata.timestampRunStart = currTimestamp;
            }
            if((typeof savedata.timestampRunEnd !== "number")) {
                savedata.timestampRunEnd = currTimestamp;
            }

            sharkgame.timestampLastsave = savedata.timestampLastsave;
            sharkgame.timestampGameStart = savedata.timestampGameStart;
            sharkgame.timestampRunStart = savedata.timestampRunStart;
            sharkgame.timestampRunEnd = savedata.timestampRunEnd;

            // load existence in in-between state,
            // else check for offline mode and process
            var simulateOffline = sharkgame.settings.current.offlineModeActive;
            if(savedata.gateway) {
                if(savedata.gateway.betweenRuns) {
                    simulateOffline = false;
                    sharkgame.wonGame = savedata.gateway.wonGame;
                    sharkgame.main.endGame(true);
                }
            }

            // if offline mode is enabled
            if(simulateOffline) {
                // get times elapsed since last save game
                var now = (new Date()).getTime();
                var secondsElapsed = (now - savedata.timestampLastsave) / 1000;
                if(secondsElapsed < 0) {
                    // something went hideously wrong or someone abused a system clock somewhere
                    secondsElapsed = 0;
                }

                // process this
                sharkgame.resources.recalculateIncomeTable();
                sharkgame.main.processSimTime(secondsElapsed);

                // acknowledge long time gaps
                if(secondsElapsed > 3600) {
                    var notification = "Welcome back! It's been ";
                    var numHours = Math.floor(secondsElapsed / 3600);
                    if(numHours > 24) {
                        var numDays = Math.floor(numHours / 24);
                        if(numDays > 7) {
                            var numWeeks = Math.floor(numDays / 7);
                            if(numWeeks > 4) {
                                var numMonths = Math.floor(numWeeks / 4);
                                if(numMonths > 12) {
                                    var numYears = Math.floor(numMonths / 12);
                                    notification += "almost " + ( numYears === 1 ? "a" : numYears ) + " year" + sharkgame.plural(numYears) + ", thanks for remembering this exists!"
                                } else {
                                    notification += "like " + (numMonths === 1 ? "a" : numMonths ) + " month" + sharkgame.plural(numMonths) + ", it's getting kinda crowded.";
                                }
                            } else {
                                notification += "about " + (numWeeks === 1 ? "a" : numWeeks) + " week" + sharkgame.plural(numWeeks) + ", you were gone a while!";
                            }
                        } else {
                            notification += (numDays === 1 ? "a" : numDays ) + " day" + sharkgame.plural(numDays) + ", and look at all the stuff you have now!";
                        }
                    } else {
                        notification += (numHours === 1 ? "an" : numHours ) + " hour" + sharkgame.plural(numHours) + " since you were seen around here!";
                    }
                    sharkgame.log.addMessage(notification);
                }
            }
        } else {
            throw new Error("Couldn't load saved game. I don't know how to break this to you, but I think your save is corrupted. Your save: " + savedataString);
        }
    },

    importData: function(data) {
        // decode from ascii85
        var savedata;
        try {
            savedata = ascii85.decode(data);
        } catch(err) {
            sharkgame.log.addError("That's not encoded properly. Are you sure that's the full save export string?");
        }
        // load the game from this save data string
        try {
            sharkgame.save.loadGame(savedata);
        } catch(err) {
            sharkgame.log.addError(err.message);
            console.log(err.trace);
        }
        // refresh current tab
        sharkgame.main.setUpTab();
    },

    exportData: function() {
        // get save
        var savedata = localStorage.getItem(sharkgame.save.saveFileName);
        if(savedata === null) {
            try {
                savedata = sharkgame.save.saveGame(true);
            } catch(err) {
                sharkgame.log.addError(err.message);
                console.log(err.trace);
            }
        }
        // check if save isn't encoded
        if(savedata.substring(0, 2) !== "<~") {
            // encode it
            savedata = ascii85.encode(savedata);
        }
        return savedata;
    },

    savedGameExists: function() {
        return (localStorage.getItem(sharkgame.save.saveFileName) !== null);
    },

    deletesave: function() {
        localStorage.removeItem(sharkgame.save.saveFileName);
    },

    // Thanks to Dylan for managing to crush saves down to a much smaller size!
    createBlueprint: function(template, sortWrong) {
        function createPart(t) {
            var bp = [];
            $.each(t, function(k, v) {
                if(typeof v === "object" && v !== null) {
                    bp.push([k, createPart(v)]);
                } else {
                    bp.push(k);
                }
            });
            bp.sort(function(a, b) {
                a = typeof a === "object" ? a[0] : a;
                b = typeof b === "object" ? b[0] : b;
                if(sortWrong) {
                    return a > b;  //mercy on my soul
                } else {
                    return a > b ? 1 : -1;
                }
            });
            return bp;
        }

        return createPart(template);
    },

    flattenData: function(template, source) {
        var out = [];

        function flattenPart(bp, src) {
            $.each(bp, function(_, slot) {
                if(typeof slot === "object") {
                    flattenPart(slot[1], src[slot[0]]);
                } else {
                    var elem = src[slot];
                    if(typeof elem === "number" && slot.indexOf("timestamp") === -1) {
                        elem = Number(elem.toPrecision(5));
                    }
                    out.push(elem);
                }
            });
        }

        flattenPart(sharkgame.save.createBlueprint(template), source);
        return out;
    },

    expandData: function(template, data, sortWrong) {
        function expandPart(bp) {
            var out = {}; //todo: array support
            $.each(bp, function(_, slot) {
                if(typeof slot === "object") {
                    out[slot[0]] = expandPart(slot[1]);
                } else {
                    if(data.length === 0) throw new Error("Incorrect save length.");
                    out[slot] = data.shift();
                }
            });
            return out;
        }

        var expanded = expandPart(sharkgame.save.createBlueprint(template, sortWrong));
        if(data.length !== 0) throw new Error("Incorrect save length.");
        return expanded;
    },

    saveUpdaters: [ //used to update saves and to make templates
        function(save) {
            //no one is converting a real save to version 0, so it doesn't need real values
            save.version = null;
            save.timestamp = null;
            save.resources = {};
            $.each(["essence", "shark", "ray", "crab", "scientist", "nurse", "laser", "maker", "planter", "brood", "crystalMiner", "autoTransmuter", "fishMachine", "science", "fish", "sand", "crystal", "kelp", "seaApple", "sharkonium"], function(i, v) {
                save.resources[v] = {amount: null, totalAmount: null};
            });
            save.upgrades = {};
            $.each(["crystalBite", "crystalSpade", "crystalContainer", "underwaterChemistry", "seabedGeology", "thermalVents", "laserRays", "automation", "engineering", "kelpHorticulture", "xenobiology", "biology", "rayBiology", "crabBiology", "sunObservation", "transmutation", "exploration", "farExploration", "gateDiscovery"], function(i, v) {
                save.upgrades[v] = null;
            });
            save.tabs = {
                "current": null,
                "home": {"discovered": null},
                "lab": {"discovered": null},
                "gate": {"discovered": null}
            };
            save.settings = {
                "buyAmount": null,
                "offlineModeActive": null,
                "autosaveFrequency": null,
                "logMessageMax": null,
                "sidebarWidth": null,
                "showAnimations": null,
                "colorCosts": null
            };
            save.gateCostsMet = {
                "fish": null,
                "sand": null,
                "crystal": null,
                "kelp": null,
                "seaApple": null,
                "sharkonium": null
            };
            return save;
        },

        // future updaters for save versions beyond the base:
        // they get passed the result of the previous updater and it continues in a chain
        // and they start based on the version they were saved
        function(save) {
            save = $.extend(true, save, {
                "resources": {"sandDigger": {"amount": 0, "totalAmount": 0}, "junk": {"amount": 0, "totalAmount": 0}},
                "upgrades": {statsDiscovery: null, recyclerDiscovery: null},
                "settings": {"showTabHelp": false, "groupresources": false},
                "timestampLastsave": save.timestamp,
                "timestampGameStart": null,
                "timestampRunStart": null
            });
            // reformat tabs
            save.tabs = {
                "current": save.tabs["current"],
                "home": save.tabs["home"].discovered,
                "lab": save.tabs["lab"].discovered,
                "gate": save.tabs["gate"].discovered,
                "stats": false,
                "recycler": false
            };
            delete save.timestamp;
            return save;
        },

        // v0.6
        function(save) {
            // add new setting to list of saves
            save = $.extend(true, save, {
                "settings": {"iconPositions": "top"}
            });
            return save;
        },

        // v0.7
        function(save) {
            save = $.extend(true, save, {
                "settings": {"showTabImages": true},
                "tabs": {"reflection": false},
                "timestampRunEnd": null
            });
            _.each(["shrimp", "lobster", "dolphin", "whale", "chimaera", "octopus", "eel", "queen", "berrier", "biologist", "pit", "worker", "harvester", "philosopher", "treasurer", "chorus", "transmuter", "explorer", "collector", "scavenger", "technician", "sifter", "skimmer", "purifier", "heater", "spongeFarmer", "berrySprayer", "glassMaker", "silentArchivist", "tirelessCrafter", "clamCollector", "sprongeSmelter", "seaScourer", "prostheticPolyp", "sponge", "jellyfish", "clam", "coral", "algae", "coralglass", "delphinium", "spronge", "tar", "ice"], function(v) {
                save.resources[v] = {amount: 0, totalAmount: 0};
            });
            _.each(["environmentalism", "thermalConditioning", "coralglassSmelting", "industrialGradeSponge", "aquamarineFusion", "coralCircuitry", "sprongeBiomimicry", "dolphinTechnology", "spongeCollection", "jellyfishHunting", "clamScooping", "pearlConversion", "crustaceanBiology", "eusociality", "wormWarriors", "cetaceanAwareness", "dolphinBiology", "delphinePhilosophy", "coralHalls", "eternalSong", "eelHabitats", "creviceCreches", "bioelectricity", "chimaeraMysticism", "abyssalEnigmas", "octopusMethodology", "octalEfficiency"], function(v) {
                save.upgrades[v] = false;
            });
            save.world = {type: "start", level: 1};
            save.artifacts = {};
            _.each(["permanentMultiplier", "planetTerraformer", "gateCostReducer", "planetScanner", "sharkMigrator", "rayMigrator", "crabMigrator", "shrimpMigrator", "lobsterMigrator", "dolphinMigrator", "whaleMigrator", "eelMigrator", "chimaeraMigrator", "octopusMigrator", "sharkTotem", "rayTotem", "crabTotem", "shrimpTotem", "lobsterTotem", "dolphinTotem", "whaleTotem", "eelTotem", "chimaeraTotem", "octopusTotem", "progressTotem", "carapaceTotem", "inspirationTotem", "industryTotem", "wardingTotem"], function(v) {
                save.artifacts[v] = 0;
            });
            save.gateway = {betweenRuns: false};
            return save;
        },

        // a little tweak here and there
        function(save) {
            save = $.extend(true, save, {
                "settings": {"buttonDisplayType": "list"}
            });
            return save;
        },
        function(save) {
            save = $.extend(true, save, {
                "gateway": {"wonGame": false}
            });
            return save;
        },
        function(save) {
            // forgot to add numen to saved resources (which is understandable given it can't actually be legitimately achieved at this point)
            save.resources["numen"] = {amount: 0, totalAmount: 0};
            // completely change how gate slot status is saved
            save.gateCostsMet = [false, false, false, false, false, false];
            return save;
        },

        // v 0.71
        function(save) {
            _.each(["eggBrooder", "diver"], function(v) {
                save.resources[v] = {amount: 0, totalAmount: 0};
            });
            _.each(["agriculture", "ancestralRecall", "utilityCarapace", "primordialSong", "leviathanHeart", "eightfoldOptimisation", "mechanisedAlchemy", "mobiusShells", "imperialDesigns"], function(v) {
                save.upgrades[v] = false;
            });
            return save;
        }
    ]
};
