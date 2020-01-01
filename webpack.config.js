const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const _ = require('lodash');
// require('@babel/polyfill'); corejs polyfill

module.exports = (env) => {
	const config = {
		entry: [
			path.resolve(__dirname, 'src', 'public', 'js', 'client.js'),
		],

		output: {
			path: path.resolve(__dirname, 'src', 'public', 'js'),
			filename: 'index.bundle.min.js',
		},

		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'source-map-loader',
						},
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'@babel/preset-env',
										// corejs polyfill
										// {
										// 	"useBuiltIns": "entry",
										// 	'corejs': 3
										// }
									],
								],
							},
						},
					],
				},
				{
					test:  /\.(sa|sc|c)ss$/,
					use: [
						{
							loader: CssExtractPlugin.loader,
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				},
			],
		},

		resolve: {
			extensions: [".js", ".json", ".vue",],
		},

		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({sourceMap: true,}),],
		},

		plugins: [
			new CompressionPlugin(),
			new VueLoaderPlugin(),
			new CssExtractPlugin({
				filename: '../style/style.bundle.css',
				ignoreOrder: false,
			}),
		],
	};

	if(env.production) {
		_.merge(config, {
			mode: 'production',
			stats: 'minimal',
			externals: {
				// 'vue' to resolve to external cdn
				'vue': 'Vue',
			},
		});
	} else if(env.development) {
		_.merge(config, {
			mode: 'development',
			devtool: 'source-map',
			resolve: {
				alias: {
					// 'vue' to reference local development version (allows for vue devtools)
					'vue$': 'vue/dist/vue.js',
				},
			},
		});
	} else {
		throw new Error('Bad webpack env');
	}

	return config;
};