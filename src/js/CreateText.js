
import { FontLoader, TextGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
//const format = require('three/examples/fonts/helvetiker_regular.typeface.json');
//import typefaceFont
//import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import typefaceFont from 'three/examples/fonts/droid/droid_sans_bold.typeface.json'
//import text from '../HomePage.glb';
//import text from '../about4.glb';
import text from '../ContactPage.glb';
//const format = require('three/examples/fonts/helvetiker_regular.typeface.json');
//import '/three/examples/fonts/helvetiker_regular.typeface.json';

export class CreateText
{
  constructor(scene, animation)
  {
    this.loader = new GLTFLoader();

    // loading text object made from blender, using a promise to wait for the object to load then use in main class
    this.textLoaded = new Promise((res, rej) => {
          return this.loader.load(text, (gltf) => {
            //console.log(gltf.scene.children[1].geometry.attributes.position.array)
          // adding object to the main scene thats being passed in from the Main class
          if(gltf)
          {
            res(gltf.scene)
          }
          else
          {
            rej('text was not loaded')
          }
        })
      })
  }

}
