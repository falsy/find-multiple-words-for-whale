const inputEl = document.getElementById('keyword');
let keywords = [];

inputEl.addEventListener('keydown', (e) => {
  setTimeout(() => {
    if(e.keyCode === 13 && inputEl.value) {
      keywords = inputEl.value.split(',');
      keywords.forEach((keyword, i) => {
        keywords[i] = keyword.trim();
      });
    }
  });
});


const findAllDom = function() {
  class actionFindAllDom {
    constructor() {
      this.body = document.body;
      this.exceptEl = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME'];
      this.findWord = 'About';
    }

    insertFmwElement(el) {
      el.childNodes.forEach(node => {
        if(node.nodeName === '#text') {
          if(node.data.indexOf(this.findWord) !== -1) {
            const fmwElement = document.createElement('i');
            fmwElement.className = 'fmw-style';
            fmwElement.innerText = this.findWord;
            node.parentNode.replaceChild(fmwElement, node);
          }
        } else {
          if(node.childNodes && node.childNodes.length && this.exceptEl.indexOf(node.nodeName) === -1) {
            this.insertFmwElement(node);
          }
        }
      });
    }

    deleteFmwElement(el) {
      for(const node of el.children) {
        if(String(node.className).indexOf('fmw-style') !== -1 && node.nodeName === 'I') {
          node.outerHTML = this.findWord;
        } else {
          if(node.children && node.children.length && this.exceptEl.indexOf(node.nodeName) === -1) {
            this.deleteFmwElement(node);
          }
        }
      }
    }

    searchDomElement(isInsert = false) {
      this.deleteFmwElement(this.body);
      if(isInsert) this.body.childNodes.forEach(node => this.insertFmwElement(node));
    }
  };
  return actionFindAllDom;
};

whale.tabs.executeScript({
  code: `
  window.fmwClass = new ${findAllDom()}();
  `
});

setTimeout(() => {
  whale.tabs.executeScript({
    code: `
    fmwClass.searchDomElement(true);
    `
  });
}, 2000);

setTimeout(() => {
  whale.tabs.executeScript({
    code: `
    fmwClass.searchDomElement(false);
    `
  });
}, 4000);