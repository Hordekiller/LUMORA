import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

const StatsWidget = () => {
	const [ stats, setStats ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		apiFetch( { path: '/lumora/v1/stats' } )
			.then( ( data ) => {
				setStats( data );
				setIsLoading( false );
			} )
			.catch( () => setIsLoading( false ) );
	}, [] );

	if ( isLoading ) {
		return (
			<Card padding="md">
				<Skeleton.Text lines={ 3 } />
			</Card>
		);
	}

	const items = [
		{ label: __( 'Posts', 'lumora' ), value: stats?.totalPosts ?? 0 },
		{ label: __( 'Comments', 'lumora' ), value: stats?.totalComments ?? 0 },
		{ label: __( 'Users', 'lumora' ), value: stats?.totalUsers ?? 0 },
	];

	return (
		<Card padding="md" hoverable>
			<Card.Header>
				<h4 className="lumora-text lumora-text--sm lumora-text--muted">
					{ __( 'Site Stats', 'lumora' ) }
				</h4>
			</Card.Header>
			<Card.Body>
				{ items.map( ( item ) => (
					<div key={ item.label } className="lumora-stat-row">
						<span className="lumora-text lumora-text--xs lumora-text--muted">
							{ item.label }
						</span>
						<span className="lumora-heading lumora-heading--4">
							{ item.value.toLocaleString() }
						</span>
					</div>
				) ) }
			</Card.Body>
		</Card>
	);
};

export default StatsWidget;
