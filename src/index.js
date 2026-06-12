import { render, createElement } from '@wordpress/element';
import App from './App';
import './store';
import './styles/main.scss';

const root = document.getElementById( 'lumora-root' );

if ( root ) {
	render( createElement( App ), root );
}
