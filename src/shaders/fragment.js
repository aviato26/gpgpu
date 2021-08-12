

exports.fragment =
`
varying vec2 vUv;
uniform sampler2D tex;
uniform sampler2D positionTexture;

void main() {
  vec4 tex1 = texture2D(tex, vUv);
  gl_FragColor = tex1;
  //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}

`
