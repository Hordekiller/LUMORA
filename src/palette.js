import {
	render,
	createElement,
	useState,
	useEffect,
	useRef,
	useCallback,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

( function injectStyles() {
	const id = 'lumora-palette-styles';
	if ( document.getElementById( id ) ) {
		return;
	}
	const style = document.createElement( 'style' );
	style.id = id;
	style.textContent = `
.lumora-palette-overlay{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.4);display:flex;align-items:flex-start;justify-content:center;padding-top:10vh;animation:fadeIn 150ms ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.lumora-palette{background:var(--lumora-surface,#fff);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.16);width:100%;max-width:580px;max-height:60vh;display:flex;flex-direction:column;animation:slideUp 250ms cubic-bezier(0.34,1.56,0.64,1) forwards;overflow:hidden;color:var(--lumora-text,#0f172a)}
.lumora-palette__input-wrapper{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--lumora-border,#e2e8f0)}
.lumora-palette__search-icon{color:var(--lumora-text-disabled,#94a3b8);display:flex;flex-shrink:0}
.lumora-palette__input{flex:1;border:none;outline:none;font-size:15px;background:transparent;color:var(--lumora-text,#0f172a)}
.lumora-palette__input::placeholder{color:var(--lumora-text-disabled,#94a3b8)}
.lumora-palette__esc-key{font-family:monospace;font-size:10px;padding:1px 5px;background:var(--lumora-surface-2,#f1f5f9);border-radius:4px;color:var(--lumora-text-disabled,#94a3b8);flex-shrink:0}
.lumora-palette__results{flex:1;overflow-y:auto;padding:4px 0}
.lumora-palette__group{padding:4px 0}
.lumora-palette__group-label{padding:6px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--lumora-text-secondary,#64748b)}
.lumora-palette__item{display:flex;align-items:center;gap:10px;width:100%;padding:8px 16px;text-align:left;font-size:14px;background:transparent;border:none;cursor:pointer;color:var(--lumora-text,#0f172a);transition:background 0.1s}
.lumora-palette__item:hover,.lumora-palette__item--active{background:var(--lumora-primary,#6366f1);color:#fff}
.lumora-palette__item-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:0.6}
.lumora-palette__item--active .lumora-palette__item-icon,.lumora-palette__item:hover .lumora-palette__item-icon{opacity:1}
.lumora-palette__item-content{flex:1;min-width:0}
.lumora-palette__item-title{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lumora-palette__item-sub{display:block;font-size:11px;opacity:0.6;margin-top:1px}
.lumora-palette__loading,.lumora-palette__empty{padding:32px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px}
.lumora-palette__spinner{width:18px;height:18px;border:2px solid var(--lumora-border,#e2e8f0);border-top-color:var(--lumora-primary,#6366f1);border-radius:50%;animation:spin 0.6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.lumora-palette__footer{display:flex;align-items:center;gap:12px;padding:8px 16px;border-top:1px solid var(--lumora-border,#e2e8f0)}
.lumora-palette__footer-hint{font-size:11px;color:var(--lumora-text-disabled,#94a3b8);display:flex;align-items:center;gap:4px}
.lumora-palette__footer-hint kbd{font-family:monospace;font-size:10px;padding:1px 4px;background:var(--lumora-surface-2,#f1f5f9);border-radius:3px;border:1px solid var(--lumora-border,#e2e8f0)}
@media(max-width:767px){.lumora-palette-overlay{align-items:stretch;padding-top:0}.lumora-palette{max-width:100%;max-height:100vh;border-radius:0}}
`;
	document.head.appendChild( style );
} )();

function normalize( str ) {
	return str
		.toLowerCase()
		.normalize( 'NFD' )
		.replace( /[\u0300-\u036f]/g, '' )
		.replace( /[^\w\s]/g, '' )
		.trim();
}

function fuzzyScore( query, target ) {
	const q = normalize( query );
	const t = normalize( target );
	if ( t === q ) {
		return 100;
	}
	if ( t.startsWith( q ) ) {
		return 90;
	}
	if ( t.includes( q ) ) {
		return 70;
	}
	const chars = q.split( '' );
	let ti = 0,
		matched = 0,
		consecutive = 0,
		maxConsecutive = 0;
	for ( let ci = 0; ci < chars.length && ti < t.length; ci++ ) {
		while ( ti < t.length && t[ ti ] !== chars[ ci ] ) {
			ti++;
			consecutive = 0;
		}
		if ( ti < t.length && t[ ti ] === chars[ ci ] ) {
			matched++;
			consecutive++;
			maxConsecutive = Math.max( maxConsecutive, consecutive );
			ti++;
		}
	}
	if ( matched === 0 ) {
		return 0;
	}
	return Math.round(
		Math.min(
			100,
			( matched / chars.length ) * 70 +
				( maxConsecutive / chars.length ) * 30
		)
	);
}

const GROUP_LABELS = {
	posts: __( 'Posts', 'lumora' ),
	pages: __( 'Pages', 'lumora' ),
	media: __( 'Media', 'lumora' ),
	users: __( 'Users', 'lumora' ),
	commands: __( 'Commands', 'lumora' ),
	wp_section: __( 'WordPress', 'lumora' ),
};

const iconSVG = ( type ) => {
	if ( type === 'post' ) {
		return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
	}
	if ( type === 'page' ) {
		return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
	}
	if ( type === 'media' ) {
		return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
	}
	if ( type === 'user' ) {
		return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
	}
	return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
};

function PaletteModal( { onClose } ) {
	const [ query, setQuery ] = useState( '' );
	const [ staticItems, setStaticItems ] = useState( [] );
	const [ searchResults, setSearchResults ] = useState( null );
	const [ isSearching, setIsSearching ] = useState( false );
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );
	const inputRef = useRef( null );
	const listRef = useRef( null );

	useEffect( () => {
		window.requestAnimationFrame( () => inputRef.current?.focus() );
		apiFetch( { path: '/lumora/v1/commands' } )
			.then( ( d ) =>
				setStaticItems( [
					...( d.commands || [] ),
					...( d.sections || [] ),
				] )
			)
			.catch( () => {
				setStaticItems( [
					{
						id: 'add-post',
						title: __( 'Add New Post', 'lumora' ),
						action: 'lumora:go-dashboard',
						icon: 'command',
					},
					{
						id: 'add-page',
						title: __( 'Add New Page', 'lumora' ),
						action: 'lumora:go-dashboard',
						icon: 'command',
					},
					{
						id: 'toggle-theme',
						title: __( 'Toggle Dark Mode', 'lumora' ),
						action: 'lumora:toggle-theme',
						icon: 'command',
					},
				] );
			} );
	}, [] );

	useEffect( () => {
		if ( ! query || query.length < 1 ) {
			setSearchResults( null );
			setIsSearching( false );
			return;
		}
		setIsSearching( true );
		setSelectedIndex( 0 );
		const local = staticItems
			.map( ( i ) => ( {
				...i,
				_score: fuzzyScore( query, i.title || '' ),
				group: i.type || 'commands',
			} ) )
			.filter( ( i ) => i._score > 0 )
			.sort( ( a, b ) => b._score - a._score );
		const timer = setTimeout( () => {
			apiFetch( {
				path: `/lumora/v1/search?q=${ encodeURIComponent( query ) }`,
			} )
				.then( ( d ) => {
					const remote = [];
					for ( const [ g, items ] of Object.entries(
						d.results || {}
					) ) {
						for ( const item of items ) {
							remote.push( {
								...item,
								group: g,
								_source: 'remote',
							} );
						}
					}
					setSearchResults( [ ...local, ...remote ] );
					setIsSearching( false );
				} )
				.catch( () => {
					setSearchResults( local );
					setIsSearching( false );
				} );
		}, 300 );
		return () => clearTimeout( timer );
	}, [ query, staticItems ] );

	const flat = useCallback( () => {
		if ( ! searchResults ) {
			return staticItems.map( ( i ) => ( {
				...i,
				group: i.type || 'commands',
			} ) );
		}
		return searchResults;
	}, [ searchResults, staticItems ] );

	const groups = useCallback( () => {
		const gs = {};
		for ( const item of flat() ) {
			const g = item.group || 'other';
			if ( ! gs[ g ] ) {
				gs[ g ] = [];
			}
			gs[ g ].push( item );
		}
		return gs;
	}, [ flat ] );

	const handleKey = ( e ) => {
		const items = flat();
		switch ( e.key ) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex(
					Math.min( selectedIndex + 1, items.length - 1 )
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex( Math.max( selectedIndex - 1, 0 ) );
				break;
			case 'Enter':
				e.preventDefault();
				if ( items[ selectedIndex ] ) {
					select( items[ selectedIndex ] );
				}
				break;
			case 'Escape':
				e.preventDefault();
				onClose();
				break;
		}
	};

	const select = ( item ) => {
		if ( item.action && item.action.startsWith( 'lumora:' ) ) {
			const actions = {
				'lumora:toggle-theme': () => {
					const html = document.documentElement;
					const current =
						html.getAttribute( 'data-lumora-theme' ) || 'light';
					const next = current === 'dark' ? 'light' : 'dark';
					html.setAttribute( 'data-lumora-theme', next );
					try {
						window.localStorage.setItem( 'lumora-theme', next );
					} catch ( err ) {
						// Silently ignore storage errors.
					}
				},
				'lumora:toggle-sidebar': () => {
					const sidebar = document.querySelector( '.lumora-sidebar' );
					if ( sidebar ) {
						sidebar.classList.toggle( 'lumora-sidebar--collapsed' );
					}
				},
				'lumora:go-dashboard': () => {
					window.location.href =
						window.lumoraData?.adminUrl + 'admin.php?page=lumora';
				},
				'lumora:go-settings': () => {
					window.location.href =
						window.lumoraData?.adminUrl +
						'admin.php?page=lumora#settings';
				},
			};
			( actions[ item.action ] || ( () => {} ) )();
			onClose();
			return;
		}
		if ( item.url ) {
			window.location.href = item.url;
		}
		onClose();
	};

	useEffect( () => {
		if ( listRef.current && selectedIndex >= 0 ) {
			const el = listRef.current.children[ selectedIndex ];
			if ( el ) {
				el.scrollIntoView( { block: 'nearest' } );
			}
		}
	}, [ selectedIndex ] );

	const gs = groups();
	let idx = 0;

	return (
		<div
			className="lumora-palette-overlay"
			onClick={ onClose }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					onClose();
				}
			} }
			role="presentation"
			tabIndex={ -1 }
		>
			{ /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */ }
			<div
				className="lumora-palette"
				onClick={ ( e ) => e.stopPropagation() }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.stopPropagation();
					}
				} }
				role="dialog"
				tabIndex={ -1 }
				aria-modal="true"
				aria-label={ __( 'Command palette', 'lumora' ) }
			>
				<div className="lumora-palette__input-wrapper">
					<span
						className="lumora-palette__search-icon"
						aria-hidden="true"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</span>
					<input
						ref={ inputRef }
						className="lumora-palette__input"
						type="text"
						value={ query }
						onChange={ ( e ) => setQuery( e.target.value ) }
						onKeyDown={ handleKey }
						placeholder={ __(
							'Search posts, pages, settings…',
							'lumora'
						) }
						autoComplete="off"
						spellCheck={ false }
					/>
					<kbd className="lumora-palette__esc-key">Esc</kbd>
				</div>
				<div className="lumora-palette__results" ref={ listRef }>
					{ isSearching && (
						<div className="lumora-palette__loading">
							<span className="lumora-palette__spinner" />
							<span className="lumora-text lumora-text--sm lumora-text--muted">
								{ __( 'Searching…', 'lumora' ) }
							</span>
						</div>
					) }
					{ ! isSearching && Object.keys( gs ).length === 0 && (
						<div className="lumora-palette__empty">
							<p className="lumora-text lumora-text--sm lumora-text--muted">
								{ query
									? __( 'No results found.', 'lumora' )
									: __( 'Type to search…', 'lumora' ) }
							</p>
						</div>
					) }
					{ ! isSearching &&
						Object.entries( gs ).map( ( [ group, items ] ) => (
							<div
								key={ group }
								className="lumora-palette__group"
							>
								<div className="lumora-palette__group-label">
									{ GROUP_LABELS[ group ] || group }
								</div>
								{ items.map( ( item ) => {
									const ci = idx++;
									return (
										<button
											key={ `${
												item.id || item.title
											}-${ ci }` }
											className={ `lumora-palette__item ${
												ci === selectedIndex
													? 'lumora-palette__item--active'
													: ''
											}` }
											onClick={ () => select( item ) }
											onMouseEnter={ () =>
												setSelectedIndex( ci )
											}
											type="button"
											role="option"
											aria-selected={
												ci === selectedIndex
											}
											dangerouslySetInnerHTML={ {
												__html: `<span class="lumora-palette__item-icon">${ iconSVG(
													item.icon || 'wp'
												) }</span>
                                            <div class="lumora-palette__item-content"><span class="lumora-palette__item-title">${ escapeHtml(
												item.title || ''
											) }</span></div>`,
											} }
										/>
									);
								} ) }
							</div>
						) ) }
				</div>
				<div className="lumora-palette__footer">
					<span className="lumora-palette__footer-hint">
						<kbd>↑↓</kbd> { __( 'Navigate', 'lumora' ) }
					</span>
					<span className="lumora-palette__footer-hint">
						<kbd>Enter</kbd> { __( 'Select', 'lumora' ) }
					</span>
					<span className="lumora-palette__footer-hint">
						<kbd>Esc</kbd> { __( 'Close', 'lumora' ) }
					</span>
				</div>
			</div>
		</div>
	);
}

function escapeHtml( str ) {
	const div = document.createElement( 'div' );
	div.appendChild( document.createTextNode( str ) );
	return div.innerHTML;
}

let paletteRoot = null;
let paletteContainer = null;

function togglePalette() {
	if ( paletteRoot ) {
		render( null, paletteContainer );
		document.body.removeChild( paletteContainer );
		paletteRoot = null;
		paletteContainer = null;
		return;
	}
	paletteContainer = document.createElement( 'div' );
	paletteContainer.id = 'lumora-palette-container';
	document.body.appendChild( paletteContainer );
	paletteRoot = true;
	render(
		createElement( PaletteModal, {
			onClose: () => {
				render( null, paletteContainer );
				document.body.removeChild( paletteContainer );
				paletteRoot = null;
				paletteContainer = null;
			},
		} ),
		paletteContainer
	);
}

document.addEventListener( 'keydown', function ( e ) {
	if ( ( e.ctrlKey || e.metaKey ) && e.key === 'k' ) {
		e.preventDefault();
		togglePalette();
	}
} );
