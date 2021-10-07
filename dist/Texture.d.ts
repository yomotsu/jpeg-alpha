import { EventDispatcher } from './EventDispatcher';
export declare class Texture extends EventDispatcher {
    private _image;
    texture: WebGLTexture;
    private _gl;
    onload: () => void;
    constructor(gl: WebGLRenderingContext, src?: string);
    get isLoaded(): boolean;
    get imageSize(): [number, number];
    load(src: string): void;
    setImage(image: HTMLImageElement): void;
    destroy(): void;
}
