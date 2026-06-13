import classnames from '../../utils/classnames';

const Toggle = ( {
	checked = false,
	onChange,
	label,
	disabled = false,
	size = 'md',
	id,
} ) => {
	const toggleId =
		id || `lumora-toggle-${ Math.random().toString( 36 ).slice( 2 ) }`;

	return (
		<label
			className={ classnames(
				'lumora-toggle',
				`lumora-toggle--${ size }`,
				checked && 'lumora-toggle--active',
				disabled && 'lumora-toggle--disabled'
			) }
			htmlFor={ toggleId }
		>
			<input
				id={ toggleId }
				type="checkbox"
				className="lumora-toggle__input"
				checked={ checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
				disabled={ disabled }
				aria-checked={ checked }
			/>
			<span className="lumora-toggle__track" aria-hidden="true">
				<span className="lumora-toggle__thumb" />
			</span>
			{ label && <span className="lumora-toggle__label">{ label }</span> }
		</label>
	);
};

export default Toggle;
