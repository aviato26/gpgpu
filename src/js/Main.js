
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { MouseControls } from './MouseControls.js';
import { CreateText } from './CreateText.js';
import TextContainer from './textContainers.js';
import vertex from '../shaders/vertex.js';
import fragment from '../shaders/fragment.js';
import posFragment from '../shaders/Position.js';
import velFragment from '../shaders/Velocity.js';
import oldPosFragment from '../shaders/OldPos.js';

//import homePage from '../images/scrolled3.jpeg';
//import homePage from '../images/hp2.jpeg';
import homePage from '../images/hpm2.jpeg';
//import projectPage from '../images/ProjectsPage.jpeg';
import projectPage from '../images/pp.jpeg';
//import aboutPage from '../images/AboutPage.jpeg';
import aboutPage from '../images/ap.jpeg';
//import contactPage from '../images/ContactPage.jpeg';
import contactPage from '../images/cp.jpeg';

//import mountain from '../m.jpeg';
import mountain from '../images/mb2.jpeg';

//import bgMountain from '../bground.jpeg';
import bgMountain from '../images/bgmini.jpeg';

import { MathUtils } from 'three';

import ringModel from '../ring.glb';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';



export default class Main
{
  constructor(){
  this.scene = new THREE.Scene();

  this.norm = 0.0;

  //this.fov = 75;
  this.fov = 45;
  this.cameraAspect = window.innerWidth / window.innerHeight;
  this.planeAspectRatio = 16 / 9;

  this.camera = new THREE.PerspectiveCamera( this.fov, this.cameraAspect, 0.1, 1000 );

  this.stats = new Stats();

  // particle size in the vertex shader, checking for mobile device and setting particle size accordingly
  this.particleSize = (this.cameraAspect < 1.0) ? 2.0 : 4.0;

  //this.scene.background = new THREE.Color( 0x999999 );
  //this.scene.background = new THREE.Color( 0x000000 );

  // size for gpgpu renderer
  // size for imgs
  //this.size = 320;
  //this.size = 270;

  // current size since we needed to reduce the amount of particles to keep 60fps on mobile
  //this.size = 400;
  // 670 covers about 1.3 million particles

  // checking to see if the device is mobile or not to set renderer size (mobile cannot handle much more than 300 hundred unless optomized further)
  this.size = (this.cameraAspect < 1.0) ? 300 : 300;

  // setting pixelRatio according window size
  this.pixelRatio = (this.cameraAspect < 1.0) ? 2.0 : 1.6;
  //this.size = 120;

  this.camera.position.z = 3.2;

  this.renderer = new THREE.WebGLRenderer( );

  this.renderer.setSize( window.innerWidth, window.innerHeight );
  //this.renderer.setPixelRatio( window.devicePixelRatio );

  // setting pixel ratio according to screen size, if ratio is set to window.devicePixelRatio performance becomes an issue on bigger screens
  this.renderer.setPixelRatio( this.pixelRatio );
  this.renderer.outputEncoding = THREE.sRGBEncoding;
  //this.renderer.toneMapping = THREE.ACESFilmicToneMapping
  //this.renderer.toneMappingExposure = Math.pow(1.01, 2.0);
  //this.renderer.toneMapping = THREE.LinearToneMapping
  //this.renderer.toneMapping = THREE.ReinhardToneMapping
  //this.renderer.toneMapping = THREE.CineonToneMapping
  //this.renderer.shadowMap.enabled = true
  //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap


  this.scene2 = new THREE.Scene();
  this.renderer2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerWidth);

  //console.log(this.ctx.getImageData(0, 0, window.innerWidth, window.innerHeight))
  //this.renderer.setSize( this.size, this.size );
  //this.needResize = this.renderer.domElement.clientWidth !== window.innerWidth || this.renderer.domElement.clientHeight !== window.innerHeight;

  document.body.appendChild( this.renderer.domElement );
  document.body.appendChild( this.stats.dom );

  this.clock = new THREE.Clock();

  this.time = 1.0 / 60.0;

  this.mouse = new MouseControls();

  this.segments = this.size - 1;
  //this.backgroundGeometrySize = 1.5;
  //this.backgroundGeometrySize = 1.6;

  this.particleGeometry = new THREE.PlaneGeometry(1.5, 1.5, this.segments, this.segments);

