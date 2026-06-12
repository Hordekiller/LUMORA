import { createReduxStore, register } from '@wordpress/data';
import { getWidgets, updateWidgets } from '../utils/api';

const STORE_NAME = 'lumora/widgets';

const DEFAULT_STATE = {
	widgets: [],
	layout: [],
	isLoading: false,
	isSaving: false,
	error: null,
};

const actions = {
	setWidgets: ( widgets ) => ( { type: 'SET_WIDGETS', widgets } ),
	setLayout: ( layout ) => ( { type: 'SET_LAYOUT', layout } ),
	setLoading: ( isLoading ) => ( { type: 'SET_LOADING', isLoading } ),
	setSaving: ( isSaving ) => ( { type: 'SET_SAVING', isSaving } ),
	setError: ( error ) => ( { type: 'SET_ERROR', error } ),

	fetchWidgets:
		() =>
		async ( { dispatch } ) => {
			dispatch.setLoading( true );
			try {
				const data = await getWidgets();
				dispatch.setWidgets( data.widgets || [] );
				dispatch.setLayout( data.layout || [] );
			} catch ( err ) {
				dispatch.setError( err.message );
			} finally {
				dispatch.setLoading( false );
			}
		},

	saveLayout:
		( layout ) =>
		async ( { dispatch } ) => {
			dispatch.setSaving( true );
			try {
				const result = await updateWidgets( layout );
				dispatch.setLayout( result.layout );
			} catch ( err ) {
				dispatch.setError( err.message );
			} finally {
				dispatch.setSaving( false );
			}
		},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_WIDGETS':
			return { ...state, widgets: action.widgets };
		case 'SET_LAYOUT':
			return { ...state, layout: action.layout };
		case 'SET_LOADING':
			return { ...state, isLoading: action.isLoading };
		case 'SET_SAVING':
			return { ...state, isSaving: action.isSaving };
		case 'SET_ERROR':
			return { ...state, error: action.error };
		default:
			return state;
	}
};

const selectors = {
	getWidgets: ( state ) => state.widgets,
	getLayout: ( state ) => state.layout,
	isLoading: ( state ) => state.isLoading,
	isSaving: ( state ) => state.isSaving,
	getError: ( state ) => state.error,
};

const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

register( store );

export default store;
