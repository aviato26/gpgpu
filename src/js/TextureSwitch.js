


export class TextureSwitch
{
  constructor(textContainer)
  {
    this.currentIndex = 0;

    this.textureIndex(textContainer);
  }

  textureIndex(textContainer)
  {
    switch(textContainer)
    {
      case "HomePageTop":
        this.currentIndex = 1;
      break;

      case "HomePageMiddle":
        this.currentIndex = 2;
      break;

      case "HomePageBottom":
        this.currentIndex = 3;
      break;

      case "":
        this.currentIndex = 0;
      break;
    }
  }

}
