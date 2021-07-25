
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import vertex from '../shaders/vertex.js';
import fragment from '../shaders/fragment.js';
import fragState from '../shaders/FragState.js';

export default class Main
{
  constructor(){
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  this.scene.background = new THREE.Color( 0xffffff );
  this.size = 32;

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( this.renderer.domElement );

  //this.geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size, 50, 50, 50);
  this.addingObjects();
  this.initGPGPU()

  this.camera.position.z = 5;

  // must bind function to this class or the default is the global scope which will return animate is undefined since there is no animate function in global scope
  this.animate = this.animate.bind(this);

  this.animate();
  }

  addingObjects()
  {

    this.geometry = new THREE.BufferGeometry();
    //this.geometry1 = new THREE.BoxBufferGeometry(1, 1, 1, 10, 10, 10);
    let positions = new Float32Array(this.size * this.size * 3);
    let reference = new Float32Array(this.size * this.size * 2);

    let x;
    let y;
    let z;
    let refx;
    let refy;

    for(let i = 0; i < (this.size * this.size); i++)
    {
      //  setting random numbers for position
      x = Math.random();
      y = Math.random();
      z = Math.random();

      refx = (i % this.size) / this.size;
      refy = ~~(i / this.size) / this.size;

      positions.set([x, y, z], i * 3);
      reference.set([refx, refy], i * 2);
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('reference', new THREE.BufferAttribute(reference, 2))

    this.material = new THREE.ShaderMaterial(
      {
        side: THREE.DoubleSide,

        uniforms:
        {
          positionTexture: { value: null },
          res: { value: new THREE.Vector4() },
          count: { type: "f", value: 0.0}
        },

        vertexShader: vertex.vertex,
        fragmentShader: fragment.fragment
      }
    )

    this.mesh = new THREE.Points( this.geometry, this.material );
    this.scene.add(this.mesh)
  }

  initGPGPU()
  {
    this.gpgpu = new GPUComputationRenderer(this.size, this.size, this.renderer);
    this.dtPosition = this.gpgpu.createTexture();
    //this.dtPosition.image.data = this.geometry.attributes.position.array
    this.fillPositions(this.dtPosition)

    //this.material.uniforms.positionTexture.value = this.dtPosition.texture
    this.positionVariable = this.gpgpu.addVariable('texturePosition', fragState.fragState, this.dtPosition);

    this.positionVariable.wrapS = THREE.RepeatWrapping;
    this.positionVariable.wrapT = THREE.RepeatWrapping;

    this.gpgpu.init();
  }

  fillPositions(texture)
  {
    let arr = texture.image.data;
    let x;
    let y;
    let z;
/*
    this.geometry = new THREE.BufferGeometry();
    let positions = new Float32Array(this.size * this.size * 3);
    let reference = new Float32Array(this.size * this.size * 2);
*/
    for(let i = 0; i < arr.length; i += 4)
    {
      //  setting random numbers for position
      x = Math.random();
      y = Math.random();
      z = Math.random();

      // assigning position values, the texture uses 4 numbers for every particle

      arr[i] = x;
      arr[i + 1] = y;
      arr[i + 2] = z;
      arr[i + 3] = 1;
    }
  }


  animate(){
    requestAnimationFrame( this.animate );

    this.gpgpu.compute();
    //console.log(this.dtPosition)
    this.material.uniforms.positionTexture.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture;

    //requestAnimationFrame( this.animate );
    this.renderer.render( this.scene, this.camera);
  }

}
