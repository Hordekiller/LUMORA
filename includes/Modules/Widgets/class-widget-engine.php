<?php
/**
 * Widget Engine — Registration + Render
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Widget Engine — Registration + Render
 *
 * @package Lumora
 * @since   1.0.0
 */
class Widget_Engine {

	/**
	 * Singleton instance.
	 *
	 * @var Widget_Engine|null
	 */
	private static ?Widget_Engine $instance = null;

	/**
	 * Registered widgets.
	 *
	 * @var array
	 */
	private array $widgets = array();

	/**
	 * Get singleton instance.
	 *
	 * @since 1.0.0
	 * @return Widget_Engine
	 */
	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->register_core_widgets();
	}

	/**
	 * Get all registered widgets.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_all_widgets(): array {
		return apply_filters( 'lumora_register_widgets', $this->widgets );
	}

	/**
	 * Get a widget by ID.
	 *
	 * @since 1.0.0
	 * @param string $id Widget ID.
	 * @return Widget_Interface|null
	 */
	public function get_widget( string $id ): ?Widget_Interface {
		$widgets = $this->get_all_widgets();
		return $widgets[ $id ] ?? null;
	}

	/**
	 * Get all widget data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_widgets_data(): array {
		$data = array();
		foreach ( $this->get_all_widgets() as $id => $widget ) {
			$data[ $id ] = array(
				'id'          => $widget->get_id(),
				'title'       => $widget->get_title(),
				'description' => $widget->get_description(),
				'data'        => $widget->get_data(),
				'config'      => $widget->get_default_config(),
			);
		}
		return $data;
	}

	/**
	 * Get user layout.
	 *
	 * @since 1.0.0
	 * @param int $user_id User ID.
	 * @return array
	 */
	public function get_user_layout( int $user_id = 0 ): array {
		if ( ! $user_id ) {
			$user_id = get_current_user_id();
		}
		$layout = get_user_meta( $user_id, 'lumora_widget_layout', true );
		if ( ! is_array( $layout ) || empty( $layout ) ) {
			$layout = $this->get_default_layout();
		}
		return $layout;
	}

	/**
	 * Save user layout.
	 *
	 * @since 1.0.0
	 * @param array $layout  Layout data.
	 * @param int   $user_id User ID.
	 * @return bool
	 */
	public function save_user_layout( array $layout, int $user_id = 0 ): bool {
		if ( ! $user_id ) {
			$user_id = get_current_user_id();
		}
		return (bool) update_user_meta( $user_id, 'lumora_widget_layout', $layout );
	}

	/**
	 * Get default layout.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_default_layout(): array {
		return array_keys( $this->get_widgets_data() );
	}

	/**
	 * Register core widgets.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function register_core_widgets(): void {
		$this->widgets = array();

		add_filter(
			'lumora_register_widgets',
			function ( array $widgets ): array {
				$widgets['widget_stats']    = new Widget_Stats();
				$widgets['widget_posts']    = new Widget_Posts();
				$widgets['widget_system']   = new Widget_System();
				$widgets['widget_comments'] = new Widget_Comments();
				return $widgets;
			}
		);
	}
}
