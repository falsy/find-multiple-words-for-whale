const findAllDom = function() {
  class actionFindAllDom {
    constructor() {
      this.body = document.body;
      this.exceptEl = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME', 'MAT-ICON'];
    }

    insertFmwElement(el) {
      el.childNodes.forEach(node => {
        if(node.nodeName === '#text'
          && this.exceptEl.indexOf(node.parentNode.nodeName) === -1
          && node.data.replace(/\t|\n| /gm, '') !== "") {
            this.replaceElement(node);
        } else if(node.childNodes
          && node.childNodes.length
          && this.exceptEl.indexOf(node.nodeName) === -1) {
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
          nodeText = nodeText.replace(reg, `<i class="fmw-style fmw-style-${i}">${word}</i>`);
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
        if(children[i].children && children[i].children.length && this.exceptEl.indexOf(children[i].nodeName) === -1) {
          this.deleteFmwElement(children[i]);
        }
        if(String(children[i].className).indexOf('fmw-style-container') !== -1 && children[i].nodeName === 'I') {
          children[i].outerHTML = children[i].textContent;
        }
        i--;
      }

      // [메모] 아래의 코드는 알 수 없는 이유로 약간의 오류 상황이 만들어짐.
      // for(const node of el.children) {
      //   if(node.children && node.children.length && this.exceptEl.indexOf(node.nodeName) === -1) {
      //     this.deleteFmwElement(node);
      //   }
      //   if(String(node.className).indexOf('fmw-style-container') !== -1 && node.nodeName === 'I') {
      //     node.outerHTML = node.textContent;
      //   }
      // }
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
      const color = ['#AEDFDB', '#F4D94E', '#F38D9B', '#21B7A9', '#99d45D'];
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
                color: #000;
              }
              .fmw-style-0 {
                background: ${color[0]};
              }
              .fmw-style-1 {
                background: ${color[1]};
              }
              .fmw-style-2 {
                background: ${color[2]};
              }
              .fmw-style-3 {
                background: ${color[3]};
              }
              .fmw-style-4 {
                background: ${color[4]};
              }
            `;
      this.body.prepend(fmwStyleElement);
    }

  };
  return actionFindAllDom;
};

whale.tabs.executeScript({
  code: `
    window.fmwClass = new ${findAllDom()}();
    fmwClass.prependStyleSheet();
  `
});

const inputEl = document.getElementById('keyword');
inputEl.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    let keywords = inputEl.value.split(',');
        keywords = keywords.map((keyword) => {
          return keyword.trim();
        }).filter(Boolean);
        keywords = JSON.stringify(keywords);

    whale.tabs.executeScript({
      code: `
        fmwClass.searchDomElement(${keywords});
      `
    });
  }
});

window.onload = () => {
  inputEl.focus();
};