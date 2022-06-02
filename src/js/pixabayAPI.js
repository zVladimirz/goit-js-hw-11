const API_KEY = '27704892-de5059e1c4b826ebc44d6e413';
const BASE_URL = 'https://pixabay.com/api';

const url = `https://pixabay.com/api/?key=27704892-de5059e1c4b826ebc44d6e413&q=dog&image_type=photo&per_page=40&page=1`;

const axios = require('axios');

class PixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pageItem = 40;
  }
  async fetchImages() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&per_page=${this.pageItem}&page=${this.page}`;
    try {
      const resp = await axios.get(url);

      if (this.page === 1) {
        this.totalHits = resp.data.totalHits;
        this.maxPege = Math.ceil(resp.data.totalHits / this.pageItem);
      }
      this.incrementPage();
      return resp.data;
    } catch (err) {
      // Handle Error Here
      console.error('axiosget error');
    }
  }
  fetchImages1() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&per_page=40&page=${this.page}`;
    return fetch(url).then(response => {
      const answer = response.json();
      if (this.page === 1) {
        this.totalHits = answer.totalHits;
        this.maxPege = Math.ceil(answer.totalHits / this.pageItem);
      }
      this.incrementPage();
      return answer;
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export { PixabayAPI };
