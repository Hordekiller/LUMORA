import { __ } from '@wordpress/i18n';
import Icon from '../ui/Icon';
import Toggle from '../ui/Toggle';

const Header = ( { onMenuToggle, onThemeToggle, theme, onSearchClick } ) => {
	return (
		<header className="lumora-header" role="banner">
			<div className="lumora-header__left">
				<button
					className="lumora-header__menu-btn"
					onClick={ onMenuToggle }
					aria-label={ __( 'Toggle menu', 'lumora' ) }
					type="button"
				>
					<Icon name="menu" size={ 22 } />
				</button>

				<button
					className="lumora-header__search"
					onClick={ onSearchClick }
					type="button"
				>
					<span
						className="lumora-header__search-icon"
						aria-hidden="true"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</span>
					<span className="lumora-header__search-placeholder">
						{ __( 'Search…', 'lumora' ) }
					</span>
					<kbd className="lumora-header__search-kbd">Ctrl+K</kbd>
				</button>
			</div>

			<div className="lumora-header__right">
				<Toggle
					checked={ theme === 'dark' }
					onChange={ onThemeToggle }
					label={
						theme === 'dark'
							? __( 'Light mode', 'lumora' )
							: __( 'Dark mode', 'lumora' )
					}
					size="sm"
				/>
				<div className="lumora-header__avatar">
					<span className="lumora-header__avatar-placeholder">
						{ __( 'A', 'lumora' ) }
					</span>
				</div>
			</div>
		</header>
	);
};

export default Header;
