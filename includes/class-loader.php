<?php
/**
 * Action/Filter Registry
 *
 * @package Lumora
 * @since   1.0.0
 */

namespace Lumora;

defined( 'ABSPATH' ) || exit;

/**
 * Action/Filter Registry
 *
 * @package Lumora
 * @since   1.0.0
 */
final class Loader {

	/**
	 * Registered actions.
	 *
	 * @var array
	 */
	private array $actions = array();

	/**
	 * Registered filters.
	 *
	 * @var array
	 */
	private array $filters = array();

	/**
	 * Add an action.
	 *
	 * @since 1.0.0
	 * @param string $hook          Hook name.
	 * @param object $component     Component instance.
	 * @param string $callback      Callback method.
	 * @param int    $priority      Priority.
	 * @param int    $accepted_args Accepted args count.
	 * @return void
	 */
	public function add_action( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->actions[] = compact( 'hook', 'component', 'callback', 'priority', 'accepted_args' );
	}

	/**
	 * Add a filter.
	 *
	 * @since 1.0.0
	 * @param string $hook          Hook name.
	 * @param object $component     Component instance.
	 * @param string $callback      Callback method.
	 * @param int    $priority      Priority.
	 * @param int    $accepted_args Accepted args count.
	 * @return void
	 */
	public function add_filter( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->filters[] = compact( 'hook', 'component', 'callback', 'priority', 'accepted_args' );
	}

	/**
	 * Run all registered hooks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function run(): void {
		foreach ( $this->filters as $hook ) {
			add_filter(
				$hook['hook'],
				array( $hook['component'], $hook['callback'] ),
				$hook['priority'],
				$hook['accepted_args']
			);
		}

		foreach ( $this->actions as $hook ) {
			add_action(
				$hook['hook'],
				array( $hook['component'], $hook['callback'] ),
				$hook['priority'],
				$hook['accepted_args']
			);
		}
	}

	/**
	 * Get registered actions.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_actions(): array {
		return $this->actions;
	}

	/**
	 * Get registered filters.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function get_filters(): array {
		return $this->filters;
	}
}
