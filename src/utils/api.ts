interface FetchOptions extends Omit< RequestInit, 'method' | 'body' > {
	method?: string;
	body?: any;
}

interface CacheEntry {
	data: unknown;
	timestamp: number;
}

const BASE_URL: string =
	window.lumoraData?.restUrl || `${ window.wpApiSettings?.root }lumora/v1/`;
const TTL = 30000;

const cache = new Map< string, CacheEntry >();

const getCached = < T >( key: string ): T | null => {
	const entry = cache.get( key );
	if ( entry && Date.now() - entry.timestamp < TTL ) {
		return entry.data as T;
	}
	return null;
};

const setCached = ( key: string, data: unknown ): void => {
	cache.set( key, { data, timestamp: Date.now() } );
};

const invalidateCache = ( prefix: string ): void => {
	for ( const key of cache.keys() ) {
		if ( key.startsWith( prefix ) ) {
			cache.delete( key );
		}
	}
};

const apiFetch = async < T = unknown >(
	path: string,
	options: FetchOptions = {}
): Promise< T > => {
	const cacheKey = `${ options.method || 'GET' }:${ path }`;
	const isGet = ! options.method || options.method === 'GET';

	if ( isGet ) {
		const cached = getCached< T >( cacheKey );
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

	const data: T = await response.json();

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

export const getSettings = (): Promise< unknown > => apiFetch( '/settings' );
export const updateSettings = (
	data: Record< string, unknown >
): Promise< unknown > =>
	apiFetch( '/settings', {
		method: 'POST',
		body: JSON.stringify( data ),
	} );
export const getWidgets = (): Promise< unknown > => apiFetch( '/widgets' );
export const updateWidgets = ( layout: unknown ): Promise< unknown > =>
	apiFetch( '/widgets', {
		method: 'POST',
		body: JSON.stringify( { layout } ),
	} );
export const getStats = (): Promise< unknown > => apiFetch( '/stats' );

const api = {
	get: < T = unknown >( path: string ): Promise< T > => apiFetch< T >( path ),
	post: < T = unknown >( path: string, data: unknown ): Promise< T > =>
		apiFetch< T >( path, {
			method: 'POST',
			body: JSON.stringify( data ),
		} ),
	put: < T = unknown >( path: string, data: unknown ): Promise< T > =>
		apiFetch< T >( path, {
			method: 'PUT',
			body: JSON.stringify( data ),
		} ),
	delete: < T = unknown >( path: string ): Promise< T > =>
		apiFetch< T >( path, {
			method: 'DELETE',
		} ),
};

export default api;
