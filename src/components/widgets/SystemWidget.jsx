import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';

const SystemWidget = () => {
	const [ data, setData ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		apiFetch( { path: '/lumora/v1/widgets' } )
			.then( ( result ) => {
				const widgetData = result.widgets?.widget_system?.data;
				setData( widgetData );
				setIsLoading( false );
			} )
			.catch( () => setIsLoading( false ) );
	}, [] );

	if ( isLoading ) {
		return (
			<Card padding="md">
				<Skeleton.Text lines={ 4 } />
			</Card>
		);
	}

	return (
		<Card padding="md" hoverable>
			<Card.Header>
				<h4 className="lumora-text lumora-text--sm lumora-text--muted">
					{ __( 'System', 'lumora' ) }
				</h4>
			</Card.Header>
			<Card.Body>
				<div className="lumora-system-info">
					<div className="lumora-system-info__row">
						<span className="lumora-text lumora-text--xs lumora-text--muted">
							{ __( 'PHP', 'lumora' ) }
						</span>
						<span className="lumora-text lumora-text--sm">
							{ data?.phpVersion || '—' }
						</span>
					</div>
					<div className="lumora-system-info__row">
						<span className="lumora-text lumora-text--xs lumora-text--muted">
							{ __( 'WP', 'lumora' ) }
						</span>
						<span className="lumora-text lumora-text--sm">
							{ data?.wpVersion || '—' }
						</span>
					</div>
					<div className="lumora-system-info__row">
						<span className="lumora-text lumora-text--xs lumora-text--muted">
							{ __( 'Theme', 'lumora' ) }
						</span>
						<span className="lumora-text lumora-text--sm">
							{ data?.theme || '—' }
						</span>
					</div>
					<div className="lumora-system-info__row">
						<span className="lumora-text lumora-text--xs lumora-text--muted">
							{ __( 'Debug', 'lumora' ) }
						</span>
						<Badge
							variant={ data?.debugMode ? 'warning' : 'success' }
							size="xs"
						>
							{ data?.debugMode
								? __( 'ON', 'lumora' )
								: __( 'OFF', 'lumora' ) }
						</Badge>
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default SystemWidget;
