

exports.velFragment =
`
uniform vec2 res;
uniform vec3 mouse;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  vec3 m = mouse;

  m.z = 0.001;

  vec3 dPos = m - pos;
  vec3 force;
  vec3 acc;

  float distance = length(dPos);
  float dSqrd = sqrt(distance);
  float gravityField = 1.0 / dSqrd;
  gravityField = min(gravityField, 0.9);
  acc += gravityField * normalize(dPos);

  //vel.xyz += normalize(dist) * 0.4;
  //vel.xyz = clamp(vel.xyz, vec3(-1.9), vec3(1.9));
  //vel += acc;

  gl_FragColor = vec4(vel, 0.1);
}
`
