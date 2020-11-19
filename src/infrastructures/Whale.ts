import { IWhale } from "./interfaces/whale"
import BgeDTO, { IBgeParams } from '../dto/bgeDTO'

class Whale implements IWhale {
  
  private readonly whale

  constructor() {
    this.whale = window.whale
  }

  initClassFMW(classFmw: any): void {
    this.whale.tabs.executeScript({
      code: `
        if(typeof fmwClass === 'undefined') {
          window.fmwClass = new ${classFmw}()
        }
      `
    })
  }

  moveScrollPosition(position: number): void {
    this.whale.tabs.executeScript({
      code: `document.documentElement.scrollTop = ${position}`
    });
  }
  
  searchDomElement(keywords: Array<string>): void {
    this.whale.tabs.executeScript({
      code: `
        if(typeof fmwClass !== 'undefined') {
          window.fmwClass.searchDomElement(${JSON.stringify(keywords)})
        }
      `
    });
  }
  
  clearEventMessage(): void {
    this.whale.tabs.executeScript({
      code: `window.fmwClass.clearTimeoutSearch()`
    })
  }

  onUpdateEvent(callback: Function): void {
    this.whale.tabs.onUpdated.addListener((id, changeInfo) => {
      if(changeInfo.status === 'complete') callback()
    })
  }

  onActivatedEvent(callback: Function): void {
    this.whale.tabs.onActivated.addListener(() => callback())
  }

  onRemovedEvent(callback: Function): void {
    this.whale.tabs.onRemoved.addListener((id: number) => callback(id))
  }

  onMessageEvent(callback: Function): void {
    this.whale.runtime.onMessage.addListener((data: IBgeParams) => {
      return callback(new BgeDTO(data));
    })
  }
}

export default Whale