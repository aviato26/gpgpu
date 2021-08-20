
exports.vertex =
`
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform sampler2D tex;
uniform float time;
attribute vec2 reference;
varying vec2 vUv;

void main()
{
    vUv = uv;

    vec3 pos = texture(positionTexture, vUv).xyz;
    vec3 vel = texture(velocityTexture, vUv).xyz;

    if(pos.x > 0.01)
    {
      //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      pos.xy = position.xy;
      pos.z = 0.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 2.0;
}
`
