<?php
/**
 * Menu Manager — Reorder & Hide Admin Menu Items
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\MenuManager;

defined( 'ABSPATH' ) || exit;

/**
 * Menu Manager — Reorder & Hide Admin Menu Items
 *
 * @package Lumora
 * @since   1.0.0
 */
class Menu_Manager {

	private const META_KEY_GLOBAL = 'lumora_menu_config';
	private const META_KEY_USER   = 'lumora_menu_config';

	/**
	 * Singleton instance.
	 *
	 * @var Menu_Manager|null
	 */
	private static ?Menu_Manager $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @since 1.0.0
	 * @return Menu_Manager
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
		add_action( 'admin_menu', array( $this, 'apply_custom_menu' ), 999 );
	}

	/**
	 * Get menu items.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_menu_items(): array {
		global $menu, $submenu;

		$items = array();

		foreach ( $menu as $item ) {
			if ( ! isset( $item[0] ) || empty( $item[0] ) ) {
				continue;
			}

			if ( isset( $item[4] ) && false !== strpos( $item[4], 'wp-menu-separator' ) ) {
				continue;
			}

			$menu_slug = $item[2] ?? '';
			if ( ! $menu_slug ) {
				continue;
			}

			$children = array();
			if ( isset( $submenu[ $menu_slug ] ) && is_array( $submenu[ $menu_slug ] ) ) {
				foreach ( $submenu[ $menu_slug ] as $child ) {
					$children[] = array(
						'title'      => preg_replace( '/<[^>]*>/', '', $child[0] ?? '' ),
						'slug'       => $child[2] ?? '',
						'capability' => $child[1] ?? '',
					);
				}
			}

			$items[] = array(
				'id'         => 'menu_' . sanitize_key( $menu_slug ),
				'title'      => preg_replace( '/<[^>]*>/', '', $item[0] ?? '' ),
				'slug'       => $menu_slug,
				'icon'       => $this->get_menu_icon( $item[6] ?? '' ),
				'capability' => $item[1] ?? 'read',
				'children'   => $children,
			);
		}

		return $items;
	}

	/**
	 * Get menu config.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_config(): array {
		$config = get_option( self::META_KEY_GLOBAL, array() );
		if ( ! is_array( $config ) ) {
			$config = array();
		}

		$user_config = get_user_meta( get_current_user_id(), self::META_KEY_USER, true );
		if ( is_array( $user_config ) && ! empty( $user_config ) ) {
			$config = array_merge( $config, $user_config );
		}

		return $config;
	}

	/**
	 * Save menu config.
	 *
	 * @since 1.0.0
	 * @param array $config Configuration data.
	 * @param bool  $is_global Whether to save as global.
	 * @return bool
	 */
	public function save_config( array $config, bool $is_global = false ): bool {
		if ( $is_global ) {
			return update_option( self::META_KEY_GLOBAL, $config );
		}

		return (bool) update_user_meta( get_current_user_id(), self::META_KEY_USER, $config );
	}

	/**
	 * Apply custom menu order/hiding.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function apply_custom_menu(): void {
		$config = $this->get_config();

		if ( empty( $config ) || ! isset( $config['order'] ) ) {
			return;
		}

		global $menu, $submenu;

		$hidden = $config['hidden'] ?? array();
		$order  = $config['order'] ?? array();

		$ordered_menu = array();
		$remaining    = array();

		foreach ( $menu as $item ) {
			$slug = $item[2] ?? '';
			$id   = 'menu_' . sanitize_key( $slug );

			if ( in_array( $id, $hidden, true ) ) {
				continue;
			}

			$ordered_menu[] = $item;
		}

		$menu = $ordered_menu; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
	}

	/**
	 * Get menu icon.
	 *
	 * @since 1.0.0
	 * @param string $icon Icon string.
	 * @return string
	 */
	private function get_menu_icon( string $icon ): string {
		if ( ! $icon ) {
			return 'dashicons-admin-generic';
		}

		if ( 0 === strpos( $icon, 'data:' ) ) {
			return 'custom';
		}

		if ( 0 === strpos( $icon, 'dashicons' ) ) {
			return $icon;
		}

		return 'dashicons-admin-generic';
	}
}
