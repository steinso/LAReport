var webpack           = require('webpack');
var path              = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DevEnvPlugin = new webpack.DefinePlugin({
	'process.env': {
		'NODE_ENV': JSON.stringify('development')

	}
});

/*var sassLoaders = [
  'css-loader',
  'autoprefixer-loader' +
  '?browsers=last 2 version',
  '?includePaths[]=' + path.resolve(__dirname, './js')    // includes app dir for libsass

  ];
  */

module.exports = {

	entry: [
			/*'webpack/hot/dev-server',*/
			"webpack-dev-server/client?http://192.168.1.158:8081",
			"webpack/hot/only-dev-server",
			'./static/js/main.js'
	],

	debug: true,
	devtool: 'eval',

	output: {
		path: './static/',
		filename: 'bundle.js',
		publicPath: 'http://192.168.1.158:8081/'
	},

	externals: {
		"jquery": "jQuery",
		"lodash": "lodash",
		"jsx": "jsx",
		"d3": "d3"
	},

	resolve: {
		// Allow to omit extensions when requiring these files
		extensions: ['', '.scss', '.js', '.jsx'],
		modulesDirectories: [ 'js/', 'node_modules/']
	},

	module: {
		loaders: [
			{ test: /\.(js)$/,  loaders: ['react-hot', 'babel'], exclude: /node_modules/  },
			{ test: /\.(jsx)$/,  loaders: ['react-hot', 'babel'] },
			/*{ test: /\.css$/,  loader: ExtractTextPlugin.extract('style-loader', 'css-loader')  },*/
			{ test: /\.css$/,  loader: 'style!css' }
			/*{ test: /\.(jpg|png)$/,  loader: 'url-loader?limit=8192'  }*/
		]
	},

	plugins: [
		DevEnvPlugin,
		/*new ExtractTextPlugin('[name].css'),*/
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()    // don't reload if there are errors

	],
	devServer: {
		publicPath:  "http://192.168.1.158:8081/",
		port:"8081",
		contentBase: "./static",
		hot:         true,
		inline:      true,
		lazy:        false,
		quiet:       false,
		noInfo:      false,
		headers:     {"Access-Control-Allow-Origin": "*"},
		stats:       {colors: true},
		host:        "0.0.0.0"
	}
};
