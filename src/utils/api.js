const BASE_URL =
	window.lumoraData?.restUrl || `${ window.wpApiSettings?.root }lumora/v1/`;
const TTL = 30000;

const cache = new Map();

const getCached = ( key ) => {
	const entry = cache.get( key );
	if ( entry && Date.now() - entry.timestamp < TTL ) {
		return entry.data;
	}
	return null;
};

const setCached = ( key, data ) => {
	cache.set( key, { data, timestamp: Date.now() } );
};

const invalidateCache = ( prefix ) => {
	for ( const key of cache.keys() ) {
		if ( key.startsWith( prefix ) ) {
			cache.delete( key );
		}
	}
};

const apiFetch = async ( path, options = {} ) => {
	const cacheKey = `${ options.method || 'GET' }:${ path }`;
	const isGet = ! options.method || options.method === 'GET';

	if ( isGet ) {
		const cached = getCached( cacheKey );
		if ( cached ) {
			return cached;
		}
	}

	const response = await fetch( `${ BASE_URL }${ path }`, {
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce':
				window.lumoraData?.nonce || window.wpApiSettings?.nonce,
		},
		...options,
	} );

	if ( ! response.ok ) {
		const error = await response.json().catch( () => ( {} ) );
		throw new Error( error.message || `HTTP ${ response.status }` );
	}

	const data = await response.json();

	if ( isGet ) {
		setCached( cacheKey, data );
	} else {
		const parts = path.split( '/' ).filter( Boolean );
		if ( parts.length >= 1 ) {
			invalidateCache( '/' + parts[ 0 ] );
		}
	}

	return data;
};

export const getSettings = () => apiFetch( '/settings' );
export const updateSettings = ( data ) =>
	apiFetch( '/settings', {
		method: 'POST',
		body: JSON.stringify( data ),
	} );
export const getWidgets = () => apiFetch( '/widgets' );
export const updateWidgets = ( layout ) =>
	apiFetch( '/widgets', {
		method: 'POST',
		body: JSON.stringify( { layout } ),
	} );
export const getStats = () => apiFetch( '/stats' );

const api = {
	get: ( path ) => apiFetch( path ),
	post: ( path, data ) =>
		apiFetch( path, {
			method: 'POST',
			body: JSON.stringify( data ),
		} ),
	put: ( path, data ) =>
		apiFetch( path, {
			method: 'PUT',
			body: JSON.stringify( data ),
		} ),
	delete: ( path ) =>
		apiFetch( path, {
			method: 'DELETE',
		} ),
};

export default api;
