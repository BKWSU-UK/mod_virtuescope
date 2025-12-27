/* 
 * Brahma Kumaris 2014
 */

/**
 * History related functions.
 */
var hist = {
    _getHistory: function() {
        var history = localStorage.getItem("virtueHistory");
        if (history === null || history === "") {
            // Check for legacy cookie
            history = jQuery.cookie("virtueHistory");
            if (history !== null && history !== "") {
                // Migrate to localStorage
                try {
                    localStorage.setItem("virtueHistory", history);
                    // Clear cookie
                    jQuery.cookie("virtueHistory", "", { expires: -1, path: '/' });
                    jQuery.cookie("virtueHistory", "", { expires: -1 });
                } catch (e) {
                    console.error("Migration failed", e);
                }
            }
        }
        return history;
    },
    saveHistory: function(virtueText) {
        var history = this._getHistory();
        var now = new Date();
        var dateStr = (now.getYear() + 1900) + "-" + util.pad((now.getMonth() + 1), 2, '0') + "-" + util.pad(now.getDate(), 2, '0') + " " + util.pad(now.getHours(), 2, '0')
                    + ":" + util.pad(now.getMinutes(), 2, '0');
        var entry = dateStr + "::" + virtueText + "\n";

        if (history !== null && history !== "") {
            history += entry;
        }
        else {
            history = entry;
        }

        // Limit history to 100 entries to keep things tidy
        var lines = history.trim().split("\n");
        if (lines.length > 100) {
            lines = lines.slice(lines.length - 100);
            history = lines.join("\n") + "\n";
        }

        try {
            localStorage.setItem("virtueHistory", history);
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
        return false;
    },
    renderHistory: function() {
        var history = this._getHistory();
        var $showHist = jQuery("#showHist");
        if ($showHist.html().indexOf(i18n["Hide"]) > -1) {
            jQuery("#history").html("");
            $showHist.html(i18n["Show history"]);
        }
        else if (history) {
            var lines = history.trim().split("\n");
            var historyArray = [];
            for (var i = 0, length = lines.length; i < length; i++) {
                var elems = lines[i].split("::");
                if (typeof (elems[1]) != "undefined") {
                    historyArray[historyArray.length] = [elems[0], elems[1]];
                }
            }
            jQuery("#history").html("<table id='histTable' class='display' cellspacing='0' width='100%'></table>");
            jQuery('#histTable').dataTable({
                "data": historyArray,
                "columns": [
                    {"title": i18n["Date"]},
                    {"title": i18n["Virtue"]}
                ],
                "order": [[ 0, "desc" ]] // Sort by date descending by default
            });
            $showHist.html(i18n["Hide history"]);
        }
        else {
            jQuery("#history").html(i18n["No history yet"]);
        }
        return false;
    },
    deleteHistory: function() {
        localStorage.removeItem("virtueHistory");
        jQuery.cookie("virtueHistory", "", { expires: -1, path: '/' });
        jQuery.cookie("virtueHistory", "", { expires: -1 });
        jQuery("#history").html("");
        return false;
    }
};


