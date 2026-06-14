<?php
/**
 * WP-CLI commands for Lumora plugin.
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\CLI;

use WP_CLI;
use WP_CLI_Command;

/**
 * Manage Lumora plugin settings and cache.
 *
 * ## EXAMPLES
 *
 *     wp lumora status
 *     wp lumora cache flush
 *     wp lumora settings get theme
 *     wp lumora settings set theme dark
 *     wp lumora reset
 *
 * @since 1.0.0
 */
class Lumora_Command extends WP_CLI_Command {

	/**
	 * Display Lumora plugin status and version info.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Output format.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp lumora status
	 *
	 * @since 1.0.0
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function status( $args, $assoc_args ) {
		$plugin_dir = defined( 'LUMORA_PLUGIN_DIR' ) ? LUMORA_PLUGIN_DIR : plugin_dir_path( __FILE__ ) . '../../';
		$version    = defined( 'LUMORA_VERSION' ) ? LUMORA_VERSION : '1.0.0';

		$table_data = array(
			array(
				'Key'   => 'Version',
				'Value' => $version,
			),
			array(
				'Key'   => 'Plugin Dir',
				'Value' => $plugin_dir,
			),
			array(
				'Key'   => 'Theme',
				'Value' => get_option( 'lumora_theme', 'light' ),
			),
			array(
				'Key'   => 'Sidebar Collapsed',
				'Value' => get_option( 'lumora_sidebar_collapsed', '0' ) ? 'Yes' : 'No',
			),
			array(
				'Key'   => 'Menu Order',
				'Value' => get_option( 'lumora_menu_order', '[]' ) ? 'Custom' : 'Default',
			),
			array(
				'Key'   => 'White Label Active',
				'Value' => get_option( 'lumora_white_label', 0 ) ? 'Yes' : 'No',
			),
			array(
				'Key'   => 'Build Exists',
				'Value' => file_exists( $plugin_dir . 'build/admin.js' ) ? 'Yes' : 'No',
			),
		);

		if ( 'json' === \WP_CLI\Utils\get_flag_value( $assoc_args, 'format', 'table' ) ) {
			WP_CLI::log( wp_json_encode( $table_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ) );
		} else {
			WP_CLI\Utils\format_items( 'table', $table_data, array( 'Key', 'Value' ) );
		}
	}

	/**
	 * Flush Lumora cache (transients).
	 *
	 * ## OPTIONS
	 *
	 * [--all]
	 * : Flush all WordPress transients, not just Lumora ones.
	 *
	 * ## EXAMPLES
	 *
	 *     wp lumora cache flush
	 *     wp lumora cache flush --all
	 *
	 * @since 1.0.0
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function cache_flush( $args, $assoc_args ) {
		global $wpdb;

		if ( \WP_CLI\Utils\get_flag_value( $assoc_args, 'all', false ) ) {
			$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_lumora_%' OR option_name LIKE '_transient_timeout_lumora_%'" );
			WP_CLI::success( 'All Lumora transients flushed.' );
		} else {
			$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_lumora_%' OR option_name LIKE '_transient_timeout_lumora_%'" );
			WP_CLI::success( 'Lumora cache flushed.' );
		}
	}

	/**
	 * Get or set Lumora settings.
	 *
	 * ## OPTIONS
	 *
	 * <action>
	 * : The action to perform.
	 * ---
	 * default: get
	 * options:
	 *   - get
	 *   - set
	 *   - list
	 * ---
	 *
	 * [<key>]
	 * : The setting key.
	 *
	 * [<value>]
	 * : The value to set (required for 'set' action).
	 *
	 * ## EXAMPLES
	 *
	 *     wp lumora settings get theme
	 *     wp lumora settings set theme dark
	 *     wp lumora settings list
	 *
	 * @since 1.0.0
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function settings( $args, $assoc_args ) {
		$action = $args[0] ?? 'list';

		switch ( $action ) {
			case 'get':
				$key = $args[1] ?? '';
				if ( empty( $key ) ) {
					WP_CLI::error( 'Please specify a setting key.' );
				}
				$value = get_option( "lumora_{$key}", null );
				if ( null === $value ) {
					WP_CLI::warning( "Setting '{$key}' not found." );
				} else {
					WP_CLI::log( is_string( $value ) ? $value : wp_json_encode( $value ) );
				}
				break;

			case 'set':
				$key   = $args[1] ?? '';
				$value = $args[2] ?? '';
				if ( empty( $key ) || '' === $value ) {
					WP_CLI::error( 'Usage: wp lumora settings set <key> <value>' );
				}
				update_option( "lumora_{$key}", $value );
				WP_CLI::success( "Setting '{$key}' updated to '{$value}'." );
				break;

			case 'list':
				global $wpdb;
				$results = $wpdb->get_results(
					"SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'lumora_%'",
					ARRAY_A
				);

				if ( empty( $results ) ) {
					WP_CLI::log( 'No Lumora settings found.' );
					return;
				}

				$table_data = array_map(
					function( $row ) {
						return array(
							'Key'   => str_replace( 'lumora_', '', $row['option_name'] ),
							'Value' => $row['option_value'],
						);
					},
					$results
				);

				WP_CLI\Utils\format_items( 'table', $table_data, array( 'Key', 'Value' ) );
				break;

			default:
				WP_CLI::error( "Unknown action '{$action}'. Use: get, set, or list." );
		}
	}

	/**
	 * Reset Lumora settings to defaults.
	 *
	 * ## OPTIONS
	 *
	 * [--force]
	 * : Skip confirmation.
	 *
	 * ## EXAMPLES
	 *
	 *     wp lumora reset --force
	 *
	 * @since 1.0.0
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function reset( $args, $assoc_args ) {
		if ( ! \WP_CLI\Utils\get_flag_value( $assoc_args, 'force', false ) ) {
			WP_CLI::confirm( 'Are you sure you want to reset all Lumora settings?' );
		}

		global $wpdb;
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE 'lumora_%'" );

		\Lumora\Activator::activate();

		WP_CLI::success( 'Lumora settings reset to defaults.' );
	}
}

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'lumora', 'Lumora\CLI\Lumora_Command' );
}
