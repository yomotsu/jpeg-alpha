export const VERTEX_SHADER_SOURCE = /* glsl */`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
	gl_Position = vec4( position, 1., 1. );
	vUv = uv;
}
`;

export const FRAGMENT_SHADER_SOURCE = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D rgbImage, alphaImage;

void main(){

	vec4 color = texture2D( rgbImage, vUv );
	float alpha = texture2D( alphaImage, vUv ).r;
	gl_FragColor = vec4( color.rgb, color.a * alpha );

}
`;
