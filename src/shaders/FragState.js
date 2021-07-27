

exports.fragState =
`
uniform sampler2D texturePosition;
uniform vec2 res;
uniform vec2 mouse;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec3 pos = tmpPos.xyz;

  // vector for force calculation
  vec3 force;
  vec3 forceApply;

  // getting the distance between particle position and mouse position
  force.x = (pos.x - mouse.x);
  force.y = (pos.y - mouse.y);

  // squaring the distance;
  float dist = sqrt((force.x * force.x) + (force.y * force.y));

  force = normalize(force);

  float constrainDist = clamp(dist, 1.0, 125.0);

  float gravityContant = 1.0;
  float forceStrength = gravityContant / constrainDist;

  forceApply + forceStrength;
  //forceApply.y += forceStrength;

  //pos + forceApply;

  gl_FragColor = vec4(pos + mouse.x, 0.1);
}
`
