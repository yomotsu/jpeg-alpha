import { EventDispatcher } from './EventDispatcher';
export declare class JpegAlpha extends EventDispatcher {
    private _canvas;
    private _rgbTexture;
    private _alphaTexture;
    private _destroyed;
    private _internalCount;
    private _gl;
    private _vertexShader;
    private _fragmentShader;
    private _program;
    private _vertexBuffer;
    private _uvBuffer;
    private _uniformLocations;
    constructor(rgbImageSource: string, alphaImageSource: string, canvas?: HTMLCanvasElement);
    loadImages(rgbImageSource: string, alphaImageSource: string): Promise<void>;
    setSize(w: number, h: number): void;
    render(): void;
    toDataUri(): string;
    destroy(removeElement?: boolean): void;
}
