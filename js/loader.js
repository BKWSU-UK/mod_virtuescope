/**
 * Contains the functions and commands used to dynamically load the Virtuescope.
 */
var bk = {};

bk.loader = {
    loadFile: function (filename) {
        if (filename.match(/.+\.js/i)) {
            this.loadJsCssfile(filename, "js");
        }
        else if (filename.match(/.+\.css/i)) {
            this.loadJsCssfile(filename, "css");
        }
    },
    loadJsCssfile: function (filename, filetype) {
        var fileref;
        if (filetype === "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype === "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref !== "undefined") {
            var length = document.getElementsByTagName("head").length;
            document.getElementsByTagName("head")[length - 1].appendChild(fileref);
        }
    },
    // Poll for jQuery to come into existance
    checkReadyJQuery: function (callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function () {
                bk.loader.checkReadyJQuery(callback);
            }, 100);
        }
    },
    // Poll for jQuery to come into existance
    checkReadyOther: function (other, callback) {
        if (window[other]) {
            callback();
        }
        else {
            window.setTimeout(function () {
                bk.loader.checkReadyOther(other, callback);
            }, 300);
        }
    },
    // Poll for jQuery to come into existence
    checkReadyJqueryDialog: function (callback) {
        var dialogVs = jQuery("#dialogueVs");
        if (dialogVs && dialogVs.dialog) {
            callback();
        }
        else {
            //bk.loader.loadFile(global.urls.domain + global.urls.context + "/media/mod_virtuescope/js/jquery-ui.min.js");
            //bk.loader.loadFile(global.urls.domain + global.urls.context + "/media/mod_virtuescope/css/jquery-ui.structure.css");
            //bk.loader.loadFile(global.urls.domain + global.urls.context + "/media/mod_virtuescope/css/jquery-ui.theme.css");
            window.setTimeout(function () {
                bk.loader.checkReadyJqueryDialog(callback);
            }, 500);
        }
    },
    virtuescope: {
        loadHtml: function (jQuery, callback, targetElement) {
            if(!targetElement) {
                targetElement = "body";
            }
            jQuery.ajax(global.urls.domain + global.urls.context + "/media/mod_virtuescope/js/vs-template.tpl")
                .done(function(data) {
                    jQuery(targetElement).html(Handlebars.compile(data)({}));
                    callback();
            });
        }
    },

    loadCssJs: function () {
        var serverAndContext = global.urls.domain + global.urls.context;
        if(!global.css.preventLoad) {
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/css/main.css");
        }
        bk.loader.processExclusion("jquery", function() {
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery.min-1.11.1.js");
        });
        bk.loader.checkReadyJQuery(function(jQuery) {
            bk.loader.processExclusion("jquery-ui", function() {
//                bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery-ui-1.11.1.flick/jquery-ui.min.js");
            });
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery-dataTables-1.10.1/css/jquery.dataTables.css");
//            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery-ui-1.11.1.flick/jquery-ui.min.css");
//            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery-ui-1.11.1.flick/jquery-ui.structure.css");
//            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery-ui-1.11.1.flick/jquery-ui.theme.css");
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/lib/handlebars-v4.0.5.js");
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/compression/lz-string-1.4.4.js");
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/util.js");
        });
    },

    processExclusion: function(lib, callback) {
        var arr = global.libs.exclude;
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === lib) {
                return;
            }
        }
        callback();
    }
};

bk.loader.loadCssJs();

// Start polling...
bk.loader.checkReadyOther("Handlebars", function () {
    bk.loader.virtuescope.loadHtml(jQuery, function() {
        var serverAndContext = global.urls.domain + global.urls.context;
        bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/lib/jquery.json.min.js");
        bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/jquery-dataTables-1.10.1/js/jquery.dataTables-1.10.1.js");
        bk.loader.checkReadyOther("util", function () {
            var targetScript = util.readParam("lang");
            var defaultLang = "en_UK";
            targetScript = targetScript === "" ? defaultLang : targetScript;
            if (targetScript === defaultLang) {
                // check the global parameters
                targetScript = global.language ? global.language : defaultLang;
            }
            var serverAndContext = global.urls.domain + global.urls.context;
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/" + targetScript + ".js");
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/plans.js");
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/hist.js");
            bk.loader.loadFile(serverAndContext + "/media/mod_virtuescope/js/anim.js");
            var initCallback = function () {
//                bk.loader.loadFile(global.urls.domain + global.urls.context + "/media/mod_virtuescope/js/cookie_loader.js");
                bk.loader.loadFile(global.urls.domain + global.urls.context + "/media/mod_virtuescope/js/init.js");
            };
            var animCallback = function () {
                bk.loader.checkReadyOther("anim", initCallback)
            };
            bk.loader.checkReadyJqueryDialog(animCallback);
        });
    }, global.targetElement);

});
