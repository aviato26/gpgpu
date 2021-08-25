

exports.fragment =
`
varying vec2 vUv;
uniform sampler2D tex;
uniform sampler2D tex2;
uniform float switchTex;

void main() {

  vec4 tex1 = texture2D(tex, vUv);
  vec4 tex2 = texture2D(tex2, vUv);
  vec4 finalTex = tex1;
  float t = switchTex;

  if(t == 1.0)
    {
      //finalTex = tex2;
    }
  else
    {
      //finalTex = tex1;
    }

  gl_FragColor = finalTex;
  //gl_FragColor = vec4(col, 1.0);
}

`
