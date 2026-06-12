<?php
/**
 * White Label Module — Rebranding for Agencies
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\WhiteLabel;

defined( 'ABSPATH' ) || exit;

/**
 * White Label Module — Rebranding for Agencies
 *
 * @package Lumora
 * @since   1.0.0
 */
class White_Label {

	/**
	 * Singleton instance.
	 *
	 * @var White_Label|null
	 */
	private static ?White_Label $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @since 1.0.0
	 * @return White_Label
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
		add_filter( 'lumora_plugin_name', array( $this, 'filter_plugin_name' ) );
		add_filter( 'admin_footer_text', array( $this, 'filter_footer_text' ), 100 );
		add_action( 'admin_head', array( $this, 'inject_custom_css' ), 100 );
	}

	/**
	 * Get white label config.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_config(): array {
		$defaults = array(
			'enabled'       => false,
			'plugin_name'   => '',
			'primary_color' => '',
			'footer_text'   => '',
			'hide_branding' => false,
		);

		$config = get_option( 'lumora_white_label', array() );
		if ( ! is_array( $config ) ) {
			return $defaults;
		}

		return wp_parse_args( $config, $defaults );
	}

	/**
	 * Save white label config.
	 *
	 * @since 1.0.0
	 * @param array $data Configuration data.
	 * @return bool
	 */
	public function save_config( array $data ): bool {
		$config       = $this->get_config();
		$allowed_keys = array( 'enabled', 'plugin_name', 'primary_color', 'footer_text', 'hide_branding' );

		foreach ( $allowed_keys as $key ) {
			if ( isset( $data[ $key ] ) ) {
				$config[ $key ] = sanitize_text_field( $data[ $key ] );
			}
		}

		$config['enabled']       = ! empty( $config['enabled'] ) && 'false' !== $config['enabled'];
		$config['hide_branding'] = ! empty( $config['hide_branding'] ) && 'false' !== $config['hide_branding'];

		return update_option( 'lumora_white_label', $config );
	}

	/**
	 * Filter plugin name.
	 *
	 * @since 1.0.0
	 * @param string $name Original name.
	 * @return string
	 */
	public function filter_plugin_name( string $name ): string {
		$config = $this->get_config();
		if ( $config['enabled'] && ! empty( $config['plugin_name'] ) ) {
			return $config['plugin_name'];
		}
		return $name;
	}

	/**
	 * Filter footer text.
	 *
	 * @since 1.0.0
	 * @param string $text Original text.
	 * @return string
	 */
	public function filter_footer_text( string $text ): string {
		$config = $this->get_config();
		if ( $config['enabled'] && ! empty( $config['footer_text'] ) ) {
			return wp_kses_post( $config['footer_text'] );
		}
		return $text;
	}

	/**
	 * Inject custom CSS.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function inject_custom_css(): void {
		$config = $this->get_config();
		if ( ! $config['enabled'] ) {
			return;
		}

		$css = '';

		if ( ! empty( $config['primary_color'] ) ) {
			$primary = sanitize_hex_color( $config['primary_color'] );
			if ( $primary ) {
				$css .= sprintf(
					':root { --lumora-primary: %1$s; --lumora-primary-dark: %1$s; --lumora-border-focus: %1$s; }',
					esc_attr( $primary )
				);
			}
		}

		if ( $config['hide_branding'] ) {
			$css .= '.lumora-sidebar__title, .lumora-sidebar__logo { display: none !important; }';
		}

		if ( ! empty( $css ) ) {
			echo '<style id="lumora-white-label">' . $css . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput
		}
	}
}
