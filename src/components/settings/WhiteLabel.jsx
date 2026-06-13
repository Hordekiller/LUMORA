import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import Skeleton from '../ui/Skeleton';

const WhiteLabel = () => {
	const [ config, setConfig ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ message, setMessage ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/lumora/v1/white-label' } )
			.then( ( data ) => {
				setConfig( {
					enabled: data?.enabled === true || data?.enabled === '1',
					plugin_name: data?.plugin_name || '',
					primary_color: data?.primary_color || '',
					footer_text: data?.footer_text || '',
					hide_branding:
						data?.hide_branding === true ||
						data?.hide_branding === '1',
				} );
				setIsLoading( false );
			} )
			.catch( () => setIsLoading( false ) );
	}, [] );

	const handleChange = ( key, value ) => {
		setConfig( ( prev ) => ( { ...prev, [ key ]: value } ) );
	};

	const saveConfig = () => {
		setIsSaving( true );
		setMessage( null );

		apiFetch( {
			path: '/lumora/v1/white-label',
			method: 'POST',
			data: {
				enabled: config.enabled,
				plugin_name: config.plugin_name,
				primary_color: config.primary_color,
				footer_text: config.footer_text,
				hide_branding: config.hide_branding,
			},
		} )
			.then( () => {
				setMessage( {
					type: 'success',
					text: __( 'White label settings saved.', 'lumora' ),
				} );
				setIsSaving( false );
				setTimeout( () => setMessage( null ), 3000 );
			} )
			.catch( () => {
				setMessage( {
					type: 'error',
					text: __( 'Failed to save settings.', 'lumora' ),
				} );
				setIsSaving( false );
			} );
	};

	if ( isLoading ) {
		return (
			<Card padding="lg">
				<Skeleton.Text lines={ 6 } />
			</Card>
		);
	}

	return (
		<div className="lumora-white-label">
			<div className="lumora-white-label__header">
				<h1 className="lumora-heading lumora-heading--3">
					{ __( 'White Label', 'lumora' ) }
				</h1>
				<p className="lumora-text lumora-text--muted">
					{ __(
						'Rebrand Lumora for your agency or clients.',
						'lumora'
					) }
				</p>
			</div>

			{ message && (
				<div
					className={ `lumora-notice lumora-notice--${ message.type }` }
				>
					<span className="lumora-text lumora-text--sm">
						{ message.text }
					</span>
				</div>
			) }

			<Card padding="lg">
				<Card.Body>
					<div className="lumora-white-label__group">
						<div className="lumora-white-label__row">
							{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
							<label className="lumora-white-label__label">
								<span className="lumora-text">
									{ __( 'Enable White Label', 'lumora' ) }
								</span>
								<span className="lumora-text lumora-text--xs lumora-text--muted">
									{ __(
										'Toggle to customize branding.',
										'lumora'
									) }
								</span>
							</label>
							<Toggle
								checked={ config.enabled }
								onChange={ ( checked ) =>
									handleChange( 'enabled', checked )
								}
							/>
						</div>
					</div>

					{ config.enabled && (
						<>
							<div className="lumora-white-label__group">
								<h4 className="lumora-text lumora-text--sm">
									{ __( 'Plugin Name', 'lumora' ) }
								</h4>
								<div className="lumora-white-label__field">
									<input
										className="lumora-input"
										type="text"
										value={ config.plugin_name }
										onChange={ ( e ) =>
											handleChange(
												'plugin_name',
												e.target.value
											)
										}
										placeholder={ __(
											'Enter custom plugin name…',
											'lumora'
										) }
									/>
									<p className="lumora-text lumora-text--xs lumora-text--muted">
										{ __(
											'Changes the plugin name displayed in the admin menu.',
											'lumora'
										) }
									</p>
								</div>
							</div>

							<div className="lumora-white-label__group">
								<h4 className="lumora-text lumora-text--sm">
									{ __( 'Primary Color', 'lumora' ) }
								</h4>
								<div className="lumora-white-label__field">
									<div className="lumora-white-label__color-picker">
										<input
											type="color"
											value={
												config.primary_color ||
												'#6366f1'
											}
											onChange={ ( e ) =>
												handleChange(
													'primary_color',
													e.target.value
												)
											}
											className="lumora-color-input"
										/>
										<span className="lumora-text lumora-text--sm lumora-text--muted">
											{ config.primary_color ||
												'#6366f1' }
										</span>
									</div>
									<p className="lumora-text lumora-text--xs lumora-text--muted">
										{ __(
											'Custom primary color for the admin theme.',
											'lumora'
										) }
									</p>
								</div>
							</div>

							<div className="lumora-white-label__group">
								<h4 className="lumora-text lumora-text--sm">
									{ __( 'Footer Text', 'lumora' ) }
								</h4>
								<div className="lumora-white-label__field">
									<input
										className="lumora-input"
										type="text"
										value={ config.footer_text }
										onChange={ ( e ) =>
											handleChange(
												'footer_text',
												e.target.value
											)
										}
										placeholder={ __(
											'Custom footer text…',
											'lumora'
										) }
									/>
									<p className="lumora-text lumora-text--xs lumora-text--muted">
										{ __(
											'Custom text for the WordPress admin footer.',
											'lumora'
										) }
									</p>
								</div>
							</div>

							<div className="lumora-white-label__group">
								<div className="lumora-white-label__row">
									{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
									<label className="lumora-white-label__label">
										<span className="lumora-text">
											{ __(
												'Hide Lumora Branding',
												'lumora'
											) }
										</span>
										<span className="lumora-text lumora-text--xs lumora-text--muted">
											{ __(
												'Remove the Lumora logo and name from the sidebar.',
												'lumora'
											) }
										</span>
									</label>
									<Toggle
										checked={ config.hide_branding }
										onChange={ ( e ) =>
											handleChange(
												'hide_branding',
												e.target.checked
											)
										}
									/>
								</div>
							</div>
						</>
					) }
				</Card.Body>
			</Card>

			<div className="lumora-white-label__actions">
				<Button
					variant="primary"
					size="md"
					loading={ isSaving }
					onClick={ saveConfig }
				>
					{ __( 'Save Settings', 'lumora' ) }
				</Button>
			</div>
		</div>
	);
};

export default WhiteLabel;
