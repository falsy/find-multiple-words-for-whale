import { EXCEPT_NODE_NAME, KEYWORDS_COLOR_SET } from "../../constants"
import FindMultipleWords from "../data/FindMultipleWords"
import { IBgeDTO } from "../dto/bgeDTO";
import { IWhale } from "../infrastructures/interfaces/whale"
import { IWhaleRepo } from "./interfaces/whaleRepo";

class WhaleRepo implements IWhaleRepo {

  private readonly whale: IWhale
  private cacheMessage: string
  
  constructor(whale: IWhale) {
    this.whale = whale
    this.cacheMessage = ''
  }

  initClassFMW(): void {
    this.whale.executeScript(`
      if(typeof fmwClass === 'undefined') {
        window.fmwClass = new ${FindMultipleWords}(${KEYWORDS_COLOR_SET}, ${EXCEPT_NODE_NAME})
      }
    `)
  }

  moveScrollPosition(position: number): void {
    this.whale.executeScript(`
      document.documentElement.scrollTop = ${position}
    `)
  }
  
  searchDomElement(keywords: Array<string>): void {
    this.whale.executeScript(`
      if(typeof fmwClass !== 'undefined') {
        window.fmwClass.searchDomElement(${JSON.stringify(keywords)})
      }
    `)
  }

  async getCurruntTabId(): Promise<number> {
    const data = await this.whale.getCurruntTabData()
    return data.tabs.filter((tab) => tab.active)[0]?.id
  }
  
  clearEventMessage(): void {
    this.whale.executeScript(`
      window.fmwClass.clearTimeoutSearch()
    `)
  }

  onUpdateEvent(callback: Function): void {
    this.whale.onUpdateEvent((changeInfo: chrome.tabs.TabChangeInfo) => {
      if(changeInfo.status === 'complete') callback()
    })
  }

  onActivatedEvent(callback: Function): void {
    this.whale.onActivatedEvent(callback)
  }

  onRemovedEvent(callback: Function): void {
    this.whale.onRemovedEvent(callback)
  }

  onMessageEvent(callback: Function): void {
    this.whale.onMessageEvent((data: IBgeDTO) => {
      const message = JSON.stringify(data)
      if(this.cacheMessage === message) this.clearEventMessage()
      this.cacheMessage = message
      callback(data)
    })
  }
}

export default WhaleRepo