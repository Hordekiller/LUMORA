import {
	useState,
	useCallback,
	createContext,
	useContext,
	useRef,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ToastContext = createContext( null );

let toastId = 0;

export function ToastProvider( { children } ) {
	const [ toasts, setToasts ] = useState( [] );
	const timersRef = useRef( {} );

	const removeToast = useCallback( ( id ) => {
		setToasts( ( prev ) => prev.filter( ( t ) => t.id !== id ) );
		if ( timersRef.current[ id ] ) {
			clearTimeout( timersRef.current[ id ] );
			delete timersRef.current[ id ];
		}
	}, [] );

	const addToast = useCallback(
		( message, type = 'info', duration = 4000 ) => {
			const id = ++toastId;
			setToasts( ( prev ) => [
				...prev,
				{ id, message, type, duration },
			] );
			if ( duration > 0 ) {
				timersRef.current[ id ] = setTimeout(
					() => removeToast( id ),
					duration
				);
			}
			return id;
		},
		[ removeToast ]
	);

	const success = useCallback(
		( msg, dur ) => addToast( msg, 'success', dur ),
		[ addToast ]
	);
	const error = useCallback(
		( msg, dur ) => addToast( msg, 'error', dur ),
		[ addToast ]
	);
	const info = useCallback(
		( msg, dur ) => addToast( msg, 'info', dur ),
		[ addToast ]
	);
	const warning = useCallback(
		( msg, dur ) => addToast( msg, 'warning', dur ),
		[ addToast ]
	);

	const contextValue = {
		addToast,
		removeToast,
		success,
		error,
		info,
		warning,
	};

	return (
		<ToastContext.Provider value={ contextValue }>
			{ children }
			<div className="lumora-toast-container" aria-live="polite">
				{ toasts.map( ( t ) => (
					<ToastItem
						key={ t.id }
						toast={ t }
						onDismiss={ removeToast }
					/>
				) ) }
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext( ToastContext );
	if ( ! ctx ) {
		throw new Error( 'useToast must be used within a ToastProvider' );
	}
	return ctx;
}

const ICONS = {
	success: 'yes',
	error: 'no',
	warning: 'warning',
	info: 'info',
};

function ToastItem( { toast, onDismiss } ) {
	const [ exiting, setExiting ] = useState( false );

	const handleDismiss = useCallback( () => {
		setExiting( true );
		setTimeout( () => onDismiss( toast.id ), 200 );
	}, [ toast.id, onDismiss ] );

	return (
		<div
			className={ `lumora-toast lumora-toast--${ toast.type }${
				exiting ? ' lumora-toast--exit' : ''
			}` }
			role="alert"
		>
			<span
				className={ `dashicons dashicons-${
					ICONS[ toast.type ]
				} lumora-toast__icon` }
			/>
			<span className="lumora-toast__message">{ toast.message }</span>
			<button
				className="lumora-toast__dismiss"
				onClick={ handleDismiss }
				aria-label={ __( 'Dismiss notification', 'lumora' ) }
				type="button"
			>
				<span className="dashicons dashicons-no-alt" />
			</button>
		</div>
	);
}
