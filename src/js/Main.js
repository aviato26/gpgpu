
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import vertex from '../shaders/vertex.js';
import fragment from '../shaders/fragment.js';

export default class Main
{
  constructor(){
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  this.scene.background = new THREE.Color( 0xffffff );

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( this.renderer.domElement );

  this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);

  this.gpgpu = new GPUComputationRenderer(window.innerWidth, window.innerHeight, this.renderer);
  this.initGPGPU()

  //this.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );

  this.material = new THREE.ShaderMaterial(
    {
      uniforms:
      {
        posMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texVel).texture},
        velMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texPos).texture},
        count: { type: "f", value: 0.0}
      },

      vertexShader: vertex.vertex,
      fragmentShader: fragment.fragment
    }
  )

  this.material2 = new THREE.ShaderMaterial(
    {
      uniforms:
      {
        posMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texVel).texture},
        velMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texPos).texture},
      },

      vertexShader: vertex.vertex,
      fragmentShader: fragment.fragment
    }
  )

  //this.addMaterials()

  this.mesh = new THREE.Points( this.geometry, this.material );

  this.scene.add(this.mesh)

  this.camera.position.z = 2;

  // must bind function to this class or the default is the global scope which will return animate is undefined since there is no animate function in global scope
  this.animate = this.animate.bind(this);

  this.animate();
  }

  addMaterials()
  {
    this.material = new THREE.ShaderMaterial(
      {
        uniforms:
        {
          posMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texVel).texture},
          velMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texPos).texture},
          count: { type: "f", value: 0.0}
        },

        vertexShader: vertex.vertex,
        fragmentShader: fragment.fragment
      }
    )

    this.material2 = new THREE.ShaderMaterial(
      {
        uniforms:
        {
          posMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texVel).texture},
          velMap: { type: "t", value: this.gpgpu.getCurrentRenderTarget(this.texPos).texture},
        },

        vertexShader: vertex.vertex,
        fragmentShader: fragment.fragment
      }
    )

  }

  initGPGPU()
  {
    this.pos = this.gpgpu.createTexture();
    this.vel = this.gpgpu.createTexture();

    /*
    this.def = this.gpgpu.createTexture();

    var posArray = this.pos.image.data;
    var velArray = this.vel.image.data;
    var defArray = this.def.image.data;


    for ( var i = 0, il = posArray.length; i < il; i += 4 ) {

      var phi = Math.random() * 2 * Math.PI;
      var theta = Math.random() * Math.PI;
      var r = 0.8 + Math.random() * 2;

      defArray[ i + 0 ] = posArray[ i + 0 ] = r * Math.sin( theta) * Math.cos( phi );
      defArray[ i + 1 ] = posArray[ i + 1 ] = r * Math.sin( theta) * Math.sin( phi );
      defArray[ i + 2 ] = posArray[ i + 2 ] = r * Math.cos( theta );

      velArray[ i + 3 ] = Math.random() * 100; // frames life
      // if(i < 50) console.log(velArray[ i + 3 ])
    }
    */
    //this.pos.image.data
    //this.pos.image.data = this.geometry.attributes.position.array
    //this.vel.image.data = this.geometry.attributes.position.array
    this.texVel = this.gpgpu.addVariable("tVel", fragment.fragment, this.vel );
    this.texPos = this.gpgpu.addVariable("tPos", fragment.fragment, this.pos );
    //this.texDef = this.gpgpu.addVariable("texDef", fragment.fragment, this.def );

    this.gpgpu.setVariableDependencies(this.texVel, [this.texVel, this.texPos]);
    this.gpgpu.setVariableDependencies(this.texPos, [this.texVel, this.texPos]);
    //this.gpgpu.setVariableDependencies(this.texDef, [this.texVel, this.texPos]);

/*
    this.gpgpu.setVariableDependencies(this.texVel, [this.texVel, this.texPos, this.def]);
    this.gpgpu.setVariableDependencies(this.texPos, [this.texVel, this.texPos, this.def]);
    this.gpgpu.setVariableDependencies(this.texDef, [this.texVel, this.texPos, this.def]);
    */
    this.gpgpu.init()
  }


  animate(){
    requestAnimationFrame( this.animate );

    this.gpgpu.compute()

    this.material.uniforms.posMap.value = this.gpgpu.getCurrentRenderTarget(this.texVel).texture;
    this.material.uniforms.velMap.value = this.gpgpu.getCurrentRenderTarget(this.texVel).texture;

    this.material2.uniforms.posMap.value = this.gpgpu.getCurrentRenderTarget(this.texVel).texture;
    this.material2.uniforms.velMap.value = this.gpgpu.getCurrentRenderTarget(this.texVel).texture;
    //this.material.uniforms.count.value =

    this.mesh.material = this.material2;

    this.renderer.render( this.scene, this.camera );

    this.mesh.material = this.material;

    this.renderer.render( this.scene, this.camera);
  }

}
