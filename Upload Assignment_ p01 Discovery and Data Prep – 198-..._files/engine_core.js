"use strict";
eesy.define(['jquery-private', 'context-probe', 'context-handling', 'monitor-handling',
    'events-urlchange', 'events-domchange', 'events-iframe', 'engine-state', 'keep-alive', 'presentation',
    'found-items-handler', 'mouse', 'context-tree-matcher', 'eesy-timers', 'hints', 'helpitem-handling', 'support-tab',
    'utils', 'sessionInfo'], function ($, ctxProbe, ctxHandling, monitorHandling, eventsUrlChange, eventsDOMChange, eventsIframe, engineState, keepAlive, presentation, foundItemsHandler, mouse, contextTreeMatcher, eesyTimers, hints, helpitemHandling, supportTab, utils, sessionInfo) {
    var mouseOverElement = undefined;
    var lookuptimer;
    window.addEventListener('eesy_launchSupportTab', function () {
        supportTab.launchSupportCenter();
    }, true);
    $(document).on('helpitemArticleHandle', function (e, opts) {
        eesyRequire(['supportCenter'], function (supportCenter) {
            supportCenter.showHelpItemInNode(e.originalEvent.detail.helpitemGuid);
        });
    });
    return {
        start: start
    };
    function inBuildMode() {
        return window.sessionStorage.build_mode && window.sessionStorage.build_mode == "true";
    }
    function start() {
        engineState.foundNodes.set(foundItemsHandler.create());
        if (var_show_tab) {
            supportTab.show(function () {
                supportTab.launchSupportCenter();
                utils.focusElement("#supportCenterMainHeading", 500);
            });
        }
        if (var_isExpert) {
            eesyRequire(['expert-tools'], function (expertTools) {
                expertTools.show();
            });
        }
        monitorHandling.handleUnhandledMonitors();
        if (!inBuildMode()) {
            handleContentChanges();
        }
        //
        // Allow iframes/lti tools to load the engine directly()
        //
        window.addEventListener("message", function (e) {
            if (e.data.messageName === "lti.ready") {
                if (e.source !== null) {
                    var dashboardUrl = sessionInfo.dashboardUrl().indexOf("//") > -1
                        ? sessionInfo.dashboardUrl().split("//")[1]
                        : sessionInfo.dashboardUrl();
                    var showSupportTab = (e.data.supportTab == "inherited")
                        ? (var_show_tab ? "true" : "false")
                        : e.data.supportTab;
                    e.source.postMessage({ eesysoftloader: "//" + dashboardUrl
                            + "/loader.jsp?stmp=" + new Date().getTime()
                            + "&listento=top.nav&embedded=true&showquicklink=" + showSupportTab + "&k=" + sessionInfo.sessionKey() }, "*");
                }
            }
        }, false);
        registerGuardedHandler(document, "mousemove", handleMouseMove);
        registerGuardedHandler(document, "iframe.mousemove", function (e, orgEvent) { return handleMouseMove(orgEvent); });
        registerGuardedHandler(document, "mouseup", function (e) { return probeForMonitors($(e.target)); });
        registerGuardedHandler(document, "iframe.mouseup", function (e, orgEvent) { return probeForMonitors($(orgEvent.target)); });
        registerGuardedHandler(document, "iframes.changed presentation.hide.item", handleContentChanges);
        registerGuardedHandler(window, "domchanged", handleContentChanges);
        registerGuardedHandler(document, "iframe.focus iframe.added", function (e, iframe) { return probeForMonitors($(iframe).find('body')); });
        registerGuardedHandler(window, "urlchanged", handleContentChanges);
        eventsIframe.start();
        eventsUrlChange.start();
        eventsDOMChange.start();
        keepAlive.start();
    } //main end
    function registerGuardedHandler(target, eventName, handler) {
        $(target).on(eventName, function (e, data) {
            if (inBuildMode())
                return true;
            handler(e, data);
            return true;
        });
    }
    function probeForContexts(element) {
        ctxProbe.probeForElementContexts(ctxHandling.handlePresentContext, element);
        ctxProbe.probeForPresentContexts(element.get(0).ownerDocument, ctxHandling.handlePresentContext);
    }
    function handleContentChanges() {
        ctxHandling.clearQueuedContextLinks();
        ctxHandling.clearQueuedMonitors();
        engineState.foundNodes.get().clearFoundItems();
        probeForContexts($('body'));
        eventsIframe.getIFrames().forEach(function (iframe) {
            probeForContexts($(iframe.iframe.documentElement).find('body'));
        });
        if (mouseOverElement) {
            helpitemHandling.hideHints();
            ProbeForHelp(mouseOverElement);
        }
        ctxHandling.handleQueuedContextLinks();
        ctxHandling.handleQueuedMonitors();
    }
    function timedLookup() {
        if (!eventsDOMChange.isEesyElement(mouse.lastelement)) {
            mouseOverElement = mouse.lastelement;
            helpitemHandling.hideHints();
            ProbeForHelp(mouseOverElement);
        }
    }
    function handleMouseMove(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        if (e.target != mouse.lastelement) {
            clearTimeout(lookuptimer);
            mouse.lastelement = e.target;
            lookuptimer = setTimeout(timedLookup, $("#hintcontainer").length > 0 ? 1000 : 10);
        }
    }
    function probeForMonitors(element) {
        ctxProbe.eesy_traversePathForMatchingContexts(element, function (contextRule) {
            ctxHandling.handleMonitors(contextRule, element);
        });
        ctxHandling.handleQueuedMonitors();
    }
    function ProbeForHelp(element) {
        ctxProbe.eesy_traversePathForMatchingContexts(element, function (contextRule) {
            ctxHandling.handleContextLinks(contextRule, element, 0);
        });
        ctxHandling.handleQueuedContextLinks();
    }
});
//# sourceMappingURL=engine_core.js.map