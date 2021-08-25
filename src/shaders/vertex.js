
exports.vertex =
`
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform sampler2D oldPos;
//uniform sampler2D tex;
//uniform sampler2D tex2;
uniform float switchTex;
uniform float time;
uniform vec3 mouse;
attribute vec2 reference;
varying vec2 vUv;

void main()
{
    vUv = uv;

    float t = switchTex;

    vec3 pos = texture(positionTexture, vUv).xyz;
    //vec3 vel = texture(velocityTexture, vUv).xyz;
    //vec3 oldPos = pos - position;

    if(t == 1.0)
    {
      //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      //pos.xy = position.xy;
      //pos.z = 0.0;
      //pos += normalize(pos) - position * 0.1;
      //pos += position - pos;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 3.0;
}
`
