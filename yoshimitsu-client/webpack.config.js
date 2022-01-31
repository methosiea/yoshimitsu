const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { exit } = require('process');

let currentScriptSrcOrigin = null;
let currentScriptSrc = null;
let externalScriptSrc = null;

// In the production environment we want to make sure that APP_URL is set by the provider.
// Otherwise we terminate the compilation
if (process.env.NODE_ENV === 'production' && !process.env.APP_URL) {
	console.error("Please specify the environment variable 'APP_URL' for production use.");

	exit(1);
}

// If environment variable APP_URL was found, we create the script URL based on this.
if (process.env.APP_URL) {
	console.log(`The environment variable 'APP_URL' (${process.env.APP_URL}) was found.`);

	try {
		const { origin } = new URL(process.env.APP_URL);

		// Script URLs based on the APP_URL:
		currentScriptSrcOrigin = origin;
		currentScriptSrc = new URL('/yoshimitsu-client.js', origin).toString();
		externalScriptSrc = new URL('/yoshimitsu-external.js', origin).toString();
	} catch {
		console.error('The specified app URL is not valid. Please check it.');

		exit(1);
	}

	console.log(
		'Successfully created script URLs based on the app URL.' +
			`\n\t=> CURRENT_SCRIPT_SRC_ORIGIN: '${currentScriptSrcOrigin}'` +
			`\n\t=> CURRENT_SCRIPT_SRC: '${currentScriptSrc}'` +
			`\n\t=> EXTERNAL_SCRIPT_SRC: '${externalScriptSrc}'`
	);
}

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const isDevelopment = argv.mode === 'development';

	const analyze = env.analyze && env.analyze !== 'false' && env.analyze !== '0' ? true : false;

	// In Production mode, the built-in killswitch no longer works, so we should be quite sure about this.
	if (isProduction) {
		console.log('Builds in Production Mode. Are you sure you want to build in Production mode?');
	}

	return merge(
		{
			mode: 'production',
			entry: {
				'yoshimitsu-client': './src/yoshimitsu-client.ts',
			},
			externals: {
				jquery: 'jQuery',
			},
			module: {
				rules: [
					{
						test: /\.ts$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								cacheDirectory: isDevelopment,
								cacheCompression: isProduction,
								plugins: ['babel-plugin-ts-nameof'],
								presets: [
									// See: https://babeljs.io/docs/en/presets#preset-ordering
									// See: https://github.com/babel/babel/issues/12066
									[
										'@babel/preset-env',
										{
											bugfixes: true,
											useBuiltIns: 'usage',
											corejs: '3',
										},
									],
									'@babel/preset-typescript',
								],
							},
						},
					},
				],
			},
			resolve: {
				extensions: ['.tsx', '.ts', '.js'],
				plugins: [new TsconfigPathsPlugin()],
			},
			plugins: [
				new webpack.EnvironmentPlugin({
					CURRENT_SCRIPT_SRC_ORIGIN: currentScriptSrcOrigin,
					CURRENT_SCRIPT_SRC: currentScriptSrc,
					EXTERNAL_SCRIPT_SRC: externalScriptSrc,
				}),
			],
			output: {
				filename: '[name].js',
				path: path.join(__dirname, 'lib/js'),
			},
		},
		isProduction && {
			devtool: false,
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							compress: {
								drop_console: true,
							},
						},
					}),
				],
			},
		},
		isDevelopment && {
			devtool: 'inline-source-map',
		},
		analyze && {
			plugins: [new BundleAnalyzerPlugin({ analyzerPort: 'auto' })],
		}
	);
};
