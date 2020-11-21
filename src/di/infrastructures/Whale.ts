import { IWhale } from "./interfaces/whale"
import BgeDTO, { IBgeParams } from '../dto/BgeDTO'

class Whale implements IWhale {
  
  private readonly whale

  constructor() {
    this.whale = window.whale
  }

  executeScript(code: string): void {
    this.whale.tabs.executeScript({ code })
  }

  getCurruntTabData(): Promise<chrome.windows.Window> {
    return new Promise(resolve => {
      this.whale.windows.getCurrent({ populate: true }, (data) => {
        resolve(data)
      })
    })
  }

  onUpdateEvent(callback: Function): void {
    this.whale.tabs.onUpdated.addListener((id, changeInfo) => {
      callback(changeInfo)
    })
  }

  onActivatedEvent(callback: Function): void {
    this.whale.tabs.onActivated.addListener(() => {
      callback()
    })
  }

  onRemovedEvent(callback: Function): void {
    this.whale.tabs.onRemoved.addListener((id: number) => {
      callback(id)
    })
  }

  onMessageEvent(callback: Function): void {
    this.whale.runtime.onMessage.addListener((data: IBgeParams) => {
      callback(new BgeDTO(data));
    })
  }
}

export default Whale