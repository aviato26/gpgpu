
exports.oldPos =
`
void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 oPos = texture2D(textureOldPos, uv).xyz;

  gl_FragColor = vec4(oPos, 0.1);
  //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`
