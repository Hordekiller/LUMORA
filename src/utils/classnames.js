export default function classnames( ...args ) {
	return args.flat().filter( Boolean ).join( ' ' );
}
