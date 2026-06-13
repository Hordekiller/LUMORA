<?php
/**
 * Menu Manager REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

use Lumora\Modules\MenuManager\Menu_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Menu Manager REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */
class Menu_Endpoint extends Rest_Controller {

	/**
	 * Menu manager instance.
	 *
	 * @var Menu_Manager
	 */
	private Menu_Manager $manager;

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
		$this->manager = Menu_Manager::get_instance();
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
			'/menu',
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
					'args'                => array(
						'order'  => array(
							'type'     => 'array',
							'items'    => array( 'type' => 'string' ),
							'required' => false,
						),
						'hidden' => array(
							'type'     => 'array',
							'items'    => array( 'type' => 'string' ),
							'required' => false,
						),
						'global' => array(
							'type'    => 'boolean',
							'default' => false,
						),
					),
				),
			)
		);
	}

	/**
	 * Get menu items.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_items(): \WP_REST_Response {
		$items  = $this->manager->get_menu_items();
		$config = $this->manager->get_config();

		$items_with_config = array_map(
			function ( $item ) use ( $config ) {
				$item['visible'] = ! in_array( $item['id'], $config['hidden'] ?? array(), true );
				$item['order']   = array_search( $item['id'], $config['order'] ?? array(), true );
				return $item;
			},
			$items
		);

		if ( ! empty( $config['order'] ) ) {
			usort(
				$items_with_config,
				function ( $a, $b ) {
					$a_order = false === $a['order'] ? PHP_INT_MAX : $a['order'];
					$b_order = false === $b['order'] ? PHP_INT_MAX : $b['order'];
					return $a_order - $b_order;
				}
			);
		}

		return new \WP_REST_Response(
			array(
				'items'  => $items_with_config,
				'config' => $config,
			),
			200
		);
	}

	/**
	 * Update menu items.
	 *
	 * @since 1.0.0
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_items( \WP_REST_Request $request ): \WP_REST_Response {
		$config = array();

		if ( $request->has_param( 'order' ) ) {
			$config['order'] = array_map( 'sanitize_key', $request->get_param( 'order' ) );
		}

		if ( $request->has_param( 'hidden' ) ) {
			$config['hidden'] = array_map( 'sanitize_key', $request->get_param( 'hidden' ) );
		}

		$global = (bool) $request->get_param( 'global' );
		$this->manager->save_config( $config, $global );

		return new \WP_REST_Response(
			array(
				'message' => __( 'Menu configuration saved.', 'lumora' ),
				'config'  => $this->manager->get_config(),
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
