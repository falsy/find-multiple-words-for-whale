import { COLOR, EXCEPT_ELEMENT } from './constants/index.js';
import FindMultipleWords from './services/FindMultipleWords.js';
import KeywordElement from './services/KeywordElement.js';

class Fmw {

  constructor() {
    this.input = document.getElementById('keyword');
    this.keywordList = new KeywordElement();
    this.eventListener();
  }

  eventListener() {
    let oneCallCheck = true;

    this.input.addEventListener('focus', (e) => {
      whale.tabs.executeScript({
        code: `
          window.fmwClass = new ${FindMultipleWords}();
          window.fmwClass.COLOR = "${COLOR}".split(',');
          window.fmwClass.EXCEPT_ELEMENT = "${EXCEPT_ELEMENT}".split(",");
          window.fmwClass.prependStyleSheet();
        `
      });
    });

    this.input.addEventListener('keyup', (e) => {
      if(e.keyCode === 13 && oneCallCheck) {
        let keywords = this.input.value.split(',');
            keywords = keywords.length > 5 ? keywords.slice(0, 5) : keywords;
            keywords = keywords.map((keyword) => {
              return keyword.trim();
            }).filter(Boolean);

        whale.tabs.executeScript({
          code: `
            window.fmwClass.searchDomElement(${JSON.stringify(keywords)});
          `
        });

        this.keywordList.removeKeywordList();
        if(keywords.length) {
          this.keywordList.appendKeywordList(keywords);
          this.input.value = '';
        }

        oneCallCheck = false;
        setTimeout(() => oneCallCheck = true, 300);
      }
    });
  }

}

new Fmw();
