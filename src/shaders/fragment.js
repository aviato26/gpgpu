

exports.fragment =
`
varying vec2 vUv;
uniform sampler2D tex;

void main() {
  vec4 tex = texture2D(tex, vUv);
  gl_FragColor = tex;
  //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}

`
