import { EventDispatcher } from './EventDispatcher';
export declare class Texture extends EventDispatcher {
    texture: WebGLTexture;
    private _image;
    private _gl;
    private _onload;
    constructor(gl: WebGLRenderingContext, src?: string);
    get isLoaded(): boolean;
    get imageSize(): [number, number];
    load(src: string): void;
    setImage(image: HTMLImageElement): void;
    destroy(): void;
}
