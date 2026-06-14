import classnames from '../../utils/classnames';

export default function ItemLabel( { children, align } ) {
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
