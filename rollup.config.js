import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const license = `/*!
 * jpeg-alpha
 * https://github.com/yomotsu/jpeg-alpha
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */`;

export default {
	input: 'src/index.ts',
	output: [
		{
			format: 'umd',
			name: 'JpegAlpha',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		typescript( { typescript: require( 'typescript' ) } ),
	],
};
