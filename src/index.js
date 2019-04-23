import { COLOR, EXCEPT_ELEMENT } from './constants/index.js';
import FindMultipleWords from './services/FindMultipleWords.js';
import KeywordElement from './services/KeywordElement.js';

class Fmw {

  constructor() {
    this.input = document.getElementById('keyword');
    this.keywordList = new KeywordElement();
    this.keywords = [];
    this.eventListener();
  }

  eventListener() {
    let oneCallCheck = true;

    this.input.addEventListener('focus', (e) => {
      this.initExecute();
    });

    this.input.addEventListener('keyup', (e) => {
      if(e.keyCode === 13 && oneCallCheck) {
        this.searchExecute();
        oneCallCheck = false;
        setTimeout(() => oneCallCheck = true, 300);
      }
    });

    document.body.addEventListener('click', (e) => {
      if(typeof e.target.className.baseVal !== 'undefined' && e.target.className.baseVal.indexOf('keyword-list-close-btn') === 0) {
        const removeKeywordIdx = e.target.className.baseVal.split('list-close-idx-')[1];
        this.keywords.splice(removeKeywordIdx, 1);
        this.searchExecute(true);
      }
    }, {
      capture: true
    });
  }

  initExecute() {
    whale.tabs.executeScript({
      code: `
        window.fmwClass = new ${FindMultipleWords}();
        window.fmwClass.COLOR = "${COLOR}".split(',');
        window.fmwClass.EXCEPT_ELEMENT = "${EXCEPT_ELEMENT}".split(",");
        window.fmwClass.prependStyleSheet();
      `
    });
  }

  searchExecute(isDelete = false) {
    this.keywords = isDelete ? this.keywords : this.input.value.split(',');
    this.keywords = this.keywords.length > 5 ? this.keywords.slice(0, 5) : this.keywords;
    this.keywords = this.keywords.map((keyword) => {
      return keyword.trim();
    }).filter(Boolean);

    whale.tabs.executeScript({
      code: `
        window.fmwClass.searchDomElement(${JSON.stringify(this.keywords)});
      `
    });

    this.keywordList.removeKeywordList();
    if(this.keywords.length) {
      this.keywordList.appendKeywordList(this.keywords);
      this.input.value = '';
    }
  }

}

new Fmw();
