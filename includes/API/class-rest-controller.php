<?php
/**
 * Base REST Controller
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

defined( 'ABSPATH' ) || exit;

/**
 * Base REST Controller
 *
 * @package Lumora
 * @since   1.0.0
 */
abstract class Rest_Controller {

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	protected string $namespace = 'lumora/v1';

	/**
	 * Register routes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	abstract public function register_routes(): void;

	/**
	 * Check REST API permission.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function check_permission(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Build a success response.
	 *
	 * @since 1.0.0
	 * @param array $data Response data.
	 * @param int   $status HTTP status code.
	 * @return \WP_REST_Response
	 */
	protected function success( array $data = array(), int $status = 200 ): \WP_REST_Response {
		return new \WP_REST_Response( $data, $status );
	}

	/**
	 * Build an error response.
	 *
	 * @since 1.0.0
	 * @param string $message Error message.
	 * @param int    $status HTTP status code.
	 * @return \WP_REST_Response
	 */
	protected function error( string $message, int $status = 400 ): \WP_REST_Response {
		return new \WP_REST_Response( array( 'message' => $message ), $status );
	}
}
