import classnames from '../../utils/classnames';

const Skeleton = ( {
	variant = 'text',
	width,
	height,
	count = 1,
	className,
	...rest
} ) => {
	const items = Array.from( { length: count }, ( _, i ) => i );

	return (
		<div
			className={ classnames( 'lumora-skeleton-group', className ) }
			{ ...rest }
		>
			{ items.map( ( i ) => (
				<div
					key={ i }
					className={ classnames(
						'lumora-skeleton',
						`lumora-skeleton--${ variant }`
					) }
					style={ {
						width: width || undefined,
						height: variant === 'custom' ? height : undefined,
					} }
					aria-hidden="true"
				/>
			) ) }
		</div>
	);
};

Skeleton.Text = ( { lines = 3, ...rest } ) => (
	<Skeleton variant="text" count={ lines } { ...rest } />
);

Skeleton.Card = ( props ) => (
	<Skeleton variant="card" height="120px" { ...props } />
);

Skeleton.Avatar = ( props ) => (
	<Skeleton variant="circle" width="40px" height="40px" { ...props } />
);

export default Skeleton;
