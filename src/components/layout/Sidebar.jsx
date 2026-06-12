import { __ } from '@wordpress/i18n';
import classnames from '../../utils/classnames';
import Icon from '../ui/Icon';

const menuItems = [
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
					{ menuItems.map( ( item ) => (
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
