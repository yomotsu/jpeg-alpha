import { EventDispatcher } from './EventDispatcher';
import { getWebglContext } from './webgl-utils';
import { Texture } from './Texture';
import {
	VERTEX_SHADER_SOURCE,
	FRAGMENT_SHADER_SOURCE,
} from './shader';

const VERTEXES = new Float32Array( [
	- 1, - 1,
	  1, - 1,
	- 1,   1,
	  1, - 1,
	  1,   1,
	- 1,   1,
] );

const UV = new Float32Array( [
	0, 0,
	1, 0,
	0, 1,
	1, 0,
	1, 1,
	0, 1,
] );

export class JpegAlpha extends EventDispatcher {

	private _canvas: HTMLCanvasElement;
	private _rgbTexture: Texture;
	private _alphaTexture: Texture;
	private _destroyed: boolean = false;
	private _internalCount: number = 0;

	private _gl: WebGLRenderingContext;
	private _vertexShader: WebGLShader;
	private _fragmentShader: WebGLShader | null;
	private _program: WebGLProgram | null;
	private _vertexBuffer: WebGLBuffer;
	private _uvBuffer: WebGLBuffer;
	private _uniformLocations: {
		rgbImage  : WebGLUniformLocation | null,
		alphaImage: WebGLUniformLocation | null,
	};

	constructor(
		rgbImageSource: string,
		alphaImageSource: string,
		canvas: HTMLCanvasElement = document.createElement( 'canvas' ),
	) {

		super();

		this._canvas = canvas;

		this._gl = getWebglContext( canvas, { preserveDrawingBuffer: true } );
		this._vertexBuffer = this._gl.createBuffer()!;
		this._uvBuffer = this._gl.createBuffer()!;

		this._vertexShader = this._gl.createShader( this._gl.VERTEX_SHADER )!;
		this._gl.shaderSource( this._vertexShader, VERTEX_SHADER_SOURCE );
		this._gl.compileShader( this._vertexShader );

		this._fragmentShader = this._gl.createShader( this._gl.FRAGMENT_SHADER )!;
		this._gl.shaderSource( this._fragmentShader, FRAGMENT_SHADER_SOURCE );
		this._gl.compileShader( this._fragmentShader );

		this._program = this._gl.createProgram()!;
		this._gl.attachShader( this._program, this._vertexShader );
		this._gl.attachShader( this._program, this._fragmentShader );
		this._gl.linkProgram( this._program );
		this._gl.useProgram( this._program );

		// http://webos-goodies.jp/archives/overlaying_webgl_on_html.html
		this._gl.enable( this._gl.BLEND );
		this._gl.blendFuncSeparate(
			this._gl.SRC_ALPHA,
			this._gl.ONE_MINUS_SRC_ALPHA,
			this._gl.ONE,
			this._gl.ZERO,
		);

		// vertexes
		this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._vertexBuffer );
		this._gl.bufferData( this._gl.ARRAY_BUFFER, VERTEXES, this._gl.STATIC_DRAW );

		const position = this._gl.getAttribLocation( this._program, 'position' );
		this._gl.vertexAttribPointer( position, 2, this._gl.FLOAT, false, 0, 0 );
		this._gl.enableVertexAttribArray( position );

		// uv attr
		this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._uvBuffer );
		this._gl.bufferData( this._gl.ARRAY_BUFFER, UV, this._gl.STATIC_DRAW );

		const uv = this._gl.getAttribLocation( this._program, 'uv' );
		this._gl.vertexAttribPointer( uv, 2, this._gl.FLOAT, false, 0, 0 );
		this._gl.enableVertexAttribArray( uv );

		this._uniformLocations = {
			rgbImage  : this._gl.getUniformLocation( this._program, 'rgbImage' ),
			alphaImage: this._gl.getUniformLocation( this._program, 'alphaImage' ),
		};

		this._rgbTexture   = new Texture( this._gl );
		this._alphaTexture = new Texture( this._gl );

		this.loadImages( rgbImageSource, alphaImageSource );
		return this;

	}

	async loadImages(
		rgbImageSource: string,
		alphaImageSource: string,
	): Promise<void> {

		this._internalCount ++;
		const loadId = this._internalCount;

		const [ rgbImage, alphaImage ] = await Promise.all( [
			loadImage( rgbImageSource ),
			loadImage( alphaImageSource ),
		] );

		// another load has been fired. abort this load.
		if ( loadId !== this._internalCount ) return;

		this.setSize( rgbImage.naturalWidth, rgbImage.naturalHeight );
		this._rgbTexture.setImage( rgbImage );
		this._alphaTexture.setImage( alphaImage );

		this._gl.activeTexture( this._gl.TEXTURE0 );
		this._gl.bindTexture( this._gl.TEXTURE_2D, this._rgbTexture.texture );
		this._gl.uniform1i( this._uniformLocations.rgbImage, 0 );

		this._gl.activeTexture( this._gl.TEXTURE1 );
		this._gl.bindTexture( this._gl.TEXTURE_2D, this._alphaTexture.texture );
		this._gl.uniform1i( this._uniformLocations.alphaImage, 1 );

		this.render();

	}

	setSize( w: number, h: number ): void {

		if ( this._canvas.width  === w && this._canvas.height === h ) return;

		this._canvas.width  = w;
		this._canvas.height = h;
		this._gl.viewport( 0, 0, w, h );

	}

	render(): void {

		if ( this._destroyed ) return;

		this._gl.clearColor( 0, 0, 0, 0 );
		this._gl.clear( this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT );
		this._gl.drawArrays( this._gl.TRIANGLES, 0, 6 );
		this._gl.flush();

	}

	toDataUri(): string {

		return this._canvas.toDataURL();

	}

	destroy( removeElement = false ): void {

		this._destroyed   = true;

		if ( removeElement ) this.setSize( 1, 1 );

		if ( this._program ) {

			// https://stackoverflow.com/a/23606581/1512272
			this._gl.activeTexture( this._gl.TEXTURE0 );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );
			this._gl.activeTexture( this._gl.TEXTURE1 );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );
			this._gl.bindBuffer( this._gl.ARRAY_BUFFER, null );

			this._rgbTexture.destroy(); // this._gl.deleteTexture( ... );
			this._alphaTexture.destroy(); // this._gl.deleteTexture( ... );
			this._gl.deleteBuffer( this._vertexBuffer );
			this._gl.deleteBuffer( this._uvBuffer );
			this._gl.deleteShader( this._vertexShader );
			this._gl.deleteShader( this._fragmentShader );
			this._gl.deleteProgram( this._program );

		}

		if ( removeElement && !! this._canvas.parentNode ) {

			this._canvas.parentNode.removeChild( this._canvas );

		}

	}

}

function loadImage( src: string ): Promise<HTMLImageElement> {

	return new Promise( ( resolve ) => {

		const image = new Image();
		const onload = () => {

			image.removeEventListener( 'load', onload );
			resolve( image );

		}

		image.addEventListener( 'load', onload );
		image.src = src;

	} );

}

