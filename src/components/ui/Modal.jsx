import { useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from '../../utils/classnames';

const Modal = ( {
	isOpen,
	onClose,
	title,
	size = 'md',
	children,
	className,
} ) => {
	const handleEscape = useCallback(
		( e ) => {
			if ( e.key === 'Escape' ) {
				onClose();
			}
		},
		[ onClose ]
	);

	useEffect( () => {
		if ( isOpen ) {
			document.addEventListener( 'keydown', handleEscape );
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener( 'keydown', handleEscape );
			document.body.style.overflow = '';
		};
	}, [ isOpen, handleEscape ] );

	if ( ! isOpen ) {
		return null;
	}

	return (
		<div
			className="lumora-modal__overlay"
			onClick={ onClose }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					onClose();
				}
			} }
			role="presentation"
			tabIndex={ -1 }
		>
			{ /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */ }
			<div
				className={ classnames(
					'lumora-modal',
					`lumora-modal--${ size }`,
					className
				) }
				onClick={ ( e ) => e.stopPropagation() }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.stopPropagation();
					}
				} }
				role="dialog"
				tabIndex={ -1 }
				aria-modal="true"
				aria-label={ title }
			>
				<div className="lumora-modal__header">
					<h2 className="lumora-modal__title">{ title }</h2>
					<button
						className="lumora-modal__close"
						onClick={ onClose }
						aria-label={ __( 'Close', 'lumora' ) }
						type="button"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M15 5L5 15M5 5l10 10"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>
				<div className="lumora-modal__body">{ children }</div>
			</div>
		</div>
	);
};

export default Modal;
