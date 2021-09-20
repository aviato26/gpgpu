
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { MouseControls } from './MouseControls.js';
import { CreateText } from './CreateText.js';
import vertex from '../shaders/vertex.js';
import fragment from '../shaders/fragment.js';
import posFragment from '../shaders/Position.js';
import velFragment from '../shaders/Velocity.js';
import oldPosFragment from '../shaders/OldPos.js';
import img from '../coffeeStop.jpg';
import img2 from '../talkbox.jpg';

export default class Main
{
  constructor(){
  this.scene = new THREE.Scene();
  this.fov = 75;
  this.cameraAspect = window.innerWidth / window.innerHeight;

  this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 0.01, 100 );

  this.stats = new Stats();

  this.scene.background = new THREE.Color( 0xffffff );

  // size for imgs
  //this.size = 300;
  //this.size = 270;
  this.size = 470;

  //this.camera.position.y = 0.0;
  this.camera.rotation.x += 3.14;
  this.camera.position.z = -2.0;

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  //this.renderer.setSize( this.size, this.size );
  //this.needResize = this.renderer.domElement.clientWidth !== window.innerWidth || this.renderer.domElement.clientHeight !== window.innerHeight;

  document.body.appendChild( this.renderer.domElement );
  document.body.appendChild( this.stats.dom );

  this.clock = new THREE.Clock();

  this.mouse = new MouseControls();

  this.segments = this.size - 1;

  this.boxGeometry = new THREE.PlaneGeometry(0.9, 0.9, this.segments, this.segments);

  //this.boxGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9, this.segments, this.segments, this.segments)

  this.text = new CreateText();

  //this.boxGeometry.rotateX(Math.PI)

  //this.size = parseInt(Math.sqrt(this.boxGeometry.attributes.position.array.length * 3));

  this.imgs = [new THREE.TextureLoader().load(img), new THREE.TextureLoader().load(img2)];

  this.texSwitch = this.mouse.tSwitch;

  this.text.textLoaded
  .then(textObject => {
    console.log(textObject)

    // vertices positions of the texts mesh
    this.datatexture = textObject.children[0].geometry.attributes.position.array;
    //this.dTexture = new THREE.DataTexture(this.datatexture, this.size, this.size, THREE.RGBFormat);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.datatexture, 3));

    this.addingObjects();
    this.initGPGPU();
    this.animate();

  })
  .catch(err => console.log(err))

  if(this.imgs)
  {
    //this.addingObjects();
    //this.initGPGPU();
  }

  // mouse position is between -1 and 1 so moving camera out just a little so all the particles do not go off screen
  //this.camera.position.z = -1.2;
  this.animate = this.animate.bind(this);

