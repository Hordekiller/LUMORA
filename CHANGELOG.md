# Changelog

All notable changes to Lumora are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 1.0.0 — 2025-06-12

Initial release.

### Added

#### Core & Foundation
- WordPress plugin bootstrap with PHP 7.4+ and WP 6.0+ version checks
- Custom autoloader supporting WordPress `class-*.php` naming convention
- Composer PSR-4 autoloader as fallback
- Singleton architecture (`Lumora\Lumora`)
- Hook loader pattern (`Lumora\Loader`)
- Activation/deactivation hooks with database table creation
- Clean uninstall handler removing all options and tables
- REST API base controller and 7 specialized endpoints
- Security utilities (nonce validation, permission callbacks)
- Cache abstraction layer
- i18n with full Persian (fa_IR) translation support

#### Design System
- 11 SCSS partials with 60+ CSS custom property design tokens
- Fluid typography using `clamp()` for all text sizes
- Dark/light mode with `data-lumora-theme` attribute
- Full RTL support via `[dir="rtl"]` overrides
- Responsive mixin system with 5 breakpoints (xs, sm, md, lg, xl)
- 9+ animation keyframes (fade, slide, spin, shimmer, spring transitions)
- Accessibility: reduced-motion media query, focus indicators, contrast ratios
- UI components: Button (5 variants, 3 sizes), Card (3 variants), Modal (4 sizes), Toggle (2 sizes), Badge (5 variants), Skeleton, Tooltip, Icon

#### Layout & Navigation
- Fixed sidebar with collapse/expand, mobile off-canvas overlay
- Header with hamburger menu, search trigger, dark mode toggle, avatar
- Responsive grid system with auto-fit columns
- Mobile navigation with swipe gesture support

#### Dashboard & Widgets
- 4 real WordPress widgets: Site Stats, Recent Posts, Recent Comments, System Info
- Widget engine with per-user layout persistence via `wp_usermeta`
- Drag-and-drop widget grid with live layout saving
- Widget engine filter (`lumora_register_widgets`) for third-party extensibility

#### Command Palette
- Global Ctrl+K / Cmd+K keyboard shortcut on ALL admin pages
- Standalone Webpack entry (`palette.js`) — only 11KB, loaded separately
- Fuzzy search with Persian/Arabic character normalization
- Local commands + remote search across posts, pages, media, users
- Keyboard navigation: ↑↓ to navigate, Enter to select, Esc to close
- Grouped results with section headers

#### Menu Manager
- Drag-and-drop reorder of WordPress admin menu items
- Toggle visibility (hide/show) per item
- Per-user or global save options
- Reset to WordPress defaults
- Reads real `$GLOBALS['menu']` and `$submenu`

#### White Label
- Custom plugin name displayed in admin menu
- Primary accent color with live CSS injection
- Custom footer text
- Hide Lumora branding toggle
- Reuses existing settings endpoint

#### Notifications & Onboarding
- Toast notification system with 4 types (success, error, warning, info)
- Auto-dismiss with configurable duration (default 4s)
- Welcome/onboarding screen with 4-step guide on first activation
- ESC key to dismiss welcome screen
- System Status dashboard: PHP, WordPress, MySQL, server health

#### Performance
- Code splitting: lazy-loaded page bundles via `React.lazy()` + dynamic `import()`
- Initial `admin.js` reduced from 50KB to 26KB (48% smaller)
- 4 separate page chunks: Dashboard (15KB), Menu (8KB), White Label (7KB), Settings (3KB)
- In-memory API response cache with 30-second TTL
- Automatic cache invalidation on write operations
- Debounced command palette search (300ms)

#### Quality Assurance
- WordPress Coding Standards: 0 PHPCS errors across 27 PHP files
- ESLint: 0 errors across 38 JS/JSX files
- Stylelint: 0 errors across 11 SCSS files
- PHP syntax check: all files pass `php -l`
- Webpack production build: successful (7 Sass deprecation warnings only)
- 4 PHPUnit test files: Activator, Settings, REST endpoints
- CI/CD workflows for automated testing on PHP 7.4–8.3 and WP 6.0–6.7

#### Documentation & Distribution
- `README.md` with features and development instructions
- `readme.txt` for WordPress.org plugin repository
- `CHANGELOG.md` with full version history
- `LICENSE` file (GPL-2.0-or-later)
- `languages/lumora.pot` for translation tools
- `languages/lumora-fa_IR.po` + `.mo` with full Persian translation
- GitHub Actions CI + Release workflows
- Automated ZIP builder for distribution
- WordPress.org SVN deployment workflow
