import { useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from '../../utils/classnames';
import Icon from '../ui/Icon';

const MobileNav = ( { isOpen, onClose, children } ) => {
	const navRef = useRef( null );

	useEffect( () => {
		if ( isOpen && navRef.current ) {
			navRef.current.focus();
		}
	}, [ isOpen ] );

	useEffect( () => {
		const handleSwipe = ( e ) => {
			if ( isOpen && e.touches && e.touches[ 0 ].clientX > 200 ) {
				onClose();
			}
		};

		document.addEventListener( 'touchstart', handleSwipe );
		return () => document.removeEventListener( 'touchstart', handleSwipe );
	}, [ isOpen, onClose ] );

	return (
		<>
			{ isOpen && (
				<div
					className="lumora-mobile-nav-overlay"
					onClick={ onClose }
					aria-hidden="true"
				/>
			) }
			<nav
				ref={ navRef }
				className={ classnames(
					'lumora-mobile-nav',
					isOpen && 'lumora-mobile-nav--open'
				) }
				aria-label={ __( 'Mobile navigation', 'lumora' ) }
				tabIndex={ -1 }
			>
				<div className="lumora-mobile-nav__header">
					<span className="lumora-mobile-nav__title">
						{ __( 'Menu', 'lumora' ) }
					</span>
					<button
						className="lumora-mobile-nav__close"
						onClick={ onClose }
						aria-label={ __( 'Close navigation', 'lumora' ) }
						type="button"
					>
						<Icon name="close" size={ 24 } />
					</button>
				</div>
				{ children }
			</nav>
		</>
	);
};

export default MobileNav;
