export default class KeywordElement {

  constructor() {
    this.container = document.getElementById('keyword-container');
  }

  removeKeywordList() {
    while(this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  createCloseSvg(idx) {
    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(xmlns, "svg");
          svg.setAttribute('class', `keyword-list-close-btn list-close-idx-${idx}`);
          svg.setAttributeNS(null, 'width', '24');
          svg.setAttributeNS(null, 'height', '24');
          svg.setAttributeNS(null, 'fill-rule', 'evenodd');
          svg.setAttributeNS(null, 'clip-rule', 'evenodd');
    const path = document.createElementNS (xmlns, "path");
          path.setAttributeNS(null, 'd', 'M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z');

    svg.appendChild(path);
    return svg;
  }

  appendKeywordList(keywords) {
    const listContainer = document.createElement('ul');
    const listTitle = document.createElement('h2');
          listTitle.appendChild(document.createTextNode('keyword'));

    this.container.appendChild(listTitle);
    // 키워드 개수 매핑을 위한 엘리먼트 배열
    this.listElement = [];

    keywords.forEach((keyword, i) => {
      const list = document.createElement('li');
      const text = document.createElement('p');
            text.appendChild(document.createTextNode(keyword));
            list.appendChild(text);
            list.appendChild(this.createCloseSvg(i));

      this.listElement.push(list);
      listContainer.appendChild(list);
    });

    this.container.appendChild(listContainer);
  }

  // 검색한 키워드의 개수 출력
  appendKeywordCount(counts) {
    counts.forEach((count, i) => {
      const countElement = document.createElement('span');
      const keywordCount = document.createTextNode(`(${counts[i]})`);
            countElement.appendChild(keywordCount);
      
      this.listElement[i].appendChild(countElement);
    });
  }
}