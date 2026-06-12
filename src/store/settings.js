import { createReduxStore, register } from '@wordpress/data';
import { getSettings, updateSettings } from '../utils/api';

const STORE_NAME = 'lumora/settings';

const DEFAULT_STATE = {
	settings: {
		theme: 'light',
		sidebar_collapsed: false,
	},
	isLoading: false,
	isSaving: false,
	error: null,
	isDirty: false,
};

const actions = {
	setSettings: ( settings ) => ( { type: 'SET_SETTINGS', settings } ),
	setLoading: ( isLoading ) => ( { type: 'SET_LOADING', isLoading } ),
	setSaving: ( isSaving ) => ( { type: 'SET_SAVING', isSaving } ),
	setError: ( error ) => ( { type: 'SET_ERROR', error } ),
	setDirty: ( isDirty ) => ( { type: 'SET_DIRTY', isDirty } ),

	fetchSettings:
		() =>
		async ( { dispatch } ) => {
			dispatch.setLoading( true );
			try {
				const settings = await getSettings();
				dispatch.setSettings( settings );
				dispatch.setDirty( false );
			} catch ( err ) {
				dispatch.setError( err.message );
			} finally {
				dispatch.setLoading( false );
			}
		},

	saveSettings:
		( data ) =>
		async ( { dispatch } ) => {
			dispatch.setSaving( true );
			try {
				const result = await updateSettings( data );
				dispatch.setSettings( result.settings || result );
				dispatch.setDirty( false );
			} catch ( err ) {
				dispatch.setError( err.message );
			} finally {
				dispatch.setSaving( false );
			}
		},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_SETTINGS':
			return {
				...state,
				settings: { ...state.settings, ...action.settings },
				isDirty: true,
			};
		case 'SET_LOADING':
			return { ...state, isLoading: action.isLoading };
		case 'SET_SAVING':
			return { ...state, isSaving: action.isSaving };
		case 'SET_ERROR':
			return { ...state, error: action.error };
		case 'SET_DIRTY':
			return { ...state, isDirty: action.isDirty };
		default:
			return state;
	}
};

const selectors = {
	getSettings: ( state ) => state.settings,
	getSetting: ( state, key ) => state.settings[ key ],
	isLoading: ( state ) => state.isLoading,
	isSaving: ( state ) => state.isSaving,
	getError: ( state ) => state.error,
	isDirty: ( state ) => state.isDirty,
};

const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

register( store );

export default store;
