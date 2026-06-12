<?php
/**
 * Settings — Options API Wrapper
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Settings — Options API Wrapper
 *
 * @package Lumora
 * @since   1.0.0
 */
class Settings {

	/**
	 * Option key prefix.
	 *
	 * @var string
	 */
	private string $prefix = 'lumora_';

	/**
	 * Get a setting.
	 *
	 * @since 1.0.0
	 * @param string $key     Setting key.
	 * @param mixed  $default Default value.
	 * @return mixed
	 */
	public function get( string $key, $default = false ) {
		return get_option( $this->prefix . $key, $default );
	}

	/**
	 * Set a setting.
	 *
	 * @since 1.0.0
	 * @param string $key      Setting key.
	 * @param mixed  $value    Setting value.
	 * @param bool   $autoload Whether to autoload.
	 * @return bool
	 */
	public function set( string $key, $value, bool $autoload = false ): bool {
		return update_option( $this->prefix . $key, $value, $autoload );
	}

	/**
	 * Delete a setting.
	 *
	 * @since 1.0.0
	 * @param string $key Setting key.
	 * @return bool
	 */
	public function delete( string $key ): bool {
		return delete_option( $this->prefix . $key );
	}

	/**
	 * Check if a setting exists.
	 *
	 * @since 1.0.0
	 * @param string $key Setting key.
	 * @return bool
	 */
	public function has( string $key ): bool {
		return false !== $this->get( $key );
	}

	/**
	 * Get all settings.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_all(): array {
		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE %s",
				$this->prefix . '%'
			)
		);

		$settings = array();
		foreach ( $results as $row ) {
			$key              = str_replace( $this->prefix, '', $row->option_name );
			$settings[ $key ] = maybe_unserialize( $row->option_value );
		}

		return $settings;
	}
}
