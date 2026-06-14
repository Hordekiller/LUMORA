import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect, useDispatch } from '@wordpress/data';
import { TextControl, SelectControl, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Lumora Sidebar Panel for the Block Editor.
 * Adds quick access to post-level Lumora settings.
 */
const LumoraSidebarPanel = () => {
	const postMeta = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		[]
	);

	const { editPost } = useDispatch( 'core/editor' );

	const updateMeta = ( key, value ) => {
		editPost( { meta: { ...postMeta, [ key ]: value } } );
	};

	return (
		<PluginDocumentSettingPanel
			name="lumora-sidebar"
			title={ __( 'Lumora', 'lumora' ) }
			className="lumora-editor-panel"
		>
			<PanelRow>
				<SelectControl
					label={ __( 'Sidebar Style', 'lumora' ) }
					value={ postMeta?.lumora_sidebar_style || 'default' }
					options={ [
						{ label: __( 'Default', 'lumora' ), value: 'default' },
						{ label: __( 'Compact', 'lumora' ), value: 'compact' },
						{
							label: __( 'Expanded', 'lumora' ),
							value: 'expanded',
						},
					] }
					onChange={ ( value ) =>
						updateMeta( 'lumora_sidebar_style', value )
					}
				/>
			</PanelRow>

			<PanelRow>
				<TextControl
					label={ __( 'Custom CSS Class', 'lumora' ) }
					value={ postMeta?.lumora_css_class || '' }
					onChange={ ( value ) =>
						updateMeta( 'lumora_css_class', value )
					}
					help={ __(
						'Add a custom CSS class to the post content wrapper.',
						'lumora'
					) }
				/>
			</PanelRow>

			<PanelRow>
				<SelectControl
					label={ __( 'Content Width', 'lumora' ) }
					value={ postMeta?.lumora_content_width || 'default' }
					options={ [
						{ label: __( 'Default', 'lumora' ), value: 'default' },
						{
							label: __( 'Narrow (600px)', 'lumora' ),
							value: 'narrow',
						},
						{
							label: __( 'Wide (1200px)', 'lumora' ),
							value: 'wide',
						},
						{ label: __( 'Full Width', 'lumora' ), value: 'full' },
					] }
					onChange={ ( value ) =>
						updateMeta( 'lumora_content_width', value )
					}
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'lumora-sidebar', {
	render: LumoraSidebarPanel,
	icon: 'admin-customizer',
} );
