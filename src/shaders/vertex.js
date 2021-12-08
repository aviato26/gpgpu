
exports.vertex =
`
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform sampler2D oldPos;
uniform vec2 res;
//uniform sampler2D tex;
//uniform sampler2D tex2;
uniform float time;
uniform float particleSize;
uniform float switchTex;
uniform vec3 mouse;
attribute vec2 reference;
varying vec2 vUv;

void main()
{
    vUv = uv;

    //float t = switchTex;
    //float pSize = particleSize;

    vec3 pos = texture(positionTexture, vUv).xyz;
    //vec3 vel = texture(velocityTexture, vUv).xyz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = particleSize;
}
`
