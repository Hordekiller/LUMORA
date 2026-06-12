import classnames from '../../utils/classnames';

const Grid = ( { columns = 3, gap = 'md', children, className, ...rest } ) => {
	const classes = classnames(
		'lumora-grid',
		`lumora-grid--cols-${ columns }`,
		`lumora-grid--gap-${ gap }`,
		className
	);

	return (
		<div className={ classes } { ...rest }>
			{ children }
		</div>
	);
};

Grid.Item = ( { span = 1, children, className, ...rest } ) => (
	<div
		className={ classnames(
			'lumora-grid__item',
			`lumora-grid__item--span-${ span }`,
			className
		) }
		{ ...rest }
	>
		{ children }
	</div>
);

export default Grid;
