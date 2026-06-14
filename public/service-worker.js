const CACHE_NAME = 'lumora-v1';
const STATIC_ASSETS = [
	'/wp-admin/',
	'/wp-includes/css/buttons.min.css',
	'/wp-includes/css/dashicons.min.css',
];

// Install event — cache static assets.
self.addEventListener( 'install', ( event ) => {
	event.waitUntil(
		caches.open( CACHE_NAME ).then( ( cache ) => {
			return cache.addAll( STATIC_ASSETS );
		} )
	);
	self.skipWaiting();
} );

// Activate event — clean old caches.
self.addEventListener( 'activate', ( event ) => {
	event.waitUntil(
		caches.keys().then( ( keys ) => {
			return Promise.all(
				keys
					.filter( ( key ) => key !== CACHE_NAME )
					.map( ( key ) => caches.delete( key ) )
			);
		} )
	);
	self.clients.claim();
} );

// Fetch event — network-first for API, cache-first for static.
self.addEventListener( 'fetch', ( event ) => {
	const { request } = event;
	const url = new URL( request.url );

	// Skip non-GET requests.
	if ( request.method !== 'GET' ) {
		return;
	}

	// API requests: network-first with cache fallback.
	if ( url.pathname.includes( '/wp-json/lumora/' ) ) {
		event.respondWith(
			fetch( request )
				.then( ( response ) => {
					const clone = response.clone();
					caches.open( CACHE_NAME ).then( ( cache ) => {
						cache.put( request, clone );
					} );
					return response;
				} )
				.catch( () => caches.match( request ) )
		);
		return;
	}

	// Static assets: cache-first.
	event.respondWith(
		caches.match( request ).then( ( cached ) => {
			if ( cached ) {
				return cached;
			}
			return fetch( request ).then( ( response ) => {
				// Only cache same-origin successful responses.
				if (
					response.ok &&
					url.origin === self.location.origin &&
					response.type === 'basic'
				) {
					const clone = response.clone();
					caches.open( CACHE_NAME ).then( ( cache ) => {
						cache.put( request, clone );
					} );
				}
				return response;
			} );
		} )
	);
} );
