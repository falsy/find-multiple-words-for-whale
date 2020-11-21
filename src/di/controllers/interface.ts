export interface IController {
  addWhaleEventListener(setKeywords: Function, tabList: Array<number>, setTabList: Function, setCountList: Function, setPositionList: Function): void
  insertClassFmw(): void
  searchExecute(keywords: Array<string>): void
  getkeywords(): Array<string>
  moveScrollPosition(position: number): void
}