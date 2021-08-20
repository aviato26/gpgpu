

exports.fragment =
`
varying vec2 vUv;
uniform sampler2D tex;

void main() {

  vec4 tex1 = texture2D(tex, vUv);

  gl_FragColor = tex1;
  //gl_FragColor = vec4(col, 1.0);
}

`
