import classnames from '../../utils/classnames';
import Icon from '../ui/Icon';
import ItemLabel from './ItemLabel';

export default function MenuLink( { href, icon, children, isSub = false } ) {
	const className = classnames(
		'lumora-global-sidebar__item',
		isSub && 'lumora-global-sidebar__item--sub'
	);

	return (
		<a className={ className } href={ href }>
			{ ! isSub && <Icon name={ icon } size={ 18 } /> }
			<ItemLabel>{ children }</ItemLabel>
		</a>
	);
}
