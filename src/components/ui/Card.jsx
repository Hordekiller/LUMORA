import classnames from '../../utils/classnames';

const Card = ( {
	variant = 'default',
	padding = 'md',
	hoverable = false,
	className,
	children,
	...rest
} ) => {
	const classes = classnames(
		'lumora-card',
		`lumora-card--${ variant }`,
		`lumora-card--pad-${ padding }`,
		hoverable && 'lumora-card--hoverable',
		className
	);

	return (
		<div className={ classes } { ...rest }>
			{ children }
		</div>
	);
};

Card.Header = ( { children, className, ...rest } ) => (
	<div
		className={ classnames( 'lumora-card__header', className ) }
		{ ...rest }
	>
		{ children }
	</div>
);

Card.Body = ( { children, className, ...rest } ) => (
	<div className={ classnames( 'lumora-card__body', className ) } { ...rest }>
		{ children }
	</div>
);

Card.Footer = ( { children, className, ...rest } ) => (
	<div
		className={ classnames( 'lumora-card__footer', className ) }
		{ ...rest }
	>
		{ children }
	</div>
);

export default Card;
