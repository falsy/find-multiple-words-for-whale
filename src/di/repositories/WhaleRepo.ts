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

  initClassFMW(classFmw: any): void {
    this.whale.initClassFMW(classFmw)
  }

  moveScrollPosition(position: number): void {
    this.whale.moveScrollPosition(position)
  }
  
  searchDomElement(keywords: Array<string>): void {
    this.whale.searchDomElement(keywords)
  }

  getCurruntTabId(): Promise<number> {
    return this.whale.getCurruntTabId()
  }
  
  clearEventMessage(): void {
    this.whale.clearEventMessage()
  }

  onUpdateEvent(callback: Function): void {
    this.whale.onUpdateEvent(callback)
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