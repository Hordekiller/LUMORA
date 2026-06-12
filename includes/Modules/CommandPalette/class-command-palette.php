<?php
/**
 * Command Palette Module
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\CommandPalette;

defined( 'ABSPATH' ) || exit;

/**
 * Command Palette Module
 *
 * @package Lumora
 * @since   1.0.0
 */
class Command_Palette {

	/**
	 * Singleton instance.
	 *
	 * @var Command_Palette|null
	 */
	private static ?Command_Palette $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @since 1.0.0
	 * @return Command_Palette
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
	private function __construct() {}

	/**
	 * Render commands inline script.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function render_commands_script(): void {
		$commands = $this->get_static_commands();
		wp_add_inline_script(
			'lumora-admin',
			'window.lumoraCommands = ' . wp_json_encode( $commands ) . ';',
			'before'
		);
	}

	/**
	 * Get static commands.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_static_commands(): array {
		return array(
			array(
				'id'     => 'add_new_post',
				'title'  => __( 'Add New Post', 'lumora' ),
				'type'   => 'wp_section',
				'url'    => admin_url( 'post-new.php' ),
				'icon'   => 'wp',
				'hotkey' => '',
			),
			array(
				'id'     => 'add_new_page',
				'title'  => __( 'Add New Page', 'lumora' ),
				'type'   => 'wp_section',
				'url'    => admin_url( 'post-new.php?post_type=page' ),
				'icon'   => 'wp',
				'hotkey' => '',
			),
			array(
				'id'     => 'upload_media',
				'title'  => __( 'Upload Media', 'lumora' ),
				'type'   => 'wp_section',
				'url'    => admin_url( 'media-new.php' ),
				'icon'   => 'wp',
				'hotkey' => '',
			),
		);
	}
}
