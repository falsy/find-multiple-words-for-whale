import FindMultipleWords from './services/FindMultipleWords.js';
import KeywordElement from './services/KeywordElement.js';
import WebStorage from './services/WebStorage.js';

class Fmw {

  constructor() {
    this.keywordList = new KeywordElement();
    this.storage = new WebStorage();
    if(this.storage.getkeywords() === null) this.storage.setKeywords([]);

    this.input = document.getElementById('keyword');
    this.keywords = this.storage.getkeywords();
    this.activeTabList = [];
    this.keywordPositionList = [];
    this.cacheIdx = 0;
    this.cacheCnt = 0;

    this.whaleEventListener();
    this.eventListener();

    if(this.keywords.length) {
      this.initExecuteCode();
      this.searchExecute(true);
    }
  }

  checkRedeclared() {
    whale.windows.getCurrent({ populate: true }, (data) => {
      const currentTabId = data.tabs.filter((tab) => {
        return tab.active === true;
      })[0].id;

      if(this.activeTabList.indexOf(currentTabId) !== -1) return;
      this.activeTabList.push(currentTabId);
      this.initExecuteCode();
    });
  }

  initExecuteCode() {
    // 탭 페이지에 FMW 클래스 초기화
    whale.tabs.executeScript({
      code: `
        if(typeof fmwClass === 'undefined') {
          window.fmwClass = new ${FindMultipleWords}();
        }`
    });
  }

  setStorageKeywords() {
    if(this.keywords.length === 0 && this.storage.getkeywords().length > 0) {
      this.keywords = this.storage.getkeywords();
    }
  }

  clearEeventMessage() {
    whale.tabs.executeScript({
      code: `window.fmwClass.clearTimeoutSearch();`
    });
  }

  whaleEventListener() {
    // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
    whale.tabs.onUpdated.addListener((id, changeInfo) => {
      if(changeInfo.status === 'complete') {
        this.initExecuteCode();
        this.setStorageKeywords();
        this.clearEeventMessage();
        this.searchExecute(this.keywords.length>0);
      }
    });

    // 다른 탭이 활성화 되었을때, 다시 문서에서 단어를 검색하도록
    whale.tabs.onActivated.addListener(() => {
      this.checkRedeclared();
      this.setStorageKeywords();
      this.searchExecute(this.keywords.length>0);
    });

    // 탭이 종료되었을때
    whale.tabs.onRemoved.addListener((id) => {
      const idx = this.activeTabList.indexOf(id);
      this.activeTabList.splice(idx, 1);
    });

    // 사이드바가 활성화 되었을때
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkRedeclared();
        this.input.focus();
      }
    });
    
    let cacheMessage = '';
    // 키워드 검색 후 키워드 개수 출력 및 위치 값 기억
    whale.runtime.onMessage.addListener((data) => {
      const stringMessage = JSON.stringify(data);
      if(cacheMessage === stringMessage) this.clearEeventMessage();
      cacheMessage = stringMessage;
      this.keywordList.appendKeywordCount(data.count);
      this.keywordPositionList = data.position;
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
      if(typeof e.target.className.baseVal !== 'undefined' 
        && e.target.className.baseVal.indexOf('keyword-list-close-btn') === 0) {
          const removeKeywordIdx = e.target.className.baseVal.split('list-close-idx-')[1];
          this.keywords.splice(removeKeywordIdx, 1);
          this.searchExecute(true);
      }

      if(e.target.className === 'search-position-btn') {
        const idx = e.target.dataset.idx;
        this.searchPosition(idx);
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

    this.storage.setKeywords(this.keywords);

    whale.tabs.executeScript({
      code: `
        if(typeof fmwClass !== 'undefined') {
          window.fmwClass.searchDomElement(${JSON.stringify(this.keywords)});
        }
      `
    });

    this.printSearchKeywords();
  }

  printSearchKeywords() {
    this.keywordList.removeKeywordList();
    if(this.keywords.length) {
      this.keywordList.appendKeywordList(this.keywords);
      this.input.value = '';
    }
  }

  searchPosition(idx) {
    if(this.cacheIdx !== idx) {
      this.cacheIdx = idx;
      this.cacheCnt = 0;
    }

    const target = this.keywordPositionList[this.cacheIdx];
    
    if(this.cacheCnt + 1 > target.length) {
      this.cacheCnt = 0;
    }

    whale.tabs.executeScript({
      code: `document.documentElement.scrollTop = ${target[this.cacheCnt]};`
    });

    this.cacheCnt += 1;
  }

}

new Fmw();
