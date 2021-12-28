
//import { Vector2 } from 'three';

import { TextureSwitch } from './TextureSwitch.js';
import TextContainer from './textContainers.js';

export class MouseControls
{
  constructor()
  {

    // the x,y,z variables are for keeping track of the moving cursor
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.tSwitch = 0;
    this.pressingDown = true;

    this.currentElement = '';
    this.initialClick = 0;

    this.currentTexture = new TextureSwitch(this.currentElement);

    this.updateMosPos();
    this.mobileMovePos();

  }

  updateMosPos()
  {
    document.addEventListener('mousemove', (event) => {
      if(this.pressingDown)
      {
        this.x = (( event.clientX / window.innerWidth ) * 2 - 1) * 0.2;
        this.y = ((1.0 - event.clientY / window.innerHeight ) * 2 - 1) * 0.2;
        //this.y = -this.y;
        //this.tSwitch = 0.0;
      }
    })

    document.addEventListener('mousedown', (e) => {

      // setting pressingDown to true so the particles will move with mouse move
      this.pressingDown = true;

      // check increment click event
      //this.initialClick += 1;

      this.x = (( event.clientX / window.innerWidth ) * 2 - 1);
      this.y = ((1.0 - event.clientY / window.innerHeight ) * 2 - 1);

/*
      // current element that is clicked on
      this.currentElement = e.target.id;
      this.currentTexture.textureIndex(this.currentElement);
      this.textContainer.updateElements(this.currentTexture.currentIndex);
      this.tSwitch = this.currentTexture.currentIndex;
*/
      //this.y = -this.y;
      /*
      this.cursorDown.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      this.cursorDown.y = (1.0 - e.clientY / window.innerHeight ) * 2 - 1;

      this.cursorDown.y = -this.cursorDown.y;

      this.newPos = this.cursorDown.sub(this.centerOfView).normalize();
      this.midScreen = window.innerWidth / window.innerHeight;
      this.xs = e.clientX - ( window.innerWidth / 2 );
      this.ys = e.clientY - ( window.innerHeight / 2 );
      */
      //this.newPos = new Vector2();

/*
      if(this.tSwitch === 1.0)
      {
        this.tSwitch = 0.0;
      }
      else
      {
        this.tSwitch = 1.0;
      }
*/
      //console.log(direction.subVectors(this.mouse, new Vector2()).normalize());
    })

    document.addEventListener('mouseup', (e) => {

      // check increment click event
      this.initialClick += 1;

      // check if the initial click event was activated
      if(this.initialClick === 1)
      {
        // after initial click, instantiating textContainer to activate text boxes
        this.textContainer = new TextContainer();
        //this.textContainer.updateElements(this.currentTexture.currentIndex);
      }

      if(this.textContainer)
      {
        this.textContainer.redirectToURL(e.target.id);
      }

      // initialze textContainer for texture switching
      //this.textContainer = new TextContainer();

      // current element that is clicked on
      this.currentElement = e.target.id;
      this.currentTexture.textureIndex(this.currentElement);
      this.textContainer.updateElements(this.currentTexture.currentIndex);
      this.tSwitch = this.currentTexture.currentIndex;

      // creating a little delay to let particles bunch together

      setTimeout(() => {
        this.pressingDown = false;

        // current element that is clicked on
        this.currentElement = e.target.id;
        this.currentTexture.textureIndex(this.currentElement);
        this.textContainer.updateElements(this.currentTexture.currentIndex);
        this.tSwitch = this.currentTexture.currentIndex;

        //this.textContainer.updateElements(this.currentTexture.currentIndex);

        // check increment click event
        //this.initialClick += 1;
      }, 500)

      //this.tSwitch = 1.0;
    })

    // gathering all divs that are placed over the text
    const containers = [...document.getElementsByClassName('textContainers')];

    // looping over the divs over text to add click event, this will check which div is clicked to chose which text object (from home page to project to about page ...)
    containers.map(c => c.addEventListener('click', (e) => console.log(e)))

  }


  mobileMovePos()
  {
    document.addEventListener('touchmove', (e) => {
      /*
      this.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
      this.y = (1.0 - event.changedTouches[0].clientY / window.innerHeight ) * 2 - 1;
      this.y = -this.y;
      */
      if(this.pressingDown)
      {
        this.x = (( e.changedTouches[0].clientX / window.innerWidth ) * 2 - 1) * 0.2;
        this.y = ((1.0 - e.changedTouches[0].clientY / window.innerHeight ) * 2 - 1) * 0.2;
        //this.y = -this.y;
        this.tSwitch = 0.0;
      }
    })

    document.addEventListener('touchstart', (e) => {
      this.pressingDown = true;
      this.x = ( e.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
      this.y = (1.0 - e.changedTouches[0].clientY / window.innerHeight ) * 2 - 1;
      //this.y = -this.y;
      /*
      this.cursorDown.x = ( e.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
      this.cursorDown.y = (1.0 - e.changedTouches[0].clientY / window.innerHeight ) * 2 - 1;
      this.cursorDown.y = -this.cursorDown.y;
      */
      //console.log(this.cursorDown.sub(this.centerOfView).normalize());

    })

    document.addEventListener('touchend', (e) => {
      //this.pressingDown = false;

      setTimeout(() => {
        this.pressingDown = false;

        // current element that is clicked on
        this.currentElement = e.target.id;
        this.currentTexture.textureIndex(this.currentElement);
        this.textContainer.updateElements(this.currentTexture.currentIndex);
        this.tSwitch = this.currentTexture.currentIndex;

        //this.textContainer.updateElements(this.currentTexture.currentIndex);

        // check increment click event
        //this.initialClick += 1;
      }, 500)

      //this.tSwitch = 1.0;
    })

  }



}
