<?php
/**
 * Activation Logic & DB Setup
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora;

defined( 'ABSPATH' ) || exit;

/**
 * Activation Logic & DB Setup
 *
 * @package Lumora
 * @since   1.0.0
 */
class Activator {

	/**
	 * Activate the plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public static function activate(): void {
		self::check_requirements();
		self::create_tables();
		self::set_default_options();
		self::set_capabilities();
	}

	/**
	 * Check PHP and WP version requirements.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private static function check_requirements(): void {
		if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
			deactivate_plugins( LUMORA_PLUGIN_BASE );
			wp_die(
				esc_html__( 'Lumora requires PHP 7.4 or higher.', 'lumora' )
			);
		}

		global $wp_version;
		if ( version_compare( $wp_version, '6.0', '<' ) ) {
			deactivate_plugins( LUMORA_PLUGIN_BASE );
			wp_die(
				esc_html__( 'Lumora requires WordPress 6.0 or higher.', 'lumora' )
			);
		}
	}

	/**
	 * Create database tables.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private static function create_tables(): void {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();
		$table_name      = $wpdb->prefix . 'lumora_widget_layouts';

		$sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            layout longtext NOT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Set default options.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private static function set_default_options(): void {
		$defaults = array(
			'theme'               => 'light',
			'sidebar_collapsed'   => false,
			'widgets_enabled'     => true,
			'command_palette'     => true,
			'activation_redirect' => true,
		);

		foreach ( $defaults as $key => $value ) {
			$option = 'lumora_' . $key;
			if ( false === get_option( $option ) ) {
				update_option( $option, $value );
			}
		}
	}

	/**
	 * Set user capabilities.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private static function set_capabilities(): void {
		$role = get_role( 'administrator' );
		if ( $role ) {
			$role->add_cap( 'manage_lumora' );
		}
	}
}
