class WebStorage {
  
  constructor() {
    this.local = window.localStorage;
  }

  setKeywords(keywords) {
    this.local.setItem('keywords', JSON.stringify(keywords));
  }

  getkeywords() {
    return JSON.parse(this.local.getItem('keywords'));
  }

  removeKeywords() {
    this.local.removeItem('keywords');
  }

}

export default WebStorage;