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
    const listContainer = document.createElement('ul');
    const listTitle = document.createElement('h2');
          listTitle.appendChild(document.createTextNode('keyword'));

    this.container.appendChild(listTitle);

    keywords.forEach((keyword, i) => {
      const list = document.createElement('li');
      const text = document.createElement('p');
            text.appendChild(document.createTextNode(keyword));
            list.appendChild(text);

      listContainer.appendChild(list);
    });

    this.container.appendChild(listContainer);
  }
}