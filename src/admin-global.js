import { render, createElement } from '@wordpress/element';
import GlobalSidebar from './GlobalSidebar';
import './styles/_admin-global.scss';

function mount() {
	const existing = document.getElementById( 'lumora-global-sidebar-root' );
	if ( existing ) {
		return;
	}

	const container = document.createElement( 'div' );
	container.id = 'lumora-global-sidebar-root';
	document.body.appendChild( container );

	render( createElement( GlobalSidebar ), container );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', mount );
} else {
	mount();
}
