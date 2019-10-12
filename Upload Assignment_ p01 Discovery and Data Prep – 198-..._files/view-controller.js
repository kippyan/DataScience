"use strict";
eesy.define([], function () {
    var viewState = {};
    function allItems() {
        return Object.keys(viewState).map(function (key) { return viewState[key]; });
    }
    function addHelpitem(helpitem) {
        viewState[helpitem.cl.helpitemid] = helpitem;
    }
    function removeHelpitem(helpitemId) {
        delete viewState[helpitemId];
    }
    function isShowing(item) {
        return !!viewState[item.cl.helpitemid];
    }
    function isTypeShowing(itemType) {
        return numShowingByType(itemType) > 0;
    }
    function numShowingByType(itemType) {
        return getByType(itemType).length;
    }
    function getByType(itemType) {
        return Object.keys(viewState).filter(function (key) { return viewState[key].itemType === itemType; }).map(function (key) { return viewState[key]; });
    }
    function getModalShowing() {
        for (var helpitemId in viewState) {
            if (viewState[helpitemId].modal) {
                return viewState[helpitemId];
            }
        }
        return undefined;
    }
    function isModalShowing() {
        return !!getModalShowing();
    }
    function removeByType(itemType) {
        getByType(itemType).forEach(function (item) {
            removeHelpitem(item.cl.helpitemid);
        });
    }
    return {
        allItems: allItems,
        isShowing: isShowing,
        isModalShowing: isModalShowing,
        getModalShowing: getModalShowing,
        isTypeShowing: isTypeShowing,
        addHelpitem: addHelpitem,
        removeHelpitem: removeHelpitem,
        removeByType: removeByType,
        getByType: getByType,
        ITEM_TYPE: {
            HINT: "hint",
            SYSTRAY: "systray",
            POPUP: "popup",
            HINT_PROACTIVE: "proactiveHint",
            ON_DEMAND: "onDemand"
        }
    };
});
//# sourceMappingURL=view-controller.js.map