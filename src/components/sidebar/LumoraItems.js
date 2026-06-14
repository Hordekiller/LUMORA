import { __ } from '@wordpress/i18n';

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

export default LUMORA_ITEMS;
