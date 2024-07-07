export interface IController {
  addWhaleEventListener(
    setKeywords: Function,
    tabList: Array<number>,
    setTabList: Function,
    setCountList: Function,
    setPositionList: Function
  ): void
  searchExecute(
    keywords: Array<string>,
    setCountList: Function,
    setPositionList: Function,
    setUnsupportedPage: Function
  ): void
  getKeywords(): Array<string>
  moveScrollPosition(position: number): void
}
