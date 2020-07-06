import $ from 'jquery';
import Util from './util';
import * as ProductsAPI from './utils/ProductsAPI'


class Modal {
  constructor() {
    this.modalButton = document.querySelectorAll('.modal-btn');
    this.body = document.querySelector('body');
    this.backdrop = document.querySelector('.modal__backdrop');
    this.maxHeight = 100;

    this.products = {
      babyProducts: [
        {
            id: 'bebealimentation',
            title: 'Alimentation',
            imgURL: '/assets/img/products/baby/bebealimentation.png',
          },
          {
            id: 'bebesoins',
            title: 'Soins',
            imgURL: '/assets/img/products/baby/bebesoins.png',
          },
          {
            id: 'couches',
            title: 'Couches',
            imgURL: '/assets/img/products/baby/couches.png',
          },
      ],
      hygieneProducts: [
        {
            id: 'apres-shamppoing',
            title: 'après-shamppoing',
            imgURL: '/assets/img/products/hygen/apres-shamppoing.png',
          },
          {
            id: 'papier-hygenique',
            title: 'papier WC Mouchoirs et coutons',
            imgURL: '/assets/img/products/hygen/papier-hygenique.png',
          },
          {
            id: 'coton-tige-et-coton',
            title: 'Coton et coton pads',
            imgURL: '/assets/img/products/hygen/coton-tige-et-coton.png',
          },
          {
            id: 'serviettes-hygenique',
            title: 'Hygiène féminine',
            imgURL: '/assets/img/products/hygen/serviettes-hygenique.png',
          },
          {
            id: 'soins-capilaires',
            title: 'Soins capilaires',
            imgURL: '/assets/img/products/hygen/soins-capilaires.png',
          },
      ],
    };
    this.getProductsAPI();
    this.events();
  }

  getProductsAPI() {
    ProductsAPI.getAll().then((products) => {
        this.products  = products
    })
  }
  
  resizeImage(imageURL, maxHeight) {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {

        if (image.height > maxHeight) {
          image.width *= maxHeight / image.height;
          image.height = maxHeight;
        }

        resolve('image loaded')
      };

      image.src = imageURL;
    });
  }

  loadSection(element) {
    const sectionSelector = element.getAttribute('data-section');
    const parentDiv = document.querySelector(`#${sectionSelector}>.modal__navbar__product`);
    
    const arrayOfProducts = this.products[sectionSelector];

    if(!arrayOfProducts){
        return
    }

    arrayOfProducts.forEach(function (obj){
      const id = obj.id;
      const url = obj.imgURL;
      const title = obj.title;

      const product = document.querySelector(`#${id}`);

      if (!product) {
        this.resizeImage(url, this.maxHeight).then((inlineURL) => {
          const productHTML = `<div class="modal__navbar__product__container" id="${id}">
          <img class="modal__navbar__product__img" src="${url}" alt="apres shampooing">
              <span class="modal__navbar__product__title">${title}</span>
            </div>`;
          parentDiv.insertAdjacentHTML('beforeend', productHTML);
        });
      }
    },this);
  }

  events() {
    this.modalButton.forEach((item) => {
      item.addEventListener('click', this.openModal.bind(this, item));
    });
  }

  closeModal(element) {
    const selector = element.getAttribute('data-modal');
    const sectionSelector = element.getAttribute('data-section');
    const section = document.querySelector(`#${sectionSelector}`);
    const modal = document.querySelector(`.${selector}`);


    this.backdrop.classList.remove('modal__backdrop--open');
    section ? (section.style.display = 'none') : null;
    modal.classList.remove(`${selector}--open`);
    this.body.classList.remove('overflow-hidden');

    this.backdrop.removeEventListener('click', this.moveModal);
  }

  openModal(element) {
    const selector = element.getAttribute('data-modal');
    const sectionSelector = element.getAttribute('data-section');
    const section = document.querySelector(`#${sectionSelector}`);
    const modal = document.querySelector(`.${selector}`);
    const transitionDuration = Util.getTransitionDurationFromElement(element);
    const waitForModalBackdrop = new Promise((resolve) => {
      setTimeout(function () {
        resolve('transition finished!');
      }, transitionDuration);
    });
    
    sectionSelector? this.loadSection.call(this,element):null;
    

    this.backdrop.classList.add('modal__backdrop--open');
    this.body.classList.add('overflow-hidden');
    section ? (section.style.display = 'block') : null;

    waitForModalBackdrop.then(() => {
      modal.classList.add(`${selector}--open`);
      this.backdrop.addEventListener('click', this.closeModal.bind(this, element));
    });
  }
}

new Modal();
