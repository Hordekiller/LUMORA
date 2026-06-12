import { useState, useRef } from '@wordpress/element';
import classnames from '../../utils/classnames';

const Tooltip = ( {
	content,
	position = 'top',
	delay = 300,
	children,
	className,
} ) => {
	const [ visible, setVisible ] = useState( false );
	const timerRef = useRef( null );

	const show = () => {
		timerRef.current = setTimeout( () => setVisible( true ), delay );
	};

	const hide = () => {
		clearTimeout( timerRef.current );
		setVisible( false );
	};

	return (
		<span
			className={ classnames( 'lumora-tooltip-wrapper', className ) }
			onMouseEnter={ show }
			onMouseLeave={ hide }
			onFocus={ show }
			onBlur={ hide }
		>
			{ children }
			{ visible && (
				<span
					className={ classnames(
						'lumora-tooltip',
						`lumora-tooltip--${ position }`
					) }
					role="tooltip"
				>
					{ content }
				</span>
			) }
		</span>
	);
};

export default Tooltip;
