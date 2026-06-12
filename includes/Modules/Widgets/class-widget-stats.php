<?php
/**
 * Stats Widget
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Stats Widget
 *
 * @package Lumora
 * @since   1.0.0
 */
class Widget_Stats implements Widget_Interface {

	/**
	 * Get widget ID.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_id(): string {
		return 'widget_stats';
	}

	/**
	 * Get widget title.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_title(): string {
		return __( 'Site Stats', 'lumora' );
	}

	/**
	 * Get widget description.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_description(): string {
		return __( 'Displays site statistics summary.', 'lumora' );
	}

	/**
	 * Get widget data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_data(): array {
		$count_posts    = wp_count_posts();
		$count_comments = wp_count_comments();
		$count_users    = count_users();
		$count_terms    = wp_count_terms( 'category' );

		return array(
			'totalPosts'      => (int) ( $count_posts->publish ?? 0 ),
			'totalPages'      => (int) ( $count_posts->publish ?? 0 ),
			'totalComments'   => (int) ( $count_comments->approved ?? 0 ),
			'totalUsers'      => (int) ( $count_users['total_users'] ?? 0 ),
			'totalCategories' => ! is_wp_error( $count_terms ) ? (int) $count_terms : 0,
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
			'showChart' => true,
			'period'    => '7days',
		);
	}
}
