const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin')
const mode = 'development'

const server = {
	entry: {
		'server': './src/server/server.js'
	},
	target: 'node',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				},
			}
		],
	},
	externals: [nodeExternals()],
};

const client = {
	entry: {
		'client': './src/client/index.js'
	},
	target: 'web',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/public')
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				},
				],
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader",
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.(scss|css)$/,
				use: [
					"style-loader",
					"css-loader",
				]
			}
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: 'src/client/index.html',
			filename: './index.html'
		})
	]
};

module.exports = [client, server];
