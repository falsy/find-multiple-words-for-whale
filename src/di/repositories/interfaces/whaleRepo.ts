export interface IWhaleRepo {
  initClassFMW(): void
  moveScrollPosition(position: number): void
  searchDomElement(keywords: Array<string>): void
  getCurruntTabId(): Promise<number>
  onUpdateEvent(callback: Function): void
  onActivatedEvent(callback: Function): void
  onRemovedEvent(callback: Function): void
  onMessageEvent(callback: Function): void
}