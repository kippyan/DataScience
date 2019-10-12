"use strict";
eesy.define(['json!language'], function (language) {
    return {
        helpItemModel: helpItemModel
    };
    function helpItemModel(helpItem) {
        return {
            LNG: language.LNG,
            var_dashboard_url: var_dashboard_url,
            var_proactive_lms: var_proactive_lms,
            helpItem: helpItem,
            isLoggedIn: !!var_key
        };
    }
});
//# sourceMappingURL=presentation-helper.js.map