import classnames from '../../utils/classnames';

const Button = ( {
	variant = 'primary',
	size = 'md',
	loading = false,
	fullWidth = false,
	icon = null,
	children,
	...rest
} ) => {
	const classes = classnames(
		'lumora-btn',
		`lumora-btn--${ variant }`,
		`lumora-btn--${ size }`,
		fullWidth && 'lumora-btn--full',
		loading && 'lumora-btn--loading'
	);

	return (
		<button
			className={ classes }
			disabled={ loading || rest.disabled }
			aria-busy={ loading }
			{ ...rest }
		>
			{ loading && (
				<span className="lumora-spinner" aria-hidden="true" />
			) }
			{ icon && (
				<span className="lumora-btn__icon" aria-hidden="true">
					{ icon }
				</span>
			) }
			<span className="lumora-btn__label">{ children }</span>
		</button>
	);
};

export default Button;
