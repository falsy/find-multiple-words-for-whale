const findAllDom = function() {
  class actionFindAllDom {
    constructor() {
      this.body = document.body;
      this.exceptEl = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME'];
    }

    insertFmwElement(el) {
      el.childNodes.forEach(node => {
        if(node.nodeName === '#text' && this.exceptEl.indexOf(node.parentNode.nodeName) === -1
          && node.parentNode.className !== 'fmw-style-container') {
          if(node.data.replace(/\t|\n| /g, '') !== "") {
            this.replaceElement(node);
          }
        } else {
          if(node.childNodes && node.childNodes.length && this.exceptEl.indexOf(node.nodeName) === -1) {
            this.insertFmwElement(node);
          }
        }
      });
    }

    replaceElement(node) {
      const posMark = this.elementAbsPositionTop(node.parentNode);
      const fmwElement = document.createElement('i');
            fmwElement.className = 'fmw-style-container';
      let nodeText = node.data;

      this.findWords.forEach((word, i) => {
        if(nodeText.indexOf(word) !== -1) {
          const reg = new RegExp(word, 'gm');
          nodeText = nodeText.replace(reg, `
            <i class="fmw-style fmw-style-${i}">${word}</i>
          `);
          this.scrollMarkElement.innerHTML += `
            <i class="fmw-style-scroll-mark fmw-style-${i}" style="top: ${posMark}px;"><i>
          `;
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
      for(const node of el.children) {
        if(String(node.className).indexOf('fmw-style-container') !== -1 && node.nodeName === 'I') {
          node.outerHTML = node.textContent;
        } else {
          if(node.children && node.children.length && this.exceptEl.indexOf(node.nodeName) === -1) {
            this.deleteFmwElement(node);
          }
        }
      }
    }

    searchDomElement(keywords) {
      this.scrollMarkElement = document.getElementById('fwm-scroll');
      this.scrollMarkElement.innerHTML = '';
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
              #fwm-scroll {
                position: absolute;
                top: 0;
                right: 0;
              }
              .fmw-style-container {
                font-style: normal;
              }
              .fmw-style-scroll-mark {
                position: absolute;
                width: 15px;
                height: 2px;
                background: inherit;
                right: 0;
              }
              .fmw-style-container .fmw-style {
                font-style: normal;
                display: inline-block;
                box-shadow: 1px 3px 3px rgba(0,0,0,0.2);
                border-radius: 4px;
                padding: 0 5px;
              }
              .fmw-style-0 {
                background: red;
                color: #fff;
              }
              .fmw-style-1 {
                background: blue;
                color: #fff;
              }
              .fmw-style-2 {
                background: green;
                color: #fff;
              }
              .fmw-style-3 {
                background: yellow;
                color: #000;
              }
              .fmw-style-4 {
                background: orange;
                color: #000;
              }
            `;
      this.body.prepend(fmwStyleElement);
    }

    appendScrollMark() {
      if(document.getElementById('fwm-scroll')) return;
      const fmwScrollElement = document.createElement('div');
            fmwScrollElement.id = 'fwm-scroll';
      this.body.append(fmwScrollElement);
    }
  };
  return actionFindAllDom;
};

whale.tabs.executeScript({
  code: `
    window.fmwClass = new ${findAllDom()}();
    fmwClass.prependStyleSheet();
    fmwClass.appendScrollMark();
  `
});

const inputEl = document.getElementById('keyword');
inputEl.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    let keywords = inputEl.value.split(',');
    keywords = keywords.filter(keyword => {
      return !!keyword.trim();
    });
    keywords = JSON.stringify(keywords);
    whale.tabs.executeScript({
      code: `
        fmwClass.searchDomElement(${keywords});
      `
    });
  }
});