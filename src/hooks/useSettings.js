import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function useSettings() {
	const settings = useSelect(
		( select ) => select( 'lumora/settings' ).getSettings(),
		[]
	);
	const isLoading = useSelect(
		( select ) => select( 'lumora/settings' ).isLoading(),
		[]
	);
	const isSaving = useSelect(
		( select ) => select( 'lumora/settings' ).isSaving(),
		[]
	);
	const isDirty = useSelect(
		( select ) => select( 'lumora/settings' ).isDirty(),
		[]
	);
	const { fetchSettings, saveSettings } = useDispatch( 'lumora/settings' );

	useEffect( () => {
		fetchSettings();
	}, [ fetchSettings ] );

	return {
		settings,
		isLoading,
		isSaving,
		isDirty,
		saveSettings,
	};
}
