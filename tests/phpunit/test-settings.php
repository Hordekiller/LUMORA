<?php
/**
 * Tests for Settings
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Tests;

use Lumora\Core\Settings;

/**
 * @group lumora
 */
class Test_Settings extends \WP_UnitTestCase {

	private Settings $settings;

	public function setUp(): void {
		parent::setUp();
		$this->settings = new Settings();
	}

	public function test_set_and_get(): void {
		$result = $this->settings->set( 'test_key', 'test_value' );
		$this->assertTrue( $result );
		$this->assertEquals( 'test_value', $this->settings->get( 'test_key' ) );
	}

	public function test_has(): void {
		$this->settings->set( 'exists', 'yes' );
		$this->assertTrue( $this->settings->has( 'exists' ) );
		$this->assertFalse( $this->settings->has( 'does_not_exist' ) );
	}

	public function test_delete(): void {
		$this->settings->set( 'to_delete', 'value' );
		$this->assertTrue( $this->settings->has( 'to_delete' ) );
		$this->settings->delete( 'to_delete' );
		$this->assertFalse( $this->settings->has( 'to_delete' ) );
	}

	public function test_get_default(): void {
		$this->assertEquals( 'default', $this->settings->get( 'non_existent', 'default' ) );
	}
}
