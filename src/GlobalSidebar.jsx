import { useState, useCallback, render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const SVG_ICONS = {
	home: '<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
	grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
	settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>',
	menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
	edit: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
	media: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
	page: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
	comments: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
	appearance: '<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>',
	plugins: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>',
	users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
	tools: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
	products: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>',
	globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
	link: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
	download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
	upload: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
	database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
	network: '<rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><path d="M12 8v8"/><path d="M8 12h8"/>',
	chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
	megaphone: '<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/>',
	calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
	backup: '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
	wordpress: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10"/><path d="M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10"/>',
	update: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>',
	feedback: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
	airplane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
	awards: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
	bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
	building: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>',
	car: '<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-6H5.27a1 1 0 00-.98.8L4 9h4l-1 5h6l1-5h4l-1 5"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>',
	laptop: '<path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16"/>',
	microphone: '<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
	migrate: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
	palmtree: '<path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0116.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-4"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 4.24-4.24c1.96 1.96 1.8 5.28-.36 7.43"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>',
	pede: '<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
	tickets: '<path d="M2 9a3 3 0 010 6v5a2 2 0 002 2h16a2 2 0 002-2v-5a3 3 0 010-6V4a2 2 0 00-2-2H4a2 2 0 00-2 2z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
	chevron_right: '<polyline points="9 18 15 12 9 6"/>',
	chevron_left: '<polyline points="15 18 9 12 15 6"/>',
};

const LUMORA_ITEMS = [
	{ icon: 'home', label: 'Dashboard', url: '/wp-admin/admin.php?page=lumora' },
	{ icon: 'grid', label: 'Widgets', url: '/wp-admin/admin.php?page=lumora' },
	{ icon: 'settings', label: 'Settings', url: '/wp-admin/admin.php?page=lumora' },
	{ icon: 'menu', label: 'Menu Manager', url: '/wp-admin/admin.php?page=lumora' },
	{ icon: 'settings', label: 'White Label', url: '/wp-admin/admin.php?page=lumora' },
];

function getIcon( name ) {
	return SVG_ICONS[ name ] || SVG_ICONS.settings;
}

function Icon( { name, size = 20 } ) {
	const svg = getIcon( name );
	return (
		<span
			className="lumora-g-icon"
			style={ { width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } }
			dangerouslySetInnerHTML={ {
				__html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ svg }</svg>`,
			} }
		/>
	);
}

function Sidebar() {
	const [ expanded, setExpanded ] = useState( null );

	const adminUrl = window.lumoraData?.adminUrl || '/wp-admin/';
	const adminMenu = window.lumoraData?.adminMenu || [];
	const isRtl = window.lumoraData?.isRtl || false;
	const isLumoraPage =
		document.body.classList.contains( 'toplevel_page_lumora' ) ||
		document.querySelector( '#lumora-root' ) !== null;

	const toggleSub = useCallback( ( id ) => {
		setExpanded( ( prev ) => ( prev === id ? null : id ) );
	}, [] );

	if ( isLumoraPage ) {
		return null;
	}

	return (
		<div
			className="lumora-global-sidebar"
			dir={ isRtl ? 'rtl' : 'ltr' }
			style={ {
				position: 'fixed',
				top: '32px',
				left: isRtl ? 'auto' : 0,
				right: isRtl ? 0 : 'auto',
				bottom: 0,
				width: '160px',
				background: 'var(--lumora-sidebar-bg)',
				zIndex: 100001,
				overflowY: 'auto',
				overflowX: 'hidden',
				fontFamily: 'var(--lumora-font-sans)',
			} }
		>
			<div
				style={ {
					display: 'flex',
					alignItems: 'center',
					padding: '12px',
					borderBottom: '1px solid rgba(255,255,255,0.08)',
					height: '48px',
				} }
			>
				<div
					style={ {
						width: '28px',
						height: '28px',
						background: 'var(--lumora-primary)',
						borderRadius: '6px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 800,
						fontSize: '14px',
						color: '#fff',
						flexShrink: 0,
					} }
				>
					L
				</div>
			</div>

			<nav style={ { padding: '8px' } }>
				<ul style={ { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' } }>
					{ LUMORA_ITEMS.map( ( item ) => (
						<li key={ item.label }>
							<a
								href={ adminUrl + item.url.replace( adminUrl, '' ) }
								style={ {
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									padding: '6px 8px',
									borderRadius: '6px',
									color: 'var(--lumora-sidebar-text)',
									textDecoration: 'none',
									fontSize: '12px',
									opacity: 0.75,
									transition: 'all 150ms',
								} }
								onMouseEnter={ ( e ) => {
									e.currentTarget.style.opacity = '1';
									e.currentTarget.style.background = 'var(--lumora-sidebar-hover)';
								} }
								onMouseLeave={ ( e ) => {
									e.currentTarget.style.opacity = '0.75';
									e.currentTarget.style.background = 'transparent';
								} }
							>
								<Icon name={ item.icon } size={ 18 } />
								<span style={ { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }>
									{ item.label }
								</span>
							</a>
						</li>
					) ) }

					{ adminMenu.length > 0 && (
						<li style={ margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' } />
					) }

					{ adminMenu.map( ( item ) => (
						<li key={ item.id }>
							{ item.sub && item.sub.length > 0 ? (
								<>
									<button
										onClick={ () => toggleSub( item.id ) }
										style={ {
											display: 'flex',
											alignItems: 'center',
											gap: '8px',
											padding: '6px 8px',
											borderRadius: '6px',
											color: 'var(--lumora-sidebar-text)',
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											fontSize: '12px',
											width: '100%',
											textAlign: 'left',
											opacity: 0.75,
											transition: 'all 150ms',
										} }
										onMouseEnter={ ( e ) => {
											e.currentTarget.style.opacity = '1';
											e.currentTarget.style.background = 'var(--lumora-sidebar-hover)';
										} }
										onMouseLeave={ ( e ) => {
											e.currentTarget.style.opacity = '0.75';
											e.currentTarget.style.background = 'none';
										} }
									>
										<Icon name={ item.icon } size={ 18 } />
										<span style={ { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: isRtl ? 'right' : 'left' } }>
											{ item.title }
										</span>
										<Icon name={ expanded === item.id ? 'chevron_right' : 'chevron_left' } size={ 12 } />
									</button>
									{ expanded === item.id && (
										<ul style={ { listStyle: 'none', margin: 0, padding: 0 } }>
											{ item.sub.map( ( sub ) => (
												<li key={ sub.url }>
													<a
														href={ sub.url }
														style={ {
															display: 'block',
															padding: '4px 8px 4px 34px',
															color: 'var(--lumora-gray-400)',
															textDecoration: 'none',
															fontSize: '11px',
															opacity: 0.6,
															transition: 'all 150ms',
														} }
														onMouseEnter={ ( e ) => {
															e.currentTarget.style.opacity = '1';
															e.currentTarget.style.color = '#fff';
															e.currentTarget.style.background = 'var(--lumora-sidebar-hover)';
														} }
														onMouseLeave={ ( e ) => {
															e.currentTarget.style.opacity = '0.6';
															e.currentTarget.style.color = 'var(--lumora-gray-400)';
															e.currentTarget.style.background = 'none';
														} }
													>
														{ sub.title }
													</a>
												</li>
											) ) }
										</ul>
									) }
								</>
							) : (
								<a
									href={ item.url }
									style={ {
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										padding: '6px 8px',
										borderRadius: '6px',
										color: 'var(--lumora-sidebar-text)',
										textDecoration: 'none',
										fontSize: '12px',
										opacity: 0.75,
										transition: 'all 150ms',
									} }
									onMouseEnter={ ( e ) => {
										e.currentTarget.style.opacity = '1';
										e.currentTarget.style.background = 'var(--lumora-sidebar-hover)';
									} }
									onMouseLeave={ ( e ) => {
										e.currentTarget.style.opacity = '0.75';
										e.currentTarget.style.background = 'transparent';
									} }
								>
									<Icon name={ item.icon } size={ 18 } />
									<span style={ { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }>
										{ item.title }
									</span>
								</a>
							) }
						</li>
					) ) }
				</ul>
			</nav>
		</div>
	);
}

function mountGlobalSidebar() {
	const existing = document.getElementById( 'lumora-global-sidebar-root' );
	if ( existing ) {
		return;
	}

	const container = document.createElement( 'div' );
	container.id = 'lumora-global-sidebar-root';
	document.body.appendChild( container );

	render( <Sidebar />, container );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', mountGlobalSidebar );
} else {
	mountGlobalSidebar();
}
