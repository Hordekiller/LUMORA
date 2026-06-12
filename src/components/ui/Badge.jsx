import classnames from '../../utils/classnames';

const Badge = ( {
	variant = 'default',
	size = 'sm',
	children,
	className,
	...rest
} ) => {
	const classes = classnames(
		'lumora-badge',
		`lumora-badge--${ variant }`,
		`lumora-badge--${ size }`,
		className
	);

	return (
		<span className={ classes } { ...rest }>
			{ children }
		</span>
	);
};

export default Badge;
