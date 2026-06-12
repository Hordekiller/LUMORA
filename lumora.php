<?php
/**
 * Lumora — Modern WordPress Admin Dashboard
 *
 * @package           Lumora
 * @author            Lumora Team
 * @copyright         2025 Lumora
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Lumora
 * Plugin URI:        https://github.com/Hordekiller/LUMORA
 * Description:       A revolutionary WordPress admin dashboard — modern, ultra-responsive, with a unique visual design.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Lumora Team
 * Author URI:        https://github.com/Hordekiller/LUMORA
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       lumora
 * Domain Path:       /languages
 */

defined( 'ABSPATH' ) || exit;

/**
 * Check minimum PHP version.
 */
if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
	add_action(
		'admin_notices',
		function () {
			$message = sprintf(
				/* translators: %s: PHP version */
				esc_html__( 'Lumora requires PHP 7.4 or higher. You are running %s.', 'lumora' ),
				PHP_VERSION
			);
			printf( '<div class="notice notice-error"><p>%s</p></div>', esc_html( $message ) );
		}
	);
	return;
}

/**
 * Check minimum WordPress version.
 */
global $wp_version;
if ( version_compare( $wp_version, '6.0', '<' ) ) {
		add_action(
			'admin_notices',
			function () use ( $wp_version ) {
				$message = sprintf(
					/* translators: %s: WordPress version */
					esc_html__( 'Lumora requires WordPress 6.0 or higher. You are running %s.', 'lumora' ),
					$wp_version
				);
				printf( '<div class="notice notice-error"><p>%s</p></div>', esc_html( $message ) );
			}
		);
	return;
}

/**
 * Define plugin constants.
 */
define( 'LUMORA_VERSION', '1.0.0' );
define( 'LUMORA_PLUGIN_FILE', __FILE__ );
define( 'LUMORA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'LUMORA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'LUMORA_PLUGIN_BASE', plugin_basename( __FILE__ ) );
define( 'LUMORA_MIN_PHP', '7.4' );
define( 'LUMORA_MIN_WP', '6.0' );

/**
 * Custom autoloader for WordPress-style file naming (class-{name}.php).
 * Falls back to Composer PSR-4 autoloader if file not found.
 */
spl_autoload_register(
	function ( string $qualified_class ): void {
		$prefix = 'Lumora\\';
		if ( 0 !== strpos( $qualified_class, $prefix ) ) {
				return;
		}

		$relative_class = substr( $qualified_class, strlen( $prefix ) );
		$parts          = explode( '\\', $relative_class );
		$class_name     = array_pop( $parts );
		$namespace_dir  = ! empty( $parts ) ? implode( '/', $parts ) . '/' : '';

		$file = LUMORA_PLUGIN_DIR . 'includes/' . $namespace_dir . 'class-' . str_replace( '_', '-', strtolower( $class_name ) ) . '.php';

		if ( file_exists( $file ) ) {
			require_once $file;
		}
	}
);

/**
 * Autoloader via Composer (PSR-4).
 */
if ( file_exists( LUMORA_PLUGIN_DIR . 'vendor/autoload.php' ) ) {
	require_once LUMORA_PLUGIN_DIR . 'vendor/autoload.php';
}

/**
 * Register activation and deactivation hooks.
 */
register_activation_hook( __FILE__, array( Lumora\Activator::class, 'activate' ) );
register_deactivation_hook( __FILE__, array( Lumora\Deactivator::class, 'deactivate' ) );

/**
 * Bootstrap the plugin.
 *
 * @since 1.0.0
 */
function lumora(): Lumora\Lumora {
	return Lumora\Lumora::get_instance();
}

lumora();
