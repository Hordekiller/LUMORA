<?php
/**
 * Conditional Asset Enqueueing
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Conditional Asset Enqueueing
 *
 * @package Lumora
 * @since   1.0.0
 */
class Assets {

	/**
	 * Enqueue styles.
	 *
	 * @since 1.0.0
	 * @param string $hook_suffix Current admin page hook.
	 * @return void
	 */
	public function enqueue_styles( string $hook_suffix ): void {
		// Load global admin styles on ALL admin pages.
		$this->enqueue_global_admin_styles();

		// Load full admin styles only on Lumora page.
		if ( 'toplevel_page_lumora' !== $hook_suffix ) {
			return;
		}

		$style_path = 'build/admin.css';
		$style_file = LUMORA_PLUGIN_DIR . $style_path;

		if ( file_exists( $style_file ) ) {
			wp_enqueue_style(
				'lumora-admin',
				LUMORA_PLUGIN_URL . $style_path,
				array( 'lumora-admin-global' ),
				filemtime( $style_file )
			);
		}
	}

	/**
	 * Enqueue global admin override styles on all admin pages.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function enqueue_global_admin_styles(): void {
		$style_path = 'build/admin-global.css';
		$style_file = LUMORA_PLUGIN_DIR . $style_path;

		if ( file_exists( $style_file ) ) {
			wp_enqueue_style(
				'lumora-admin-global',
				LUMORA_PLUGIN_URL . $style_path,
				array(),
				filemtime( $style_file )
			);
		}
	}

	/**
	 * Enqueue scripts.
	 *
	 * @since 1.0.0
	 * @param string $hook_suffix Current admin page hook.
	 * @return void
	 */
	public function enqueue_scripts( string $hook_suffix ): void {
		if ( 'toplevel_page_lumora' !== $hook_suffix ) {
			$this->enqueue_palette_script();
			return;
		}

		$script_path = 'build/admin.js';
		$script_file = LUMORA_PLUGIN_DIR . $script_path;

		if ( file_exists( $script_file ) ) {
			$asset_file = LUMORA_PLUGIN_DIR . 'build/admin.asset.php';
			$deps       = array( 'wp-components' );
			if ( file_exists( $asset_file ) ) {
				$asset = require $asset_file;
				$deps  = array_merge( $deps, (array) $asset['dependencies'] );
			} else {
				$deps = array_merge( $deps, array( 'wp-element', 'wp-data', 'wp-i18n', 'wp-api-fetch' ) );
			}

			wp_enqueue_script(
				'lumora-admin',
				LUMORA_PLUGIN_URL . $script_path,
				$deps,
				filemtime( $script_file ),
				true
			);

			wp_localize_script(
				'lumora-admin',
				'lumoraData',
				array(
					'nonce'     => wp_create_nonce( 'wp_rest' ),
					'restUrl'   => rest_url( 'lumora/v1' ),
					'siteName'  => get_bloginfo( 'name' ),
					'adminUrl'  => admin_url(),
					'isRtl'     => is_rtl(),
					'adminMenu' => $this->get_admin_menu(),
				)
			);
		}
	}

