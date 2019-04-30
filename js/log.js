sharkgame.log = {

    initialised: false,
    messages: [],

    init: function() {
        var l = sharkgame.log;
        // create log
        $('#log').append("<button id='clearlog' class='min'></button><h3>log<h3/><ul id='messageList'></ul>");
        // add clear button
        sharkgame.ui.replaceButton("clearlog", "&nbsp x &nbsp", l.clearMessages);
        l.initialised = true;
    },

    addMessage: function(message) {
        var l = sharkgame.log;
        var s = sharkgame.settings.current;
        var showAnims = s.showAnimations;

        if(!l.initialised) {
            l.init();
        }
        var messageList = $('#messageList');

        var messageItem = $('<li>').html(message);
        if(showAnims) {
            messageItem.hide()
                .css("opacity", 0)
                .prependTo('#messageList')
                .slideDown(50)
                .animate({opacity: 1.0}, 100);
        } else {
            messageItem.prependTo('#messageList');
        }
        l.messages.push(messageItem);

        sharkgame.log.correctlogLength();

        return messageItem;
    },

    addError: function(message) {
        var l = sharkgame.log;
        var messageItem = l.addMessage("Error: " + message);
        messageItem.addClass("error");
        return messageItem;
    },

    addDiscovery: function(message) {
        var l = sharkgame.log;
        var messageItem = l.addMessage(message);
        messageItem.addClass("discovery");
        return messageItem;
    },

    correctlogLength: function() {
        var l = sharkgame.log;
        var showAnims = sharkgame.settings.current.showAnimations;
        var logMax = sharkgame.settings.current.logMessageMax;

        if(l.messages.length >= logMax) {
            while(l.messages.length > logMax) {
                // remove oldest message
                if(showAnims) {
                    l.messages[0].animate({opacity: 0.0}, 100, "swing", function() {
                        $(this).remove();
                    });
                } else {
                    l.messages[0].remove();
                }

                // shift array (remove first item)
                l.messages.shift();
            }
        }
    },

    clearMessages: function() {
        var l = sharkgame.log;
        // remove each element from page
        $.each(l.messages, function(_, v) {
            v.remove();
        });
        // wipe array
        l.messages = [];
    },

    haveAnyMessages: function() {
        return sharkgame.log.messages.length > 0;
    }
};
