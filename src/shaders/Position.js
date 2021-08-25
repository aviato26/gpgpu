

exports.posFragment =
`
uniform vec2 res;
uniform float texSwitch;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec4 oldPosTex = texture2D(textureOldPos, uv);

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  // adding the original pos so we can subtract from the current to this original position and find our way back to the original image position
  vec3 oldPos = oldPosTex.xyz;

  // just adding some float to be multipled by the velocity to keep the position from growing to big and out of control
  float distortion = 0.018;

  float t = texSwitch;

  if(t == 1.0)
  {
    vec3 dist = pos - oldPos;
    vec3 gravity = 1.0 / dist;

    //pos += normalize(dist) * gravity;
    //pos += oldPos * 0.1;

    vec3 distSqrd = sqrt(dist);
    vec3 distNormalized = normalize(dist);

    //pos = dist * 0.5;

    /*
    vec3 newPos = -0.001 * distNormalized;
    pos += newPos / distSqrd * 0.99;
    */

    // i think this is the equation for emulating springs
    vec3 newPos = -0.01 * distSqrd;

    /*
      after we get the reverse force from the spring equation
      we can divide by the normalized distance and multiply by anything under 1.0
      to get a slower pulling force, not to sure but i believe this is sometimes used for implementing
      a verlet simulation
    */
    pos += newPos / distNormalized * 0.7;

  }
  else {

    // if texture is not changed we are leaving the velocity based on the distance from the particles and mouse position
    pos += vel * distortion;

  }

  gl_FragColor = vec4(pos, 0.1);
  //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`
