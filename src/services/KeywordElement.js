import { COLOR } from '../constants/index.js';

export default class KeywordElement {
  constructor() {
    this.container = document.getElementById('keyword-container');
  }

  removeKeywordList() {
    while(this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  appendKeywordList(keywords) {
    keywords = JSON.parse(keywords);
    this.removeKeywordList();
    const listContainer = document.createElement('ul');
    keywords.forEach((keyword, i) => {
      const list = document.createElement('li');
      const text = document.createElement('p');
            text.setAttribute('style', `background: ${COLOR[i]};`);
      text.appendChild(document.createTextNode(keyword));
      list.appendChild(text);
      listContainer.appendChild(list);
    });
    this.container.appendChild(listContainer);
  }
}