  //this.boxGeometry = new THREE.BoxGeometry(this.backgroundGeometrySize, this.backgroundGeometrySize, this.backgroundGeometrySize, 10, 10, 10);
/*
  this.bSize = 20;
  this.boxGeometry = new THREE.BoxGeometry( this.bSize, this.bSize );
*/
  this.text = new CreateText();

  this.renderer.sortObjects = false;

  console.log(this.mouse)

// container used to listen for click events to change textures
  //this.container = new TextContainer();

  //this.container.updateElements(this.mouse.currentTexture);

  this.text.loadModel(ringModel)
  .then(model => {
    //console.log(model)
    this.scene.add(model);


    this.mountainImg = new THREE.TextureLoader().load( mountain, function(texture){

      texture.encoding = THREE.sRGBEncoding;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      model.children[0].children[0].children[0].children[0].children[0].material.envMap = texture;

    })

    this.bg = new THREE.TextureLoader().load(bgMountain)
    //this.bg.encoding = THREE.LinearEncoding;

    // setting encoding to tone done colors on background image
    this.bg.encoding = THREE.sRGBEncoding;
    //this.bg.toneMapping = THREE.ReinhardToneMapping

    // initiating material before apply them to skulls
    this.addMaterial();
    this.initGPGPU();
    this.animate();

    // model scale
    const scale = 1.0;

    this.scene.children.map((c, i) => {
      if(c.type === "Group")
      {
        c.scale.x = scale;
        c.scale.y = scale;
        c.scale.z = scale;
      }

    })

  })
  .catch(err => console.log(err))


  this.imgs = [new THREE.TextureLoader().load(homePage), new THREE.TextureLoader().load(projectPage), new THREE.TextureLoader().load(aboutPage), new THREE.TextureLoader().load(contactPage)];

  this.texSwitch = this.mouse.tSwitch;
  this.applyParticleVelocity = this.mouse.pressingDown;

