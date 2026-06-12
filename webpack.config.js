const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        admin:   path.resolve( __dirname, 'src/index.js' ),
        palette: path.resolve( __dirname, 'src/palette.js' ),
    },
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: '[name].js',
    },
};
