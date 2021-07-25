

exports.fragState =
`
uniform sampler2D texturePosition;
uniform vec2 res;

void main()
{
  vec2 uv = gl_FragColor.xy / resolution.xy;
  vec4 tmpPos = texture2D( texturePosition, uv);
  vec3 position = tmpPos.xyz;

  gl_FragColor = vec4(position + vec3(0.001), 1.0);
}
`
