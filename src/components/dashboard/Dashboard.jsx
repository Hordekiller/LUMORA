import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import WidgetGrid from './WidgetGrid';
import WelcomeScreen from './WelcomeScreen';
import SystemStatus from './SystemStatus';
import Toggle from '../ui/Toggle';
import api from '../../utils/api';

const Dashboard = () => {
	const [ welcomeDismissed, setWelcomeDismissed ] = useState( false );
	const [ config, setConfig ] = useState( null );

	const widgets = useSelect(
		( select ) => select( 'lumora/widgets' ).getWidgets(),
		[]
	);
	const layout = useSelect(
		( select ) => select( 'lumora/widgets' ).getLayout(),
		[]
	);
	const isLoading = useSelect(
		( select ) => select( 'lumora/widgets' ).isLoading(),
		[]
	);
	const settings = useSelect(
		( select ) => select( 'lumora/settings' ).getSettings(),
		[]
	);
	const { fetchWidgets, saveLayout } = useDispatch( 'lumora/widgets' );

	useEffect( () => {
		fetchWidgets();
	}, [ fetchWidgets ] );

	useEffect( () => {
		api.get( '/dashboard/config' )
			.then( setConfig )
			.catch( () => {
				setConfig( { show_system_status: true } );
			} );
	}, [] );

	useEffect( () => {
		if ( window.location.hash !== '#widgets' ) {
			return;
		}

		const widgetsSection = document.getElementById( 'lumora-widgets' );
		if ( widgetsSection ) {
			widgetsSection.scrollIntoView( { block: 'start' } );
		}
	}, [ isLoading ] );

	const handleLayoutChange = ( newLayout ) => {
		saveLayout( newLayout );
	};

	const toggleSystemStatus = async () => {
		const next = ! config?.show_system_status;
		try {
			const res = await api.post( '/dashboard/config', {
				show_system_status: next,
			} );
			setConfig( res.config );
		} catch ( err ) {
			setConfig( ( prev ) => ( {
				...prev,
				show_system_status: next,
			} ) );
		}
	};

	const showSysStatus = config?.show_system_status;
	const widgetsEnabled = settings?.widgets_enabled !== false;

	return (
		<div className="lumora-dashboard">
			{ ! welcomeDismissed && (
				<WelcomeScreen
					onDismiss={ () => setWelcomeDismissed( true ) }
				/>
			) }

			<div className="lumora-dashboard__header">
				<h1 className="lumora-heading lumora-heading--2">
					{ __( 'Dashboard', 'lumora' ) }
				</h1>
				<p className="lumora-text lumora-text--muted">
					{ __( 'Welcome to your Lumora dashboard.', 'lumora' ) }
				</p>
			</div>

			<div className="lumora-dashboard__toolbar">
				<Toggle
					checked={ showSysStatus }
					onChange={ toggleSystemStatus }
					label={ __( 'Show System Status', 'lumora' ) }
				/>
			</div>

			{ showSysStatus && <SystemStatus /> }

			{ widgetsEnabled && (
				<WidgetGrid
					widgets={ Object.values( widgets ) }
					layout={ layout }
					onLayoutChange={ handleLayoutChange }
					isLoading={ isLoading }
				/>
			) }
		</div>
	);
};

export default Dashboard;
