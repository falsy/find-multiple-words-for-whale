class FindMultipleWords {
  constructor() {
    this.body = document.body;
    this.color = ['#AEDFDB', '#F4D94E', '#F38D9B', '#BEA6F9', '#99d45D'];
    this.except = ['SCRIPT', 'LINK', 'STYLE', 'MAT-ICON'];
    this.wordCount = [];
    this.wordPosition = [];
  }

  insertFmwElement(el) {
    el.childNodes.forEach(node => {
      if(node.nodeName === '#text'
        && this.except.indexOf(node.parentNode.nodeName) === -1
        && node.data.replace(/\t|\n| /gm, '') !== "") {
          this.replaceElement(node);
      } else if(node.nodeName === 'IFRAME' && node.contentDocument) {
        node.contentDocument.body.childNodes.forEach(node => {
          this.insertFmwElement(node);
        });
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
          fmwElement.style.fontStyle = 'normal';
    let nodeText = node.data;

    this.findWords.forEach((word, i) => {
      const reg = new RegExp(word, 'gim');
      if(reg.test(nodeText)) {
        const className = `fmw-style fmw-style-${i}`;
        const baseStyleText = "font-style: normal; display: inline-block; box-shadow: 1px 3px 3px rgba(0,0,0,0.2); border-radius: 4px; padding: 0 5px; color: #000;";
        const divisionColor = `background: ${this.color[i]};`;
        nodeText = nodeText.replace(reg, `
          <i class="${className}" style="${baseStyleText + divisionColor}">
            \$&
          </i>
        `);
        // 검색된 키워드 카운팅
        this.wordCount[i] += 1;
        const targetPosition = this.elementAbsPositionTop(node.parentElement);
        const marginScroll = 80;
        this.wordPosition[i] = this.wordPosition[i].concat(targetPosition - marginScroll);
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
      if(children[i].nodeName === 'IFRAME' && children[i].contentDocument) {
        this.deleteFmwElement(children[i].contentDocument.body);
      }
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

  resetWordPosition() {
    this.wordPosition = [];
  }

  watchingDom() {
    console.log('aa');
  //   console.log(sha1);
  }

  searchDomElement(keywords) {
    this.deleteFmwElement(this.body);
    if(keywords.length) {
      this.watchingDom();
      // 검색에 사용된 단어
      this.findWords = keywords;
      // 검색된 단어의 개수 파악
      this.wordCount = Array(keywords.length).fill(0);
      // 검색된 단어의 위치값 파악
      this.wordPosition = Array(keywords.length).fill([]);
      this.body.childNodes.forEach(node => this.insertFmwElement(node));
    }
  }

}

export default FindMultipleWords;