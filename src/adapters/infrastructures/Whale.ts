import { IWhale } from "./interfaces/whale"
import BgeDTO, { IBgeParams } from "../../dto/BgeDTO"

class Whale implements IWhale {
  private readonly whale: any

  constructor() {
    this.whale = (window as any).whale
  }

  async executeScript(action: () => void): Promise<void> {
    const tabData = await this.getCurruntTabData()

    this.whale.scripting.executeScript({
      target: { tabId: tabData.id },
      function: action,
    })
  }

  getCurruntTabData(): Promise<any> {
    return new Promise((resolve) => {
      this.whale.tabs.query(
        { active: true, currentWindow: true },
        (tabs: any) => {
          resolve(tabs[0])
        }
      )
    })
  }

  setLocalStoage(key: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      const dataSet = {}
      dataSet[key] = data

      this.whale.storage.local.set(dataSet, () => {
        resolve(true)
      })
    })
  }

  getLocalStorage(key: string): Promise<any> {
    return new Promise((resolve) => {
      this.whale.storage.local.get([key], (data: any) => {
        resolve(data)
      })
    })
  }

  onUpdateEvent(callback: Function): void {
    this.whale.tabs.onUpdated.addListener((_: any, changeInfo: any) => {
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
      callback(new BgeDTO(data))
    })
  }
}

export default Whale