	/**
	 * Enqueue palette script on non-lumora pages.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function enqueue_palette_script(): void {
		$script_path = 'build/palette.js';
		$script_file = LUMORA_PLUGIN_DIR . $script_path;

		if ( ! file_exists( $script_file ) ) {
			return;
		}

		$asset_file = LUMORA_PLUGIN_DIR . 'build/palette.asset.php';
		$deps       = array();
		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;
			$deps  = (array) $asset['dependencies'];
		} else {
			$deps = array( 'wp-element', 'wp-i18n', 'wp-api-fetch', 'wp-components', 'wp-primitives' );
		}

		wp_enqueue_script(
			'lumora-palette',
			LUMORA_PLUGIN_URL . $script_path,
			$deps,
			filemtime( $script_file ),
			true
		);

		wp_localize_script(
			'lumora-palette',
			'lumoraData',
			array(
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'restUrl'  => rest_url( 'lumora/v1/' ),
				'siteName' => get_bloginfo( 'name' ),
				'adminUrl' => admin_url(),
				'isRtl'    => is_rtl(),
			)
		);
	}

	/**
	 * Get admin menu items for the sidebar.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	private function get_admin_menu(): array {
		global $menu, $submenu;

		$items = array();

		if ( empty( $menu ) ) {
			return $items;
		}

		$icon_map = array(
			'dashicons-admin-appearance' => 'appearance',
			'dashicons-admin-comments'   => 'comments',
			'dashicons-admin-customizer' => 'settings',
			'dashicons-admin-collapse'   => 'menu',
			'dashicons-admin-generic'    => 'settings',
			'dashicons-admin-home'       => 'home',
			'dashicons-admin-languages'  => 'globe',
			'dashicons-admin-links'      => 'link',
			'dashicons-admin-manage'     => 'grid',
			'dashicons-admin-multisite'  => 'network',
			'dashicons-admin-network'    => 'network',
			'dashicons-admin-page'       => 'page',
			'dashicons-admin-plugins'    => 'plugins',
			'dashicons-admin-post'       => 'edit',
			'dashicons-admin-settings'   => 'settings',
			'dashicons-admin-site'       => 'home',
			'dashicons-admin-site-wide'  => 'network',
			'dashicons-admin-themes'     => 'appearance',
			'dashicons-admin-tools'      => 'tools',
			'dashicons-admin-users'      => 'users',
			'dashicons-admin-welcome'    => 'home',
			'dashicons-admin-wordpress'  => 'wordpress',
			'dashicons-airplane'         => 'airplane',
			'dashicons-awards'           => 'awards',
			'dashicons-bed'              => 'bed',
			'dashicons-building'         => 'building',
			'dashicons-businessman'      => 'users',
			'dashicons-car'              => 'car',
			'dashicons-cart'             => 'products',
			'dashicons-chart-area'       => 'chart',
			'dashicons-chart-bar'        => 'chart',
			'dashicons-chart-line'       => 'chart',
			'dashicons-chart-pie'        => 'chart',
			'dashicons-database'         => 'database',
			'dashicons-database-add'     => 'database',
			'dashicons-database-drag'    => 'database',
			'dashicons-database-export'  => 'database',
			'dashicons-database-import'  => 'database',
			'dashicons-database-remove'  => 'database',
			'dashicons-database-view'    => 'database',
			'dashicons-download'         => 'download',
			'dashicons-feedback'         => 'feedback',
			'dashicons-groups'           => 'users',
			'dashicons-id'               => 'users',
			'dashicons-id-alt'           => 'users',
			'dashicons-laptop'           => 'laptop',
			'dashicons-megaphone'        => 'megaphone',
			'dashicons-microphone'       => 'microphone',
			'dashicons-migrate'          => 'migrate',
			'dashicons-nametag'          => 'users',
			'dashicons-palmtree'         => 'palmtree',
			'dashicons-pede'             => 'pede',
			'dashicons-performance'      => 'chart',
			'dashicons-portfolio'        => 'grid',
			'dashicons-products'         => 'products',
			'dashicons-schedule'         => 'calendar',
			'dashicons-shield'           => 'settings',
			'dashicons-shield-alt'       => 'settings',
			'dashicons-testimonial'      => 'users',
			'dashicons-tickets'          => 'tickets',
			'dashicons-update'           => 'update',
			'dashicons-update-alt'       => 'update',
			'dashicons-upload'           => 'upload',
			'dashicons-vault'            => 'settings',
			'home'                       => 'home',
		);

		foreach ( $menu as $item ) {
			// Skip separators and empty items.
			if ( empty( $item[0] ) || empty( $item[2] ) || 0 === strpos( (string) $item[4], 'separator' ) ) {
				continue;
			}

			$slug  = $item[2];
			$title = wp_strip_all_tags( $item[0] );
			$icon  = $item[6] ?? 'dashicons-admin-generic';
			$cap   = $item[1] ?? 'manage_options';

			// Check capability.
			if ( ! current_user_can( $cap ) ) {
				continue;
			}

			// Map dashicon to our icon names.
			$mapped_icon = $icon_map[ $icon ] ?? 'settings';

			// Build URL.
			$url = '';
			if ( 'toplevel_page_lumora' === $slug ) {
				// Skip Lumora's own menu item — we handle it internally.
				continue;
			} elseif ( isset( $submenu[ $slug ] ) ) {
				// Use first submenu item URL.
				$first_sub = reset( $submenu[ $slug ] );
				$url       = admin_url( $first_sub[2] );
			} else {
				$url = admin_url( 'admin.php?page=' . $slug );
			}

			$sub_items = array();
			if ( isset( $submenu[ $slug ] ) ) {
				foreach ( $submenu[ $slug ] as $sub ) {
					if ( empty( $sub[0] ) || empty( $sub[2] ) ) {
						continue;
					}
					$sub_items[] = array(
						'title' => wp_strip_all_tags( $sub[0] ),
						'url'   => admin_url( $sub[2] ),
					);
				}
			}

			$items[] = array(
				'id'     => $slug,
				'title'  => $title,
				'url'    => $url,
				'icon'   => $mapped_icon,
				'raw'    => $icon,
				'sub'    => $sub_items,
				'active' => false,
			);
		}

		return $items;
	}
}
