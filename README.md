# Lumora — Modern WordPress Admin Dashboard

[![CI](https://github.com/Hordekiller/LUMORA/actions/workflows/ci.yml/badge.svg)](https://github.com/Hordekiller/LUMORA/actions/workflows/ci.yml)
[![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue)](https://wordpress.org)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple)](https://php.net)
[![License](https://img.shields.io/badge/license-GPL--2.0--or--later-green)](LICENSE)
[![Persian](https://img.shields.io/badge/fa_IR-ترجمه_شده-239120)](languages/lumora-fa_IR.po)

A revolutionary WordPress admin dashboard plugin — modern, ultra-responsive, with a unique visual design built on React.

---

## Features

| Feature | Description |
|---|---|
| 🎨 **Modern Interface** | React-based SPA with code splitting, lazy loading, and fluid animations |
| 📊 **Dashboard Widgets** | 4 customizable widgets with drag-and-drop layout per user |
| ⌨️ **Command Palette** | Global Ctrl+K (Cmd+K) instant search across posts, pages, media, users |
| 📋 **Menu Manager** | Reorder, hide, and customize admin menu with drag-and-drop |
| 🏷️ **White Label** | Rebrand for agencies: custom name, color, footer, hide branding |
| 🌙 **Dark Mode** | System-aware dark/light toggle with smooth transitions |
| 🔄 **RTL Ready** | Full right-to-left support for Persian, Arabic, Hebrew |
| 📱 **Responsive** | Mobile-first 320px–4K with off-canvas navigation |
| ♿ **Accessible** | Keyboard nav, ARIA, reduced-motion, contrast ratios |
| 🌐 **Persian (فارسی)** | Fully translated Iranian Persian interface |
| ⚡ **Performance** | 26KB initial JS, API caching, debounced search |

## Screenshots

1. **Dashboard** — Widget grid with site stats and recent activity
2. **Command Palette** — Ctrl+K fuzzy search overlay
3. **Menu Manager** — Drag-and-drop admin menu reordering
4. **White Label** — Custom branding and color picker
5. **Dark Mode** — Full dark theme with all components

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Node.js 20+ (for development)

## Installation

### Production (WordPress)

1. Download the [latest release](https://github.com/Hordekiller/LUMORA/releases/latest) ZIP
2. Upload to `/wp-content/plugins/` and activate
3. Navigate to the **Lumora** menu item in your admin sidebar
4. Press **Ctrl+K** (Cmd+K) to open the command palette from anywhere

### Development

```bash
# Clone the repository
git clone https://github.com/Hordekiller/LUMORA.git
cd LUMORA

# Install dependencies
composer install
npm install

# Development (with hot reload)
npm run start

# Production build
npm run build

# Lint checks
npm run lint:js       # ESLint
npm run lint:css      # Stylelint
npm run lint:php      # PHPCS (WordPress standard)

# Tests
vendor/bin/phpunit
```

## Project Structure

```
lumora/
├── includes/            # PHP backend
│   ├── Admin/           # Admin page, assets
│   ├── API/             # REST endpoints (8 controllers)
│   ├── Core/            # Settings, Security, i18n, Cache
│   └── Modules/         # Widgets, Dashboard, Menu, CommandPalette, WhiteLabel
├── src/                 # JavaScript frontend
│   ├── components/      # React components (ui, layout, dashboard, widgets, menu, settings, command-palette)
│   ├── hooks/           # Custom hooks (useKeyboard, useMediaQuery, useSettings, useStats)
│   ├── store/           # WordPress data stores (settings, widgets)
│   ├── styles/          # SCSS (11 partials with design tokens)
│   └── utils/           # API client, classnames, fuzzy search
├── tests/               # PHPUnit tests
├── languages/           # Translation files (POT, PO, MO)
└── build/               # Webpack output (admin.js, palette.js, page chunks)
```

## Architecture

- **Custom Autoloader**: Registered before Composer PSR-4. Converts WordPress `class-*.php` naming to PSR-4 class names automatically.
- **Code Splitting**: `React.lazy()` + dynamic imports split the 50KB bundle into 26KB initial + 4 page-specific chunks.
- **Dual Entry Points**: `build/admin.js` loads only on Lumora admin page; `build/palette.js` (11KB) loads on ALL admin pages for global Ctrl+K.
- **API Layer**: In-memory cache with 30-second TTL, automatic invalidation on writes, 300ms debounced search.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

## License

GPL-2.0-or-later — see [LICENSE](LICENSE) for details.
