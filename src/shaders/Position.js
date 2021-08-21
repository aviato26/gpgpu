

exports.posFragment =
`
uniform vec2 res;
varying vec2 vUv;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  pos += vel * 0.018;

  gl_FragColor = vec4(pos, 0.1);
  //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`
