import { useState, useEffect } from '@wordpress/element';
import { getStats } from '../utils/api';

export default function useStats() {
	const [ stats, setStats ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		let mounted = true;

		getStats()
			.then( ( data ) => {
				if ( mounted ) {
					setStats( data );
					setIsLoading( false );
				}
			} )
			.catch( ( err ) => {
				if ( mounted ) {
					setError( err.message );
					setIsLoading( false );
				}
			} );

		return () => {
			mounted = false;
		};
	}, [] );

	return { stats, isLoading, error };
}
