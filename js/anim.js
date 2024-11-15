var virtueTargetEnum = {
    PREDICTION: 1,
    SPIN: 2
};
var rotationCheck = (function () {

    return {
        toDegrees: function (angle) {
            return angle * (180 / Math.PI);
        },
        angle: function(cos, sin) {
            return this.toDegrees(Math.atan(cos / sin));
        },
        toRadians: function(angle) {
            return angle * (Math.PI / 180);
        },
        getAbsoluteRotation: function() {
            return [this.angle(context.getMatrix()[1][0], context.getMatrix()[1][1]),
                this.angle(context.getMatrix()[0][1], context.getMatrix()[0][0])];
        }
    }
}());


var anim = (function () {

    var TO_RADIANS = Math.PI / 180;

    var pub = {};

    pub.virtueTarget = virtueTargetEnum.SPIN;

    pub.drawTriangle = function (ctx) {
        ctx.fillStyle = '#f00';
        ctx.rotate(-40 * TO_RADIANS);
        ctx.translate(-30, 27);
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(75, 30);
        ctx.lineTo(75, 10);
        ctx.fill();
    };

    pub.initRotate = function () {
        return Math.floor((Math.random() * 5) + 1) + 2;
    };

    pub.rotate = function (context) {
        context.rotate(rotation);
        context.drawImage(imageObj, rectWidth / -2, rectHeight / -2, rectWidth, rectHeight);
    };


    pub.drawRotate = function (context) {
        // translate context to center of canvas
        var mode = parseInt(document.getElementById('behaviour').value);
        if (mode === 1) {
            rotation = Math.PI / rotate++;
        }
        else if (mode === 2) {
            rotation = rotate * TO_RADIANS;
        }
        else if (mode === 3) {
            rotation = rotate++ * TO_RADIANS;
        }
        degrees += (rotation * (180 / Math.PI));
        degrees = degrees % 360;
        this.rotate(context);
    };

    pub.rotateExternal = function(x) {

        rotate = rotate + x;
        var dir = x < 0 ? 1 : -1;
        rotation = dir * Math.PI / (rotate + 720) + dir * 0.01;
        this.rotate(context);
    };

    pub.animate = function (canvas, context, startTime) {

        // clear
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        anim.drawRotate(context);
        var mode = document.getElementById('behaviour').value;
        if (modeChanged) {
            anim.stopIt(true);
            return;
        }
        if ((mode == 1 || mode == 3) && (stop || (rotation < stopThreshhold))) {
            anim.stopIt(true);
            return;
        }
        else if (mode == 2 && stop) {
            if (rotation < stopThreshhold) {
                anim.stopIt(true);
                return;
            }
            rotate -= 0.1;
        }
        // request new frame
        requestAnimFrame(function () {
            anim.animate(canvas, context, startTime);
        });
    };

    pub.stopIt = function (displayCard) {
        stop = true;

        function displayVirtue() {
            var selectedVirtue = extractSelectedVirtue();
            var $content = jQuery("#virtuescopeContent");
            $content.css("background-color", "white");
            if (ui.hasMobileWidth()) { // mobile version
                jQuery("#canvasContainer").fadeOut(function() {
                    jQuery("#virtuescopeContainer").prepend(jQuery("#textDisplay").detach());
                    $content.fadeIn();
                });
            }
            else {
                $content.fadeIn();
            }

            if (!useImgs) {
                $content.css("background-color", backColors[selectedVirtue]);
                $content.css("color", foregroundColor[selectedVirtue]);
                contentDiv.innerHTML = virtueText != null ? virtueText : i18n["Work in progress"];
            }
        }

        function extractSelectedVirtue() {
            return virtueMap[(360 - (Math.floor(rotationCheck.toDegrees(context.getRotation()))) + 315) % 360];
        }

        function displayPrediction() {
            if (!useImgs) {
                contentDiv.innerHTML = virtueText != null ? virtueText : i18n["Work in progress"];
            }
            else {
                var imgPath = location.href.replace(/(.+\/).*/, "$1").replace(/#/, "");
                contentDiv.innerHTML = virtueImages[selectedVirtue] ?
                "<img src='" + imgPath + "../images/" + virtueImages[selectedVirtue] + "'></img><p>" + util.ellipsis(virtueTexts[selectedVirtue], 90) + "</p>" :
                '<div class="card-header">Virtue</div><div class="card-body"><h2 class="virtue card-title">' + selectedVirtue + '</h2><p class="card-text">' + virtueTexts[selectedVirtue] + '</p></div>';
            }
            yearPlan.showVirtue(yearPlan.monthForVirtue, contentDiv.innerHTML, selectedVirtue);
        }

        if (displayCard) {
            var selectedVirtue = extractSelectedVirtue();
            var speed = 1000;
            var virtueText = '<div class="card-header">Virtue</div><div class="card-body"><h2 class="virtue card-title">' + selectedVirtue + '</h2><p class="card-text">' + virtueTexts[selectedVirtue] + '</p></div>';

            //jQuery("#introText").html("");

            hist.saveHistory(virtueText);
            jQuery("#startIt").fadeOut(function () {
                jQuery(this).prop('disabled', false).text(i18n["Play again"]).fadeIn();
            });
            var contentDiv = document.getElementById("virtuescopeContent");
            if (yearPlan.monthForVirtue > -1 && anim.virtueTarget === virtueTargetEnum.PREDICTION) {
                displayPrediction();
            }
            else if (anim.virtueTarget === virtueTargetEnum.SPIN) {
                displayVirtue();
            }
        }
        return false;
    };

    pub.restartIt = function () {
        stop = false;
        modeChanged = false;
        jQuery("#virtuescopeContent").fadeOut(function () {
            jQuery("#canvasContainer").show();
            jQuery("#startIt").prop('disabled', true);
            //jQuery("#startIt").hide();
            // request new frame
            requestAnimFrame(function () {
                var startTime = (new Date()).getTime();
                rotate = anim.initRotate();
                anim.animate(canvas, context, startTime);
            });
        });

        return false;
    };

    return pub;
}());