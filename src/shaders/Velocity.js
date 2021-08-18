

exports.velFragment =
`
uniform vec2 res;
uniform vec3 mouse;
uniform float time;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  vec3 m = mouse;

  m.z = sin(time);

  vec3 dPos = m - pos;
  vec3 force;
  vec3 acc = vec3(0.0, 0.0, 0.0);

  //float dist = length(dPos);

  //vec3 dist = sqrt(dPos);
  //dist = sqrt(dist);
  vec3 dist = sqrt(dPos);
  vec3 gravityField = 5.0 / dist;
  gravityField = min(gravityField, 0.1);
  vel += normalize(dPos) * gravityField;

  //vel += acc;
  vel = clamp(vel, -1.1, 1.1);

  gl_FragColor = vec4(vel, 0.1);
}
`
