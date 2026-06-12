import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

const CommentsWidget = () => {
	const [ data, setData ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		apiFetch( { path: '/lumora/v1/widgets' } )
			.then( ( result ) => {
				const widgetData = result.widgets?.widget_comments?.data;
				setData( widgetData );
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

	const comments = data?.items || [];

	return (
		<Card padding="md" hoverable>
			<Card.Header>
				<div className="lumora-card__header-row">
					<h4 className="lumora-text lumora-text--sm lumora-text--muted">
						{ __( 'Recent Comments', 'lumora' ) }
					</h4>
					<span className="lumora-text lumora-text--xs lumora-text--disabled">
						{ __( 'Approved', 'lumora' ) }:{ ' ' }
						{ data?.totalApproved ?? 0 }
					</span>
				</div>
			</Card.Header>
			<Card.Body>
				{ comments.length === 0 ? (
					<p className="lumora-text lumora-text--sm lumora-text--muted">
						{ __( 'No comments yet.', 'lumora' ) }
					</p>
				) : (
					<ul className="lumora-list">
						{ comments.map( ( comment ) => (
							<li
								key={ comment.id }
								className="lumora-list__item"
							>
								<p className="lumora-text lumora-text--sm">
									{ comment.author }
								</p>
								<p className="lumora-text lumora-text--xs lumora-text--muted">
									{ comment.content }
								</p>
							</li>
						) ) }
					</ul>
				) }
			</Card.Body>
		</Card>
	);
};

export default CommentsWidget;
