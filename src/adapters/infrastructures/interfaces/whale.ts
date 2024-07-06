export interface IWhale {
  setLocalStoage(key: string, data: any): Promise<boolean>
  getLocalStorage(key: string): Promise<any>
  executeScript(action: () => void): void
  getCurruntTabData(): Promise<any>
  onUpdateEvent(callback: Function): void
  onActivatedEvent(callback: Function): void
  onRemovedEvent(callback: Function): void
  onMessageEvent(callback: Function): void
}
