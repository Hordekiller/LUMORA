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
					'nonce'    => wp_create_nonce( 'wp_rest' ),
					'restUrl'  => rest_url( 'lumora/v1' ),
					'siteName' => get_bloginfo( 'name' ),
					'adminUrl' => admin_url(),
					'isRtl'    => is_rtl(),
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
			$deps = array( 'wp-element', 'wp-i18n', 'wp-api-fetch' );
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
}
