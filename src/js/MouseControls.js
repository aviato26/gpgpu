

export class MouseControls
{
  constructor()
  {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.tSwitch = 0.0;

    this.updateMosPos();
    this.changeTexture();
    this.mobileMovePos();
  }

  updateMosPos()
  {
    document.addEventListener('mousemove', (event) => {
      this.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.y = (1.0 - event.clientY / window.innerHeight ) * 2 - 1;
      this.y = -this.y;
    })
  }

  changeTexture()
  {
    document.addEventListener('mousedown', (e) => {
      if(this.tSwitch === 1.0)
      {
        this.tSwitch = 0.0;
      }
      else
      {
        this.tSwitch = 1.0;
      }
    })

  }

  mobileMovePos()
  {
    document.addEventListener('touchmove', (event) => {
      this.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
      this.y = (1.0 - event.changedTouches[0].clientY / window.innerHeight ) * 2 - 1;
      this.y = -this.y;
    })
  }

}
