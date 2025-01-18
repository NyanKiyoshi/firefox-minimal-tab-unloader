"use strict";

const unloadMenuID = "unload-tab-ext";
const menuTitleSingular = "Unload Tab";
const menuTitlePlural = "Unload Tabs";

/**
 * Retrieves the selected tabs.
 *
 * If the user selected multiple tabs, then we check whether the
 * tab where the user clicked the "Unload Tab" button was one of
 * the selected tabs.
 *
 * If the tab was indeed selected, then we return all selected tabs
 * as the user most likely wants to unload multiple tabs.
 *
 * But if the user selected multiple tabs but didn't click the unload
 * button on one of the selected tabs, then user most likely only wants
 * to unload the tab they clicked, thus we ignore all selected tabs.
 *
 * Return value is either:
 *
 * - All selected tabs (if they right clicked on them).
 *   => returns N tabs.
 * - The right-clicked tab (only one tab)
 *   => return 1 tab.
 */
async function getSelectedTabs(tab, excludeUnloaded=true) {
    // Retrieve selected tabs (if any).
    // Only retrieves the tab selected in the current window,
    // otherwise we may end up unloading unrelated tabs.
    let selectedTabs = await browser.tabs.query({
        // Only return tabs that the user select or is active.
        highlighted: true,
        // Only show active/selected tabs from the current window.
        currentWindow: true,
        // Don't show tabs that are already unloaded if `excludeUnloaded=true`.
        // Otherwise, show both unloaded and loaded (by passing `null`).
        discarded: excludeUnloaded ? false : null,
    });

    // Check whether the clicked tab was actually one of the selected one.
    // If it wasn't one of the selected, then only suspend the active/focused one.
    let tabSelected = false;
    for (const selectedTab of selectedTabs) {
        if (selectedTab.id == tab.id) {
            // The user must have multi-selected tabs.
            tabSelected = true;
            break;
        }
    }

    // The user selected tabs but clicked another,
    // thus only suspend the tab where the user click the menu.
    if (!tabSelected) {
        selectedTabs = [tab];
    }
    return selectedTabs;
}

const unloadTab = async (tab) => {
    const selectedTabs = await getSelectedTabs(tab);

    for (const tab of selectedTabs) {
        console.debug("Unloading tab:", { id: tab.id, title: tab.title }, tab);

        try {
            // Note: an active/focused tab will not be unloaded, only tabs that aren't
            // actively rendered will be suspended.
            await browser.tabs.discard(tab.id);
        } catch (exc) {
            console.error("Failed to discard tab:", err, tab.title, tab);
        }
    }
};

// Create menu item for right-clicks on tabs.
browser.menus.create({
    id: unloadMenuID,
    title: menuTitleSingular,
    contexts: ["tab"]
});

// Changes the menu item title to/from plural depending
// on whether the user selected multiple tabs.
browser.menus.onShown.addListener(async (info, tab) => {
    const selectedTabCount = (await getSelectedTabs(tab, true)).length;

    let title = menuTitleSingular;

    // Set title to plural if multiple tabs selected.
    if (selectedTabCount > 1) {
        title = menuTitlePlural;
    }

    browser.menus.update(unloadMenuID, {title: title});
    browser.menus.refresh();
});

// Handle clicks on tab menu items.
browser.menus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === unloadMenuID) {
	    unloadTab(tab);
    }
});

