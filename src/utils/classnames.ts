type ClassValue = string | number | boolean | null | undefined | ClassValue[];

/**
 * Merge class names into a single string.
 * Lightweight alternative to the `classnames` package.
 *
 * @param args - Class values to merge.
 * @return Merged class name string.
 */
export default function classnames( ...args: ClassValue[] ): string {
	return args.flat().filter( Boolean ).join( ' ' );
}
