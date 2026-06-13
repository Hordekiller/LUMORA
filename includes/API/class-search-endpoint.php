<?php
/**
 * Search REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\API;

defined( 'ABSPATH' ) || exit;

/**
 * Search REST Endpoint
 *
 * @package Lumora
 * @since   1.0.0
 */
class Search_Endpoint extends Rest_Controller {

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	private string $namespace = 'lumora/v1';

	/**
	 * Register routes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/search',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'search' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'args'                => array(
						'q'    => array(
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'type' => array(
							'default'           => 'all',
							'sanitize_callback' => 'sanitize_key',
						),
					),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/commands',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_commands' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);
	}

	/**
	 * Search.
	 *
	 * @since 1.0.0
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function search( \WP_REST_Request $request ): \WP_REST_Response {
		$query = trim( $request->get_param( 'q' ) );
		$type  = $request->get_param( 'type' );

		$results = array();

		if ( in_array( $type, array( 'all', 'posts' ), true ) ) {
			$results['posts'] = $this->search_posts( $query );
		}

		if ( in_array( $type, array( 'all', 'pages' ), true ) ) {
			$results['pages'] = $this->search_pages( $query );
		}

		if ( in_array( $type, array( 'all', 'media' ), true ) ) {
			$results['media'] = $this->search_media( $query );
		}

		if ( in_array( $type, array( 'all', 'users' ), true ) ) {
			$results['users'] = $this->search_users( $query );
		}

		return new \WP_REST_Response(
			array(
				'query'   => $query,
				'results' => $results,
				'total'   => array_sum( array_map( 'count', $results ) ),
			),
			200
		);
	}

	/**
	 * Get commands.
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_commands(): \WP_REST_Response {
		$commands    = $this->get_lumora_commands();
		$wp_sections = $this->get_wp_sections();

		return new \WP_REST_Response(
			array(
				'commands' => $commands,
				'sections' => $wp_sections,
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

	/**
	 * Search posts.
	 *
	 * @since 1.0.0
	 * @param string $query Search query.
	 * @return array
	 */
	private function search_posts( string $query ): array {
		$posts = get_posts(
			array(
				's'              => $query,
				'post_type'      => 'post',
				'post_status'    => 'any',
				'posts_per_page' => 5,
				'orderby'        => 'relevance',
			)
		);

		return array_map(
			function ( $post ) {
				return array(
					'id'    => $post->ID,
					'title' => $post->post_title ? $post->post_title : __( '(no title)', 'lumora' ),
					'type'  => 'post',
					'url'   => get_edit_post_link( $post->ID ),
					'icon'  => 'post',
				);
			},
			$posts
		);
	}

	/**
	 * Search pages.
	 *
	 * @since 1.0.0
	 * @param string $query Search query.
	 * @return array
	 */
	private function search_pages( string $query ): array {
		$pages = get_posts(
			array(
				's'              => $query,
				'post_type'      => 'page',
				'post_status'    => 'any',
				'posts_per_page' => 5,
				'orderby'        => 'relevance',
			)
		);

		return array_map(
			function ( $page ) {
				return array(
					'id'    => $page->ID,
					'title' => $page->post_title ? $page->post_title : __( '(no title)', 'lumora' ),
					'type'  => 'page',
					'url'   => get_edit_post_link( $page->ID ),
					'icon'  => 'page',
				);
			},
			$pages
		);
	}

	/**
	 * Search media.
	 *
	 * @since 1.0.0
	 * @param string $query Search query.
	 * @return array
	 */
	private function search_media( string $query ): array {
		$media = get_posts(
			array(
				's'              => $query,
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'posts_per_page' => 5,
				'orderby'        => 'relevance',
			)
		);

		return array_map(
			function ( $item ) {
				$src = wp_get_attachment_image_url( $item->ID, 'thumbnail' );
				return array(
					'id'    => $item->ID,
					'title' => $item->post_title ? $item->post_title : wp_basename( $item->guid ),
					'type'  => 'media',
					'url'   => get_edit_post_link( $item->ID ),
					'icon'  => 'media',
					'thumb' => $src ? $src : '',
				);
			},
			$media
		);
	}

	/**
	 * Search users.
	 *
	 * @since 1.0.0
	 * @param string $query Search query.
	 * @return array
	 */
	private function search_users( string $query ): array {
		$users = get_users(
			array(
				'search'         => '*' . $query . '*',
				'search_columns' => array( 'user_login', 'user_nicename', 'user_email', 'display_name' ),
				'number'         => 5,
			)
		);

		return array_map(
			function ( $user ) {
				return array(
					'id'    => $user->ID,
					'title' => $user->display_name ? $user->display_name : $user->user_login,
					'type'  => 'user',
					'url'   => get_edit_user_link( $user->ID ),
					'icon'  => 'user',
					'email' => $user->user_email,
				);
			},
			$users
		);
	}

	/**
	 * Get Lumora commands.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	private function get_lumora_commands(): array {
		return array(
			array(
				'id'     => 'theme_toggle',
				'title'  => __( 'Toggle Dark/Light Mode', 'lumora' ),
				'type'   => 'command',
				'icon'   => 'command',
				'action' => 'lumora:toggle-theme',
			),
			array(
				'id'     => 'sidebar_toggle',
				'title'  => __( 'Toggle Sidebar', 'lumora' ),
				'type'   => 'command',
				'icon'   => 'command',
				'action' => 'lumora:toggle-sidebar',
			),
			array(
				'id'     => 'go_dashboard',
				'title'  => __( 'Go to Lumora Dashboard', 'lumora' ),
				'type'   => 'command',
				'icon'   => 'command',
				'action' => 'lumora:go-dashboard',
			),
			array(
				'id'     => 'go_settings',
				'title'  => __( 'Go to Lumora Settings', 'lumora' ),
				'type'   => 'command',
				'icon'   => 'command',
				'action' => 'lumora:go-settings',
			),
		);
	}

	/**
	 * Get WP admin sections.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	private function get_wp_sections(): array {
		return array(
			array(
				'id'    => 'wp_dashboard',
				'title' => __( 'WordPress Dashboard', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url(),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_posts',
				'title' => __( 'Posts', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'edit.php' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_media',
				'title' => __( 'Media Library', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'upload.php' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_pages',
				'title' => __( 'Pages', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'edit.php?post_type=page' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_comments',
				'title' => __( 'Comments', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'edit-comments.php' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_users',
				'title' => __( 'Users', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'users.php' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_plugins',
				'title' => __( 'Plugins', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'plugins.php' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_settings_general',
				'title' => __( 'General Settings', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'options-general.php' ),
				'icon'  => 'wp',
			),
			array(
				'id'    => 'wp_themes',
				'title' => __( 'Themes', 'lumora' ),
				'type'  => 'wp_section',
				'url'   => admin_url( 'themes.php' ),
				'icon'  => 'wp',
			),
		);
	}
}
