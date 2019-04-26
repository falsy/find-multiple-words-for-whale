import { COLOR } from './constants/index.js';
import FindMultipleWords from './services/FindMultipleWords.js';
import KeywordElement from './services/KeywordElement.js';

class Fmw {

  constructor() {
    this.input = document.getElementById('keyword');
    this.keywordList = new KeywordElement();
    this.keywords = [];

    this.whaleEventListener();
    this.eventListener();
  }

  initExecuteCode() {
    whale.tabs.executeScript({
      code: `
        window.fmwClass = new ${FindMultipleWords}();
      `
    });

    whale.tabs.insertCSS({
      code: `
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
          background: ${COLOR[0]};
        }
        .fmw-style-1 {
          background: ${COLOR[1]};
        }
        .fmw-style-2 {
          background: ${COLOR[2]};
        }
        .fmw-style-3 {
          background: ${COLOR[3]};
        }
        .fmw-style-4 {
          background: ${COLOR[4]};
        }
      `
    });
  }

  whaleEventListener() {
    // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
    whale.tabs.onUpdated.addListener((id, changeInfo) => {
      if(changeInfo.status === 'complete') {
        this.initExecuteCode();
        this.searchExecute(this.keywords.length>0);
      }
    });

    // 다른 탭이 활성화 되었을때, 다시 문서에서 단어를 검색하도록
    whale.tabs.onActivated.addListener(() => {
      this.initExecuteCode();
      this.searchExecute(this.keywords.length>0);
    });

    // 사이드바가 활성화 되었을때
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.initExecuteCode();
        this.input.focus();
      }
    });
  }

  eventListener() {
    let oneCallCheck = true;

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
