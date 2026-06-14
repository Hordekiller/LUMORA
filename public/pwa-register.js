/**
 * Register the Lumora service worker for PWA support.
 *
 * @since 1.0.0
 */
( function () {
	if ( 'serviceWorker' in navigator ) {
		window.addEventListener( 'load', function () {
			navigator.serviceWorker
				.register( '/wp-content/plugins/lumora/public/service-worker.js' )
				.then( function ( registration ) {
					// eslint-disable-next-line no-console
					console.log(
						'Lumora SW registered: ',
						registration.scope
					);
				} )
				.catch( function ( error ) {
					// eslint-disable-next-line no-console
					console.log( 'Lumora SW registration failed: ', error );
				} );
		} );
	}
} )();
