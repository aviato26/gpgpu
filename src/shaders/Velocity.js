

exports.velFragment =
`
uniform vec2 res;
uniform vec3 mouse;
uniform float t;
uniform float texSwitch;
uniform float time;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);
  float flip = texSwitch;

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  vec3 m = mouse;

  //m.z = 0.1;

  if(flip == 1.0)
  {
    m = vec3(0.0);
  }

  //m = vec3(0.0, 0.0, 0.1);

  vec3 dPos = m - pos;
  vec3 force;
  vec3 acc = vec3(0.0, 0.0, 0.0);

  vec3 dist = sqrt(dPos);
  vec3 gravityField = 1.0 / dist;
  gravityField = min(gravityField, 0.1);
  acc += normalize(dPos) * gravityField;

  acc.z *= fract(dPos.y) + cos(dPos.x);

  if(flip == 1.0)
  {
    acc = vec3(0.0);
  }

  vel += acc;

  vel = clamp(vel, -1.0, 1.0);

  //vel = vec3(0.0);

  gl_FragColor = vec4(vel, 0.1);
}
`
