/*!
 * jpeg-alpha
 * https://github.com/yomotsu/jpeg-alpha
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var EventDispatcher = (function () {
    function EventDispatcher() {
        this._listeners = {};
    }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        var listeners = this._listeners;
        if (listeners[type] === undefined)
            listeners[type] = [];
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    };
    EventDispatcher.prototype.hasEventListener = function (type, listener) {
        var listeners = this._listeners;
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        var listeners = this._listeners;
        var listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== -1)
                listenerArray.splice(index, 1);
        }
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            var array = listenerArray.slice(0);
            for (var i = 0, l = array.length; i < l; i++) {
                array[i].call(this, event);
            }
        }
    };
    return EventDispatcher;
}());

function getWebglContext(canvas, contextAttributes) {
    return (canvas.getContext('webgl', contextAttributes) ||
        canvas.getContext('experimental-webgl', contextAttributes));
}

var WHITE_1PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
var Texture = (function (_super) {
    __extends(Texture, _super);
    function Texture(gl, src) {
        if (src === void 0) { src = WHITE_1PX; }
        var _this = _super.call(this) || this;
        _this._image = new Image();
        _this._gl = gl;
        _this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, _this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
        _this._gl.pixelStorei(_this._gl.UNPACK_FLIP_Y_WEBGL, true);
        _this._gl.texParameteri(_this._gl.TEXTURE_2D, _this._gl.TEXTURE_MIN_FILTER, _this._gl.LINEAR);
        _this._gl.texParameteri(_this._gl.TEXTURE_2D, _this._gl.TEXTURE_MAG_FILTER, _this._gl.LINEAR);
        _this._gl.texParameteri(_this._gl.TEXTURE_2D, _this._gl.TEXTURE_WRAP_S, _this._gl.CLAMP_TO_EDGE);
        _this._gl.texParameteri(_this._gl.TEXTURE_2D, _this._gl.TEXTURE_WRAP_T, _this._gl.CLAMP_TO_EDGE);
        _this._onload = function () {
            _this._gl.bindTexture(_this._gl.TEXTURE_2D, _this.texture);
            _this._gl.texImage2D(_this._gl.TEXTURE_2D, 0, _this._gl.RGBA, _this._gl.RGBA, _this._gl.UNSIGNED_BYTE, _this._image);
            _this._gl.bindTexture(_this._gl.TEXTURE_2D, null);
            _this.dispatchEvent({ type: 'updated' });
        };
        _this._image.addEventListener('load', _this._onload);
        _this.load(src);
        return _this;
    }
    Object.defineProperty(Texture.prototype, "isLoaded", {
        get: function () {
            return this._image.naturalWidth !== 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "imageSize", {
        get: function () {
            return [this._image.naturalWidth, this._image.naturalHeight];
        },
        enumerable: false,
        configurable: true
    });
    Texture.prototype.load = function (src) {
        this._image.src = src;
        if (this.isLoaded)
            this._onload();
    };
    Texture.prototype.setImage = function (image) {
        this._image.removeEventListener('load', this._onload);
        this._image = image;
        this._image.addEventListener('load', this._onload);
        if (this.isLoaded) {
            this._onload();
        }
    };
    Texture.prototype.destroy = function () {
        this._image.removeEventListener('load', this._onload);
        this._gl.deleteTexture(this.texture);
    };
    return Texture;
}(EventDispatcher));

var VERTEX_SHADER_SOURCE = "\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUv;\nvoid main() {\n\tgl_Position = vec4( position, 1., 1. );\n\tvUv = uv;\n}\n";
var FRAGMENT_SHADER_SOURCE = "\nprecision highp float;\nvarying vec2 vUv;\nuniform sampler2D rgbImage, alphaImage;\n\nvoid main(){\n\n\tvec4 color = texture2D( rgbImage, vUv );\n\tfloat alpha = texture2D( alphaImage, vUv ).r;\n\tgl_FragColor = vec4( color.rgb, color.a * alpha );\n\n}\n";

var VERTEXES = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, -1,
    1, 1,
    -1, 1,
]);
var UV = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    1, 0,
    1, 1,
    0, 1,
]);
var JpegAlpha = (function (_super) {
    __extends(JpegAlpha, _super);
    function JpegAlpha(rgbImageSource, alphaImageSource, canvas) {
        if (canvas === void 0) { canvas = document.createElement('canvas'); }
        var _this = _super.call(this) || this;
        _this._destroyed = false;
        _this._internalCount = 0;
        _this._canvas = canvas;
        _this._gl = getWebglContext(canvas, { preserveDrawingBuffer: true });
        _this._vertexBuffer = _this._gl.createBuffer();
        _this._uvBuffer = _this._gl.createBuffer();
        _this._vertexShader = _this._gl.createShader(_this._gl.VERTEX_SHADER);
        _this._gl.shaderSource(_this._vertexShader, VERTEX_SHADER_SOURCE);
        _this._gl.compileShader(_this._vertexShader);
        _this._fragmentShader = _this._gl.createShader(_this._gl.FRAGMENT_SHADER);
        _this._gl.shaderSource(_this._fragmentShader, FRAGMENT_SHADER_SOURCE);
        _this._gl.compileShader(_this._fragmentShader);
        _this._program = _this._gl.createProgram();
        _this._gl.attachShader(_this._program, _this._vertexShader);
        _this._gl.attachShader(_this._program, _this._fragmentShader);
        _this._gl.linkProgram(_this._program);
        _this._gl.useProgram(_this._program);
        _this._gl.enable(_this._gl.BLEND);
        _this._gl.blendFuncSeparate(_this._gl.SRC_ALPHA, _this._gl.ONE_MINUS_SRC_ALPHA, _this._gl.ONE, _this._gl.ZERO);
        _this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, _this._vertexBuffer);
        _this._gl.bufferData(_this._gl.ARRAY_BUFFER, VERTEXES, _this._gl.STATIC_DRAW);
        var position = _this._gl.getAttribLocation(_this._program, 'position');
        _this._gl.vertexAttribPointer(position, 2, _this._gl.FLOAT, false, 0, 0);
        _this._gl.enableVertexAttribArray(position);
        _this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, _this._uvBuffer);
        _this._gl.bufferData(_this._gl.ARRAY_BUFFER, UV, _this._gl.STATIC_DRAW);
        var uv = _this._gl.getAttribLocation(_this._program, 'uv');
        _this._gl.vertexAttribPointer(uv, 2, _this._gl.FLOAT, false, 0, 0);
        _this._gl.enableVertexAttribArray(uv);
        _this._uniformLocations = {
            rgbImage: _this._gl.getUniformLocation(_this._program, 'rgbImage'),
            alphaImage: _this._gl.getUniformLocation(_this._program, 'alphaImage'),
        };
        _this._rgbTexture = new Texture(_this._gl);
        _this._alphaTexture = new Texture(_this._gl);
        _this.loadImages(rgbImageSource, alphaImageSource);
        return _this;
    }
    JpegAlpha.prototype.loadImages = function (rgbImageSource, alphaImageSource) {
        return __awaiter(this, void 0, void 0, function () {
            var loadId, _a, rgbImage, alphaImage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._internalCount++;
                        loadId = this._internalCount;
                        return [4, Promise.all([
                                loadImage(rgbImageSource),
                                loadImage(alphaImageSource),
                            ])];
                    case 1:
                        _a = _b.sent(), rgbImage = _a[0], alphaImage = _a[1];
                        if (loadId !== this._internalCount)
                            return [2];
                        this.setSize(rgbImage.naturalWidth, rgbImage.naturalHeight);
                        this._rgbTexture.setImage(rgbImage);
                        this._alphaTexture.setImage(alphaImage);
                        this._gl.activeTexture(this._gl.TEXTURE0);
                        this._gl.bindTexture(this._gl.TEXTURE_2D, this._rgbTexture.texture);
                        this._gl.uniform1i(this._uniformLocations.rgbImage, 0);
                        this._gl.activeTexture(this._gl.TEXTURE1);
                        this._gl.bindTexture(this._gl.TEXTURE_2D, this._alphaTexture.texture);
                        this._gl.uniform1i(this._uniformLocations.alphaImage, 1);
                        this.render();
                        return [2];
                }
            });
        });
    };
    JpegAlpha.prototype.setSize = function (w, h) {
        if (this._canvas.width === w && this._canvas.height === h)
            return;
        this._canvas.width = w;
        this._canvas.height = h;
        this._gl.viewport(0, 0, w, h);
    };
    JpegAlpha.prototype.render = function () {
        if (this._destroyed)
            return;
        this._gl.clearColor(0, 0, 0, 0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
        this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
        this._gl.flush();
    };
    JpegAlpha.prototype.toDataUri = function () {
        return this._canvas.toDataURL();
    };
    JpegAlpha.prototype.destroy = function (removeElement) {
        if (removeElement === void 0) { removeElement = false; }
        this._destroyed = true;
        if (removeElement)
            this.setSize(1, 1);
        if (this._program) {
            this._gl.activeTexture(this._gl.TEXTURE0);
            this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            this._gl.activeTexture(this._gl.TEXTURE1);
            this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
            this._rgbTexture.destroy();
            this._alphaTexture.destroy();
            this._gl.deleteBuffer(this._vertexBuffer);
            this._gl.deleteBuffer(this._uvBuffer);
            this._gl.deleteShader(this._vertexShader);
            this._gl.deleteShader(this._fragmentShader);
            this._gl.deleteProgram(this._program);
        }
        if (removeElement && !!this._canvas.parentNode) {
            this._canvas.parentNode.removeChild(this._canvas);
        }
    };
    return JpegAlpha;
}(EventDispatcher));
function loadImage(src) {
    return new Promise(function (resolve) {
        var image = new Image();
        var onload = function () {
            image.removeEventListener('load', onload);
            resolve(image);
        };
        image.addEventListener('load', onload);
        image.src = src;
    });
}

export { JpegAlpha as default };
