<?php
/**
 * Tests for Activator
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Tests;

use Lumora\Activator;

/**
 * @group lumora
 */
class Test_Activator extends \WP_UnitTestCase {

	public function setUp(): void {
		parent::setUp();
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	public function test_activate_creates_table(): void {
		global $wpdb;
		$table_name = $wpdb->prefix . 'lumora_widget_layouts';
		Activator::activate();
		$this->assertEquals(
			$table_name,
			$wpdb->get_var(
				$wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name )
			)
		);
	}

	public function test_activate_sets_default_options(): void {
		Activator::activate();
		$this->assertNotFalse( get_option( 'lumora_theme' ) );
		$this->assertEquals( 'light', get_option( 'lumora_theme' ) );
		$this->assertNotFalse( get_option( 'lumora_sidebar_collapsed' ) );
	}

	public function test_activate_adds_capability(): void {
		Activator::activate();
		$role = get_role( 'administrator' );
		$this->assertNotEmpty( $role );
		$this->assertTrue( $role->has_cap( 'manage_lumora' ) );
	}
}
