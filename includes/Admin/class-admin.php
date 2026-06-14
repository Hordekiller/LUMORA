<?php
/**
 * Admin Menu & Page Registration
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Admin;

use Lumora\Loader;

defined( 'ABSPATH' ) || exit;

/**
 * Admin Menu & Page Registration
 *
 * @package Lumora
 * @since   1.0.0
 */
class Admin {

	/**
	 * Hook loader.
	 *
	 * @var Loader
	 */
	private Loader $loader;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 * @param Loader $loader Hook loader.
	 */
	public function __construct( Loader $loader ) {
		$this->loader = $loader;
	}

	/**
	 * Register admin hooks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_hooks(): void {
		$this->loader->add_action( 'admin_menu', $this, 'add_admin_menu' );
		$this->loader->add_filter( 'admin_body_class', $this, 'add_body_class', 10, 1 );
	}

	/**
	 * Add admin menu page.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function add_admin_menu(): void {
		add_menu_page(
			esc_html__( 'Lumora Dashboard', 'lumora' ),
			esc_html__( 'Lumora', 'lumora' ),
			'manage_lumora',
			'lumora',
			array( $this, 'render_dashboard' ),
			'data:image/svg+xml;base64,' . base64_encode( $this->get_menu_icon() ),
			2
		);
	}

	/**
	 * Add body class to identify Lumora page.
	 *
	 * @since 1.0.0
	 * @param string $classes Body classes.
	 * @return string
	 */
	public function add_body_class( string $classes ): string {
		$screen = get_current_screen();
		if ( ! $screen ) {
			return $classes;
		}

		// Add global sidebar class on ALL admin pages.
		$classes .= ' lumora-admin-global';

		// Add active class only on Lumora page.
		if ( 'toplevel_page_lumora' === $screen->id ) {
			$classes .= ' lumora-active';
		}

		return $classes;
	}

	/**
	 * Render dashboard.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function render_dashboard(): void {
		?>
		<div id="lumora-root" class="lumora-app"></div>
		<?php
	}

	/**
	 * Get menu icon SVG.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function get_menu_icon(): string {
		return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
	}
}
