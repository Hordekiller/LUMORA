import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useToast } from '../ui/Toast';
import api from '../../utils/api';

const WelcomeScreen = ( { onDismiss } ) => {
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ dismissing, setDismissing ] = useState( false );
	const toast = useToast();

	const handleDismiss = useCallback( async () => {
		setDismissing( true );
		try {
			await api.post( '/dashboard/welcome', {} );
			toast.success(
				__(
					'Welcome dismissed. You can re-enable it from settings.',
					'lumora'
				)
			);
			setTimeout( () => onDismiss(), 300 );
		} catch {
			toast.error( __( 'Failed to dismiss welcome.', 'lumora' ) );
			setDismissing( false );
		}
	}, [ onDismiss, toast ] );

	useEffect( () => {
		const handleKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				handleDismiss();
			}
		};
		document.addEventListener( 'keydown', handleKey );
		return () => document.removeEventListener( 'keydown', handleKey );
	}, [ handleDismiss ] );

	useEffect( () => {
		api.get( '/dashboard' )
			.then( ( res ) => setData( res.welcome ) )
			.catch( () => {
				setData( { show_welcome: false } );
			} )
			.finally( () => setLoading( false ) );
	}, [] );

	if ( loading || ! data?.show_welcome ) {
		return null;
	}

	const steps = [
		{
			icon: 'dashboard',
			title: __( 'Overview at a Glance', 'lumora' ),
			desc: __(
				'View your site stats, recent posts, and comments from one place.',
				'lumora'
			),
		},
		{
			icon: 'menu',
			title: __( 'Customize Your Menu', 'lumora' ),
			desc: __(
				'Re-order, hide, or rename admin menu items to match your workflow.',
				'lumora'
			),
		},
		{
			icon: 'art',
			title: __( 'White-Label Everything', 'lumora' ),
			desc: __(
				'Rebrand the admin with your custom colors, logo, and plugin name.',
				'lumora'
			),
		},
		{
			icon: 'search',
			title: __( 'Command Palette', 'lumora' ),
			desc: __(
				'Press Ctrl+K (Cmd+K on Mac) to quickly navigate anywhere.',
				'lumora'
			),
		},
	];

	return (
		<div className="lumora-welcome-overlay">
			<div className="lumora-welcome">
				<div className="lumora-welcome__header">
					<span className="lumora-welcome__logo">L</span>
					<h2>{ __( 'Welcome to Lumora', 'lumora' ) }</h2>
					<p className="lumora-welcome__subtitle">
						{ __(
							'Your all-in-one WordPress admin experience, reimagined.',
							'lumora'
						) }
					</p>
				</div>

				<div className="lumora-welcome__steps">
					{ steps.map( ( step ) => (
						<div key={ step.icon } className="lumora-welcome__step">
							<span
								className={ `dashicons dashicons-${ step.icon } lumora-welcome__step-icon` }
							/>
							<div>
								<strong>{ step.title }</strong>
								<p>{ step.desc }</p>
							</div>
						</div>
					) ) }
				</div>

				<div className="lumora-welcome__footer">
					<button
						className="components-button is-primary"
						onClick={ handleDismiss }
						disabled={ dismissing }
						type="button"
					>
						{ dismissing
							? __( 'Dismissing…', 'lumora' )
							: __( 'Get Started', 'lumora' ) }
					</button>
				</div>
			</div>
		</div>
	);
};

export default WelcomeScreen;
