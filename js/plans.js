/*
 * Brahma Kumaris 2014
 */

var plan = {};

plan.namespace = {
    PlanType: {
        MONTH: 0,
        DAY: 1
    }
};

/**
 * Used to create a form on the fly and start a download via Javascript.
 * @param url
 * @param data
 * @param method
 * @param target
 */
jQuery.download = function(url, data, method, target){
    //url and data options required
    if( url && data ){
        //data can be string of parameters or array/object
        data = typeof data == 'string' ? data : jQuery.param(data);
        //split params into form inputs
        var inputs = '';
        jQuery.each(data.split('&'), function(){
            var pair = this.split('=');
            inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
        });
        //send request
        jQuery('<form action="'+ url +'" method="'+ (method||'post') +'" target="' + (target||'_self') + '">'+inputs+'</form>')
            .appendTo('body').submit().remove();
    }
};

/**
 * Contains the year plan functionality.
 */
var yearPlan = (function() {

    var pub = {}; // Prefix for all public functions

    /**
     * The maximum length of the plan.
     * @type Number
     */
    var planLength = 12;

    /**
     * The current plan
     */
    var currentPlan;

    /**
     * The data to be sent to the server.
     * @type Array
     */
    pub.data = [];

    var startMonth;

    var year;

    /**
     * The number of months currently in the plan.
     * @type Number
     */
    var monthCount = 0;

    var dayCount = 0;

    pub.curMonth;

    pub.curDay;

    pub.monthForVirtue;

    var planType = plan.namespace.PlanType.MONTH;

    /** Animation with the dots. */
    var typeAnim;

    var dots = 0;

    /**
     * Resets all the variables for a new yearly plan.
     */
    var initVars = function() {
        var date = new Date();
        startMonth = date.getMonth();
        year = date.getYear() + 1900;
        pub.curMonth = startMonth;
        pub.monthForVirtue = -1;
        pub.data = [];
        monthCount = 0;

        dayCount = 0;
        pub.curDay = date;
    };

    initVars();

    pub.addUnit = function() {
        var $yearPlanRestart = jQuery("#yearPlanRestart");
        if (!$yearPlanRestart.is(":visible")) {
            $yearPlanRestart.fadeIn("slow");
        }
        switch (planType) {
            case plan.namespace.PlanType.MONTH:
                processMonth();
                break;
            case plan.namespace.PlanType.DAY:
                processDay();
                break;
        }

    };

    var processMonth = function () {
        if (monthCount < planLength) {
            monthCount++;
            var month = pub.curMonth++ % 12;
            var presentMonth = (pub.curMonth - 1);
            if (startMonth !== 0 && pub.curMonth % 12 === 1) {
                year++;
            }
            pub.data[presentMonth] = {month: month, monthI18n: months[month], year: year};
            fillPlan(presentMonth, {year: year, month: months[month]});
            triggerClick(presentMonth);
        }
    };

    var triggerClick = function (idPrefix) {
        var $idPrefixImg2 = jQuery("#" + idPrefix + "_img");
        $idPrefixImg2.click(function (e) {
            return pub.processPlay(jQuery(this), e);
        });
        $idPrefixImg2.trigger("click"); // Triggers a click immediately after adding the month.
    };

    var fillPlan = function (idPrefix, dateData)
    {
        jQuery("#yearPlan").append(
            "<div class='col-12 col-sm-6 col-lg-3 mb-3'>\n\
                <div class='card h-100 overflow-hidden'>\n\
                    <div class='card-header py-2'>\n\
                        <h3 class='h6 mb-0' id='" + idPrefix + "_title'>" + (dateData.day ? dateData.day + " " : "") + dateData.month + " <span class='yearPlanYear'>" + dateData.year + "</span></h3>\n\
                    </div>\n\
                    <div class='card-body p-0'>\n\
                        <div class='yearPlanEntry' id='" + idPrefix + "_start'>\n\
                            <div class='yearPlanEntryLink'><a class='yearPlanEntryPause' href='#' id='" + idPrefix + "_img' rel='play' onclick='return yearPlan.startWheel(" + idPrefix + ")'>\n"
            + " " + "</a></div></div>\n\
                    </div>\n\
                </div>\n\
            </div>");
    };

    var displayWaitMessage = function(plansCombo) {
        currentPlan = plansCombo.find('option:selected').text();
        plansCombo.fadeOut("slow", function () {
            if (!jQuery("#planStatus").length) {
                var planDesc = i18n["Running"] + " <b>" + currentPlan + "</b>. " + i18n["Please wait"];
                jQuery("#runningMsg").append("<span id='planStatus'>" + planDesc + "</span>");
            }
        });
    };

    var removePlanStatus = function() {
        var planStatus = jQuery("#planStatus");
        if (planStatus.length) {
            planStatus.fadeOut().remove()
        }
    };

    var showExportControls = function() {
        var yearPlanPdf = jQuery("#yearPlanPdf");
        yearPlanPdf.fadeIn("slow");
        jQuery("#yearPlanMail").fadeIn("slow", function() {
            if(ui.hasMobileWidth()) {
                jQuery('html, body').animate({
                    scrollTop: yearPlanPdf.offset().top
                }, 2000);
                jQuery("#plansFormDiv").css("display", "block");
            }
        });
        jQuery("#spinner").fadeOut();
        removePlanStatus();
    };

    var processDay = function (selectedVirtue) {
        if (dayCount < planLength) {
            dayCount++;
            var millis = pub.curDay.getTime() + (24 * 60 * 60 * 1000);
            pub.curDay = new Date(millis);
            var year = pub.curDay.getYear() + 1900;
            const monthsArray = typeof monthsDeclined == "undefined" ? months : monthsDeclined;
            var curData = {
                month: pub.curDay.getMonth(),
                monthI18n: monthsArray[pub.curDay.getMonth()],
                year: year,
                day: pub.curDay.getDate()
            };
            var idPrefix = "" + year + util.pad(curData.month, 2, '0') + util.pad(curData.day, 2, '0');
            pub.data[idPrefix] = curData;
            fillPlan(idPrefix, {year: curData.year, month: curData.monthI18n, day: curData.day}, selectedVirtue);
            triggerClick(idPrefix);
        }
    };

    /**
     * Prevent the button from being clicked in case the wheel is still rotating.
     * @param {type} object The button which fired the click.
     * @param {type} e The triggered event.
     * @returns {Boolean} false if the wheel is rotating or true if the cancel button
     * was clicked or the wheel is not rotating.
     */
    pub.processPlay = function(object, e) {
        if (object.attr("rel").indexOf("play") > -1 && !stop) {
            e.preventDefault();
            return false;
        }
        return true;
    };

    pub.toggle = function(presentMonth) {
        jQuery("#" + presentMonth + "_start").toggle("slow");
        var presentMonthToggle = jQuery("#" + presentMonth + "_toggle");
        var txt = presentMonthToggle.text();
        presentMonthToggle.text(
            txt === i18n["Show"] ? i18n["Hide"] : i18n["Show"]
        );
        return false;
    };

    pub.startWheel = function(month) {
        pub.monthForVirtue = month;
        jQuery("#" + month + "_start").fadeOut(function() {
            var monthStartA = jQuery("#" + month + "_start a");
            monthStartA.html(" ");
            monthStartA.attr("onclick", "return anim.stopIt()");
            jQuery("#" + month + "_start").fadeIn();
        });
        anim.restartIt();
        return false;
    };

    pub.restart = function() {
        initVars();
        jQuery("#yearPlan").html("");
        var $yearPlanRestart = jQuery("#yearPlanRestart");
        if ($yearPlanRestart.is(":visible")) {
            $yearPlanRestart.fadeOut("slow");
            removePlanStatus();
        }
        jQuery("#yearPlanPdf").fadeOut("slow");
        jQuery("#yearPlanMail").fadeOut("slow");
        jQuery("#spinner").fadeOut("slow");
        jQuery("#virtuescopePredictions").fadeOut("slow");
        jQuery("#plansFormDiv").css("display", "flex");
        anim.stopIt();
    };

    pub.showVirtue = function(month, virtueHtml, selectedVirtue) {
        jQuery("#" + month + "_start").fadeOut("slow", function() {
            var bgColor = backColors[selectedVirtue];
            var fgColor = foregroundColor[selectedVirtue];
            var monthTitle = jQuery("#" + month + "_title");
            monthTitle.closest(".col-12, .col-sm-6, .col-lg-3").addClass(selectedVirtue.toLowerCase());
            var monthStart = jQuery("#" + month + "_start");
            monthStart.html(virtueHtml);
            monthStart.css("background-color", bgColor);
            monthStart.css("color", fgColor);
            monthStart.css("padding", "1rem");
            monthStart.css("min-height", "200px");
            monthStart.css("font-size", "1.1rem");
            monthStart.fadeIn("slow", function() {
                pub.data[month].virtue = selectedVirtue;
                pub.data[month].virtueText = virtueHtml.replace(/<h2.+?>.+?<\/h2>(.+)/gm, "$1");
                pub.data[month].bgColor = bgColor;
                pub.data[month].fgColor = fgColor;
                var countFilled = countFill();
                if (countFilled === planLength) { // We have now a full plan.
                    const temp = [];
                    var j = 0;
                    for (var i in pub.data) {
                        if (pub.data[i] !== null && typeof pub.data[i] !== "function") {
                            temp[j++] = pub.data[i];
                        }
                    }
                    pub.data = temp;
                    showExportControls();
                    jQuery("#startId").prop('disabled', false);
                }
                pub.addUnit(selectedVirtue);
            });
        });
    };

    var countFill = function() {
        var countFilled = 0;
        for (var i in pub.data) {
            if (pub.data[i].virtue && pub.data[i].virtue.length > 0) {
                countFilled++;
            }
        }
        return countFilled;
    };

    pub.downloadPdf = function() {
        var jsonData = JSON.stringify(pub.data);
        jQuery.download('https://liferay.bkwsu.eu/virtuescope2/rest/pdfgen',
            'json=' + encodeURIComponent(jsonData) + "&lang=" + getGlobalLocale()
            + "&plan=" + getPlanName(), 'post', 'pdf');
    };

    var getPlanName = function() {
        return encodeURIComponent(jQuery("#plans-button").text());
    };

    var encodeAndCompress = function(jsonData) {
        return LZString.compressToEncodedURIComponent(jsonData);
    };

    pub.downloadMail = function() {
        var jsonData = JSON.stringify(pub.data);
        var last = countFill() - 1;
        var dialogueVs = jQuery("#dialogueVs");
        var selectedPlan = jQuery("#plans").find("option:selected");
        dialogueVs.dialog({
            autoOpen: false,
            width: ui.hasMobileWidth() ? jQuery(window).width() - 20 : 500,
            modal: true,
            show: {effect: 'fade', duration: 250},
            hide: {effect: 'fade', duration: 250},
            title: i18n["Virtuescope"] + " - " + selectedPlan.text(),
            buttons: [
                {
                    text: i18n["OK"],
                    click: function() {
                        var toEmail = jQuery("#toEmail");
                        toEmail = toEmail.val();
                        if (!toEmail.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i)) {
                            toEmail.css("background-color", "red");
                            toEmail.css("color", "white");
                        }
                        else {
                            jQuery("#mailLabel").html(i18n["Please wait"] + " <span id='dots'></span>");
                            jQuery(".ui-dialog-buttonpane button").button("disable");
                            dots = 0;
                            typeAnim = setInterval(type, 600);
                            var closeDialogue = function() {
                                setTimeout(function() {
                                    jQuery("#dialogueVs").dialog("close");
                                }, 8000);
                            };
                            jQuery.ajax({
                                type: 'GET',
                                jsonpCallback: 'jsonCallback',
                                url: "https://liferay.bkwsu.eu/virtuescope2/rest/pdfgen/emailEncodedJsonp",
                                data: {json: encodeAndCompress(jsonData), lang: getGlobalLocale(), to: toEmail, plan: getPlanName()},
                                success: function(data) {
                                    var reply = data.res;
                                    clearInterval(typeAnim);
                                    if (reply === "OK") {
                                        jQuery("#mailLabel").html(i18n["Email sent successfully !"]);
                                    }
                                    else {
                                        jQuery("#mailLabel").html(
                                            i18n["Email could not be sent (how embarassing !). Please download the PDF."]);
                                    }
                                    closeDialogue();
                                },
                                error: function() {
                                    jQuery("#mailLabel").html(
                                        i18n["Email could not be sent (how embarassing !). Please download the PDF."]);
                                    closeDialogue();
                                },
                                async: true,
                                contentType: "application/json",
                                dataType: 'jsonp'
                            });
                        }
                    }
                },
                {
                    text: i18n["Cancel"],
                    click: function() {
                        jQuery(this).dialog("close");
                    }
                }
            ]
        });
        dialogueVs.html("<form onsubmit='return false'><div id='mailLabel'>" + i18n["Please enter your email"] + "</div>"
        + "<div><input type='text' id='toEmail' name='toEmail' />" + "</div></form>");
        dialogueVs.dialog("open");
        jQuery(".ui-dialog-titlebar-close").hide(); // hide the close button.
    };

    function type()
    {
        if (dots < 30)
        {
            jQuery('#dots').append('.');
            dots++;
        }
        else
        {
            jQuery('#dots').html('');
            dots = 0;
        }
    }

    pub.setWidth = function() {
        setWidth();
        jQuery(window).resize(function() {
            setWidth();
        });
    };

    setWidth = function() {
        var yearPlanControls = jQuery("#yearPlanControls");
    };

    pub.setPlanLength = function(pl) {
        if (pl.match(/^\d+d/)) {
            planType = plan.namespace.PlanType.DAY;
        }
        else {
            planType = plan.namespace.PlanType.MONTH;
        }
        planLength = parseInt(pl);
    };

    //Return just the public parts
    return pub;
}());




