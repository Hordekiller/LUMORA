export const normalizeAdminUrl = ( url ) => {
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

export const getLumoraUrl = ( adminUrl, item ) => {
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

export const isSafeAdminUrl = ( url, adminUrl ) => {
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

export const cleanMenuItems = ( items, adminUrl ) => {
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
