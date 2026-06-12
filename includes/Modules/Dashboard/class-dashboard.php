<?php
/**
 * Dashboard Module Controller
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Modules\Dashboard;

defined( 'ABSPATH' ) || exit;

/**
 * Dashboard Module Controller
 *
 * @package Lumora
 * @since   1.0.0
 */
class Dashboard {

	/**
	 * Singleton instance.
	 *
	 * @var Dashboard|null
	 */
	private static ?Dashboard $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @since 1.0.0
	 * @return Dashboard
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
		add_action( 'admin_init', array( $this, 'maybe_redirect_on_first_activation' ) );
	}

	/**
	 * Get welcome screen data.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_welcome_data(): array {
		$dismissed = get_user_meta( get_current_user_id(), 'lumora_welcome_dismissed', true );

		return array(
			'show_welcome'   => empty( $dismissed ),
			'plugin_version' => LUMORA_VERSION,
			'php_version'    => PHP_VERSION,
			'wp_version'     => get_bloginfo( 'version' ),
			'theme'          => wp_get_theme()->get( 'Name' ),
			'locale'         => get_locale(),
		);
	}

	/**
	 * Dismiss welcome screen.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function dismiss_welcome(): bool {
		return (bool) update_user_meta( get_current_user_id(), 'lumora_welcome_dismissed', true );
	}

	/**
	 * Get quick actions.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_quick_actions(): array {
		return array(
			array(
				'id'    => 'new_post',
				'title' => __( 'New Post', 'lumora' ),
				'icon'  => 'edit',
				'url'   => admin_url( 'post-new.php' ),
				'color' => '#6366f1',
			),
			array(
				'id'    => 'new_page',
				'title' => __( 'New Page', 'lumora' ),
				'icon'  => 'page',
				'url'   => admin_url( 'post-new.php?post_type=page' ),
				'color' => '#06b6d4',
			),
			array(
				'id'    => 'upload_media',
				'title' => __( 'Upload Media', 'lumora' ),
				'icon'  => 'media',
				'url'   => admin_url( 'media-new.php' ),
				'color' => '#10b981',
			),
			array(
				'id'    => 'view_site',
				'title' => __( 'View Site', 'lumora' ),
				'icon'  => 'external',
				'url'   => home_url(),
				'color' => '#f59e0b',
			),
		);
	}

	/**
	 * Get system status.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_system_status(): array {
		global $wpdb;

		return array(
			'php'    => array(
				'version'    => PHP_VERSION,
				'memory'     => $this->format_memory( ini_get( 'memory_limit' ) ),
				'max_exec'   => ini_get( 'max_execution_time' ),
				'upload_max' => ini_get( 'upload_max_filesize' ),
				'post_max'   => ini_get( 'post_max_size' ),
			),
			'wp'     => array(
				'version'      => get_bloginfo( 'version' ),
				'multisite'    => is_multisite(),
				'memory_limit' => defined( 'WP_MEMORY_LIMIT' ) ? WP_MEMORY_LIMIT : '—',
				'debug'        => defined( 'WP_DEBUG' ) && WP_DEBUG,
				'cache'        => defined( 'WP_CACHE' ) && WP_CACHE,
				'cron'         => ! defined( 'DISABLE_WP_CRON' ) || ! DISABLE_WP_CRON,
			),
			'server' => array(
				'software' => sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ?? '' ) ),
				'db'       => $wpdb->db_version(),
				'php_exts' => array(
					'json'     => extension_loaded( 'json' ),
					'mbstring' => extension_loaded( 'mbstring' ),
					'zip'      => extension_loaded( 'zip' ),
					'curl'     => extension_loaded( 'curl' ),
					'gd'       => extension_loaded( 'gd' ),
					'xml'      => extension_loaded( 'xml' ),
				),
			),
		);
	}

	public function get_dashboard_config(): array {
		$defaults = array(
			'show_quick_actions' => true,
			'show_welcome'       => true,
			'show_system_status' => false,
		);

		$config = get_user_meta( get_current_user_id(), 'lumora_dashboard_config', true );
		if ( ! is_array( $config ) ) {
			return $defaults;
		}

		return wp_parse_args( $config, $defaults );
	}

	public function save_dashboard_config( array $config ): bool {
		$existing     = $this->get_dashboard_config();
		$allowed_keys = array( 'show_quick_actions', 'show_welcome', 'show_system_status' );

		foreach ( $allowed_keys as $key ) {
			if ( isset( $config[ $key ] ) ) {
				$existing[ $key ] = (bool) $config[ $key ];
			}
		}

		return (bool) update_user_meta( get_current_user_id(), 'lumora_dashboard_config', $existing );
	}

	public function maybe_redirect_on_first_activation(): void {
		if ( ! get_option( 'lumora_activation_redirect', false ) ) {
			return;
		}

		delete_option( 'lumora_activation_redirect' );

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		if ( isset( $_GET['activate-multi'] ) ) {
			return;
		}

		wp_safe_redirect( admin_url( 'admin.php?page=lumora' ) );
		exit;
	}

	private function format_memory( string $memory ): string {
		if ( preg_match( '/^(\d+)([KMG])$/i', $memory, $matches ) ) {
			$units = array(
				'K' => 0,
				'M' => 1,
				'G' => 2,
			);
			$bytes = intval( $matches[1] ) * pow( 1024, $units[ strtoupper( $matches[2] ) ] );
			return size_format( $bytes );
		}
		return $memory;
	}
}
