import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Grid from '../layout/Grid';
import WidgetWrapper from './WidgetWrapper';
import Skeleton from '../ui/Skeleton';

const WidgetGrid = ( { widgets, layout, onLayoutChange, isLoading } ) => {
	const [ draggedItem, setDraggedItem ] = useState( null );

	if ( isLoading ) {
		return (
			<Grid columns={ 2 } gap="md">
				{ [ 1, 2, 3, 4 ].map( ( i ) => (
					<Grid.Item key={ i }>
						<div className="lumora-widget-wrapper" aria-busy="true">
							<Skeleton.Card />
						</div>
					</Grid.Item>
				) ) }
			</Grid>
		);
	}

	const handleDragStart = ( id ) => {
		setDraggedItem( id );
	};

	const handleDragOver = ( e ) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = ( e, targetId ) => {
		e.preventDefault();
		if ( ! draggedItem || draggedItem === targetId ) {
			return;
		}

		const newLayout = [ ...layout ];
		const fromIndex = newLayout.indexOf( draggedItem );
		const toIndex = newLayout.indexOf( targetId );

		if ( fromIndex === -1 || toIndex === -1 ) {
			return;
		}

		newLayout.splice( fromIndex, 1 );
		newLayout.splice( toIndex, 0, draggedItem );

		setDraggedItem( null );
		onLayoutChange( newLayout );
	};

	const handleDragEnd = () => {
		setDraggedItem( null );
	};

	if ( ! Array.isArray( layout ) || layout.length === 0 ) {
		return (
			<div className="lumora-dashboard__empty">
				<p className="lumora-text lumora-text--muted">
					{ __( 'No widgets configured.', 'lumora' ) }
				</p>
			</div>
		);
	}

	return (
		<Grid columns={ 2 } gap="md">
			{ layout.map( ( widgetId ) => {
				const widget = widgets.find( ( w ) => w.id === widgetId );
				if ( ! widget ) {
					return null;
				}

				return (
					<Grid.Item key={ widget.id }>
						<WidgetWrapper
							widget={ widget }
							isDragging={ draggedItem === widget.id }
							onDragStart={ () => handleDragStart( widget.id ) }
							onDragOver={ ( e ) =>
								handleDragOver( e, widget.id )
							}
							onDrop={ ( e ) => handleDrop( e, widget.id ) }
							onDragEnd={ handleDragEnd }
						/>
					</Grid.Item>
				);
			} ) }
		</Grid>
	);
};

export default WidgetGrid;
