<?php
/**
 * Dashboard REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

use Lumora\Modules\Dashboard\Dashboard;

defined( 'ABSPATH' ) || exit;

/**
 * Dashboard REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */
class Dashboard_Endpoint extends Rest_Controller {

	/**
	 * Dashboard module instance.
	 *
	 * @var Dashboard
	 */
	private Dashboard $dashboard;

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
		$this->dashboard = Dashboard::get_instance();
	}

	/**
	 * Register REST routes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/dashboard',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/dashboard/welcome',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'dismiss_welcome' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/dashboard/config',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_config' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_config' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/dashboard/system-status',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_system_status' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);
	}

	/**
	 * Get dashboard data.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_items(): \WP_REST_Response {
		return new \WP_REST_Response(
			array(
				'welcome'       => $this->dashboard->get_welcome_data(),
				'quick_actions' => $this->dashboard->get_quick_actions(),
				'config'        => $this->dashboard->get_dashboard_config(),
			),
			200
		);
	}

	/**
	 * Dismiss welcome screen.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function dismiss_welcome(): \WP_REST_Response {
		$this->dashboard->dismiss_welcome();
		return new \WP_REST_Response(
			array( 'message' => __( 'Welcome dismissed.', 'lumora' ) ),
			200
		);
	}

	/**
	 * Get dashboard configuration.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_config(): \WP_REST_Response {
		return new \WP_REST_Response(
			$this->dashboard->get_dashboard_config(),
			200
		);
	}

	/**
	 * Update dashboard configuration.
	 *
	 * @since 1.0.0
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_config( \WP_REST_Request $request ): \WP_REST_Response {
		$params = $request->get_json_params();

		if ( empty( $params ) || ! is_array( $params ) ) {
			return $this->error( __( 'Invalid request body.', 'lumora' ), 400 );
		}

		$sanitized = array();
		$allowed   = array( 'show_quick_actions', 'show_welcome', 'show_system_status' );
		foreach ( $params as $key => $value ) {
			if ( in_array( $key, $allowed, true ) ) {
				$sanitized[ $key ] = (bool) $value;
			}
		}

		$this->dashboard->save_dashboard_config( $sanitized );

		return $this->success(
			array(
				'message' => __( 'Dashboard config updated.', 'lumora' ),
				'config'  => $this->dashboard->get_dashboard_config(),
			)
		);
	}

	/**
	 * Get system status.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_system_status(): \WP_REST_Response {
		return new \WP_REST_Response(
			$this->dashboard->get_system_status(),
			200
		);
	}

	/**
	 * Check permission.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	// Inherits check_permission() from Rest_Controller.
}
