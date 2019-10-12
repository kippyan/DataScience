"use strict";
eesy.define([
    'jquery-private', 'utils', 'mustachejs',
    'presentation-helper', 'helpitem-visibility', 'eesy-timers'
], function ($, utils, Mustache, presentationHelper, helpitemVisibility, eesyTimers) {
    return {
        show: show
    };
    function show(helpItem, connectTo) {
        $("body").after(Mustache.to_html(templates.hintfixed, presentationHelper.helpItemModel(helpItem), templates));
        __showHintProactive(helpItem, connectTo);
    }
    function __showHintProactive(helpItem, connectTo) {
        if (!helpitemVisibility.isVisible(helpItem.id)) {
            $('#systraycontainer_' + helpItem.id).fadeOut('fast').remove();
            $(connectTo).removeClass('eesy-highlighted');
            $('#arrow_' + helpItem.id).remove();
            $(document).trigger("helpitemHandle.hide", [helpItem.id]);
            return;
        }
        $(connectTo).addClass('eesy-highlighted');
        var positions = calcHintPositioning(connectTo, parseInt(helpItem.width), parseInt(helpItem.height));
        // check if space to show the hint
        if (positions.arrowpos == "") {
            $('#arrow_' + helpItem.id).css({ 'display': 'none' });
            $('#systraycontainer_' + helpItem.id).css({ 'display': 'none' });
        }
        else {
            $('#systraycontainer_' + helpItem.id).css({
                'position': 'absolute',
                'height': helpItem.height + 'px',
                'width': helpItem.width + 'px',
                'top': positions.ypos,
                'left': positions.xpos
            });
            $('#arrowInner_' + helpItem.id)
                .removeClass('eesyarrow up down left right')
                .addClass('eesyarrow ' + positions.arrowpos);
            $('#arrow_' + helpItem.id).css({
                'position': 'fixed',
                'height': '10px',
                'width': '10px',
                'top': positions.arrowpostop,
                'left': positions.arrowposleft,
                'z-index': 100002
            });
            if (utils.isTargetVisible(positions.target, connectTo)) {
                $('#arrow_' + helpItem.id).show();
                $('#systraycontainer_' + helpItem.id).show();
            }
            else {
                $('#arrow_' + helpItem.id).hide();
                $('#systraycontainer_' + helpItem.id).hide();
            }
        }
        eesyTimers.set("helpitem" + helpItem.id, 250, function () {
            __showHintProactive(helpItem, connectTo);
        });
    }
    function calcHintPositioning(connectTo, hintWidth, hintHeight) {
        var arrowpos = "";
        var target = {
            left: $(connectTo).offset().left,
            top: $(connectTo).offset().top,
            width: $(connectTo).width(),
            height: $(connectTo).height()
        };
        var tt = {
            width: hintWidth,
            height: hintHeight
        };
        var ttCentered = {
            left: target.left + (target.width - tt.width) / 2,
            top: target.top + (target.height - tt.height) / 2
        };
        var space = {
            below: (target.top + target.height + tt.height + 10) < $(window).scrollTop() + $(window).height(),
            above: (target.top - tt.height - 10) > $(window).scrollTop(),
            right: (target.left + target.width + tt.width + 10) < $(window).scrollLeft() + $(window).width(),
            left: (target.left - tt.width - 10) > $(window).scrollLeft()
        };
        var canCenter = {
            x: (ttCentered.left >= 0)
                && ((ttCentered.left + tt.width) < $("body").width())
                && (space.below || space.above),
            y: (ttCentered.top >= 0)
                && ((ttCentered.top + tt.height) < $("body").height())
                && (space.left || space.right)
        };
        var xpos = 0;
        var ypos = 0;
        if (canCenter.x) {
            xpos = ttCentered.left;
            if (space.below) {
                arrowpos = "up";
                ypos = target.top + target.height + 10;
            }
            else {
                arrowpos = "down";
                ypos = target.top - tt.height - 11;
            }
        }
        else if (canCenter.y) {
            ypos = ttCentered.top;
            if (space.right) {
                arrowpos = "right";
                xpos = target.left + target.width + 10;
            }
            else {
                arrowpos = "left";
                xpos = target.left - tt.width - 12;
            }
        }
        else {
            if (space.below && space.right) {
                arrowpos = "up";
                xpos = target.left < 0 ? 0 : target.left;
                ypos = target.top + target.height + 10;
            }
            else if (space.below && space.left) {
                arrowpos = "up";
                xpos = (target.left + target.width > $("body").width() ? $("body").width()
                    : target.left + target.width) - tt.width;
                ypos = target.top + target.height + 10;
            }
            else if (space.above && space.right) {
                arrowpos = "down";
                xpos = target.left < 0 ? 0 : target.left;
                ypos = target.top - tt.height - 11;
            }
            else if (space.above && space.left) {
                arrowpos = "down";
                xpos = (target.left + target.width > $("body").width() ? $("body").width()
                    : target.left + target.width) - tt.width;
                ypos = target.top - tt.height - 11;
            }
        }
        // check if space to show the hint
        var arrowposleft = 0;
        var arrowpostop = 0;
        if (arrowpos == "right") {
            arrowposleft = target.left + target.width + 1;
            arrowpostop = target.top + target.height / 2;
        }
        else if (arrowpos == "left") {
            arrowposleft = target.left - 11;
            arrowpostop = target.top + target.height / 2;
        }
        else if (arrowpos == "up") {
            arrowposleft = target.left + target.width / 2 - 10;
            arrowpostop = target.top + target.height;
        }
        else if (arrowpos == "down") {
            arrowposleft = target.left + target.width / 2 - 10;
            arrowpostop = target.top;
        }
        if (arrowpos != "") {
            arrowpostop -= 10 + $(window).scrollTop();
            arrowposleft -= $(window).scrollLeft();
        }
        return {
            arrowpos: arrowpos,
            arrowpostop: arrowpostop,
            arrowposleft: arrowposleft,
            xpos: xpos,
            ypos: ypos,
            target: target
        };
    }
});
//# sourceMappingURL=proactive-hints.js.map