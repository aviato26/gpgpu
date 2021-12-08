
import { Raycaster } from 'three';
//import { MouseControls } from './MouseControls.js';

export default class RaycastWorker
{

  constructor( mouse, camera, scene)
  {
    this.raycaster = new Raycaster();

    this.raycaster.params.Points.threshold = 0.001;
    this.raycaster.setFromCamera( mouse, camera);

    this.getParticle( scene );
  }

  getParticle( scene )
  {
    this.points = this.raycaster.intersectObjects( scene.children )
  }

}
