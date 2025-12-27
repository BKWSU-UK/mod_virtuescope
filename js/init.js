/*
 Brahma Kumaris 2016
 */

var rotate = anim.initRotate();
var canvas = document.getElementById('myCanvas');
var canvasTriangle = document.getElementById('triangle');
var context = new CanvasWrapper(canvas.getContext('2d'));
var contextTriangle = canvasTriangle.getContext('2d');
var imageObj = new Image();
var rectWidth = canvas.width;
var rectHeight = canvas.height;
var stopThreshhold = 0.019;
var rotation = 1000;
var stop = true;
var degrees = 0;
var modeChanged = false;

var showImagesCookie;
var useImgs;
var showPlus;
var origShowImgText;
var origShowImgTitle;

loadExtra.loadJqueryCookie();

showImagesCookie = jQuery.cookie("showImages") === "true";
useImgs = util.readParam("useImgs") === "true" || showImagesCookie;
if (useImgs) {
    jQuery("#virtuescopeContent").css("top", "40px");
}

showPlus = util.readParam("showPlus") === "true";
if (!showPlus) {
    jQuery("#showAdvanced").hide();
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var $showImages2 = jQuery("#showImages");
origShowImgText = showImagesCookie ? i18n["Hide Images"] : $showImages2.text();
if (showImagesCookie) {
    $showImages2.text(i18n["Hide Images"]);
}
origShowImgTitle = $showImages2.attr("title");
$showImages2.click(
    function () {
        var $showImages = jQuery("#showImages");
        if (jQuery.cookie("showImages") !== "true") {
            jQuery.cookie("showImages", "true");
            $showImages.text(i18n["Hide Images"]);
            $showImages.attr("title", origShowImgTitle);
            useImgs = true;
        }
        else {
            jQuery.cookie("showImages", "false");
            $showImages.text(i18n["Show Images"]);
            $showImages.attr("title", i18n["Cards with text will be displayed."]);
            useImgs = false;
        }
        return false;
    });

context.translate(canvas.width / 2, canvas.height / 2);

var ui = (function () {
    var pub = {};

    pub.mobileWidth = 900;

    var originalCanvasSize;

    pub.resizeRatio = 1.0;

    pub.hasMobileWidth = function () {
        return jQuery(window).width() <= pub.mobileWidth;
        //return true;
    };

    var doPosition = function () {
        var $myCanvas = jQuery("#myCanvas");
        var pos = $myCanvas.position();
        var width = $myCanvas.outerWidth();
        var height = $myCanvas.outerHeight();
        positionTriangle2(pos, width, height);
    };

    pub.positionElements = function () {
        if (global.layout.hideControls) {
            jQuery("#yearPlanControls").hide(1000, doPosition);
        }
        else {
            doPosition();
        }
        window.setTimeout(doPosition, 1500);
    };

    var positionTriangle = function (pos, width, height) {
        var isMobile = ui.hasMobileWidth();
        var diffWidth = isMobile ? 120 : 159;
        var posX = pos.left + width - diffWidth;
        var posY = pos.top + height / 5 - (isMobile ? 30 : 22);
        positionAbsolutetly("#triangle", posX, posY);
    };

    var positionAbsolutetly = function (elem, posX, posY) {
        jQuery(elem).css({
            position: "absolute",
            top: posY + "px",
            left: posX + "px"
        });
    };

    var positionTriangle2 = function () {
        var wheelCanvas = jQuery("#myCanvas");
        var canvasHeight = wheelCanvas.height();
        var wheelCenterHeight = wheelCanvas.position().top + canvasHeight / 2;
        var canvasWidth = wheelCanvas.width();
        var wheelCenterWidth = wheelCanvas.position().left + canvasWidth / 2;
        var triangleCanvas = jQuery("#triangle");
        var distXFromCanvasCentre = wheelCenterWidth + (canvasWidth / 2 - canvasWidth * 10 / 100) * Math.cos(rotationCheck.toRadians(47))
            - 34;
        var distYFromCanvasCentre = wheelCenterHeight - (canvasHeight / 2 - canvasWidth * 10 / 100) * Math.sin(rotationCheck.toRadians(47))
            - (triangleCanvas.height() * 60 / 100) + 12;
        positionAbsolutetly("#triangle", distXFromCanvasCentre, distYFromCanvasCentre);
    };

    var responsiveCanvasListener = function () {

        function adjustCanvasContent(width) {
            context.translate(width / 2, width / 2);
            context.resetRotation();
            imageObj.onload();
        }

        function resizeCanvas() {
            //if(ui.hasMobileWidth()) {
            var c = jQuery('#myCanvas');
            var container = jQuery(c).parent();
            if (!originalCanvasSize) {
                originalCanvasSize = c.attr("width")
            }
            var width = jQuery(container).width();
            ui.resizeRatio = width / parseFloat(originalCanvasSize);
            //alert(width);

            c.css("width", width);
            c.css("height", width);
            c.attr('width', width); //max width
            c.attr('height', width); //max height

            rectWidth = width;
            rectHeight = width;
            adjustCanvasContent(width);

            //}
        }

        //Initial call
        resizeCanvas();

        //Run function when browser resizes
        jQuery(window).resize(resizeCanvas);
    };

    pub.startListeners = function () {
        jQuery("#recWidth").val(rectWidth);
        jQuery("#recHeight").val(rectHeight);
        jQuery("#behaviour").change(function () {
            modeChanged = true;
            anim.stopIt(false);
        });

        jQuery("#showAdvanced").click(function () {
            jQuery("#advanced").toggle("slow", function () {
                var $showAdvanced = jQuery("#showAdvanced");
                var expanderText = $showAdvanced.html() === '+' ? '-' : '+';
                $showAdvanced.html(expanderText);
            });
        });

        jQuery("#yearPlanRestart").text(i18n["Restart"]);
        jQuery("#yearPlanStarter").text(i18n["Virtuescope Predictions"]);
        jQuery("#yearPlanPdf").text(i18n["Download PDF"]);
        var $yearPlanMail = jQuery("#yearPlanMail");
        $yearPlanMail.text(i18n["Send Email"]);
        var startButton = jQuery("#startIt");
        startButton.text(i18n["Play"]);
        jQuery("#stopIt").html(i18n["Pause"]);
        jQuery("#introText").html(i18n["introText"]);

        function fillPlans() {
            var plansCombo = jQuery('#plans');
            plansCombo.append(jQuery("<option></option>")
                .attr("value", "Virtuescope Predictions")
                .text(i18n["Virtuescope Predictions"]));
            jQuery.each(plans, function (key, value) { // Fills the combo with the year plans
                plansCombo.append(jQuery("<option></option>")
                    .attr("value", plansLength[key])
                    .text(value));
            });
            return plansCombo;
        }

        fillPlans().change(function () {
            if(jQuery('#plans')[0].selectedIndex > 0) {
                anim.stopIt();
                yearPlan.restart();
                jQuery("#startIt").hide();
                setTimeout(function () {

                    anim.virtueTarget = virtueTargetEnum.PREDICTION;
                    jQuery("#spinner").show();
                    const virtuescopePredictions = jQuery("#virtuescopePredictions");
                    virtuescopePredictions.html(i18n["Virtuescope Predictions"]);
                    virtuescopePredictions.fadeIn();
                    yearPlan.setPlanLength(jQuery('#plans').val());
                    yearPlan.addUnit();
                }, 1000);
            }
        });
        yearPlan.setWidth();

        $yearPlanMail.click(function (event) {
            event.preventDefault();  // Move this up to ensure it always happens
            if ($yearPlanMail.length) {  // Check if element exists
                yearPlan.downloadMail();
            } else {
                console.error('Email button not found in DOM');
            }
        });

        loadOnChangePosListener();

        jQuery("#myCanvas").onPositionChanged(doPosition);

        pub.attachStartListener(startButton);

        responsiveCanvasListener();
    };

    var firstStart = true;

    pub.attachStartListener = function (startButton) {
        startButton.button().click(function (e) {
            e.preventDefault();
            if (jQuery(this).text() === i18n["Play"] || jQuery(this).text() === i18n["Play again"]) {
                anim.restartIt();
            }
            else {
                anim.stopIt();
            }
//            if (firstStart && jQuery(window).width() > pub.mobileWidth) {
//                //jQuery(this).detach().insertBefore("#plans-button");//.css("margin-top", "-30px");
//            	//jQuery(this).hide();
//            }
            anim.virtueTarget = virtueTargetEnum.SPIN;
            firstStart = false;
        });
    };

    var loadOnChangePosListener = function () {
        jQuery.fn.onPositionChanged = function (trigger, millis) {
            if (millis == null)
                millis = 100;
            var o = jQuery(this[0]); // our jquery object
            if (o.length < 1)
                return o;

            var lastPos = null;
            var lastOff = null;
            setInterval(function () {
                if (o == null || o.length < 1)
                    return o; // abort if element is non existend any more
                if (lastPos == null)
                    lastPos = o.position();
                if (lastOff == null)
                    lastOff = o.offset();
                var newPos = o.position();
                var newOff = o.offset();
                if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
                    jQuery(this).trigger('onPositionChanged', {lastPos: lastPos, newPos: newPos});
                    if (typeof (trigger) == "function")
                        trigger(lastPos, newPos);
                    lastPos = o.position();
                }
                if (lastOff.top != newOff.top || lastOff.left != newOff.left) {
                    jQuery(this).trigger('onOffsetChanged', {lastOff: lastOff, newOff: newOff});
                    if (typeof (trigger) == "function")
                        trigger(lastOff, newOff);
                    lastOff = o.offset();
                }
            }, millis);

            return o;
        };
    };

    pub.changeBackground = function () {
        if (typeof params != "undefined" && params.backgroundColor) {
            jQuery(global.targetElement).css("background-color", params.backgroundColor);
        }
    };

    pub.setMaxWidth = function () {
        var $yearPlan = jQuery("#yearPlan");
        var maxWidth = $yearPlan.width();
        $yearPlan.css("max-width", maxWidth + "px");
    };

    pub.changeButtons = function () {
    };

    pub.changeSpinner = function () {
        var spinnerImg = global.findSpinnerImage();
        jQuery("#spinner").attr("src", spinnerImg);
    };


    pub.captureMouseMoveOnCanvas = function () {

        var prevY = -1;

        jQuery("#myCanvas").mousedown(function () {
            jQuery(this).mousemove(function () {
                var rotateY = event.pageY;
                if (prevY != -1) {
                    rotateY = (prevY - rotateY);
                }
                anim.rotateExternal(rotateY);
                prevY = event.pageY;
            });
        }).mouseup(function () {
            jQuery(this).unbind('mousemove');
        }).mouseout(function () {
            jQuery(this).unbind('mousemove');
        });
    };

    return pub;
}());

var findImage = function() {
    return global.findWheelImagePath() + "/" + getGlobalLocale() + ".png";
};

imageObj.onload = function () {
    context.drawImage(imageObj, rectWidth / -2, rectHeight / -2, rectWidth, rectHeight);
};

imageObj.src = findImage();

anim.drawTriangle(contextTriangle);

ui.positionElements();

ui.startListeners();

ui.changeBackground();

ui.setMaxWidth();

ui.changeButtons();

ui.changeSpinner();

ui.captureMouseMoveOnCanvas();