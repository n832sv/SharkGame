sharkgame.utilui = {

    beautify: function(number, suppressDecimals) {

        var formatted;

        if(number === Number.POSITIVE_INFINITY) {
            formatted = "infinite";
        } else if(number < 1 && number >= 0) {
            if(suppressDecimals) {
                formatted = "0";
            } else {
                if(number > 0.001) {
                    formatted = number.toFixed(2) + "";
                } else {
                    if(number > 0.0001) {
                        formatted = number.toFixed(3) + "";
                    } else {
                        formatted = 0;
                    }
                }
            }
        } else {
            var negative = false;
            if(number < 0) {
                negative = true;
                number *= -1;
            }
            var suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
            var digits = Math.floor(sharkgame.log10(number));
            var precision = 2 - (Math.floor(sharkgame.log10(number)) % 3);
            // in case the highest supported suffix is not specified
            precision = Math.max(0, precision);
            var suffixIndex = Math.floor(digits / 3);


            var suffix;
            if(suffixIndex >= suffixes.length) {
                formatted = "lots";
            } else {
                suffix = suffixes[suffixIndex];
                // fix number to be compliant with suffix
                if(suffixIndex > 0) {
                    number /= Math.pow(1000, suffixIndex);
                }
                if(suffixIndex === 0) {
                    formatted = (negative ? "-" : "") + Math.floor(number) + suffix;
                } else if(suffixIndex > 0) {
                    formatted = (negative ? "-" : "") + number.toFixed(precision) + suffix;
                } else {
                    formatted = (negative ? "-" : "") + number.toFixed(precision);
                }
            }
        }
        return formatted;
    },
    
    formatTime: function(milliseconds) {
        var numSeconds = milliseconds / 1000;
        var formatted = "";
        if(numSeconds > 60) {
            var numMinutes = Math.floor(numSeconds / 60);
            if(numMinutes > 60) {
                var numHours = Math.floor(numSeconds / 3600);
                if(numHours > 24) {
                    var numDays = Math.floor(numHours / 24);
                    if(numDays > 7) {
                        var numWeeks = Math.floor(numDays / 7);
                        if(numWeeks > 4) {
                            var numMonths = Math.floor(numWeeks / 4);
                            if(numMonths > 12) {
                                var numYears = Math.floor(numMonths / 12);
                                formatted += numYears + "Y, ";
                            }
                            numMonths %= 12;
                            formatted += numMonths + "M, ";
                        }
                        numWeeks %= 4;
                        formatted += numWeeks + "W, ";
                    }
                    numDays %= 7;
                    formatted += numDays + "D, ";
                }
                numHours %= 24;
                formatted += numHours + ":";
            }
            numMinutes %= 60;
            formatted += (numMinutes < 10 ? ("0" + numMinutes) : numMinutes) + ":";
        }
        numSeconds %= 60;
        numSeconds = Math.floor(numSeconds);
        formatted += (numSeconds < 10 ? ("0" + numSeconds) : numSeconds);
        return formatted;
    },
    
    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    
    colorLum: function(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if(hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for(i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    },

};
