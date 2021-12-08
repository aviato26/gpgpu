

exports.posFragment =
`
uniform vec2 res;
uniform bool applyVelocity;
uniform float time;

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

  //float t = texSwitch;

  if(applyVelocity == false)
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

    // applying negative force to the distance
    vec3 newPos = -0.01 * distSqrd;

    /*
      after we get the reverse force from the spring equation
      we can divide by the normalized distance and multiply by another float
      to either speed up (anything over 1) or slow down (below 1) the partcle grouping,
      but the image will start to lose resolution once this float goes to far in either
      direction :)
    */

    // also dividing the newPos by distNormalized will bring a more spaced particle effect, will multiplying will keep entire img intact
    //pos += newPos / distNormalized;
    pos += newPos * distNormalized * 3.0;

    // clamping the position between -1 and 1 to keep the particles stable, without the partcles position starts to become unstable
    // this also is the area of the returning particle gravityField
    pos = clamp(pos, -1.0, 1.0);

    // zeroing out the z position to make the image more readable, without there is a little to much distortion
    pos.z = 0.0;

  }
  else {

    // if texture is not changed we are leaving the velocity based on the distance from the particles and mouse position
    pos += vel * distortion;

  }

  gl_FragColor = vec4(pos, 0.0);
  //gl_FragColor = vec4(uv, 0.0, 1.0);
}
`
