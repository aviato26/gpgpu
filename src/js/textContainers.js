

export default class TextContainer
{

  constructor()
  {
    this.homePage();
  }

  homePage()
  {
    // creating elements that will be placed over the particles so pagination can be implemented

    let c1 = document.createElement('div');
    let c2 = document.createElement('div');
    let c3 = document.createElement('div');

    c1.id = 'HomePageTop';
    c2.id = 'HomePageMiddle';
    c3.id = 'HomePageBottom';

    c1.className = 'textContainers';
    c2.className = 'textContainers';
    c3.className = 'textContainers';

    // append the text containers to the page
    document.body.appendChild(c1);
    document.body.appendChild(c2);
    document.body.appendChild(c3);

  }

  projectsPage()
  {
      let c1 = document.createElement('a');
      let c2 = document.createElement('a');
      let c3 = document.createElement('a');

      c1.id = 'ProjectPageTop';
      c2.id = 'ProjectPageMiddle';
      c3.id = 'ProjectPageBottom';

      c1.className = 'textContainers';
      c2.className = 'textContainers';
      c3.className = 'textContainers';

      // attaching links to projects
      c1.href = 'https://aviato26.github.io/coffeeStop/';
      c2.href = 'https://talk-box.herokuapp.com/';
      c3.href = 'https://movie-bin.herokuapp.com/';

      // checking to see if node elements are already appended to document
      if(document.querySelectorAll('a').length < 1)
      {
        // clearing homepage elements from document
        this.clearElements('#HomePageTop');
        this.clearElements('#HomePageMiddle');
        this.clearElements('#HomePageBottom');

        // append the text containers to the page
        document.body.appendChild(c1);
        document.body.appendChild(c2);
        document.body.appendChild(c3);

      }
      else
      {
        this.clearElements()
      }

  }

  contactsPage()
  {
      let c1 = document.createElement('a');

      c1.id = 'ContactPage';

      c1.className = 'textContainers';

      c1.href = 'mailto:sdeshler426@aol.com';

      // checking to see if any nodes are already appended
      if(document.querySelectorAll('a').length < 1)
      {
        this.clearElements('#HomePageTop');
        this.clearElements('#HomePageMiddle');
        this.clearElements('#HomePageBottom');
        // append the text containers to the page
        document.body.appendChild(c1);
      }
      else
      {
        this.clearElements()
      }
  }

  updateElements(index)
  {
    // check what
    switch(index)
    {
      case 0:
        this.clearElements('.textContainers');
        this.homePage();
      break;

      case 1:
        // dont clear project elements or they will not be able to use the a links
        this.projectsPage();
      break;

      case 2:
        this.clearElements('.textContainers');
      break;

      case 3:
        this.contactsPage();
      break;
    }
  }

  clearElements(elements)
  {
    // clearing all node elements to clean the document for new ones
    document.querySelectorAll(elements).forEach(c => c.remove());
  }

}
