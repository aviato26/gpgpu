
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import vertex from '../shaders/vertex.js';
import fragment from '../shaders/fragment.js';
import posFragment from '../shaders/Position.js';
import velFragment from '../shaders/Velocity.js';
import img from '../coffeeStop.png';

export default class Main
{
  constructor(){
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  this.stats = new Stats();

  this.scene.background = new THREE.Color( 0xffffff );
  this.size = 300;

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( this.renderer.domElement );
  document.body.appendChild( this.stats.dom );

  this.clock = new THREE.Clock();

  this.mouse = new THREE.Vector3();
  this.mouse.x = 0;
  this.mouse.y = 0;
  this.rayFromMouse = new THREE.Vector3();
  this.raycaster = new THREE.Raycaster();
  this.intersects = null;

  this.segments = this.size - 1;

  this.boxGeometry = new THREE.PlaneGeometry(0.9, 0.9, this.segments, this.segments);
  //this.boxGeometry.rotateX(Math.PI)

  //this.size = parseInt(Math.sqrt(this.boxGeometry.attributes.position.array.length * 3));

  this.img = img;
  this.textureLoader = new THREE.TextureLoader().load(this.img)

  if(this.textureLoader)
  {
    this.addingObjects();
    this.initGPGPU();
    this.mousePos();
  }

  this.camera.position.z = 1;
  //console.log(this.boxGeometry.attributes.position.array)
  // must bind function to this class or the default is the global scope which will return animate is undefined since there is no animate function in global scope
  this.animate = this.animate.bind(this);

  this.animate();
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
          tex: {type: "t", value: this.textureLoader},
          res: { value: new THREE.Vector4() },
          time: { type: "f", value: this.clock.getDelta() }
        },

        vertexShader: vertex.vertex,
        fragmentShader: fragment.fragment
      }
    )

    this.mesh = new THREE.Points( this.boxGeometry, this.material );
    this.scene.add(this.mesh);
  }

  initGPGPU()
  {
    this.gpgpu = new GPUComputationRenderer(this.size, this.size, this.renderer);

    this.dtPosition = this.gpgpu.createTexture();
    this.dtVelocity = this.gpgpu.createTexture();

    // this needs to be set or texture will be upside down
    this.dtPosition.flipY = true;


    //this.dtPosition.image.data = this.geometry.attributes.position.array
    console.log(this.dtPosition.image.data.length, this.boxGeometry.attributes.uv.array.length);
    this.fillPositions(this.dtPosition)
    //this.fillPositions(this.dtVelocity)

    //this.material.uniforms.positionTexture.value = this.dtPosition.texture
    this.positionVariable = this.gpgpu.addVariable('texturePosition', posFragment.posFragment, this.dtPosition);
    this.velocityVariable = this.gpgpu.addVariable('textureVelocity', velFragment.velFragment, this.dtVelocity);

    this.positionUniforms = this.positionVariable.material.uniforms;
    this.velocityUniforms = this.velocityVariable.material.uniforms;

    this.velocityUniforms['mouse'] = { value: new THREE.Vector3(0, 0, 0) };
    this.positionUniforms['time'] = { value: 0.0};

    this.gpgpu.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
    this.gpgpu.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

    this.positionVariable.wrapS = THREE.RepeatWrapping;
    this.positionVariable.wrapT = THREE.RepeatWrapping;

    this.velocityVariable.wrapS = THREE.RepeatWrapping;
    this.velocityVariable.wrapT = THREE.RepeatWrapping;

    this.gpgpu.init();
  }

  fillPositions(texture)
  {

    let data = texture.image.data;
    let geometryPosition = this.boxGeometry.attributes.position.array
    let x,y,z;

    for(let i = 0, index = 0; i < data.length; i += 4, index += 3)
    {

      x = this.boxGeometry.attributes.position.array[index];
      y = this.boxGeometry.attributes.position.array[index + 1];
      z = this.boxGeometry.attributes.position.array[index + 2];

      // assigning position values, the texture uses 4 numbers for every particle

      data[i] = x;
      data[i + 1] = y;
      data[i + 2] = z;
      data[i + 3] = 0;
    }
  }

  mousePos()
  {
    document.addEventListener('mousemove', (event) =>{
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = (1.0 - event.clientY / window.innerHeight ) * 2 - 1;
    })
  }


  animate(){
    requestAnimationFrame( this.animate );

    this.stats.begin();

    //this.velocityUniforms['mouse'].value.set(this.rayFromMouse.x, this.rayFromMouse.y)
    this.velocityUniforms['mouse'].value.set(this.mouse.x, this.mouse.y)
    this.positionUniforms['time'].value = this.clock.getDelta();

    this.gpgpu.compute();

    this.material.uniforms.positionTexture.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture;
    this.material.uniforms.velocityTexture.value = this.gpgpu.getCurrentRenderTarget(this.velocityVariable).texture;

    this.renderer.render( this.scene, this.camera);

    this.stats.end();
  }

}
