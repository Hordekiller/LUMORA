<?php
/**
 * Settings REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

use Lumora\Core\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Settings REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */
class Settings_Endpoint {

	/**
	 * Settings instance.
	 *
	 * @var Settings
	 */
	private Settings $settings;

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	private string $namespace = 'lumora/v1';

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->settings = new Settings();
	}

	/**
	 * Register routes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'args'                => $this->get_collection_params(),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_items' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'args'                => $this->get_endpoint_args(),
				),
			)
		);
	}

	/**
	 * Get settings.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_items(): \WP_REST_Response {
		$settings = $this->settings->get_all();
		return new \WP_REST_Response( $settings, 200 );
	}

	/**
	 * Update settings.
	 *
	 * @since 1.0.0
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_items( \WP_REST_Request $request ): \WP_REST_Response {
		$params = $request->get_json_params();

		if ( empty( $params ) || ! is_array( $params ) ) {
			return new \WP_REST_Response(
				array( 'message' => __( 'Invalid request body.', 'lumora' ) ),
				400
			);
		}

		foreach ( $params as $key => $value ) {
			$sanitized_key = sanitize_key( $key );
			$this->settings->set( $sanitized_key, $this->sanitize_value( $value ) );
		}

		return new \WP_REST_Response(
			array(
				'message'  => __( 'Settings updated.', 'lumora' ),
				'settings' => $this->settings->get_all(),
			),
			200
		);
	}

	/**
	 * Check permission.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function check_permission(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get collection params.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_collection_params(): array {
		return array(
			'context' => array(
				'default' => 'view',
			),
		);
	}

	/**
	 * Get endpoint args.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_endpoint_args(): array {
		return array(
			'theme'             => array(
				'type'     => 'string',
				'enum'     => array( 'light', 'dark', 'auto' ),
				'required' => false,
			),
			'sidebar_collapsed' => array(
				'type'     => 'boolean',
				'required' => false,
			),
		);
	}

	/**
	 * Sanitize a value.
	 *
	 * @since 1.0.0
	 * @param mixed $value Value to sanitize.
	 * @return mixed
	 */
	// phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundBeforeLastUsed
	private function sanitize_value( $value ) {
		if ( is_bool( $value ) ) {
			return $value;
		}
		if ( is_numeric( $value ) ) {
			return $value;
		}
		if ( is_string( $value ) ) {
			return sanitize_text_field( $value );
		}
		if ( is_array( $value ) ) {
			return array_map( array( $this, 'sanitize_value' ), $value );
		}
		return sanitize_text_field( wp_unslash( (string) $value ) );
	}
}
