import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class ErrorBoundary extends Component {
	constructor( props ) {
		super( props );
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch( error, errorInfo ) {
		// eslint-disable-next-line no-console
		console.error( 'Lumora ErrorBoundary:', error, errorInfo );
	}

	render() {
		if ( this.state.hasError ) {
			return (
				<div className="lumora-error-boundary">
					<div className="lumora-error-boundary__content">
						<h2>{ __( 'Something went wrong', 'lumora' ) }</h2>
						<p>
							{ __(
								'An unexpected error occurred. Please try refreshing the page.',
								'lumora'
							) }
						</p>
						<button
							className="lumora-btn lumora-btn--primary"
							onClick={ () => window.location.reload() }
							type="button"
						>
							{ __( 'Reload page', 'lumora' ) }
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
