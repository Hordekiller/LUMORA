<?php
/**
 * Uninstall Cleanup
 *
 * @package Lumora
 * @since   1.0.0
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

global $wpdb;

$lumora_options = array(
	'lumora_theme',
	'lumora_sidebar_collapsed',
	'lumora_widgets_enabled',
	'lumora_command_palette',
	'lumora_settings',
);

foreach ( $lumora_options as $option ) {
	delete_option( $option );
}

$table_name = $wpdb->prefix . 'lumora_widget_layouts';
$wpdb->query(
	$wpdb->prepare( 'DROP TABLE IF EXISTS %i', $table_name )
);

$admin_role = get_role( 'administrator' );
if ( $admin_role ) {
	$admin_role->remove_cap( 'manage_lumora' );
}

delete_metadata( 'user', 0, 'lumora_widget_layout', '', true );
delete_metadata( 'user', 0, 'lumora_sidebar_collapsed', '', true );
