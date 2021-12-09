

exports.fragment =
`
varying vec2 vUv;
uniform sampler2D homePage;
uniform sampler2D projectPage;
uniform sampler2D aboutPage;
uniform sampler2D contactPage;
uniform float switchTex;
uniform float time;
uniform vec2 res;


void main() {

  vec2 uv = vUv;

  vec4 homePage = texture2D(homePage, uv);
  vec4 projectPage = texture2D(projectPage, uv);
  vec4 aboutPage = texture2D(aboutPage, uv);
  vec4 contactPage = texture2D(contactPage, uv);
  vec4 currentTex = homePage;
  float t = switchTex;


  if(t == 0.0)
    {
      currentTex = homePage;
    }

  else if(t == 1.0)
    {
      currentTex = projectPage;
    }

  else if(t == 2.0)
    {
      currentTex = aboutPage;
    }

  else if(t == 3.0)
    {
      currentTex = contactPage;
    }

    gl_FragColor = vec4(currentTex.xyz, 1.0);

}

`
