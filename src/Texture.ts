import { EventDispatcher } from './EventDispatcher';

const WHITE_1PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

export class Texture extends EventDispatcher {

	texture: WebGLTexture;
	private _image = new Image();
	private _gl: WebGLRenderingContext;
	private _onload: () => void;

	constructor( gl: WebGLRenderingContext, src: string = WHITE_1PX ) {

		super();

		this._gl = gl;
		this.texture = gl.createTexture()!;
		gl.bindTexture( gl.TEXTURE_2D, this.texture );
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			1,
			1,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			new Uint8Array( [ 0, 0, 0, 255 ] ),
		);

		this._gl.pixelStorei( this._gl.UNPACK_FLIP_Y_WEBGL, true );
		this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR );
		this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR );
		this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE );
		this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE );

		this._onload = () => {

			this._gl.bindTexture( this._gl.TEXTURE_2D, this.texture );
			this._gl.texImage2D( this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._image );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );

			this.dispatchEvent( { type: 'updated' } );

		}
		this._image.addEventListener( 'load', this._onload );
		this.load( src );

	}

	get isLoaded(): boolean {

		return this._image.naturalWidth !== 0;

	}

	get imageSize(): [ number, number ] {

		return[ this._image.naturalWidth, this._image.naturalHeight ];

	}

	load( src: string ) {

		this._image.src = src;
		if ( this.isLoaded ) this._onload();

	}

	setImage( image: HTMLImageElement ) {

		this._image.removeEventListener( 'load', this._onload );
		this._image = image;
		this._image.addEventListener( 'load', this._onload );

		if ( this.isLoaded ) {

			this._onload();

		}

	}

	destroy(): void {

		this._image.removeEventListener( 'load', this._onload );
		this._gl.deleteTexture( this.texture );

	}

}
