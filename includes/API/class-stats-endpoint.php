<?php
/**
 * Stats REST Endpoint — GET /lumora/v1/stats
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

defined( 'ABSPATH' ) || exit;

/**
 * Stats REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */
class Stats_Endpoint extends Rest_Controller {

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
		register_rest_route(
			$this->namespace,
			'/stats',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);
	}

	/**
	 * Get stats.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_items(): \WP_REST_Response {
		global $wpdb;

		$count_posts    = wp_count_posts();
		$count_pages    = wp_count_posts( 'page' );
		$count_comments = wp_count_comments();
		$count_users    = count_users();

		$recent_views = get_option( 'lumora_recent_views', 0 );

		$posts_by_status = array();
		$statuses        = get_post_stati( array( 'internal' => false ) );
		foreach ( $statuses as $status ) {
			if ( isset( $count_posts->$status ) && $count_posts->$status > 0 ) {
				$posts_by_status[ $status ] = (int) $count_posts->$status;
			}
		}

		return new \WP_REST_Response(
			array(
				'totalPosts'      => (int) ( $count_posts->publish ?? 0 ),
				'totalPages'      => (int) ( $count_pages->publish ?? 0 ),
				'totalComments'   => (int) ( $count_comments->approved ?? 0 ),
				'pendingComments' => (int) ( $count_comments->moderated ?? 0 ),
				'totalUsers'      => (int) ( $count_users['total_users'] ?? 0 ),
				'recentViews'     => (int) $recent_views,
				'postsByStatus'   => $posts_by_status,
				'wpVersion'       => get_bloginfo( 'version' ),
				'phpVersion'      => PHP_VERSION,
				'siteName'        => get_bloginfo( 'name' ),
				'siteUrl'         => home_url(),
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
