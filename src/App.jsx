import {
	useState,
	useEffect,
	useCallback,
	lazy,
	Suspense,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CommandPalette from './components/command-palette/CommandPalette';
import { ToastProvider } from './components/ui/Toast';
import useMediaQuery from './hooks/useMediaQuery';
import { registerGlobalShortcut } from './hooks/useKeyboard';

const Dashboard = lazy( () =>
	import(
		/* webpackChunkName: "page-dashboard" */ './components/dashboard/Dashboard'
	)
);
const Settings = lazy( () =>
	import(
		/* webpackChunkName: "page-settings" */ './components/settings/Settings'
	)
);
const MenuManager = lazy( () =>
	import(
		/* webpackChunkName: "page-menu" */ './components/menu-manager/MenuManager'
	)
);
const WhiteLabel = lazy( () =>
	import(
		/* webpackChunkName: "page-whitelabel" */ './components/settings/WhiteLabel'
	)
);

const PAGES = {
	dashboard: Dashboard,
	settings: Settings,
	menu: MenuManager,
	whitelabel: WhiteLabel,
};

const App = () => {
	const [ currentPage, setCurrentPage ] = useState( 'dashboard' );
	const [ sidebarCollapsed, setSidebarCollapsed ] = useState( false );
	const [ mobileOpen, setMobileOpen ] = useState( false );
	const [ paletteOpen, setPaletteOpen ] = useState( false );
	const isMobile = useMediaQuery( '(max-width: 767px)' );

	const settings = useSelect(
		( select ) => select( 'lumora/settings' ).getSettings(),
		[]
	);
	const { saveSettings, fetchSettings } = useDispatch( 'lumora/settings' );

	const theme = settings?.theme || 'light';

	useEffect( () => {
		fetchSettings();
	}, [ fetchSettings ] );

	useEffect( () => {
		document.documentElement.setAttribute( 'data-lumora-theme', theme );
	}, [ theme ] );

	useEffect( () => {
		registerGlobalShortcut( 'Ctrl+K', () => {
			setPaletteOpen( ( prev ) => ! prev );
		} );
	}, [] );

	const toggleSidebar = useCallback( () => {
		const next = ! sidebarCollapsed;
		setSidebarCollapsed( next );
		saveSettings( { sidebar_collapsed: next } );
	}, [ sidebarCollapsed, saveSettings ] );

	const toggleMobile = useCallback( () => {
		setMobileOpen( ( prev ) => ! prev );
	}, [] );

	const handleThemeToggle = useCallback( () => {
		const next = theme === 'dark' ? 'light' : 'dark';
		saveSettings( { theme: next } );
	}, [ theme, saveSettings ] );

	const navigate = useCallback(
		( page ) => {
			setCurrentPage( page );
			if ( isMobile ) {
				setMobileOpen( false );
			}
		},
		[ isMobile ]
	);

	const handleCommand = useCallback(
		( action ) => {
			switch ( action ) {
				case 'lumora:toggle-theme':
					handleThemeToggle();
					break;
				case 'lumora:toggle-sidebar':
					toggleSidebar();
					break;
				case 'lumora:go-dashboard':
					navigate( 'dashboard' );
					break;
				case 'lumora:go-settings':
					navigate( 'settings' );
					break;
			}
		},
		[ handleThemeToggle, toggleSidebar, navigate ]
	);

	const sidebarVisible = isMobile ? mobileOpen : true;
	const PageComponent = PAGES[ currentPage ] || Dashboard;

	return (
		<ToastProvider>
			<div
				className={ `lumora-app ${
					theme === 'dark' ? 'lumora-dark' : ''
				}` }
				dir={ document.documentElement.dir || 'ltr' }
			>
				<Sidebar
					collapsed={ sidebarCollapsed }
					visible={ sidebarVisible }
					onToggle={ toggleSidebar }
					onClose={ () => setMobileOpen( false ) }
					isMobile={ isMobile }
					currentPage={ currentPage }
					onNavigate={ navigate }
				/>
				<div
					className={ `lumora-main ${
						sidebarCollapsed
							? 'lumora-main--collapsed'
							: 'lumora-main--expanded'
					}` }
				>
					<Header
						onMenuToggle={ toggleMobile }
						onThemeToggle={ handleThemeToggle }
						theme={ theme }
						sidebarCollapsed={ sidebarCollapsed }
						onSearchClick={ () => setPaletteOpen( true ) }
					/>
					<main className="lumora-content">
						<Suspense
							fallback={
								<div className="lumora-content__loading">
									<span className="lumora-spinner" />
								</div>
							}
						>
							<PageComponent />
						</Suspense>
					</main>
				</div>
				{ isMobile && mobileOpen && (
					<div
						className="lumora-overlay"
						onClick={ () => setMobileOpen( false ) }
						aria-hidden="true"
					/>
				) }
				<CommandPalette
					isOpen={ paletteOpen }
					onClose={ () => setPaletteOpen( false ) }
					onCommand={ handleCommand }
				/>
			</div>
		</ToastProvider>
	);
};

export default App;
