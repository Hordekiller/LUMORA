import { useEffect } from '@wordpress/element';

const listeners = new Map();

export function registerGlobalShortcut( key, handler ) {
	listeners.set( key, handler );
}

export function unregisterGlobalShortcut( key ) {
	listeners.delete( key );
}

export default function useKeyboard( keyMap, enabled = true ) {
	useEffect( () => {
		if ( ! enabled ) {
			return;
		}

		const handler = ( event ) => {
			const key = event.key;
			const ctrl = event.ctrlKey || event.metaKey;

			if ( ctrl && key === 'k' ) {
				event.preventDefault();
				const paletteHandler = listeners.get( 'Ctrl+K' );
				if ( paletteHandler ) {
					paletteHandler( event );
					return;
				}
			}

			if (
				keyMap[ key ] &&
				! ctrl &&
				! event.altKey &&
				! event.shiftKey
			) {
				event.preventDefault();
				keyMap[ key ]( event );
				return;
			}

			for ( const [ combo, fn ] of listeners ) {
				const parts = combo.split( '+' );
				const needsCtrl = parts.includes( 'Ctrl' );
				const needsShift = parts.includes( 'Shift' );
				const needsAlt = parts.includes( 'Alt' );
				const targetKey = parts[ parts.length - 1 ];

				if (
					key === targetKey &&
					needsCtrl === ctrl &&
					needsShift === event.shiftKey &&
					needsAlt === event.altKey
				) {
					event.preventDefault();
					fn( event );
					return;
				}
			}
		};

		window.addEventListener( 'keydown', handler );
		return () => window.removeEventListener( 'keydown', handler );
	}, [ keyMap, enabled ] );
}
