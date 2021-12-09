

exports.velFragment =
`
uniform vec2 res;
uniform vec3 mouse;
uniform float t;
uniform bool applyVelocity;
uniform float time;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);

  //float flip = texSwitch;

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  vec3 m = mouse;

  m.z = 0.15;

/*
  if(applyVelocity == false)
  {
    m = vec3(0.0);
  }
*/
  //m = vec3(0.0, 0.0, 0.1);

  vec3 dPos = m - pos;
  vec3 force;
  vec3 acc = vec3(0.0, 0.0, 0.0);

  vec3 dist = sqrt(dPos);
  vec3 gravityField = 1.0 / dist;

  //gravityField = min(gravityField, 0.1);

  // when using the mix function value cannot go over or under for particles will not show up on some devices
  gravityField = mix(gravityField, vec3(0.1), vec3(1.0));

  acc += normalize(dPos) * gravityField;

  acc.xy *= fract(dPos.y) + cos(dPos.x);

  if(applyVelocity == false)
  {
    acc = vec3(0.0);
  }

  // adding acceleration with a little extra push by mulpliying by 1.1
  vel += acc * 1.2;

  // the bigger the range, the bigger the particles travel radius will be
  vel = clamp(vel, -1.5, 1.5);

  //vel = vec3(0.0);

  gl_FragColor = vec4(vel, 1.0);
}
`
