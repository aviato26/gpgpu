

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

  vec3 dPos = mouse - pos;
  vec3 force;
  vec3 acc;

  float distance = length(dPos);
  float dSqrd = sqrt(distance);
  float gravityField = 1.0 / dSqrd;
  gravityField = min(gravityField, 100.0);
  acc += gravityField * normalize(dPos);


  //vec3 distSqrd = dist * dist;
  //vec3 constrain = clamp(distSqrd, 2.0, 3.5);
/*
  vec3 ds = sqrt(dist);
  vec3 c = clamp(ds, 5.0, 10.0);
  float gravityConstant = 1.0;
  float fx = gravityConstant / dist.x;
*/
  //float fy = gravityConstant / c.y;
  //float fz = gravityConstant / c.z;

  //vel.x += fx * 0.1;
  //vel.y += fy;
  //vel.z += fz;

  //vel.xyz += normalize(dist) * 0.4;
  //vel.xyz = clamp(vel.xyz, vec3(-1.9), vec3(1.9));
  vel += acc;

  gl_FragColor = vec4(vel, 0.1);
}
`
