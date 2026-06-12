=== Lumora ===
Contributors: hordekiller
Tags: admin, dashboard, white-label, modern, ui, react, dark-mode, rtl, command-palette
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A revolutionary WordPress admin dashboard — modern, ultra-responsive, with a unique visual design.

== Description ==

Lumora transforms your WordPress admin experience with a modern, blazing-fast, and beautifully designed interface built with React. Features include a drag-and-drop widget dashboard, global command palette (Ctrl+K), advanced menu manager, dark mode, full RTL support, and white-label capabilities for agencies.

= Key Features =

* **Modern React Interface** — Blazing-fast SPA with code splitting and lazy loading
* **Drag-and-Drop Dashboard** — Customizable widget grid with per-user layouts
* **Global Command Palette** — Press Ctrl+K (Cmd+K on Mac) to search and navigate instantly
* **Menu Manager** — Reorder, hide, and customize admin menu items with drag-and-drop
* **White-Label Mode** — Rebrand the entire admin with custom colors, name, and footer
* **Dark/Light Mode** — System-aware theme with manual toggle
* **Full RTL Support** — Complete right-to-left layout for Persian, Arabic, and Hebrew
* **Mobile-First Design** — Responsive from 320px to 4K with off-canvas navigation
* **Accessibility Focused** — Keyboard navigation, ARIA labels, reduced-motion support
* **Persian Language Support** — Fully translated to فارسی (Iranian Persian)
* **System Status Dashboard** — Real-time PHP, WordPress, and server health information

== Screenshots ==

1. Lumora Dashboard with widgets
2. Command Palette (Ctrl+K)
3. Menu Manager with drag-and-drop
4. White Label settings
5. Dark mode dashboard

== Installation ==

1. Upload the `lumora` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Navigate to the new "Lumora" menu item in your admin sidebar
4. Press Ctrl+K (Cmd+K on Mac) to open the command palette from any admin page

== Frequently Asked Questions ==

= Does Lumora work with other plugins? =

Yes, Lumora is designed to be compatible with Elementor, WooCommerce, Yoast SEO, Advanced Custom Fields, and other major plugins. The plugin enhances the admin experience without modifying core WordPress functionality.

= Can I customize the colors? =

Yes, the White Label feature allows you to change the primary accent color, customize the plugin name, footer text, and hide Lumora branding entirely. Perfect for agencies and freelancers.

= Does Lumora support Persian and Arabic? =

Yes! Lumora has full RTL support and is fully translated into Persian (فارسی). The interface automatically adapts to your WordPress locale.

= How do I use the Command Palette? =

Press Ctrl+K (or Cmd+K on Mac) from any WordPress admin page. Start typing to search posts, pages, media, users, and perform commands like toggling dark mode or navigating to settings.

= Can I reset the menu to default? =

Yes, the Menu Manager has a "Reset" button that restores the default WordPress admin menu order and visibility.

== Changelog ==

= 1.0.0 =
* Initial release
* React-based modern admin dashboard with SPA routing
* Design system with 60+ CSS custom properties (design tokens)
* Fluid typography (clamp-based), dark/light mode, full RTL
* 4 dashboard widgets: Site Stats, Recent Posts, Recent Comments, System Info
* Widget engine with per-user drag-and-drop layout
* Global command palette (Ctrl+K) with fuzzy search and remote results
* Menu manager with drag-and-drop reorder, hide/show, global apply
* White-label module: custom plugin name, primary color, footer text, hide branding
* Notification system (Toast) with success/error/warning/info variants
* Welcome/onboarding screen on first activation
* System status dashboard: PHP, WordPress, and server health checks
* Code splitting: lazy-loaded page bundles reduce initial JS from 50KB to 26KB
* API response caching with 30-second TTL and automatic invalidation
* Debounced command palette search (300ms)
* Persian (fa_IR) full translation
* Accessibility: keyboard navigation, ARIA roles, reduced-motion support
* WordPress coding standards (0 PHPCS errors, 0 ESLint errors, 0 Stylelint errors)
* Tested with WordPress 6.0, 6.4, 6.7 and PHP 7.4, 8.0, 8.2, 8.3

== Upgrade Notice ==

= 1.0.0 =
Initial release.
