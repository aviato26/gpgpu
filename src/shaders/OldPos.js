
exports.oldPos =
`
void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  //vec4 tmpPos = texture2D(texturePosition, uv);
  //vec4 tmpVel = texture2D(textureVelocity, uv);
  vec3 oPos = texture2D(textureOldPos, uv).xyz;

  gl_FragColor = vec4(oPos, 0.1);
  //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`
