export default class FindMultipleWords {
  constructor() {
    this.body = document.body;
    this.except = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME', 'MAT-ICON'];
  }

  insertFmwElement(el) {
    el.childNodes.forEach(node => {
      if(node.nodeName === '#text'
        && this.except.indexOf(node.parentNode.nodeName) === -1
        && node.data.replace(/\t|\n| /gm, '') !== "") {
          this.replaceElement(node);
      } else if(node.childNodes
        && node.childNodes.length
        && this.except.indexOf(node.nodeName) === -1) {
          this.insertFmwElement(node);
      }
    });
  }

  replaceElement(node) {
    const fmwElement = document.createElement('i');
          fmwElement.className = 'fmw-style-container';
    let nodeText = node.data;

    this.findWords.forEach((word, i) => {
      const reg = new RegExp(word, 'gim');
      if(reg.test(nodeText)) {
        nodeText = nodeText.replace(reg, `<i class="fmw-style fmw-style-${i}">\$&</i>`);
        // 검색된 키워드 카운팅
        this.wordCount[i] += 1;
      }
    });

    if(node.data !== nodeText) {
      fmwElement.innerHTML = nodeText;
      node.parentNode.replaceChild(fmwElement, node);
    }
  }

  elementAbsPositionTop(el) {
    let posTop = 0;
    while(el.offsetParent) {
      posTop += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return posTop;
  }

  deleteFmwElement(el) {
    let children = el.children;
    let i = children.length - 1;
    while(i >= 0) {
      if(children[i].children && children[i].children.length && this.except.indexOf(children[i].nodeName) === -1) {
        this.deleteFmwElement(children[i]);
      }
      if(String(children[i].className).indexOf('fmw-style-container') !== -1 && children[i].nodeName === 'I') {
        children[i].outerHTML = children[i].textContent;
      }
      i--;
    }
  }

  resetWordCount() {
    this.wordCount = [];
  }

  searchDomElement(keywords) {
    this.deleteFmwElement(this.body);
    if(keywords.length) {
      // 검색에 사용된 단어
      this.findWords = keywords;
      // 검색된 단어의 개수 파악
      this.wordCount = Array(keywords.length).fill(0);
      this.body.childNodes.forEach(node => this.insertFmwElement(node));
    }
  }

}