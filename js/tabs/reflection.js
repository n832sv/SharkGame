sharkgame.reflection = {

    tabId: "reflection",
    tabDiscovered: false,
    tabName: "reflection",
    tabBg: "img/bg/bg-gate.png",

    sceneImage: "img/events/misc/scene-reflection.png",

    discoverReq: {
        resource: {
            essence: 1
        }
    },

    message: "You may not remember everything, but you are something more than a shark now." +
    "</br><span='medDesc'>Reflect upon the changes in yourself and reality you have made here.</span>",

    init: function() {
        var r = sharkgame.reflection;
        // register tab
        sharkgame.tabs[r.tabId] = {
            id: r.tabId,
            name: r.tabName,
            discovered: r.tabDiscovered,
            discoverReq: r.discoverReq,
            code: r
        };
    },

    switchTo: function() {
        var r = sharkgame.reflection;
        var content = $('#content');
        content.append($('<div>').attr("id", "tabMessage"));
        content.append($('<div>').attr("id", "artifactList"));
        var message = r.message;
        var tabMessageSel = $('#tabMessage');
        if(sharkgame.settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + r.sceneImage + "' id='tabsceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + r.tabBg + "')");
        }
        tabMessageSel.html(message);

        r.updateArtifactList();
    },

    update: function() {

    },

    updateArtifactList: function() {
        var m = sharkgame.main;
        var listSel = $('#artifactList');
        $.each(sharkgame.Artifacts, function(artifactKey, artifactData) {
            if(artifactData.level > 0) {
                var maxedOut = artifactData.level >= artifactData.max;
                var item = $('<div>').addClass("artifactDiv");
                var artifactlabel = artifactData.name +
                    "<br><span class='medDesc'>";
                if(maxedOut) {
                    artifactlabel += "(Maximum Power)";
                } else {
                    artifactlabel += "(Power: " + m.beautify(artifactData.level) + ")";
                }
                artifactlabel += "</span><br><em>" + artifactData.flavour + "</em>";

                item.append(artifactlabel);
                listSel.append(item);

                var spritename = "artifacts/" + artifactKey;
                if(sharkgame.settings.current.iconPositions !== "off") {
                    var iconDiv = sharkgame.ui.changeSprite(sharkgame.spriteIconPath, spritename, null, "general/missing-artifact");
                    if(iconDiv) {
                        iconDiv.addClass("button-icon-" + sharkgame.settings.current.iconPositions);
                        iconDiv.addClass("gatewayButton");
                        item.prepend(iconDiv);
                    }
                }
            }
        });
        if($('#artifactList > div').length === 0) {
            listSel.append("<p><em>You have no artifacts to show.</em></p>");
        }
    }
};
