
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

    searchDomElement() {
      this.body.childNodes.forEach(node => {
        this.insertFmwElement(node);
      });
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
    fmwClass.searchDomElement();
    `
  });
}, 2000);

// setTimeout(() => {
//   whale.tabs.executeScript({
//     // 'document.body.innerHTML=`'+editHTML+'`'
//     code: `document.body.innerHTML=\`${editHTML}\``
//   });
// }, 2000);

// setTimeout(() => {
//   whale.tabs.executeScript({
//     code: 'document.body.innerHTML=`'+defaultElement+'`'
//   });
// }, 4000);