
exports.vertex =
`
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform sampler2D tex;
attribute vec2 reference;
varying vec2 vUv;

void main()
{
    vUv = uv;
    //vec3 pos = texture(positionTexture, reference).xyz;
    //vec3 vel = texture(velocityTexture, reference).xyz;
    vec3 pos = texture(positionTexture, vUv).xyz;
    vec3 vel = texture(velocityTexture, vUv).xyz;
    vec3 tex1 = texture(tex, vUv).xyz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 5.0;
}
`
