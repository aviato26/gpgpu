

exports.fragState =
`
uniform sampler2D texturePosition;
uniform vec2 res;

void main()
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec3 pos = tmpPos.xyz;

  gl_FragColor = vec4(pos + vec3(0.001), 1.0);
}
`
