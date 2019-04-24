import { COLOR, EXCEPT_ELEMENT } from '../constants/index.js';

class FindMultipleWords {
  constructor() {
    this.body = document.body;
  }

  insertFmwElement(el) {
    el.childNodes.forEach(node => {
      if(node.nodeName === '#text'
        && this.EXCEPT_ELEMENT.indexOf(node.parentNode.nodeName) === -1
        && node.data.replace(/\t|\n| /gm, '') !== "") {
          this.replaceElement(node);
      } else if(node.childNodes
        && node.childNodes.length
        && this.EXCEPT_ELEMENT.indexOf(node.nodeName) === -1) {
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
      if(children[i].children && children[i].children.length && this.EXCEPT_ELEMENT.indexOf(children[i].nodeName) === -1) {
        this.deleteFmwElement(children[i]);
      }
      if(String(children[i].className).indexOf('fmw-style-container') !== -1 && children[i].nodeName === 'I') {
        children[i].outerHTML = children[i].textContent;
      }
      i--;
    }
  }

  searchDomElement(keywords) {
    this.deleteFmwElement(this.body);
    if(keywords.length) {
      this.findWords = keywords;
      this.body.childNodes.forEach(node => this.insertFmwElement(node));
    }
  }

  prependStyleSheet() {
    if(document.getElementById('fwm-css')) return;
    const fmwStyleElement = document.createElement('style');
          fmwStyleElement.id = 'fwm-css';
          fmwStyleElement.innerHTML = `
            .fmw-style-container {
              font-style: normal;
            }
            .fmw-style-container .fmw-style {
              font-style: normal;
              display: inline-block;
              box-shadow: 1px 3px 3px rgba(0,0,0,0.2);
              border-radius: 4px;
              padding: 0 5px;
              color: #000;
            }
            .fmw-style-0 {
              background: ${this.COLOR[0]};
            }
            .fmw-style-1 {
              background: ${this.COLOR[1]};
            }
            .fmw-style-2 {
              background: ${this.COLOR[2]};
            }
            .fmw-style-3 {
              background: ${this.COLOR[3]};
            }
            .fmw-style-4 {
              background: ${this.COLOR[4]};
            }
          `;
    this.body.prepend(fmwStyleElement);
  }
}

export default FindMultipleWords