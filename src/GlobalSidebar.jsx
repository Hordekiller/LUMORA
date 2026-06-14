import { useState, useCallback } from '@wordpress/element';
import LUMORA_ITEMS from './components/sidebar/LumoraItems';
import {
	normalizeAdminUrl,
	getLumoraUrl,
	cleanMenuItems,
} from './components/sidebar/sidebarUtils';
import Brand from './components/sidebar/Brand';
import MenuLink from './components/sidebar/MenuLink';
import SubmenuButton from './components/sidebar/SubmenuButton';

export default function GlobalSidebar() {
	const [ expanded, setExpanded ] = useState( null );
	const data = window.lumoraData || {};
	const adminUrl = normalizeAdminUrl( data.adminUrl );
	const adminMenu = cleanMenuItems( data.adminMenu, adminUrl );
	const isRtl = !! data.isRtl;

	const toggleSub = useCallback( ( id ) => {
		setExpanded( ( prev ) => ( prev === id ? null : id ) );
	}, [] );

	return (
		<div className="lumora-global-sidebar" dir={ isRtl ? 'rtl' : 'ltr' }>
			<Brand />

			<nav className="lumora-global-sidebar__nav">
				<ul className="lumora-global-sidebar__menu">
					{ LUMORA_ITEMS.map( ( item ) => (
						<li key={ item.page }>
							<MenuLink
								href={ getLumoraUrl( adminUrl, item ) }
								icon={ item.icon }
							>
								{ item.label }
							</MenuLink>
						</li>
					) ) }

					{ adminMenu.length > 0 && (
						<li
							className="lumora-global-sidebar__divider"
							aria-hidden="true"
						/>
					) }

					{ adminMenu.map( ( item ) => (
						<li key={ item.id }>
							{ item.sub.length > 0 ? (
								<>
									<SubmenuButton
										item={ item }
										expanded={ expanded === item.id }
										isRtl={ isRtl }
										onClick={ () => toggleSub( item.id ) }
									/>
									{ expanded === item.id && (
										<ul className="lumora-global-sidebar__submenu">
											{ item.sub.map( ( sub ) => (
												<li key={ sub.url }>
													<MenuLink
														href={ sub.url }
														isSub
													>
														{ sub.title }
													</MenuLink>
												</li>
											) ) }
										</ul>
									) }
								</>
							) : (
								<MenuLink href={ item.url } icon={ item.icon }>
									{ item.title }
								</MenuLink>
							) }
						</li>
					) ) }
				</ul>
			</nav>
		</div>
	);
}
