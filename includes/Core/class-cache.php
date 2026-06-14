<?php
/**
 * Cache — Transients Wrapper
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Cache — Transients Wrapper
 *
 * @package Lumora
 * @since   1.0.0
 */
class Cache {

	/**
	 * Cache key prefix.
	 *
	 * @var string
	 */
	private string $prefix = 'lumora_cache_';

	/**
	 * Get cached value.
	 *
	 * @since 1.0.0
	 * @param string $key           Cache key.
	 * @param mixed  $default_value Default value.
	 * @return mixed
	 */
	public function get( string $key, $default_value = false ) {
		$value = get_transient( $this->prefix . $key );
		return false !== $value ? $value : $default_value;
	}

	/**
	 * Set cached value.
	 *
	 * @since 1.0.0
	 * @param string $key        Cache key.
	 * @param mixed  $value      Value to cache.
	 * @param int    $expiration Expiration in seconds.
	 * @return bool
	 */
	public function set( string $key, $value, int $expiration = HOUR_IN_SECONDS ): bool {
		return set_transient( $this->prefix . $key, $value, $expiration );
	}

	/**
	 * Delete cached value.
	 *
	 * @since 1.0.0
	 * @param string $key Cache key.
	 * @return bool
	 */
	public function delete( string $key ): bool {
		return delete_transient( $this->prefix . $key );
	}

	/**
	 * Check if key exists in cache.
	 *
	 * @since 1.0.0
	 * @param string $key Cache key.
	 * @return bool
	 */
	public function has( string $key ): bool {
		return false !== get_transient( $this->prefix . $key );
	}

	/**
	 * Remember value using callback.
	 *
	 * @since 1.0.0
	 * @param string   $key        Cache key.
	 * @param callable $callback   Callback to generate value.
	 * @param int      $expiration Expiration in seconds.
	 * @return mixed
	 */
	public function remember( string $key, callable $callback, int $expiration = HOUR_IN_SECONDS ) {
		$cached = $this->get( $key );
		if ( false !== $cached ) {
			return $cached;
		}

		$value = $callback();
		$this->set( $key, $value, $expiration );
		return $value;
	}

	/**
	 * Flush all cached values.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function flush(): void {
		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
				$wpdb->esc_like( '_transient_' . $this->prefix ) . '%'
			)
		);
	}
}
