import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import api from '../../utils/api';

const getGroupIcon = ( group ) => {
	if ( group === 'php' ) {
		return 'admin-generic';
	}
	if ( group === 'wp' ) {
		return 'wordpress';
	}
	return 'admin-network';
};

const STATUS_LABELS = {
	php: __( 'PHP', 'lumora' ),
	wp: __( 'WordPress', 'lumora' ),
	server: __( 'Server', 'lumora' ),
};

const SystemStatus = () => {
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		api.get( '/dashboard/system-status' )
			.then( setData )
			.catch( () => setData( null ) )
			.finally( () => setLoading( false ) );
	}, [] );

	if ( loading ) {
		return (
			<p className="lumora-system-status__loading">
				{ __( 'Loading system status…', 'lumora' ) }
			</p>
		);
	}

	if ( ! data ) {
		return null;
	}

	const statusItems = [
		{
			group: 'php',
			items: [
				{ label: __( 'Version', 'lumora' ), value: data.php.version },
				{
					label: __( 'Memory Limit', 'lumora' ),
					value: data.php.memory,
				},
				{
					label: __( 'Max Execution', 'lumora' ),
					value: sprintf(
						/* translators: %s: max execution time in seconds */
						__( '%s sec', 'lumora' ),
						data.php.max_exec
					),
				},
				{
					label: __( 'Upload Max', 'lumora' ),
					value: data.php.upload_max,
				},
				{ label: __( 'Post Max', 'lumora' ), value: data.php.post_max },
			],
		},
		{
			group: 'wp',
			items: [
				{ label: __( 'Version', 'lumora' ), value: data.wp.version },
				{
					label: __( 'Multisite', 'lumora' ),
					value: data.wp.multisite
						? __( 'Yes', 'lumora' )
						: __( 'No', 'lumora' ),
				},
				{
					label: __( 'Memory Limit', 'lumora' ),
					value: data.wp.memory_limit,
				},
				{
					label: __( 'Debug Mode', 'lumora' ),
					value: data.wp.debug
						? sprintf(
								'<span class="lumora-badge lumora-badge--warning">%s</span>',
								__( 'Enabled', 'lumora' )
						  )
						: __( 'Disabled', 'lumora' ),
					raw: true,
				},
				{
					label: __( 'Object Cache', 'lumora' ),
					value: data.wp.cache
						? __( 'Enabled', 'lumora' )
						: __( 'Disabled', 'lumora' ),
				},
				{
					label: __( 'WP-Cron', 'lumora' ),
					value: data.wp.cron
						? __( 'Enabled', 'lumora' )
						: __( 'Disabled', 'lumora' ),
				},
			],
		},
		{
			group: 'server',
			items: [
				{
					label: __( 'Software', 'lumora' ),
					value: data.server.software,
				},
				{
					label: __( 'Database', 'lumora' ),
					value: sprintf(
						/* translators: %s: MySQL version number */
						__( 'MySQL %s', 'lumora' ),
						data.server.db
					),
				},
				{
					label: __( 'PHP Extensions', 'lumora' ),
					value: Object.entries( data.server.php_exts )
						.filter( ( [ , loaded ] ) => loaded )
						.map( ( [ name ] ) => name )
						.join( ', ' ),
				},
			],
		},
	];

	return (
		<div className="lumora-system-status">
			<h3 className="lumora-system-status__title">
				{ __( 'System Status', 'lumora' ) }
			</h3>
			<div className="lumora-system-status__grid">
				{ statusItems.map( ( group ) => (
					<div
						key={ group.group }
						className="lumora-system-status__group"
					>
						<h4 className="lumora-system-status__group-title">
							<span
								className={ `dashicons dashicons-${ getGroupIcon(
									group.group
								) }` }
							/>
							{ STATUS_LABELS[ group.group ] }
						</h4>
						<table className="lumora-system-status__table">
							<tbody>
								{ group.items.map( ( item ) => (
									<tr
										key={ item.label }
										className="lumora-system-status__row"
									>
										<td className="lumora-system-status__label">
											{ item.label }
										</td>
										<td className="lumora-system-status__value">
											{ item.raw ? (
												<span
													dangerouslySetInnerHTML={ {
														__html: item.value,
													} }
												/>
											) : (
												item.value
											) }
										</td>
									</tr>
								) ) }
							</tbody>
						</table>
					</div>
				) ) }
			</div>
		</div>
	);
};

export default SystemStatus;
