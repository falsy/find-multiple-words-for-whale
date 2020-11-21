export interface IWhale {
  executeScript(code: string): void
  getCurruntTabData(): Promise<chrome.windows.Window>
  onUpdateEvent(callback: Function): void
  onActivatedEvent(callback: Function): void
  onRemovedEvent(callback: Function): void
  onMessageEvent(callback: Function): void
}