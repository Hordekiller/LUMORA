import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from '../../utils/classnames';
import Icon from '../ui/Icon';

const lumoraItems = [
	{ icon: 'home', label: __( 'Dashboard', 'lumora' ), page: 'dashboard' },
	{ icon: 'grid', label: __( 'Widgets', 'lumora' ), page: 'dashboard' },
	{ icon: 'settings', label: __( 'Settings', 'lumora' ), page: 'settings' },
	{ icon: 'menu', label: __( 'Menu Manager', 'lumora' ), page: 'menu' },
	{
		icon: 'settings',
		label: __( 'White Label', 'lumora' ),
		page: 'whitelabel',
	},
];

const Sidebar = ( {
	collapsed,
	visible,
	onToggle,
	onClose,
	isMobile,
	currentPage,
	onNavigate,
} ) => {
	const [ expanded, setExpanded ] = useState( null );
	const adminMenu =
		typeof window !== 'undefined' &&
		window.lumoraData &&
		window.lumoraData.adminMenu
			? window.lumoraData.adminMenu
			: [];
	const toggleSub = useCallback(
		( id ) => setExpanded( ( prev ) => ( prev === id ? null : id ) ),
		[]
	);

	return (
		<aside
			className={ classnames(
				'lumora-sidebar',
				collapsed && 'lumora-sidebar--collapsed',
				isMobile && 'lumora-sidebar--mobile',
				visible && 'lumora-sidebar--visible'
			) }
			aria-label={ __( 'Main navigation', 'lumora' ) }
		>
			<div className="lumora-sidebar__header">
				<div className="lumora-sidebar__brand">
					<span className="lumora-sidebar__logo" aria-hidden="true">
						L
					</span>
					{ ! collapsed && (
						<span className="lumora-sidebar__title">Lumora</span>
					) }
				</div>
				{ isMobile && (
					<button
						className="lumora-sidebar__close"
						onClick={ onClose }
						aria-label={ __( 'Close menu', 'lumora' ) }
						type="button"
					>
						<Icon name="close" size={ 20 } />
					</button>
				) }
			</div>

			<nav className="lumora-sidebar__nav">
				<ul className="lumora-sidebar__menu" role="menubar">
					{ /* Lumora items */ }
					{ lumoraItems.map( ( item ) => (
						<li key={ item.page } role="none">
							<button
								className={ classnames(
									'lumora-sidebar__link',
									currentPage === item.page &&
										'lumora-sidebar__link--active'
								) }
								role="menuitem"
								onClick={ () => onNavigate( item.page ) }
								type="button"
							>
								<span className="lumora-sidebar__link-icon">
									<Icon name={ item.icon } size={ 20 } />
								</span>
								{ ! collapsed && (
									<span className="lumora-sidebar__link-label">
										{ item.label }
									</span>
								) }
							</button>
						</li>
					) ) }

					{ adminMenu.length > 0 && (
						<li className="lumora-sidebar__divider" role="none">
							<hr />
						</li>
					) }

					{ /* WordPress admin items */ }
					{ adminMenu.map( ( item ) => (
						<li key={ item.id } role="none">
							{ item.sub && item.sub.length > 0 && ! collapsed ? (
								<>
									<button
										className={ classnames(
											'lumora-sidebar__link',
											expanded === item.id &&
												'lumora-sidebar__link--expanded'
										) }
										role="menuitem"
										onClick={ () => toggleSub( item.id ) }
										type="button"
									>
										<span className="lumora-sidebar__link-icon">
											<Icon
												name={ item.icon }
												size={ 20 }
											/>
										</span>
										<span className="lumora-sidebar__link-label">
											{ item.title }
										</span>
										<span className="lumora-sidebar__link-arrow">
											<Icon
												name={
													expanded === item.id
														? 'arrow_down'
														: 'arrow_right'
												}
												size={ 14 }
											/>
										</span>
									</button>
									{ expanded === item.id && (
										<ul className="lumora-sidebar__submenu">
											{ item.sub.map( ( sub ) => (
												<li key={ sub.url } role="none">
													<a
														className="lumora-sidebar__link lumora-sidebar__link--sub"
														role="menuitem"
														href={ sub.url }
													>
														<span className="lumora-sidebar__link-label">
															{ sub.title }
														</span>
													</a>
												</li>
											) ) }
										</ul>
									) }
								</>
							) : (
								<a
									className="lumora-sidebar__link"
									role="menuitem"
									href={ item.url }
								>
									<span className="lumora-sidebar__link-icon">
										<Icon name={ item.icon } size={ 20 } />
									</span>
									{ ! collapsed && (
										<span className="lumora-sidebar__link-label">
											{ item.title }
										</span>
									) }
								</a>
							) }
						</li>
					) ) }
				</ul>
			</nav>

			{ ! isMobile && (
				<button
					className="lumora-sidebar__collapse"
					onClick={ onToggle }
					aria-label={
						collapsed
							? __( 'Expand sidebar', 'lumora' )
							: __( 'Collapse sidebar', 'lumora' )
					}
					type="button"
				>
					<Icon
						name={ collapsed ? 'chevron_right' : 'chevron_left' }
						size={ 18 }
					/>
				</button>
			) }
		</aside>
	);
};

export default Sidebar;
