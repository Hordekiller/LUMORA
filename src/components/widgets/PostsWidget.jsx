import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

const PostsWidget = () => {
	const [ data, setData ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		apiFetch( { path: '/lumora/v1/widgets' } )
			.then( ( result ) => {
				const widgetData = result.widgets?.widget_posts?.data;
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

	const posts = data?.items || [];

	return (
		<Card padding="md" hoverable>
			<Card.Header>
				<div className="lumora-card__header-row">
					<h4 className="lumora-text lumora-text--sm lumora-text--muted">
						{ __( 'Recent Posts', 'lumora' ) }
					</h4>
					<span className="lumora-text lumora-text--xs lumora-text--disabled">
						{ data?.total ?? 0 }
					</span>
				</div>
			</Card.Header>
			<Card.Body>
				{ posts.length === 0 ? (
					<p className="lumora-text lumora-text--sm lumora-text--muted">
						{ __( 'No posts found.', 'lumora' ) }
					</p>
				) : (
					<ul className="lumora-list">
						{ posts.map( ( post ) => (
							<li key={ post.id } className="lumora-list__item">
								<a
									href={ post.link }
									className="lumora-text lumora-text--sm"
									target="_blank"
									rel="noopener noreferrer"
								>
									{ post.title }
								</a>
								<p className="lumora-text lumora-text--xs lumora-text--muted">
									{ post.date }
								</p>
							</li>
						) ) }
					</ul>
				) }
			</Card.Body>
		</Card>
	);
};

export default PostsWidget;
