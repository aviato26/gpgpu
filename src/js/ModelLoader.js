
// lord of the rings model from dreamventure.nvk
"The One Ring (Lord of the Rings) (https://skfb.ly/o6zC6) by dreamventure.nvk is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/)."
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'three';

import ringModel from '../ring.glb';

export class ModelLoader
{
  constructor()
  {
    this.loader = new GLTFLoader();

      this.model1 = this.loadModel(ringModel);
      //this.model2 = this.loadModel(ringModel);

      //this.allLoadedModels = Promise.all([this.model1, this.model2]);
  }

  loadModel(model)
  {
  return new Promise((res, rej) => {
          return this.loader.load(model, (gltf) => {
            //console.log(gltf.scene.children[1].geometry.attributes.position.array)
          // adding object to the main scene thats being passed in from the Main class

          if(gltf)
          {
            //console.log(gltf)
            res(gltf.scene)

              //for fbx only export gltf (there is now scene property on fbx instances)
              //res(gltf)

          }
          else
          {
            rej('text was not loaded')
          }
        })
      })
  }

}
