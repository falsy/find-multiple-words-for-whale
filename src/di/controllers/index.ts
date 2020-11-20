import FindMultipleWords from "../data/FindMultipleWords"
import { IBgeDTO } from "../dto/bgeDTO"
import { IWebStorage } from "../infrastructures/interfaces/webStorage"
import { IWhale } from "../infrastructures/interfaces/whale"

class Controller {

  constructor(
    private readonly whale: IWhale,
    private readonly storage: IWebStorage,
  ) {}

  private clearEventMessage(): void {
    this.whale.clearEventMessage()
  }

  private async setActiveTabList(tabList: Array<number>, setTabList: Function): Promise<void> {
    const currentTabId = await this.whale.getCurruntTabId()
    if(tabList.includes(currentTabId) === false) {
      setTabList([...tabList, currentTabId])
      this.insertClassFmw()
    }
  }

  addWhaleEventListener(setKeywords: Function, tabList: Array<number>, setTabList: Function, setCountList: Function, setPositionList: Function): void {
    // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
    this.whale.onUpdateEvent(() => {
      const keywords = this.storage.getkeywords()

      this.insertClassFmw()
      this.clearEventMessage()
      this.searchExecute(keywords)
      setKeywords(keywords)
    })

    // 다른 탭이 활성화 되었을때, 다시 문서에서 단어를 검색하도록
    this.whale.onActivatedEvent(() => {
      const keywords = this.storage.getkeywords()

      this.setActiveTabList(tabList, setTabList)
      this.searchExecute(keywords)
      setKeywords(keywords)
    })

    // 탭이 종료되었을때
    this.whale.onRemovedEvent((tabId: number) => {
      setTabList(tabList.filter(id => id !== tabId))
    })

    this.whale.onMessageEvent((data: IBgeDTO) => {
      setCountList(data.count)
      setPositionList(data.position)
    })
  }

  insertClassFmw(): void {
    this.whale.initClassFMW(FindMultipleWords)
  }

  searchExecute(keywords: Array<string>) {
    this.storage.setKeywords(keywords)
    this.whale.searchDomElement(keywords)
  }

  getkeywords(): Array<string> {
    return this.storage.getkeywords()
  }

}

export default Controller