  //this.animate();
  }

  addingObjects()
  {
    this.material = new THREE.ShaderMaterial(
      {
        //side: THREE.DoubleSide,

        uniforms:
        {
          positionTexture: { value: null },
          velocityTexture: { value: null },
          oldPos: { value: null },

          tex: {type: "t", value: this.texture1},
          /*
          tex2: { type: "t", value: this.texture2 },
          */
          //tex: { type: "t", value: this.imgs[0] },
          //tex2: { type: "t", value: this.imgs[1] },
          switchTex: { type: "f", value: this.texSwitch},
          res: { value: new THREE.Vector4() },
          time: { type: "f", value: this.clock.getDelta() }
        },

        vertexShader: vertex.vertex,
        fragmentShader: fragment.fragment
      }
    )

    // using the geometry from the three js plane geometry class and filling the gpgpu class with the blender models vertices
    this.mesh = new THREE.Points( this.boxGeometry, this.material );
    //console.log(this.boxGeometry.attributes.position.array)
    //this.mesh = new THREE.Points( this.geometry, this.material );

    this.scene.add(this.mesh);
  }

  initGPGPU()
  {
    this.gpgpu = new GPUComputationRenderer(this.size, this.size, this.renderer);

    this.dtPosition = this.gpgpu.createTexture();
    this.dtVelocity = this.gpgpu.createTexture();
    this.dtOldPos = this.gpgpu.createTexture();

    // this needs to be set or texture will be upside down
    //this.dtPosition.flipY = true;
    //this.dtOldPos.flipY = true;


    //this.dtPosition.image.data = this.geometry.attributes.position.array
    //console.log(this.dtPosition.image.data.length, this.geometry.attributes.position.array.length);
    this.fillPositions(this.dtPosition);
    this.fillPositions(this.dtVelocity);
    this.fillPositions(this.dtOldPos);
    console.log(this.dtPosition.image.data.length, this.datatexture.length)
    //this.material.uniforms.positionTexture.value = this.dtPosition.texture
    this.positionVariable = this.gpgpu.addVariable('texturePosition', posFragment.posFragment, this.dtPosition);
    this.velocityVariable = this.gpgpu.addVariable('textureVelocity', velFragment.velFragment, this.dtVelocity);
    this.oldPosVariable = this.gpgpu.addVariable('textureOldPos', oldPosFragment.oldPos, this.dtOldPos);

    this.positionUniforms = this.positionVariable.material.uniforms;
    this.velocityUniforms = this.velocityVariable.material.uniforms;
    this.oldPosUniforms = this.oldPosVariable.material.uniforms;

    // adding the mouse and texSwitch variable to pass off to our textures, probably could do without the time variable not sure yet
    this.velocityUniforms['mouse'] = { value: new THREE.Vector3(0, 0, 0) };
    this.positionUniforms['texSwitch'] = { value: 0.0 };
    this.velocityUniforms['texSwitch'] = { value: 0.0 };
    this.velocityUniforms['time'] = { value: 0.0};

    this.gpgpu.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable, this.oldPosVariable]);
    this.gpgpu.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable, this.oldPosVariable]);
    this.gpgpu.setVariableDependencies(this.oldPosVariable, [this.positionVariable, this.oldPosVariable])

    this.positionVariable.wrapS = THREE.RepeatWrapping;
    this.positionVariable.wrapT = THREE.RepeatWrapping;

    this.velocityVariable.wrapS = THREE.RepeatWrapping;
    this.velocityVariable.wrapT = THREE.RepeatWrapping;

    this.gpgpu.init();
  }

  fillPositions(texture)
  {

    // this function is taking the boxGeometry positions and copying them over to the newly created datatextures for the gpgpu renderer class
    let data = texture.image.data;

    // this is the particles for the project imgs
    //let geometryPosition = this.boxGeometry.attributes.position.array

    let geometryPosition = this.geometry.attributes.position.array
    //console.log(this.geometry.attributes.position.array)
    let x,y,z;

    for(let i = 0, index = geometryPosition.length; i < data.length; i += 4, index -= 3)
    {
/*
      x = this.boxGeometry.attributes.position.array[index];
      y = this.boxGeometry.attributes.position.array[index + 1];
      z = this.boxGeometry.attributes.position.array[index + 2];
*/
/*
      // this is the normal positions for the vertices but the model imported from blender imports them on a different plane, so below is the work around
      x = geometryPosition[index];
      y = geometryPosition[index + 1];
      z = geometryPosition[index + 2];
*/
      // switching the coordinates of the vertices of the y and z position, i cant seem to import different positions from the blender models so this is the work around for now
      x = geometryPosition[index];
      z = geometryPosition[index + 1];
      y = geometryPosition[index + 2];

      // assigning position values, the texture uses 4 numbers for every particle
      data[i] = x;
      data[i + 1] = y;
      data[i + 2] = z;
      data[i + 3] = 0;
    }
  }


  animate(){
    requestAnimationFrame( this.animate );

    // added the stats module to see how fast our simulation is running, so far it is 60fps yay!
    this.stats.begin();

    // checks to see if window size is mobile/tablet or laptop (if the aspect is greater than 1 than device is laptop, under 1 is tablet or mobile)
    this.fov = (this.cameraAspect < 1.0) ? 75 : ((this.cameraAspect > 1.0) && (this.cameraAspect < 1.2)) ? 55 : 45;
    console.log(this.fov)
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();
/*
    if(this.cameraAspect > 1.0)
    {
      // setting field of view and updating camera to a new field of view
      this.fov = 50;
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }
    */
    // change value to pass to shader to change texture
    this.texSwitch = this.mouse.tSwitch;
    this.material.uniforms.switchTex.value = this.texSwitch;

    //this.velocityUniforms['mouse'].value.set(this.rayFromMouse.x, this.rayFromMouse.y)
    this.velocityUniforms['mouse'].value.set(this.mouse.x, this.mouse.y)
    this.positionUniforms['texSwitch'] = { value: this.texSwitch };
    this.velocityUniforms['texSwitch'] = { value: this.texSwitch };
    this.velocityUniforms['time'].value = this.clock.getDelta();

    this.gpgpu.compute();

    // adding the render targets to our material uniforms to kick things off
    this.material.uniforms.positionTexture.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture;
    this.material.uniforms.velocityTexture.value = this.gpgpu.getCurrentRenderTarget(this.velocityVariable).texture;
    this.material.uniforms.oldPos.value = this.gpgpu.getCurrentRenderTarget(this.oldPosVariable).texture;

    this.material.needsUpdate = true;

    this.renderer.render( this.scene, this.camera);

    this.stats.end();
  }

}
