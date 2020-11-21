class FindMultipleWords {

  private readonly body: HTMLElement
  private readonly color: Array<string>
  private readonly except: Array<string>
  private wordCount: Array<number>
  private wordPosition: Array<Array<number>>
  private findWords: Array<string>
  private observer: any
  private lazySearch: any

  constructor(color: Array<string>, except: Array<string>) {
    this.body = document.body
    this.color = color
    this.except = except
    this.wordCount = []
    this.wordPosition = []
    this.findWords = []
    this.observer = ''
    this.lazySearch = ''
  }

  insertFmwElement(el: any) {
    el.childNodes.forEach((node: any) => {
      if(node.nodeName === '#text'
        && this.except.indexOf(node.parentNode.nodeName) === -1
        && node.data.replace(/\t|\n| /gm, '') !== "") {
          this.replaceElement(node);
      } else if(node.nodeName === 'IFRAME' && node.contentDocument) {
        node.contentDocument.body.childNodes.forEach((node: any) => {
          this.insertFmwElement(node);
        });
      } else if(node.childNodes
        && node.childNodes.length
        && this.except.indexOf(node.nodeName) === -1) {
          this.insertFmwElement(node);
      }
    });
  }

  replaceElement(node: any) {
    const fmwElement = document.createElement('i');
          fmwElement.className = 'fmw-style-container';
          fmwElement.style.fontStyle = 'normal';
    let nodeText = node.data;

    this.findWords.forEach((word, i) => {
      const reg = new RegExp(word, 'gim');
      if(reg.test(nodeText)) {
        const className = `fmw-style fmw-style-${i}`;
        const baseStyleText = "font-style: normal; display: inline; box-shadow: 1px 3px 3px rgba(0,0,0,0.2); border-radius: 4px; color: #000; white-space: initial;";
        const divisionColor = `background: ${this.color[i]};`;
        nodeText = nodeText.replace(reg, `<i class="${className}" style="${baseStyleText + divisionColor}">\$&</i>`);
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

  elementAbsPositionTop(el: any) {
    let posTop = 0;
    while(el.offsetParent) {
      posTop += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return posTop;
  }

  deleteFmwElement(el: any) {
    const children = el.children;
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

  resetWordPosition() {
    this.wordPosition = [];
  }

  clearTimeoutSearch() {
    if(this.observer) this.observer.disconnect();
    if(this.lazySearch) clearTimeout(this.lazySearch);
  }

  searchDomElement(keywords: Array<string>) {
    this.wordCount = [];
    this.deleteFmwElement(this.body);
    if(this.observer) this.observer.disconnect();
    if(this.lazySearch) clearTimeout(this.lazySearch);
    if(keywords.length === 0) return;
    
    // 검색에 사용된 단어
    this.findWords = keywords;
    // 검색된 단어의 개수 파악
    this.wordCount = Array(keywords.length).fill(0);
    // 검색된 단어의 위치값 파악
    this.wordPosition = Array(keywords.length).fill([]);
    this.body.childNodes.forEach(node => this.insertFmwElement(node));

    whale.runtime.sendMessage({
      count: this.wordCount,
      position: this.wordPosition
    });

    this.startDomObserver(keywords);
  }

  startDomObserver(keywords: Array<string>) {
    const targetNode = document.body;
    const config = { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: true,
      attributeOldValue: false,
      characterDataOldValue: false
    };
    
    this.observer = new MutationObserver(() => {
      if(this.lazySearch) clearTimeout(this.lazySearch);
      this.lazySearch = setTimeout(() => {
        this.observer.disconnect();
        this.searchDomElement(keywords);
      }, 1000);
    });
    this.observer.observe(targetNode, config);
  }

}

export default FindMultipleWords;