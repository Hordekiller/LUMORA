<?php
/**
 * Deactivation Cleanup
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora;

defined( 'ABSPATH' ) || exit;

/**
 * Deactivation Cleanup
 *
 * @package Lumora
 * @since   1.0.0
 */
class Deactivator {

	/**
	 * Deactivate the plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public static function deactivate(): void {
		self::clear_cron_events();
		self::remove_capabilities();
	}

	/**
	 * Clear cron events.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private static function clear_cron_events(): void {
		$crons = array(
			'lumora_daily_stats',
			'lumora_weekly_cleanup',
		);

		foreach ( $crons as $cron ) {
			$timestamp = wp_next_scheduled( $cron );
			if ( $timestamp ) {
				wp_unschedule_event( $timestamp, $cron );
			}
		}
	}

	/**
	 * Remove user capabilities.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private static function remove_capabilities(): void {
		$role = get_role( 'administrator' );
		if ( $role ) {
			$role->remove_cap( 'manage_lumora' );
		}
	}
}
