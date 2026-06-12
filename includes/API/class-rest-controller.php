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
class Rest_Controller {

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
	public function register_routes(): void {
		// Override in subclasses.
	}

	/**
	 * Check REST API permission.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function check_permission(): bool {
		return current_user_can( 'manage_options' );
	}
}
