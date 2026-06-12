<?php
/**
 * Comments Widget
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Comments Widget
 *
 * @package Lumora
 * @since   1.0.0
 */
class Widget_Comments implements Widget_Interface {

	/**
	 * Get widget ID.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_id(): string {
		return 'widget_comments';
	}

	/**
	 * Get widget title.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_title(): string {
		return __( 'Recent Comments', 'lumora' );
	}

	/**
	 * Get widget description.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_description(): string {
		return __( 'Latest comments across your site.', 'lumora' );
	}

	/**
	 * Get widget data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_data(): array {
		$comments = get_comments(
			array(
				'number'  => 5,
				'status'  => 'approve',
				'orderby' => 'comment_date',
				'order'   => 'DESC',
			)
		);

		$items = array();
		foreach ( $comments as $comment ) {
			$items[] = array(
				'id'      => $comment->comment_ID,
				'author'  => $comment->comment_author ? $comment->comment_author : __( 'Anonymous', 'lumora' ),
				'email'   => $comment->comment_author_email,
				'content' => wp_trim_words( $comment->comment_content, 20, '…' ),
				'date'    => get_comment_date( get_option( 'date_format' ), $comment->comment_ID ),
				'post'    => get_the_title( $comment->comment_post_ID ),
				'link'    => get_edit_comment_link( $comment->comment_ID ),
			);
		}

		$count = wp_count_comments();

		return array(
			'items'         => $items,
			'totalApproved' => (int) ( $count->approved ?? 0 ),
			'totalPending'  => (int) ( $count->moderated ?? 0 ),
			'totalSpam'     => (int) ( $count->spam ?? 0 ),
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
