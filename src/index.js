// Add imports above this line
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './js/pixabayAPI.js';

import './css/styles.css';

let fetchState = false;
const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
};


const pixabayAPI = new PixabayAPI();

refs.searchForm.addEventListener('submit', onSearch);


function onSearch(e) {
  e.preventDefault();
  pixabayAPI.query = encodeURI(e.currentTarget.elements.searchQuery.value.trim());

  if (pixabayAPI.query === '') {
    return alert('Введите что-то нормальное');
  }

  pixabayAPI.resetPage();

  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  pixabayAPI.fetchImages().then(images => {
    appendImagesMarkup(images);

    if (pixabayAPI.page === 2) {
      if (pixabayAPI.totalHits > 0) {
        Notiflix.Notify.info(`Hooray! We found ${pixabayAPI.totalHits} images.`);
      } else {
        Notiflix.Notify.info(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }
    }
    fetchState = false;
  });
}

function appendImagesMarkup(images) {
  const markup = images.hits
    .map(
      ({ largeImageURL, previewURL, previewWidth, tags, likes, views, comments, downloads }) => `
    

      <a class="gallery__item" href="${largeImageURL}">
      <div class="photo-card">
      <img class="gallery__image" src="${previewURL}" width="${previewWidth}" alt="${tags}" loading="lazy" />
  

      <table class="info-item">
      <tr>
        <td><b>Likes</b> ${likes}           </td>
        <td><b>Comments</b> ${comments}     </td>
      </tr>
      <tr>
        <td><b>Views</b> ${views}</td>
        <td><b>Downloads</b> ${downloads}</td>
      </tr>
    </table>
    
  
  

      </div>    
      </a>      
  `
    )
    .join('');

  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// infinite-scroll
let pageOld = 0;
window.addEventListener('scroll', function () {
  var block = document.querySelector('.gallery__item');

  var contentHeight = block.offsetHeight; // 1) высота блока контента вместе с границами
  var yOffset = window.pageYOffset; // 2) текущее положение скролбара
  var window_height = window.innerHeight; // 3) высота внутренней области окна документа
  var y = yOffset + window_height;

  if (window.scrollY + window.innerHeight <= document.body.scrollHeight - contentHeight * 2) {
    if (pixabayAPI.page > pixabayAPI.maxPege) {
      fetchState = false;
    }
  }

  if (window.scrollY + window.innerHeight + contentHeight * 2 >= document.body.scrollHeight) {
    if (!fetchState) {
      fetchState = true;

      if (pixabayAPI.page <= pixabayAPI.maxPege) {
        fetchImages();
      } else {
        Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
      }
    }
  }
});
