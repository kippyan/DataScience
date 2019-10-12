"use strict";
eesy.define(['jquery-private', 'utils', 'helpitem-loader'], function ($, utils, helpitemLoader) {
    utils.onClickOrSelectKey('.quick-survey__answer_Sup', function (e, button) {
        var answer = $(button).data('answer');
        var hid = $(button).data('helpitemId');
        $(button).addClass("isSelected").siblings('.quick-survey__answer_Sup').removeClass("isSelected");
        if (!answer) {
            $(".layout__main .thanks").addClass("hideThanks");
            $(".layout__main .__explain-downvoting").removeClass("hideQuestion");
            $('.form__submit_Sup').data("hid", hid);
        }
        else {
            $(".layout__main .__explain-downvoting").addClass("hideQuestion");
            var data = { sessionkey: var_key, isUp: answer, timeStamp: utils.createStamp(), reason: "" };
            $.post(var_dashboard_url + "/rest/helpitems/" + hid + "/votes?sessionkey=" + var_key, data, function () {
                updateHelpitemVote(hid, answer);
            });
        }
    });
    utils.onClickOrSelectKey('.form__submit_Sup', function (e, element) {
        var tempReason = $(".layout__main .__explain-downvoting .quick-survey__textarea").val();
        var hid = $('.form__submit_Sup').data("hid");
        $(".layout__main .__explain-downvoting").addClass("hideQuestion");
        $(".layout__main .thanks").removeClass("hideThanks");
        var data = { sessionKey: var_key, isUp: false, timeStamp: utils.createStamp(), reason: tempReason };
        $.post(var_dashboard_url + "/rest/helpitems/" + hid + "/votes?sessionkey=" + var_key, data, function () {
            updateHelpitemVote(hid, false);
        });
    });
    utils.onClickOrSelectKey('.__explain-downvoting .form__submit', function (e, element) {
        var tempReason = $(element).parent().find(".quick-survey__textarea").val();
        var hid = $('.form__submit').data("hid");
        $(element).closest(".quick-survey-section").children(".thanks").removeClass("hideThanks");
        $(element).parent().addClass("hideQuestion");
        var data = { sessionKey: var_key, isUp: false, timeStamp: utils.createStamp(), reason: tempReason };
        $.post(var_dashboard_url + "/rest/helpitems/" + hid + "/votes?sessionkey=" + var_key, data, function () {
            updateHelpitemVote(hid, false);
        });
    });
    // click on one of the voting up/down buttons
    utils.onClickOrSelectKey('.quick-survey__answer', function (e, button) {
        var answer = $(button).data('answer');
        var hid = $(button).data('helpitemId');
        $(button).addClass("isSelected").siblings('.quick-survey__answer').removeClass("isSelected");
        if (!answer) {
            $(button).closest(".quick-survey-section").children(".__explain-downvoting").removeClass("hideQuestion");
            $(button).closest(".quick-survey-section").children(".thanks").addClass("hideThanks");
            $('.form__submit').data("hid", hid);
        }
        else {
            $(button).closest(".quick-survey-section").children(".__explain-downvoting").addClass("hideQuestion");
            $(button).closest(".quick-survey-section").children(".thanks").removeClass("hideThanks");
            var data = { sessionkey: var_key, isUp: answer, timeStamp: utils.createStamp(), reason: "" };
            $.post(var_dashboard_url + "/rest/helpitems/" + hid + "/votes?sessionkey=" + var_key, data, function () {
                updateHelpitemVote(hid, answer);
            });
        }
    });
    return {};
    function updateHelpitemVote(hid, answer) {
        helpitemLoader.loadHelpItem(hid, function (hi) {
            hi.voting.votedUp = answer;
            hi.voting.votedDown = !answer;
        });
    }
});
//# sourceMappingURL=quick-survey.js.map