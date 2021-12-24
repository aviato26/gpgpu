

export default class TextContainer
{

  constructor()
  {
    this.homePage();
  }

/*
  addToolTip(element)
  {
    let allElements = document.querySelectorAll(element);

    for(let i = 0; i < allElements.length; i++)
    {
      allElements[i].setAttribute('data-tooltip', 'Click off link to go to previous image');
    }

  }
*/

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

    //this.addToolTip('div');

  }

  projectsPage()
  {
    /*
      let c1 = document.createElement('a');
      let c2 = document.createElement('a');
      let c3 = document.createElement('a');
    */

      let c1 = document.createElement('div');
      let c2 = document.createElement('div');
      let c3 = document.createElement('div');

      c1.id = 'ProjectPageTop';
      c2.id = 'ProjectPageMiddle';
      c3.id = 'ProjectPageBottom';

      c1.className = 'textContainers';
      c2.className = 'textContainers';
      c3.className = 'textContainers';

      document.body.appendChild(c1);
      document.body.appendChild(c2);
      document.body.appendChild(c3);

/*
      // attaching links to projects
      c1.href = 'https://aviato26.github.io/coffeeStop/';
      c2.href = 'https://talk-box.herokuapp.com/';
      c3.href = 'https://movie-bin.herokuapp.com/';
*/
/*
      // checking to see if node elements are already appended to document
      if(document.querySelectorAll('div').length < 1)
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
      */

  }

  contactsPage()
  {
      //let c1 = document.createElement('a');
      let c1 = document.createElement('div');

      c1.id = 'ContactPage';

      c1.className = 'textContainers';

      document.body.appendChild(c1);
/*
      //c1.href = 'mailto:sdeshler426@aol.com';
        document.body.appendChild(c1);
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
*/
  }

  updateElements(index)
  {
    // check what div is clicked on, then filtering each one
    switch(index)
    {
      case 0:
        this.clearElements('.textContainers');
        this.homePage();
      break;

      case 1:
        this.clearElements('.textContainers');
        this.projectsPage();
      break;

      case 2:
        this.clearElements('.textContainers');
      break;

      case 3:
        this.clearElements('.textContainers');
        this.contactsPage();
      break;
    }
  }

  redirectToURL(elementId)
  {

    let coffeeStop = 'https://aviato26.github.io/coffeeStop/';
    let talkBox = 'https://talk-box.herokuapp.com/';
    let movieBin = 'https://movie-bin.herokuapp.com/';
    let email = 'mailto:sdeshler426@aol.com';

    // checking to see what links are clicked, then filtering through each one
    switch (elementId) {
      case 'ProjectPageTop':

        // making http request to projects page
        fetch(coffeeStop, { method: 'GET', redirect: 'follow'})
          .then(response => {
            // set window location to response url to redirect to other website
            window.location.href = response.url;
          })
          .catch(err => console.log(err))
      break;

      case 'ProjectPageMiddle':
        fetch(talkBox, { method: 'GET', redirect: 'follow'})
          .then(response => {
            // set window location to response url to redirect to other website
            window.location.href = response.url;
          })
          .catch(err => console.log(err))
      break;

      case 'ProjectPageBottom':
        fetch(movieBin, { method: 'GET', redirect: 'follow'})
          .then(response => {
            // set window location to response url to redirect to other website
            window.location.href = response.url;
          })
          .catch(err => console.log(err))
      break;

      case 'ContactPage':
        window.location.href = "mailto:mail@example.org";
      break;

      default:
      break;

    }
  }

  clearElements(elements)
  {
    // clearing all node elements to clean the document for new ones
    document.querySelectorAll(elements).forEach(c => c.remove());
  }

}
