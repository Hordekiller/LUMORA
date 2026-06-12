function normalize( str ) {
	return str
		.toLowerCase()
		.normalize( 'NFD' )
		.replace( /[\u0300-\u036f]/g, '' )
		.replace( /[^\w\s]/g, '' )
		.trim();
}

function score( query, target ) {
	const q = normalize( query );
	const t = normalize( target );

	if ( t === q ) {
		return 100;
	}
	if ( t.startsWith( q ) ) {
		return 90;
	}
	if ( t.includes( q ) ) {
		return 70;
	}

	const chars = q.split( '' );
	let ti = 0;
	let matched = 0;
	let consecutive = 0;
	let maxConsecutive = 0;

	for ( let ci = 0; ci < chars.length && ti < t.length; ci++ ) {
		while ( ti < t.length && t[ ti ] !== chars[ ci ] ) {
			ti++;
			consecutive = 0;
		}
		if ( ti < t.length && t[ ti ] === chars[ ci ] ) {
			matched++;
			consecutive++;
			maxConsecutive = Math.max( maxConsecutive, consecutive );
			ti++;
		}
	}

	if ( matched === 0 ) {
		return 0;
	}

	const matchRatio = matched / chars.length;
	const positionalScore = ( maxConsecutive / chars.length ) * 30;
	const lengthPenalty = Math.max(
		0,
		1 - ( ( t.length - q.length ) / t.length ) * 0.3
	);

	return Math.round(
		Math.min( 100, ( matchRatio * 70 + positionalScore ) * lengthPenalty )
	);
}

export default function fuzzySearch(
	query,
	items,
	{ keys = [ 'title' ], threshold = 10 } = {}
) {
	if ( ! query || query.length < 1 ) {
		return items;
	}

	const scored = [];

	for ( const item of items ) {
		let bestScore = 0;

		for ( const key of keys ) {
			const value = String( item[ key ] || '' );
			const s = score( query, value );
			if ( s > bestScore ) {
				bestScore = s;
			}
		}

		if ( bestScore >= threshold ) {
			scored.push( { ...item, _score: bestScore } );
		}
	}

	return scored.sort( ( a, b ) => b._score - a._score );
}
