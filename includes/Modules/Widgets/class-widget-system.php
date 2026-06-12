<?php
/**
 * System Widget
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * System Widget
 *
 * @package Lumora
 * @since   1.0.0
 */
class Widget_System implements Widget_Interface {

	/**
	 * Get widget ID.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_id(): string {
		return 'widget_system';
	}

	/**
	 * Get widget title.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_title(): string {
		return __( 'System Info', 'lumora' );
	}

	/**
	 * Get widget description.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_description(): string {
		return __( 'Server and WordPress environment details.', 'lumora' );
	}

	/**
	 * Get widget data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_data(): array {
		global $wpdb;

		$memory_limit = defined( 'WP_MEMORY_LIMIT' ) ? WP_MEMORY_LIMIT : ini_get( 'memory_limit' );

		return array(
			'phpVersion'    => PHP_VERSION,
			'wpVersion'     => get_bloginfo( 'version' ),
			'dbVersion'     => $wpdb->db_version(),
			'server'        => sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ?? '' ) ),
			'memoryLimit'   => $memory_limit,
			'debugMode'     => defined( 'WP_DEBUG' ) && WP_DEBUG,
			'maxUploadSize' => size_format( wp_max_upload_size() ),
			'theme'         => wp_get_theme()->get( 'Name' ),
		);
	}

	/**
	 * Get default config.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_default_config(): array {
		return array();
	}
}
