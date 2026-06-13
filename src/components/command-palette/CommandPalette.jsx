import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import fuzzySearch from '../../utils/fuzzySearch';

const GROUP_LABELS = {
	posts: __( 'Posts', 'lumora' ),
	pages: __( 'Pages', 'lumora' ),
	media: __( 'Media', 'lumora' ),
	users: __( 'Users', 'lumora' ),
	commands: __( 'Commands', 'lumora' ),
	wp_section: __( 'WordPress', 'lumora' ),
};

const CommandPalette = ( { isOpen, onClose, onCommand } ) => {
	const [ query, setQuery ] = useState( '' );
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );
	const [ staticItems, setStaticItems ] = useState( [] );
	const [ searchResults, setSearchResults ] = useState( null );
	const [ isSearching, setIsSearching ] = useState( false );
	const inputRef = useRef( null );
	const listRef = useRef( null );

	useEffect( () => {
		if ( ! isOpen ) {
			setQuery( '' );
			setSelectedIndex( 0 );
			setSearchResults( null );
			return;
		}

		setQuery( '' );
		setSelectedIndex( 0 );
		setSearchResults( null );

		window.requestAnimationFrame( () => {
			inputRef.current?.focus();
		} );

		apiFetch( { path: '/lumora/v1/commands' } )
			.then( ( data ) => {
				const items = [
					...( data.commands || [] ),
					...( data.sections || [] ),
				];
				setStaticItems( items );
			} )
			.catch( () => {
				setStaticItems( [] );
			} );
	}, [ isOpen ] );

	useEffect( () => {
		if ( ! query || query.length < 1 ) {
			setSearchResults( null );
			setIsSearching( false );
			return;
		}

		setIsSearching( true );
		setSelectedIndex( 0 );

		const localResults = fuzzySearch( query, staticItems, {
			keys: [ 'title' ],
		} );

		const timer = setTimeout( () => {
			apiFetch( {
				path: `/lumora/v1/search?q=${ encodeURIComponent( query ) }`,
			} )
				.then( ( data ) => {
					const remote = [];
					for ( const [ group, items ] of Object.entries(
						data.results || {}
					) ) {
						for ( const item of items ) {
							remote.push( { ...item, group } );
						}
					}

					const merged = [
						...localResults.map( ( r ) => ( {
							...r,
							_source: 'local',
							group: r.type || 'commands',
						} ) ),
						...remote.map( ( r ) => ( {
							...r,
							_source: 'remote',
							group: r.type || 'results',
						} ) ),
					];

					setSearchResults( merged );
					setIsSearching( false );
				} )
				.catch( () => {
					setSearchResults(
						localResults.map( ( r ) => ( {
							...r,
							_source: 'local',
							group: r.type || 'commands',
						} ) )
					);
					setIsSearching( false );
				} );
		}, 300 );

		return () => clearTimeout( timer );
	}, [ query, staticItems ] );

	const groupedResults = useCallback( () => {
		if ( ! searchResults ) {
			const initial = staticItems.map( ( item ) => ( {
				...item,
				_source: 'local',
				group: item.type || 'commands',
			} ) );
			const groups = {};
			for ( const item of initial ) {
				const g = item.group || 'other';
				if ( ! groups[ g ] ) {
					groups[ g ] = [];
				}
				groups[ g ].push( item );
			}
			return groups;
		}

		const groups = {};
		for ( const item of searchResults ) {
			const g = item.group || 'other';
			if ( ! groups[ g ] ) {
				groups[ g ] = [];
			}
			groups[ g ].push( item );
		}
		return groups;
	}, [ searchResults, staticItems ] );

	const flatResults = useCallback( () => {
		return Object.values( groupedResults() ).flat();
	}, [ groupedResults ] );

	const handleKeyDown = ( e ) => {
		const items = flatResults();
		const idx = selectedIndex;

		switch ( e.key ) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex( Math.min( idx + 1, items.length - 1 ) );
				break;

			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex( Math.max( idx - 1, 0 ) );
				break;

			case 'Enter':
				e.preventDefault();
				if ( items[ idx ] ) {
					handleSelect( items[ idx ] );
				}
				break;

			case 'Escape':
				e.preventDefault();
				onClose();
				break;

			case 'Tab':
				e.preventDefault();
				if ( e.shiftKey ) {
					setSelectedIndex( Math.max( idx - 1, 0 ) );
				} else {
					setSelectedIndex( Math.min( idx + 1, items.length - 1 ) );
				}
				break;
		}
	};

	const handleSelect = ( item ) => {
		if ( item.action && item.action.startsWith( 'lumora:' ) ) {
			onCommand( item.action );
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
			const selected = listRef.current.children[ selectedIndex ];
			if ( selected ) {
				selected.scrollIntoView( { block: 'nearest' } );
			}
		}
	}, [ selectedIndex ] );

	if ( ! isOpen ) {
		return null;
	}

	const groups = groupedResults();
	const groupsEntries = Object.entries( groups );
	let flatIdx = 0;

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
							strokeLinecap="round"
							strokeLinejoin="round"
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
						onKeyDown={ handleKeyDown }
						placeholder={ __(
							'Search posts, pages, settings…',
							'lumora'
						) }
						aria-label={ __( 'Search', 'lumora' ) }
						autoComplete="off"
						spellCheck={ false }
					/>
					<kbd className="lumora-palette__esc-key">Esc</kbd>
				</div>

				<div className="lumora-palette__results" ref={ listRef }>
					{ isSearching && (
						<div className="lumora-palette__loading">
							<span
								className="lumora-palette__spinner"
								aria-hidden="true"
							/>
							<span className="lumora-text lumora-text--sm lumora-text--muted">
								{ __( 'Searching…', 'lumora' ) }
							</span>
						</div>
					) }

					{ ! isSearching && groupsEntries.length === 0 && (
						<div className="lumora-palette__empty">
							<p className="lumora-text lumora-text--sm lumora-text--muted">
								{ query
									? __( 'No results found.', 'lumora' )
									: __( 'Type to search…', 'lumora' ) }
							</p>
						</div>
					) }

					{ ! isSearching &&
						groupsEntries.map( ( [ group, items ] ) => (
							<div
								key={ group }
								className="lumora-palette__group"
							>
								<div className="lumora-palette__group-label">
									{ GROUP_LABELS[ group ] || group }
								</div>
								{ items.map( ( item ) => {
									const idx = flatIdx++;
									return (
										<button
											key={ `${
												item.id || item.title
											}-${ idx }` }
											className={ `lumora-palette__item ${
												idx === selectedIndex
													? 'lumora-palette__item--active'
													: ''
											}` }
											onClick={ () =>
												handleSelect( item )
											}
											onMouseEnter={ () =>
												setSelectedIndex( idx )
											}
											type="button"
											role="option"
											aria-selected={
												idx === selectedIndex
											}
										>
											<span
												className="lumora-palette__item-icon"
												aria-hidden="true"
											>
												{ item.icon === 'post' && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
														<polyline points="14 2 14 8 20 8" />
													</svg>
												) }
												{ item.icon === 'page' && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
														<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
													</svg>
												) }
												{ item.icon === 'media' && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<rect
															x="3"
															y="3"
															width="18"
															height="18"
															rx="2"
															ry="2"
														/>
														<circle
															cx="8.5"
															cy="8.5"
															r="1.5"
														/>
														<polyline points="21 15 16 10 5 21" />
													</svg>
												) }
												{ item.icon === 'user' && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
														<circle
															cx="12"
															cy="7"
															r="4"
														/>
													</svg>
												) }
												{ item.icon === 'command' && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
													</svg>
												) }
												{ ( item.icon === 'wp' ||
													! item.icon ) && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<circle
															cx="12"
															cy="12"
															r="10"
														/>
														<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
													</svg>
												) }
											</span>
											<div className="lumora-palette__item-content">
												<span className="lumora-palette__item-title">
													{ item.title }
												</span>
												{ item.email && (
													<span className="lumora-palette__item-sub">
														{ item.email }
													</span>
												) }
											</div>
											{ item._source === 'remote' && (
												<span className="lumora-palette__item-source">
													{ item.type }
												</span>
											) }
										</button>
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
};

export default CommandPalette;
