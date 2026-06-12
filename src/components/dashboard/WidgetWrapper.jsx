import { __ } from '@wordpress/i18n';
import classnames from '../../utils/classnames';

import StatsWidget from '../widgets/StatsWidget';
import PostsWidget from '../widgets/PostsWidget';
import SystemWidget from '../widgets/SystemWidget';
import CommentsWidget from '../widgets/CommentsWidget';

const widgetMap = {
	widget_stats: StatsWidget,
	widget_posts: PostsWidget,
	widget_system: SystemWidget,
	widget_comments: CommentsWidget,
};

const WidgetWrapper = ( {
	widget,
	isDragging,
	onDragStart,
	onDragOver,
	onDrop,
	onDragEnd,
	loading,
} ) => {
	if ( loading || ! widget ) {
		return (
			<div className="lumora-widget-wrapper" aria-busy="true">
				<div className="lumora-widget-wrapper__body">
					<p className="lumora-text lumora-text--muted lumora-text--sm">
						{ __( 'Loading…', 'lumora' ) }
					</p>
				</div>
			</div>
		);
	}

	const WidgetComponent = widgetMap[ widget.id ];

	return (
		<div
			className={ classnames(
				'lumora-widget-wrapper',
				isDragging && 'lumora-widget-wrapper--dragging'
			) }
			draggable
			onDragStart={ onDragStart }
			onDragOver={ onDragOver }
			onDrop={ onDrop }
			onDragEnd={ onDragEnd }
		>
			{ WidgetComponent ? (
				<WidgetComponent />
			) : (
				<div className="lumora-widget-wrapper__body">
					<p className="lumora-text lumora-text--muted lumora-text--sm">
						{ widget.title || __( 'Widget', 'lumora' ) }
					</p>
					<p className="lumora-text lumora-text--xs lumora-text--disabled">
						{ widget.description || '' }
					</p>
				</div>
			) }
		</div>
	);
};

export default WidgetWrapper;
