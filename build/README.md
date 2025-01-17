## Icons

Icons:

- `build/icon_tab_context_menu_inkscape.svg` - shown when:
    - Right clicking a tab
    - On the extension list (`about:addons`) (Cannot be changed to `icon_32_browser_action.svg`)
- `build/icon_browser_action_inkscape.svg` - shown when:
    - Clicking the "Extensions" button on the toolbar/address bar
    - Preferred "branding" icon for the extension

Maintaining:

- Icons were created and maintained using Inkspace (may or may not be compatible with other software)
- Icons are scaled-up and down manually using Inkscape (there is no automation script)
- Icons must be exported to 'Plain SVG' (instead of using the "Save" feature of Inkspace), menu: File > Export > "Plain SVG"
- Icons must be tested both above a black background and a light background to ensure compatibility with light and dark user themes.

Design Choices:

- A black background is put behind the icon (instead of being transparent) in order for the icon to be visible for light mode users (due to the icon being white).
    - WebManifest (v2 and v3) don't provide a way to customize the icon based on the user theme, e.g., this doesn't work:

      ```js
      // OK: detects the theme
      const icon_variant = (
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      );

      browser.menus.create({
        id: unloadMenuID,
        title: menuTitleSingular,
        contexts: ["tab"],
        // Not OK: will not work due to being a top-level item
        icons: {
          32: `icons/icon_${icon_variant}_32.svg`
        }
      });
      ```

