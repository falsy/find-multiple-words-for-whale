import { KEYWORDS_STORAGE_KEY_NAME } from "src/constants"
import { IWebStorage } from "./interfaces/webStorage"

class WebStorage implements IWebStorage {
  
  private readonly local: Storage

  constructor() {
    this.local = window.localStorage
  }

  setKeywords(keywords: Array<string>): void {
    this.local.setItem(KEYWORDS_STORAGE_KEY_NAME, JSON.stringify(keywords))
  }

  getkeywords(): Array<string> {
    return this.local.getItem(KEYWORDS_STORAGE_KEY_NAME) === null 
      ? [] 
      : JSON.parse(this.local.getItem(KEYWORDS_STORAGE_KEY_NAME))
  }

  removeKeywords(): void {
    this.local.removeItem(KEYWORDS_STORAGE_KEY_NAME)
  }

}

export default WebStorage