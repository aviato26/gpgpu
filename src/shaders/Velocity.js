

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

  vec3 dist = mouse - pos;
/*
  vec3 distSqrd = dist * dist;
  vec3 constrain = clamp(distSqrd, 0.0, 5.0);
  float gravityConstant = 1.0;
  float fx = gravityConstant / constrain.x;
  float fy = gravityConstant / constrain.y;
  float fz = gravityConstant / constrain.z;

  vel.x += fx;
  vel.y += fy;
  vel.z += fz;
*/
  vel.xyz += normalize(dist) * 0.04;
  vel.xyz = clamp(vel.xyz, vec3(-1.9), vec3(1.9));

  gl_FragColor = vec4(vel, 0.1);
}
`