  this.animate = this.animate.bind(this);

  }

  addMaterial()
  {

    const meta = new Array(3 * 10);
    let dataToSendToGPU = new Float32Array(3 * 10);
    const radius = Math.random() * 60 + 10;

    for(let i = 0; i < 10; i++)
    {
      meta[i] = {
        x: Math.random() * (window.innerWidth - 2 * radius) + radius,
        y: Math.random() * (window.innerHeight - 2 * radius) + radius,
        r: radius
       }
    }

    for(let i = 0; i < 10; i++)
    {
      var baseIndex = 3 * i;
      var mb = meta[i];
      dataToSendToGPU[baseIndex + 0] = mb.x;
      dataToSendToGPU[baseIndex + 1] = mb.y;
      dataToSendToGPU[baseIndex + 2] = mb.r;
    }

    //const backgroundGeometry = this.boxGeometry.attributes.position.array;

    this.material = new THREE.ShaderMaterial(
      {
        //side: THREE.DoubleSide,
        //transparent: true,
        //depthTest: false,
        //depthWrite: false,
        //alphaTest: 0.9,
        //vertexColors: true,
        //blending: THREE.AdditiveBlending,
        //blending: THREE.AlphaBlending,
        //blending: THREE.NoBlending,
        uniforms:
        {
          positionTexture: { value: null },
          velocityTexture: { value: null },
          oldPos: { value: null },
          particleSize: { type: "f", value: this.particleSize },
          meta: { type: "v3", value: dataToSendToGPU},
          //tex: {type: "t", value: this.texture1},
          /*
          tex2: { type: "t", value: this.texture2 },
          */
          homePage: { type: "t", value: this.imgs[0] },
          projectPage: { type: "t", value: this.imgs[1] },
          aboutPage: { type: "t", value: this.imgs[2] },
          contactPage: { type: "t", value: this.imgs[3] },
          applyVelocity: { type: "bool", value: this.applyParticleVelocity},
          switchTex: { type: "f", value: 0.0},
          res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          time: { type: "f", value: this.time },
        },

        vertexShader: vertex.vertex,
        fragmentShader: fragment.fragment
      }
    );


    let geo = new THREE.PlaneGeometry( 5.8, 5.8 );
    let geoMat = new THREE.MeshBasicMaterial({ map: this.bg });
    const bgMesh = new THREE.Mesh(geo, geoMat);

    bgMesh.position.z -= 1.0;

    // using the geometry from the three js plane geometry class and filling the gpgpu class with the blender models vertices
    this.mesh = new THREE.Points( this.particleGeometry, this.material );

    this.scene.add( this.mesh, bgMesh );
  }

  initGPGPU()
  {
    this.gpgpu = new GPUComputationRenderer(this.size, this.size, this.renderer);

    this.dtPosition = this.gpgpu.createTexture();
    this.dtVelocity = this.gpgpu.createTexture();
    this.dtOldPos = this.gpgpu.createTexture();

    // this needs to be set or texture will be upside down
    this.dtPosition.flipY = true;
    this.dtOldPos.flipY = true;


    //this.dtPosition.image.data = this.geometry.attributes.position.array
    console.log(this.dtPosition.image.data.length, this.particleGeometry.attributes.position.array.length);
    this.fillPositions(this.dtPosition, this.particleGeometry.attributes.position.array);
    this.fillPositions(this.dtVelocity, this.particleGeometry.attributes.position.array);
    this.fillPositions(this.dtOldPos, this.particleGeometry.attributes.position.array);
    //console.log(this.dtPosition.image.data.length, this.datatexture.length)
    //this.material.uniforms.positionTexture.value = this.dtPosition.texture
    this.positionVariable = this.gpgpu.addVariable('texturePosition', posFragment.posFragment, this.dtPosition);
    this.velocityVariable = this.gpgpu.addVariable('textureVelocity', velFragment.velFragment, this.dtVelocity);
    this.oldPosVariable = this.gpgpu.addVariable('textureOldPos', oldPosFragment.oldPos, this.dtOldPos);

    this.positionUniforms = this.positionVariable.material.uniforms;
    this.velocityUniforms = this.velocityVariable.material.uniforms;
    this.oldPosUniforms = this.oldPosVariable.material.uniforms;

    // adding the mouse and texSwitch variable to pass off to our textures, probably could do without the time variable not sure yet
    this.velocityUniforms['mouse'] = { value: new THREE.Vector3(0, 0, 0) };
    this.positionUniforms['applyVelocity'] = { value: false };
    this.velocityUniforms['applyVelocity'] = { value: false };
    this.velocityUniforms['time'] = { value: 0.0};

    this.gpgpu.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable, this.oldPosVariable]);
    this.gpgpu.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable, this.oldPosVariable]);
    this.gpgpu.setVariableDependencies(this.oldPosVariable, [this.positionVariable, this.oldPosVariable]);

    this.positionVariable.wrapS = THREE.RepeatWrapping;
    this.positionVariable.wrapT = THREE.RepeatWrapping;

    this.velocityVariable.wrapS = THREE.RepeatWrapping;
    this.velocityVariable.wrapT = THREE.RepeatWrapping;

    this.gpgpu.init();
  }

  fillPositions(texture, geometry)
  {

    // this function is taking the boxGeometry positions and copying them over to the newly created datatextures for the gpgpu renderer class
    let data = texture.image.data;

    // this is the particles for the project imgs
    //let geometryPosition = this.particleGeometry.attributes.position.array

    //let geometryPosition = this.geometry.attributes.position.array
    //console.log(this.geometry.attributes.position.array)
    let x,y,z;

    for(let i = 0, index = 0; i < data.length; i += 4, index += 3)
    {
/*
      x = this.boxGeometry.attributes.position.array[index];
      y = this.boxGeometry.attributes.position.array[index + 1];
      z = this.boxGeometry.attributes.position.array[index + 2];
*/

      // this is the normal positions for the vertices but the model imported from blender imports them on a different plane, so below is the work around
      x = geometry[index];
      y = geometry[index + 1];
      z = geometry[index + 2];
/*
      x = geometryPosition[index];
      y = geometryPosition[index + 1];
      z = geometryPosition[index + 2];
*/
      // switching the coordinates of the vertices of the y and z position, i cant seem to import different positions from the blender models so this is the work around for now
/*
      x = geometryPosition[index];
      z = geometryPosition[index + 1];
      y = geometryPosition[index + 2];
*/
      // assigning position values, the texture uses 4 numbers for every particle
      data[i] = x;
      data[i + 1] = y;
      data[i + 2] = z;
      data[i + 3] = 0;
    }
  }


  lerp(norm, min, max)
  {
    return (max - min) * norm + min;
  }

  ease(pos, easeFactor)
  {
    // subtract distance from ending position from objects current position
    let dx = 1.5 - pos;

    // get velocity from multiplying the distance and easeFactor
    return dx * easeFactor;
  }


  animate(){
    requestAnimationFrame( this.animate );

    // added the stats module to see how fast our simulation is running, so far it is 60fps yay!
    this.stats.begin();

    // checks to see if window size is mobile/tablet or laptop (if the aspect is greater than 1 than device is laptop, under 1 is tablet or mobile)
    this.fov = (this.cameraAspect < 1.0) ? 70 : ((this.cameraAspect > 1.0) && (this.cameraAspect < 1.2)) ? 55 : 40;

    //this.camera.position.z = 5.1;

    // setting the camera's updated fov
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();

    // spin globe
    //this.scene.children[2].rotation.x += 0.0005;
    //this.scene.children[2].rotation.y += 0.0005;

    //this.scene.children[1].rotation.y += 0.01;

    // change value to pass to shader to change texture
    this.texSwitch = this.mouse.tSwitch;
    this.applyParticleVelocity = this.mouse.pressingDown

    this.material.uniforms.switchTex.value = this.texSwitch;

    this.time += 0.01;

    this.material.uniforms.time.value = this.time;

    //this.roomMaterial.uniforms.time.value = this.time;

    //this.velocityUniforms['mouse'].value.set(this.rayFromMouse.x, this.rayFromMouse.y)
    this.velocityUniforms['mouse'].value.set(this.mouse.x, this.mouse.y)
    this.positionUniforms['applyVelocity'] = { value: this.applyParticleVelocity };
    this.velocityUniforms['applyVelocity'] = { value: this.applyParticleVelocity };
    //this.velocityUniforms['time'].value = this.clock.getDelta();


    this.gpgpu.compute();

    // adding the render targets to our material uniforms to kick things off
    //this.material.uniforms.positionTexture.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture;
    //this.material.uniforms.velocityTexture.value = this.gpgpu.getCurrentRenderTarget(this.velocityVariable).texture;
    //this.material.uniforms.oldPos.value = this.gpgpu.getCurrentRenderTarget(this.oldPosVariable).texture;

    //this.roomMaterial2.uniforms.time.value = this.time;
/*
    this.light2.position.x = this.mouse.x * 5;
    this.light2.position.z = -3;
*/
    //this.scene.children.map(c => c.rotation.y += 0.01)
    //this.scene.children[2].position.z = 0.1;
    //console.log(this.scene.children)
    //this.scene.children[1].children[0].rotation.z += 0.01;
    //this.gpgpu.compute();

    this.scene.children[0].rotation.y -= 0.001;

    //this.scene.children[0].rotation.x = 1.5;
    //this.scene.children[0].rotation.x = this.lerp(this.norm, 0.0, 1.5);
/*
    this.scene.children[0].rotation.x += this.ease(this.scene.children[0].rotation.x, 0.03);
    this.scene.children[0].rotation.y -= this.ease(this.scene.children[0].rotation.x, 0.03);
    this.scene.children[0].scale.x += this.ease(this.scene.children[0].scale.x, 0.03);
    this.scene.children[0].scale.y += this.ease(this.scene.children[0].scale.y, 0.03);
    this.scene.children[0].scale.z += this.ease(this.scene.children[0].scale.z, 0.03);
*/


    if(this.mouse.initialClick)
    {

      this.scene.children[0].rotation.x += this.ease(this.scene.children[0].rotation.x, 0.03);
      this.scene.children[0].rotation.y -= this.ease(this.scene.children[0].rotation.x, 0.03);
      this.scene.children[0].scale.x += this.ease(this.scene.children[0].scale.x, 0.03);
      this.scene.children[0].scale.y += this.ease(this.scene.children[0].scale.y, 0.03);
      this.scene.children[0].scale.z += this.ease(this.scene.children[0].scale.z, 0.03);


      //this.gpgpu.compute();

      // adding the render targets to our material uniforms to kick things off
      this.material.uniforms.positionTexture.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture;
      //this.material.uniforms.velocityTexture.value = this.gpgpu.getCurrentRenderTarget(this.velocityVariable).texture;
      //this.material.uniforms.oldPos.value = this.gpgpu.getCurrentRenderTarget(this.oldPosVariable).texture;
      //this.material.uniforms.positionTexture.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture;
    }

      /*
    if(this.mouse.pressingDown)
    {
      this.material.blending = THREE.AdditiveBlending
    }
    else
    {
      this.material.blending = THREE.NoBlending
    }
*/

    this.material.needsUpdate = true;

    this.renderer.render( this.scene, this.camera);

    this.stats.end();
  }

}
