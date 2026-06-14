<?php
/**
 * Main Lumora Class
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora;

defined( 'ABSPATH' ) || exit;

/**
 * Main Lumora Class
 *
 * @package Lumora
 * @since   1.0.0
 */
final class Lumora {

	/**
	 * Singleton instance.
	 *
	 * @var Lumora|null
	 */
	private static ?self $instance = null;

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	public string $version = LUMORA_VERSION;

	/**
	 * Hook loader.
	 *
	 * @var Loader
	 */
	private Loader $loader;

	/**
	 * Get singleton instance.
	 *
	 * @since 1.0.0
	 * @return Lumora
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
		$this->loader = new Loader();
		$this->define_constants();
		$this->load_dependencies();
		$this->set_locale();
		$this->define_hooks();
		$this->loader->run();
	}

	/**
	 * Prevent cloning.
	 *
	 * @since 1.0.0
	 */
	private function __clone() {}

	/**
	 * Prevent unserialization.
	 *
	 * @since 1.0.0
	 * @return void
	 * @throws \Exception If attempt to unserialize singleton.
	 */
	public function __wakeup() {
		throw new \Exception( 'Cannot unserialize singleton.' );
	}

	/**
	 * Get the loader.
	 *
	 * @since 1.0.0
	 * @return Loader
	 */
	public function get_loader(): Loader {
		return $this->loader;
	}

	/**
	 * Define plugin constants.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function define_constants(): void {
		if ( ! defined( 'LUMORA_VERSION' ) ) {
			define( 'LUMORA_VERSION', '1.0.0' );
		}
		if ( ! defined( 'LUMORA_PLUGIN_FILE' ) ) {
			define( 'LUMORA_PLUGIN_FILE', '' );
		}
	}

	/**
	 * Load dependencies.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function load_dependencies(): void {
		// Dependencies loaded via Composer autoloader in lumora.php.
		if ( ! defined( 'LUMORA_PLUGIN_DIR' ) ) {
			define( 'LUMORA_PLUGIN_DIR', plugin_dir_path( __DIR__ ) );
		}
	}

	/**
	 * Set locale.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function set_locale(): void {
		$plugin_i18n = new Core\I18n();
		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Define hooks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function define_hooks(): void {
		$plugin_admin = new Admin\Admin( $this->get_loader() );
		$plugin_admin->register_hooks();

		$plugin_assets = new Admin\Assets();
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_assets, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_assets, 'enqueue_scripts' );

		$settings_endpoint = new API\Settings_Endpoint();
		$this->loader->add_action( 'rest_api_init', $settings_endpoint, 'register_routes' );

		$widgets_endpoint = new API\Widgets_Endpoint();
		$this->loader->add_action( 'rest_api_init', $widgets_endpoint, 'register_routes' );

		$stats_endpoint = new API\Stats_Endpoint();
		$this->loader->add_action( 'rest_api_init', $stats_endpoint, 'register_routes' );

		$search_endpoint = new API\Search_Endpoint();
		$this->loader->add_action( 'rest_api_init', $search_endpoint, 'register_routes' );

		$this->loader->add_action( 'admin_footer', Modules\CommandPalette\Command_Palette::get_instance(), 'render_commands_script' );

		$menu_endpoint = new API\Menu_Endpoint();
		$this->loader->add_action( 'rest_api_init', $menu_endpoint, 'register_routes' );

		Modules\WhiteLabel\White_Label::get_instance();

		$dashboard_endpoint = new API\Dashboard_Endpoint();
		$this->loader->add_action( 'rest_api_init', $dashboard_endpoint, 'register_routes' );

		// Load WP-CLI commands.
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			require_once LUMORA_PLUGIN_DIR . 'includes/CLI/class-lumora-command.php';
		}
	}
}
