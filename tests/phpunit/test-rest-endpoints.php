<?php
/**
 * Tests for REST Endpoints
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora\Tests;

/**
 * @group lumora
 * @group rest
 */
class Test_Rest_Endpoints extends \WP_Test_REST_TestCase {

	protected string $namespace = 'lumora/v1';

	public function setUp(): void {
		parent::setUp();
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
	}

	public function test_settings_endpoint_exists(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/settings' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_stats_endpoint_exists(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/stats' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'totalPosts', $data );
	}

	public function test_widgets_endpoint_exists(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/widgets' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_search_endpoint_requires_query(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/search' );
		$response = rest_do_request( $request );
		$this->assertEquals( 400, $response->get_status() );
	}

	public function test_search_endpoint_with_query(): void {
		$request = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/search' );
		$request->set_param( 'q', 'test' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_menu_endpoint_exists(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/menu' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_commands_endpoint_exists(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/commands' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_dashboard_endpoint_exists(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/dashboard' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'welcome', $data );
		$this->assertArrayHasKey( 'quick_actions', $data );
		$this->assertArrayHasKey( 'config', $data );
	}

	public function test_dashboard_welcome_dismiss(): void {
		$request  = new \WP_REST_Request( 'POST', '/' . $this->namespace . '/dashboard/welcome' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_dashboard_config_get(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/dashboard/config' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
	}

	public function test_dashboard_config_update(): void {
		$request = new \WP_REST_Request( 'POST', '/' . $this->namespace . '/dashboard/config' );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body( json_encode( array( 'show_system_status' => true ) ) );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertTrue( $data['config']['show_system_status'] );
	}

	public function test_system_status_endpoint(): void {
		$request  = new \WP_REST_Request( 'GET', '/' . $this->namespace . '/dashboard/system-status' );
		$response = rest_do_request( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'php', $data );
		$this->assertArrayHasKey( 'wp', $data );
		$this->assertArrayHasKey( 'server', $data );
	}
}
