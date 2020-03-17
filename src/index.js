import FindMultipleWords from './services/FindMultipleWords.js';
import KeywordElement from './services/KeywordElement.js';

class Fmw {

  constructor() {
    this.input = document.getElementById('keyword');
    this.keywordList = new KeywordElement();
    this.activeTabList = [];
    this.keywords = [];
    this.deepSearchCheck = false;

    this.whaleEventListener();
    this.eventListener();
    this.deepSearch();
  }

  deepSearch() {
    const checkbox = document.getElementById('deep-search-checkbox');
    const deepSearchCheck = window.localStorage.getItem('deep-search');
    
    if(deepSearchCheck === 'true') {
      checkbox.setAttribute('checked', true);
      this.deepSearchCheck = true;
    } else {
      checkbox.removeAttribute('checked');
      this.deepSearchCheck = false;
    }

    checkbox.addEventListener('change', () => {
      if(checkbox.checked) {
        window.localStorage.setItem('deep-search', 'true');
        this.deepSearchCheck = true;
      } else {
        window.localStorage.removeItem('deep-search');
        this.deepSearchCheck = false;
      }
    });
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
      code: `window.fmwClass = new ${FindMultipleWords}();`
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
      this.checkRedeclared();
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
    
    // 키워드 검색 후 키워드 개수 출력
    whale.runtime.onMessage.addListener((message) => {
      this.keywordList.appendKeywordCount(message);
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
        if(typeof fmwClass !== 'undefined') {
          window.fmwClass.resetWordCount();
          window.fmwClass.searchDomElement(${JSON.stringify(this.keywords)}, ${this.deepSearchCheck});
          whale.runtime.sendMessage(fmwClass.wordCount);
        }
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
