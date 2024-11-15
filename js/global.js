/*
 Brahma Kumaris 2016
 */
var global = {
    urls: {
        domain: location.href.indexOf("localhost") > -1 ? "http://localhost:" + location.port :
            location.href.replace(/(http(?:s)?:\/\/[^\/]+)\/.+/, "$1"),
        context: "/",
        extraContext: location.href.replace(/.+?:(\d+)\/.+/, "$1") > 6000 ? "/HTML5Application" : ""
    },
    layout: {
        hideControls: false
    },
    language: "en_UK",
    css: {
        preventLoad: true
    },
    libs: {
        exclude: [] // jquery, jquery-ui
    },
    isLocal: function () {
        return location.href.indexOf("localhost") > -1;
    },
    extractPort: function () {
        return location.href.replace(/.+?:(\d+)\/.+/, "$1");
    },

    findWheelImagePath: function () {
        if (!global.isLocal()) {
            return global.urls.domain + global.urls.context + "/media/mod_virtuescope/images/wheels/";
        }
        else {
            var port = global.extractPort();
            if (port > 60000) {
                return "http://localhost:" + port + "/virtuescope.server/HTML5Application/public_html/images/wheels";
            }
            else {
                return "http://localhost:" + port + global.urls.context + "/media/mod_virtuescope/images/wheels/";
            }
        }
    },
    findSpinnerImage: function () {
        var actualImage = "loading.gif";
        if (!global.isLocal()) {
            return global.urls.domain + global.urls.context + "/media/mod_virtuescope/images/icons/" + actualImage;
        }
        else {
            var port = global.extractPort();
            if (port > 60000) {
                return "http://localhost:" + port + "/virtuescope.server/HTML5Application/public_html/images/icons/" + actualImage;
            }
            else {
                return "http://localhost:" + port + global.urls.context + "/media/mod_virtuescope/images/icons/" + actualImage;
            }
        }
    },
    targetElement: "#vs-container"
};