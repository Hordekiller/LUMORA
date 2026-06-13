import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import Skeleton from '../ui/Skeleton';

const MenuManager = () => {
	const [ items, setItems ] = useState( [] );
	const [ config, setConfig ] = useState( { order: [], hidden: [] } );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ draggedIndex, setDraggedIndex ] = useState( null );
	const [ isGlobal, setIsGlobal ] = useState( false );
	const [ message, setMessage ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/lumora/v1/menu' } )
			.then( ( data ) => {
				setItems( data.items || [] );
				setConfig( data.config || { order: [], hidden: [] } );
				setIsLoading( false );
			} )
			.catch( () => setIsLoading( false ) );
	}, [] );

	const visibleItems = items.filter( ( item ) => {
		return ! ( config.hidden || [] ).includes( item.id );
	} );

	const hiddenItems = items.filter( ( item ) => {
		return ( config.hidden || [] ).includes( item.id );
	} );

	const handleDragStart = ( index ) => {
		setDraggedIndex( index );
	};

	const handleDragOver = ( e ) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = ( e, targetIndex ) => {
		e.preventDefault();
		if ( draggedIndex === null || draggedIndex === targetIndex ) {
			setDraggedIndex( null );
			return;
		}

		const newVisible = [ ...visibleItems ];
		const [ moved ] = newVisible.splice( draggedIndex, 1 );
		newVisible.splice( targetIndex, 0, moved );
		setDraggedIndex( null );

		const newOrder = newVisible.map( ( item ) => item.id );
		const newConfig = { ...config, order: newOrder };
		setConfig( newConfig );
		setItems( ( prev ) => {
			const updatedIds = new Set( newOrder );
			const remaining = prev.filter(
				( item ) => ! updatedIds.has( item.id )
			);
			return [ ...newVisible, ...remaining ];
		} );
	};

	const toggleVisibility = ( itemId ) => {
		const hidden = config.hidden || [];
		const newHidden = hidden.includes( itemId )
			? hidden.filter( ( id ) => id !== itemId )
			: [ ...hidden, itemId ];
		setConfig( { ...config, hidden: newHidden } );
	};

	const saveConfig = useCallback( () => {
		setIsSaving( true );
		setMessage( null );

		const order = visibleItems.map( ( item ) => item.id );
		const hidden = config.hidden || [];

		apiFetch( {
			path: '/lumora/v1/menu',
			method: 'POST',
			data: { order, hidden, global: isGlobal },
		} )
			.then( ( data ) => {
				setConfig( data.config );
				setMessage( {
					type: 'success',
					text: __( 'Menu saved successfully.', 'lumora' ),
				} );
				setIsSaving( false );
				setTimeout( () => setMessage( null ), 3000 );
			} )
			.catch( () => {
				setMessage( {
					type: 'error',
					text: __( 'Failed to save menu.', 'lumora' ),
				} );
				setIsSaving( false );
			} );
	}, [ visibleItems, config, isGlobal ] );

	const resetConfig = useCallback( () => {
		setConfig( { order: [], hidden: [] } );
		setMessage( {
			type: 'info',
			text: __( 'Configuration reset. Save to apply.', 'lumora' ),
		} );
		setTimeout( () => setMessage( null ), 3000 );
	}, [] );

	if ( isLoading ) {
		return (
			<div className="lumora-menu-manager">
				<Card padding="lg">
					<Skeleton.Text lines={ 8 } />
				</Card>
			</div>
		);
	}

	return (
		<div className="lumora-menu-manager">
			<div className="lumora-menu-manager__header">
				<div>
					<h1 className="lumora-heading lumora-heading--3">
						{ __( 'Menu Manager', 'lumora' ) }
					</h1>
					<p className="lumora-text lumora-text--muted">
						{ __(
							'Reorder and customize your WordPress admin menu.',
							'lumora'
						) }
					</p>
				</div>
			</div>

			{ message && (
				<div
					className={ `lumora-notice lumora-notice--${ message.type }` }
				>
					<span className="lumora-text lumora-text--sm">
						{ message.text }
					</span>
				</div>
			) }

			<div className="lumora-menu-manager__layout">
				<div className="lumora-menu-manager__visible">
					<Card padding="md">
						<Card.Header>
							<h4 className="lumora-text lumora-text--sm">
								{ __( 'Visible Menu Items', 'lumora' ) }
								<span
									className="lumora-text lumora-text--xs lumora-text--muted"
									style={ {
										marginLeft: 'var(--lumora-space-2)',
									} }
								>
									({ visibleItems.length })
								</span>
							</h4>
						</Card.Header>
						<Card.Body>
							{ visibleItems.length === 0 ? (
								<p className="lumora-text lumora-text--sm lumora-text--muted">
									{ __( 'No visible items.', 'lumora' ) }
								</p>
							) : (
								<ul className="lumora-menu-manager__list">
									{ visibleItems.map( ( item, index ) => (
										<li
											key={ item.id }
											className={ `lumora-menu-manager__item ${
												draggedIndex === index
													? 'lumora-menu-manager__item--dragging'
													: ''
											}` }
											draggable
											onDragStart={ () =>
												handleDragStart( index )
											}
											onDragOver={ ( e ) =>
												handleDragOver( e, index )
											}
											onDrop={ ( e ) =>
												handleDrop( e, index )
											}
											onDragEnd={ () =>
												setDraggedIndex( null )
											}
										>
											<span
												className="lumora-menu-manager__drag"
												aria-label={ __(
													'Drag to reorder',
													'lumora'
												) }
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 16 16"
													fill="currentColor"
												>
													<circle
														cx="5"
														cy="3"
														r="1.5"
													/>
													<circle
														cx="11"
														cy="3"
														r="1.5"
													/>
													<circle
														cx="5"
														cy="8"
														r="1.5"
													/>
													<circle
														cx="11"
														cy="8"
														r="1.5"
													/>
													<circle
														cx="5"
														cy="13"
														r="1.5"
													/>
													<circle
														cx="11"
														cy="13"
														r="1.5"
													/>
												</svg>
											</span>
											<span
												className="lumora-menu-manager__icon"
												aria-hidden="true"
											>
												{ item.icon &&
												item.icon !== 'custom' ? (
													<span
														className={ `dashicons ${ item.icon }` }
													/>
												) : (
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="currentColor"
													>
														<rect
															x="1"
															y="1"
															width="14"
															height="3"
															rx="1"
														/>
														<rect
															x="1"
															y="6.5"
															width="14"
															height="3"
															rx="1"
														/>
														<rect
															x="1"
															y="12"
															width="14"
															height="3"
															rx="1"
														/>
													</svg>
												) }
											</span>
											<span className="lumora-menu-manager__label">
												<span className="lumora-text lumora-text--sm">
													{ item.title }
												</span>
												{ item.slug && (
													<span className="lumora-text lumora-text--xs lumora-text--muted">
														{ item.slug }
													</span>
												) }
											</span>
											<span className="lumora-menu-manager__children-count">
												{ item.children?.length > 0 && (
													<span className="lumora-text lumora-text--xs lumora-text--muted">
														{ item.children.length }{ ' ' }
														{ __(
															'sub',
															'lumora'
														) }
													</span>
												) }
											</span>
											<Toggle
												checked={ true }
												onChange={ () =>
													toggleVisibility( item.id )
												}
												size="sm"
											/>
										</li>
									) ) }
								</ul>
							) }
						</Card.Body>
					</Card>
				</div>

				{ hiddenItems.length > 0 && (
					<div className="lumora-menu-manager__hidden">
						<Card padding="md" variant="default">
							<Card.Header>
								<h4 className="lumora-text lumora-text--sm lumora-text--muted">
									{ __( 'Hidden Items', 'lumora' ) }
									<span
										className="lumora-text lumora-text--xs"
										style={ {
											marginLeft: 'var(--lumora-space-2)',
										} }
									>
										({ hiddenItems.length })
									</span>
								</h4>
							</Card.Header>
							<Card.Body>
								<ul className="lumora-menu-manager__list">
									{ hiddenItems.map( ( item ) => (
										<li
											key={ item.id }
											className="lumora-menu-manager__item lumora-menu-manager__item--hidden"
										>
											<span className="lumora-menu-manager__label">
												<span className="lumora-text lumora-text--sm">
													{ item.title }
												</span>
											</span>
											<Toggle
												checked={ false }
												onChange={ () =>
													toggleVisibility( item.id )
												}
												size="sm"
											/>
										</li>
									) ) }
								</ul>
							</Card.Body>
						</Card>
					</div>
				) }
			</div>

			<div className="lumora-menu-manager__actions">
				<div className="lumora-menu-manager__save-options">
					<Toggle
						checked={ isGlobal }
						onChange={ () => setIsGlobal( ! isGlobal ) }
						label={ __( 'Apply for all users', 'lumora' ) }
						size="sm"
					/>
				</div>
				<div className="lumora-menu-manager__buttons">
					<Button variant="ghost" size="md" onClick={ resetConfig }>
						{ __( 'Reset', 'lumora' ) }
					</Button>
					<Button
						variant="primary"
						size="md"
						loading={ isSaving }
						onClick={ saveConfig }
					>
						{ __( 'Save Menu', 'lumora' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MenuManager;
