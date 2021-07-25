

exports.fragment =
`
varying vec2 vUv;
uniform sampler2D positionTexture;

void main() {

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  //gl_FragColor = texture2D(positionTexture, vUv);
}

`
