<?php
/**
 * Widget Interface
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Widget Interface
 *
 * All dashboard widgets must implement this interface.
 *
 * @package Lumora
 * @since   1.0.0
 */
interface Widget_Interface {

	/**
	 * Get widget unique ID.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_id(): string;

	/**
	 * Get widget display title.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_title(): string;

	/**
	 * Get widget description.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function get_description(): string;

	/**
	 * Get widget data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_data(): array;

	/**
	 * Get default config.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_default_config(): array;
}
