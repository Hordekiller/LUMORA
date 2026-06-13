<?php
/**
 * Widgets REST Endpoint — CRUD /lumora/v1/widgets
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

use Lumora\Modules\Widgets\Widget_Engine;

defined( 'ABSPATH' ) || exit;

/**
 * Widgets REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */
class Widgets_Endpoint extends Rest_Controller {

	/**
	 * Widget engine instance.
	 *
	 * @var Widget_Engine
	 */
	private Widget_Engine $engine;

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
		$this->engine = Widget_Engine::get_instance();
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
			'/widgets',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_items' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);
	}

	/**
	 * Get widgets.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_items(): \WP_REST_Response {
		$user_id = get_current_user_id();

		return new \WP_REST_Response(
			array(
				'widgets' => $this->engine->get_widgets_data(),
				'layout'  => $this->engine->get_user_layout( $user_id ),
			),
			200
		);
	}

	/**
	 * Update widgets.
	 *
	 * @since 1.0.0
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_items( \WP_REST_Request $request ): \WP_REST_Response {
		$user_id = get_current_user_id();
		$params  = $request->get_json_params();

		if ( isset( $params['layout'] ) && is_array( $params['layout'] ) ) {
			$sanitized = array();
			foreach ( $params['layout'] as $widget_id ) {
				$sanitized[] = sanitize_key( $widget_id );
			}
			$this->engine->save_user_layout( $sanitized, $user_id );
		}

		if ( isset( $params['config'] ) && is_array( $params['config'] ) ) {
			$existing = get_user_meta( $user_id, 'lumora_widget_config', true );
			if ( ! is_array( $existing ) ) {
				$existing = array();
			}
			$merged = array_merge( $existing, $params['config'] );
			update_user_meta( $user_id, 'lumora_widget_config', $merged );
		}

		return new \WP_REST_Response(
			array(
				'widgets' => $this->engine->get_widgets_data(),
				'layout'  => $this->engine->get_user_layout( $user_id ),
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
	// Inherits check_permission() from Rest_Controller.
}
