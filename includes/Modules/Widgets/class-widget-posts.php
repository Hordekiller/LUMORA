<?php
/**
 * Posts Widget
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Posts Widget
 *
 * @package Lumora
 * @since   1.0.0
 */
class Widget_Posts implements Widget_Interface {

	/**
	 * Get widget ID.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_id(): string {
		return 'widget_posts';
	}

	/**
	 * Get widget title.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_title(): string {
		return __( 'Recent Posts', 'lumora' );
	}

	/**
	 * Get widget description.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_description(): string {
		return __( 'Shows your most recent published posts.', 'lumora' );
	}

	/**
	 * Get widget data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_data(): array {
		$posts = get_posts(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => 5,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$items = array();
		foreach ( $posts as $post ) {
			$items[] = array(
				'id'     => $post->ID,
				'title'  => $post->post_title ? $post->post_title : __( '(no title)', 'lumora' ),
				'link'   => get_edit_post_link( $post->ID ),
				'date'   => get_the_date( get_option( 'date_format' ), $post->ID ),
				'status' => $post->post_status,
			);
		}

		return array(
			'items' => $items,
			'total' => wp_count_posts()->publish ?? 0,
		);
	}

	/**
	 * Get default config.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_default_config(): array {
		return array(
			'limit' => 5,
		);
	}
}
