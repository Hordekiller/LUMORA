<?php
/**
 * Security — Nonce, Capability, Sanitize Helpers
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Security — Nonce, Capability, Sanitize Helpers
 *
 * @package Lumora
 * @since   1.0.0
 */
class Security {

	public const NONCE_ACTION = 'lumora_action';
	public const NONCE_NAME   = 'lumora_nonce';
	public const CAPABILITY   = 'manage_options';

	/**
	 * Verify a nonce.
	 *
	 * @since 1.0.0
	 * @param string $nonce Nonce value.
	 * @return bool
	 */
	public function verify_nonce( string $nonce ): bool {
		return (bool) wp_verify_nonce( sanitize_text_field( wp_unslash( $nonce ) ), self::NONCE_ACTION );
	}

	/**
	 * Verify request nonce.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function verify_request_nonce(): bool {
		$nonce = sanitize_text_field( wp_unslash( $_REQUEST[ self::NONCE_NAME ] ?? '' ) );
		return $this->verify_nonce( $nonce );
	}

	/**
	 * Check current user capability.
	 *
	 * @since 1.0.0
	 * @param string $capability Capability to check.
	 * @return bool
	 */
	public function current_user_can( string $capability = self::CAPABILITY ): bool {
		return current_user_can( $capability );
	}

	/**
	 * Check admin capability or die.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function check_admin_capability(): void {
		if ( ! $this->current_user_can() ) {
			wp_die( esc_html__( 'Unauthorized.', 'lumora' ) );
		}
	}

	/**
	 * Create a nonce.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function create_nonce(): string {
		return wp_create_nonce( self::NONCE_ACTION );
	}

	/**
	 * Sanitize input by type.
	 *
	 * @since 1.0.0
	 * @param mixed  $input Input value.
	 * @param string $type  Sanitization type.
	 * @return mixed
	 */
	public function sanitize( $input, string $type = 'text' ) {
		switch ( $type ) {
			case 'text':
				return sanitize_text_field( wp_unslash( $input ) );
			case 'textarea':
				return sanitize_textarea_field( wp_unslash( $input ) );
			case 'email':
				return sanitize_email( wp_unslash( $input ) );
			case 'url':
				return esc_url_raw( wp_unslash( $input ) );
			case 'int':
				return absint( $input );
			case 'key':
				return sanitize_key( $input );
			case 'html':
				return wp_kses_post( wp_unslash( $input ) );
			default:
				return sanitize_text_field( wp_unslash( $input ) );
		}
	}
}
