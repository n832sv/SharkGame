SharkGame.ui = {

	setUpTitleBar: function() {
        var titleMenu = $('#titlemenu');
        var subTitleMenu = $('#subtitlemenu');
        titleMenu.empty();
        subTitleMenu.empty();
        $.each(SharkGame.TitleBar, function(k, v) {
            var option = "<li><a id='" + k + "' href='javascript:;'>" + v.name + "</a></li>";
            if(v.main) {
                titleMenu.append(option);
            } else {
                subTitleMenu.append(option);
            }
            $('#' + k).click(v.onClick);
        });
	},

    setUpTab: function() {
        var tabs = SharkGame.Tabs;
        // empty out content div
        var content = $('#content');
        content.empty();
        content.append('<div id="contentMenu"><ul id="tabList"></ul><ul id="tabButtons"></ul></div><div id="tabBorder" class="clear-fix"></div>');

        SharkGame.ui.createTabNavigation();
        SharkGame.ui.createBuyButtons();

        // set up tab specific stuff
        var tab = tabs[tabs.current];
        var tabCode = tab.code;
        tabCode.switchTo();
    },

    createTabMenu: function() {
        SharkGame.ui.createTabNavigation();
        SharkGame.ui.createBuyButtons();
    },
    
    createTabNavigation: function() {
        var tabs = SharkGame.Tabs;
        var tabList = $('#tabList');
        tabList.empty();
        // add navigation
        // check if we have more than one discovered tab, else bypass this
        var numTabsDiscovered = 0;
        $.each(tabs, function(k, v) {
            if(v.discovered) {
                numTabsDiscovered++;
            }
        });
        if(numTabsDiscovered > 1) {
            // add a header for each discovered tab
            // make it a link if it's not the current tab
            $.each(tabs, function(k, v) {
                var onThisTab = (SharkGame.Tabs.current === k);
                if(v.discovered) {
                    var tabListItem = $('<li>');
                    if(onThisTab) {
                        tabListItem.html(v.name);
                    } else {
                        tabListItem.append($('<a>')
                                .attr("id", "tab-" + k)
                                .attr("href", "javascript:;")
                                .html(v.name)
                                .click(function() {
                                    var tab = ($(this).attr("id")).split("-")[1];
                                    SharkGame.ui.changeTab(tab);
                                })
                        );
                    }
                    tabList.append(tabListItem);
                }
            })
        }
    },

    createBuyButtons: function(customLabel) {
        // add buy buttons
        var buttonList = $('#tabButtons');
        buttonList.empty();
        $.each(SharkGame.Settings.buyAmount.options, function(_, v) {
            var amount = v;
            var disableButton = (v === SharkGame.Settings.current.buyAmount);
            buttonList.prepend($('<li>')
                .append($('<button>')
                    .addClass("min buybuttons")
                    .attr("id", "buy-" + v)
                    .prop("disabled", disableButton)
            ));
            var label = customLabel ? customLabel + " " : "buy ";
            if(amount < 0) {
                if(amount < -2) {
                    label += "1/3 max"
                } else if(amount < -1) {
                    label += "1/2 max"
                } else if(amount < 0) {
                    label += "max"
                }
            } else {
                label += SharkGame.Main.beautify(amount);
            }
            $('#buy-' + v).html(label)
                .click(function() {
                    var thisButton = $(this);
                    SharkGame.Settings.current.buyAmount = parseInt(thisButton.attr("id").slice(4));
                    $("button[id^='buy-']").prop("disabled", false);
                    thisButton.prop("disabled", true);
                });
        });
    },

    changeTab: function(tab) {
        SharkGame.Tabs.current = tab;
        SharkGame.ui.setUpTab();
    },

    discoverTab: function(tab) {
        SharkGame.Tabs[tab].discovered = true;
        // force a total redraw of the navigation
        SharkGame.ui.createTabMenu();
    },
    
    showOptions: function() {
        var optionsContent = SharkGame.ui.setUpOptions();
        SharkGame.ui.showPane("Options", optionsContent);
    },
    
    showSidebarIfNeeded: function() {
		if(SharkGame.Settings.current.showAnimations) {
			$('#sidebar').show("500");
        } else {
            $('#sidebar').show();
        }
        SharkGame.sidebarHidden = false;
    },
    
    setUpOptions: function() {
        var optionsTable = $('<table>').attr("id", "optionTable");
        // add settings specified in settings.js
        $.each(SharkGame.Settings, function(key, value) {
            if(key === "current" || !value.show) {
                return;
            }
            var row = $('<tr>');

            // show setting name
            row.append($('<td>')
                    .addClass("optionLabel")
                    .html(value.name + ":" +
                    "<br/><span class='smallDesc'>" + "(" + value.desc + ")" + "</span>")
            );

            var currentSetting = SharkGame.Settings.current[key];

            // show setting adjustment buttons
            $.each(value.options, function(k, v) {
                var isCurrentSetting = (k == value.options.indexOf(currentSetting));
                row.append($('<td>').append($('<button>')
                        .attr("id", "optionButton-" + key + "-" + k)
                        .addClass("option-button")
                        .prop("disabled", isCurrentSetting)
                        .html((typeof v === "boolean") ? (v ? "on" : "off") : v)
                        .click(SharkGame.Main.onOptionClick)
                ));
            });

            optionsTable.append(row);
        });

        // SAVE IMPORT/EXPORT
        // add save import/export
        var row = $('<tr>');
        row.append($('<td>')
                .html("Import/Export Save:<br/><span class='smallDesc'>(You should probably save first!) Import or export save as text. Keep it safe!</span>")
        );
        row.append($('<td>').append($('<button>')
                .html("import")
                .addClass("option-button")
                .click(function() {
                    var importText = $('#importExportField').val();
                    if(importText === "") {
                        SharkGame.hidePane();
                        SharkGame.Log.addError("You need to paste something in first!");
                    } else if(confirm("Are you absolutely sure? This will override your current save.")) {
                        SharkGame.Save.importData(importText);
                    }
                })
        ));
        row.append($('<td>').append($('<button>')
                .html("export")
                .addClass("option-button")
                .click(function() {
                    $('#importExportField').val(SharkGame.Save.exportData());
                })
        ));
        // add the actual text box
        row.append($('<td>').attr("colSpan", 4)
            .append($('<input>')
                .attr("type", "text")
                .attr("id", "importExportField")
        ));
        optionsTable.append(row);


        // SAVE WIPE
        // add save wipe
        row = $('<tr>');
        row.append($('<td>')
                .html("Wipe Save<br/><span class='smallDesc'>(Completely wipe your save and reset the game. COMPLETELY. FOREVER.)</span>")
        );
        row.append($('<td>').append($('<button>')
                .html("wipe")
                .addClass("option-button")
                .click(function() {
                    if(confirm("Are you absolutely sure you want to wipe your save?\nIt'll be gone forever!")) {
                        SharkGame.Save.deleteSave();
                        SharkGame.Gateway.deleteArtifacts(); // they're out of the save data, but not the working game memory!
                        SharkGame.Resources.reconstructResourcesTable();
                        SharkGame.World.worldType = "start"; // nothing else will reset this
                        SharkGame.World.planetLevel = 1;
                        SharkGame.Main.init(); // reset
                    }
                })
        ));
        optionsTable.append(row);
        return optionsTable;
    },
    
    showChangelog: function() {
        var changelogContent = $('<div>').attr("id", "changelogDiv");
        $.each(SharkGame.Changelog, function(version, changes) {
            var segment = $('<div>').addClass("paneContentDiv");
            segment.append($('<h3>').html(version + ": "));
            var changeList = $('<ul>');
            $.each(changes, function(_, v) {
                changeList.append($('<li>').html(v));
            });
            segment.append(changeList);
            changelogContent.append(segment);
        });
        SharkGame.ui.showPane("Changelog", changelogContent);
    },
    
    showHelp: function() {
        var helpDiv = $('<div>');
        helpDiv.append($('<div>').append(SharkGame.help).addClass("paneContentDiv"));
        SharkGame.ui.showPane("Help", helpDiv);
    },
    
    buildPane: function() {
        var pane;
        pane = $('<div>').attr("id", "pane");
        $('body').append(pane);

        // set up structure of pane
        var titleDiv = $('<div>').attr("id", "paneHeader");
        titleDiv.append($('<div>').attr("id", "paneHeaderTitleDiv"));
        titleDiv.append($('<div>')
            .attr("id", "paneHeaderCloseButtonDiv")
            .append($('<button>')
                .attr("id", "paneHeaderCloseButton")
                .addClass("min")
                .html("&nbsp x &nbsp")
                .click(SharkGame.ui.hidePane)
        ));
        pane.append(titleDiv);
        pane.append($('<div>').attr("id", "paneHeaderEnd").addClass("clear-fix"));
        pane.append($('<div>').attr("id", "paneContent"));

        pane.hide();
        SharkGame.paneGenerated = true;
        return pane;
    },

    showPane: function(title, contents, hideCloseButton, fadeInTime, customOpacity) {
        var pane;

        // GENERATE PANE IF THIS IS THE FIRST TIME
        if(!SharkGame.paneGenerated) {
            pane = SharkGame.ui.buildPane();
        } else {
            pane = $('#pane');
        }

        // begin fading in/displaying overlay if it isn't already visible
        var overlay = $("#overlay");
        // is it already up?
        fadeInTime = fadeInTime || 600;
        if(overlay.is(':hidden')) {
            // nope, show overlay
            var overlayOpacity = customOpacity || 0.5;
            if(SharkGame.Settings.current.showAnimations) {
                overlay.show()
                    .css("opacity", 0)
                    .animate({opacity: overlayOpacity}, fadeInTime);
            } else {
                overlay.show()
                    .css("opacity", overlayOpacity);
            }
            // adjust overlay height
            overlay.height($(document).height());
        }

        // adjust header
        var titleDiv = $('#paneHeaderTitleDiv');
        var closeButtonDiv = $('#paneHeaderCloseButtonDiv');

        if(!title || title === "") {
            titleDiv.hide();
        } else {
            titleDiv.show();
            if(!hideCloseButton) {
                // put back to left
                titleDiv.css({"float": "left", "text-align": "left", "clear": "none"});
                titleDiv.html("<h3>" + title + "</h3>");
            } else {
                // center
                titleDiv.css({"float": "none", "text-align": "center", "clear": "both"});
                titleDiv.html("<h2>" + title + "</h2>");
            }
        }
        if(hideCloseButton) {
            closeButtonDiv.hide();
        } else {
            closeButtonDiv.show();
        }

        // adjust content
        var paneContent = $('#paneContent');
        paneContent.empty();

        paneContent.append(contents);
        if(SharkGame.Settings.current.showAnimations && customOpacity) {
            pane.show()
                .css("opacity", 0)
                .animate({opacity: 1.0}, fadeInTime);
        } else {
            pane.show();
        }
    },

    hidePane: function() {
        $('#overlay').hide();
        $('#pane').hide();
    },
    
        makeButton: function(id, name, div, handler, classlist) {
		return $("<button>").html(name)
        	.attr("id", id)
			.addClass(classlist)
        	.appendTo(div)
        	.click(handler);
			
    },

    replaceButton: function(id, name, handler) {
        return $('#' + id).html(name)
            .unbind('click')
            .click(handler);
    }

};
