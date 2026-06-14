import classnames from '../../utils/classnames';
import Icon from '../ui/Icon';
import ItemLabel from './ItemLabel';

export default function SubmenuButton( { item, expanded, isRtl, onClick } ) {
	let chevronIcon = 'chevron_right';
	if ( expanded ) {
		chevronIcon = 'chevron_down';
	} else if ( isRtl ) {
		chevronIcon = 'chevron_left';
	}

	return (
		<button
			className={ classnames(
				'lumora-global-sidebar__item',
				expanded && 'lumora-global-sidebar__item--expanded'
			) }
			onClick={ onClick }
			type="button"
			aria-expanded={ expanded }
		>
			<Icon name={ item.icon } size={ 18 } />
			<ItemLabel align={ isRtl ? 'right' : 'left' }>
				{ item.title }
			</ItemLabel>
			<Icon
				className="lumora-global-sidebar__chevron"
				name={ chevronIcon }
				size={ 12 }
			/>
		</button>
	);
}
