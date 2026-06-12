import { __ } from '@wordpress/i18n';
import Card from '../ui/Card';
import Toggle from '../ui/Toggle';

import useSettings from '../../hooks/useSettings';

const Settings = () => {
	const { settings, isLoading, saveSettings } = useSettings();

	const handleToggle = ( key ) => {
		saveSettings( { [ key ]: ! settings[ key ] } );
	};

	if ( isLoading ) {
		return (
			<div className="lumora-settings">
				<Card padding="lg">
					<p className="lumora-text lumora-text--muted">
						{ __( 'Loading settings…', 'lumora' ) }
					</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="lumora-settings">
			<div className="lumora-settings__header">
				<h1 className="lumora-heading lumora-heading--3">
					{ __( 'Settings', 'lumora' ) }
				</h1>
				<p className="lumora-text lumora-text--muted">
					{ __( 'Customize your Lumora dashboard.', 'lumora' ) }
				</p>
			</div>

			<Card padding="lg">
				<Card.Body>
					<div className="lumora-settings__group">
						<h4 className="lumora-text lumora-text--sm">
							{ __( 'Sidebar', 'lumora' ) }
						</h4>
						<div className="lumora-settings__row">
							{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
							<label className="lumora-settings__label">
								<span className="lumora-text">
									{ __( 'Collapsed by default', 'lumora' ) }
								</span>
								<span className="lumora-text lumora-text--xs lumora-text--muted">
									{ __(
										'Start with the sidebar collapsed on each page load.',
										'lumora'
									) }
								</span>
							</label>
							<Toggle
								checked={ !! settings.sidebar_collapsed }
								onChange={ () =>
									handleToggle( 'sidebar_collapsed' )
								}
							/>
						</div>
					</div>

					<div className="lumora-settings__group">
						<h4 className="lumora-text lumora-text--sm">
							{ __( 'General', 'lumora' ) }
						</h4>
						<div className="lumora-settings__row">
							{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
							<label className="lumora-settings__label">
								<span className="lumora-text">
									{ __( 'Widgets', 'lumora' ) }
								</span>
								<span className="lumora-text lumora-text--xs lumora-text--muted">
									{ __(
										'Enable or disable dashboard widgets.',
										'lumora'
									) }
								</span>
							</label>
							<Toggle
								checked={ !! settings.widgets_enabled }
								onChange={ () =>
									handleToggle( 'widgets_enabled' )
								}
							/>
						</div>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
};

export default Settings;
