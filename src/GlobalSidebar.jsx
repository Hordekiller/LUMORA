import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from './utils/classnames';
import Icon from './components/ui/Icon';

const LUMORA_ITEMS = [
	{
		icon: 'home',
		label: __( 'Dashboard', 'lumora' ),
		page: 'dashboard',
	},
	{
		icon: 'grid',
		label: __( 'Widgets', 'lumora' ),
		page: 'widgets',
		hash: 'widgets',
	},
	{
		icon: 'settings',
		label: __( 'Settings', 'lumora' ),
		page: 'settings',
	},
	{
		icon: 'menu',
		label: __( 'Menu Manager', 'lumora' ),
		page: 'menu',
	},
	{
		icon: 'settings',
		label: __( 'White Label', 'lumora' ),
		page: 'whitelabel',
	},
];

const normalizeAdminUrl = ( url ) => {
	if ( ! url || typeof url !== 'string' ) {
		return '/wp-admin/';
	}

	try {
		const adminUrl = new URL( url, window.location.origin );
		adminUrl.pathname = adminUrl.pathname.endsWith( '/' )
			? adminUrl.pathname
			: `${ adminUrl.pathname }/`;

		return adminUrl.toString();
	} catch {
		return '/wp-admin/';
	}
};

const getLumoraUrl = ( adminUrl, item ) => {
	const adminBase = new URL( adminUrl, window.location.origin );
	const url = new URL( 'admin.php', adminBase );
	url.searchParams.set( 'page', 'lumora' );

	if ( item.page && item.page !== 'dashboard' ) {
		url.searchParams.set( 'lumora_page', item.page );
	}

	if ( item.hash ) {
		url.hash = item.hash;
	}

	return url.toString();
};

const isSafeAdminUrl = ( url, adminUrl ) => {
	if ( ! url || typeof url !== 'string' ) {
		return false;
	}

	try {
		const candidate = new URL( url, window.location.origin );
		const admin = new URL( adminUrl, window.location.origin );

		return (
			candidate.origin === admin.origin &&
			candidate.pathname.startsWith( admin.pathname )
		);
	} catch {
		return false;
	}
};

const cleanMenuItems = ( items, adminUrl ) => {
	if ( ! Array.isArray( items ) ) {
		return [];
	}

	return items
		.map( ( item ) => {
			if ( ! item || ! isSafeAdminUrl( item.url, adminUrl ) ) {
				return null;
			}

			const sub = Array.isArray( item.sub )
				? item.sub.filter( ( subItem ) =>
						isSafeAdminUrl( subItem?.url, adminUrl )
				  )
				: [];

			return {
				...item,
				icon: item.icon || 'settings',
				title: item.title || item.label || '',
				sub,
			};
		} )
		.filter( ( item ) => item && item.title );
};

function Brand() {
	return (
		<div className="lumora-global-sidebar__brand">
			<div className="lumora-global-sidebar__logo" aria-hidden="true">
				L
			</div>
		</div>
	);
}

function ItemLabel( { children, align } ) {
	return (
		<span
			className={ classnames(
				'lumora-global-sidebar__label',
				align === 'right' && 'lumora-global-sidebar__label--right'
			) }
		>
			{ children }
		</span>
	);
}

function MenuLink( { href, icon, children, isSub = false } ) {
	const className = classnames(
		'lumora-global-sidebar__item',
		isSub && 'lumora-global-sidebar__item--sub'
	);

	return (
		<a className={ className } href={ href }>
			{ ! isSub && <Icon name={ icon } size={ 18 } /> }
			<ItemLabel>{ children }</ItemLabel>
		</a>
	);
}

function SubmenuButton( { item, expanded, isRtl, onClick } ) {
	let chevronIcon = 'chevron_right';
	if ( expanded ) {
		chevronIcon = 'chevron_down';
	} else if ( isRtl ) {
		chevronIcon = 'chevron_left';
	}

	return (
		<button
			className={ classnames(
				'lumora-global-sidebar__item',
				expanded && 'lumora-global-sidebar__item--expanded'
			) }
			onClick={ onClick }
			type="button"
			aria-expanded={ expanded }
		>
			<Icon name={ item.icon } size={ 18 } />
			<ItemLabel align={ isRtl ? 'right' : 'left' }>
				{ item.title }
			</ItemLabel>
			<Icon
				className="lumora-global-sidebar__chevron"
				name={ chevronIcon }
				size={ 12 }
			/>
		</button>
	);
}

export default function GlobalSidebar() {
	const [ expanded, setExpanded ] = useState( null );
	const data = window.lumoraData || {};
	const adminUrl = normalizeAdminUrl( data.adminUrl );
	const adminMenu = cleanMenuItems( data.adminMenu, adminUrl );
	const isRtl = !! data.isRtl;

	const toggleSub = useCallback( ( id ) => {
		setExpanded( ( prev ) => ( prev === id ? null : id ) );
	}, [] );

	return (
		<div className="lumora-global-sidebar" dir={ isRtl ? 'rtl' : 'ltr' }>
			<Brand />

			<nav className="lumora-global-sidebar__nav">
				<ul className="lumora-global-sidebar__menu">
					{ LUMORA_ITEMS.map( ( item ) => (
						<li key={ item.page }>
							<MenuLink
								href={ getLumoraUrl( adminUrl, item ) }
								icon={ item.icon }
							>
								{ item.label }
							</MenuLink>
						</li>
					) ) }

					{ adminMenu.length > 0 && (
						<li
							className="lumora-global-sidebar__divider"
							aria-hidden="true"
						/>
					) }

					{ adminMenu.map( ( item ) => (
						<li key={ item.id }>
							{ item.sub.length > 0 ? (
								<>
									<SubmenuButton
										item={ item }
										expanded={ expanded === item.id }
										isRtl={ isRtl }
										onClick={ () => toggleSub( item.id ) }
									/>
									{ expanded === item.id && (
										<ul className="lumora-global-sidebar__submenu">
											{ item.sub.map( ( sub ) => (
												<li key={ sub.url }>
													<MenuLink
														href={ sub.url }
														isSub
													>
														{ sub.title }
													</MenuLink>
												</li>
											) ) }
										</ul>
									) }
								</>
							) : (
								<MenuLink href={ item.url } icon={ item.icon }>
									{ item.title }
								</MenuLink>
							) }
						</li>
					) ) }
				</ul>
			</nav>
		</div>
	);
}
