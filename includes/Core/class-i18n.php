<?php
/**
 * Internationalization
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Internationalization
 *
 * @package Lumora
 * @since   1.0.0
 */
class I18n {

	/**
	 * Load plugin textdomain.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function load_plugin_textdomain(): void {
		load_plugin_textdomain(
			'lumora',
			false,
			dirname( LUMORA_PLUGIN_BASE ) . '/languages/'
		);
	}
}
