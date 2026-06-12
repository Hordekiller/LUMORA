<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Lumora
 * @since   1.0.0
 */

defined( 'ABSPATH' ) || exit;

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php\n";
	exit( 1 );
}

require_once $_tests_dir . '/includes/functions.php';

function _manually_load_plugin(): void {
	require dirname( dirname( __DIR__ ) ) . '/lumora.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

require $_tests_dir . '/includes/bootstrap.php';
