import { IBgeDTO } from "../dto/bgeDTO"
import { IStorageRepo } from "../repositories/interfaces/storageRepo"
import { IWhaleRepo } from "../repositories/interfaces/whaleRepo"

class Controller {

  constructor(
    private readonly whale: IWhaleRepo,
    private readonly storage: IStorageRepo,
  ) {}

  private async setActiveTabList(tabList: Array<number>, setTabList: Function): Promise<void> {
    const currentTabId = await this.whale.getCurruntTabId()
    if(typeof currentTabId === 'number' && tabList.includes(currentTabId) === false) {
      setTabList([...tabList, currentTabId])
    }
  }

  addWhaleEventListener(setKeywords: Function, tabList: Array<number>, setTabList: Function, setCountList: Function, setPositionList: Function): void {
    // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
    this.whale.onUpdateEvent(() => {
      const keywords = this.storage.getkeywords()

      this.insertClassFmw()
      this.searchExecute(keywords)
      setKeywords(keywords)
    })

    // 다른 탭이 활성화 되었을때, 다시 문서에서 단어를 검색하도록
    this.whale.onActivatedEvent(() => {
      const keywords = this.storage.getkeywords()

      this.setActiveTabList(tabList, setTabList)
      this.insertClassFmw()
      this.searchExecute(keywords)
      setKeywords(keywords)
    })

    // 탭이 종료되었을때
    this.whale.onRemovedEvent((tabId: number) => {
      setTabList(tabList.filter(id => id !== tabId))
    })

    // 키워드 검색 후 키워드 개수 및 위치 값 저장
    this.whale.onMessageEvent((data: IBgeDTO) => {
      setCountList(data.count)
      setPositionList(data.position)
    })
  }

  insertClassFmw(): void {
    this.whale.initClassFMW()
  }

  searchExecute(keywords: Array<string>) {
    // console.log('a');
    this.storage.setKeywords(keywords)
    this.whale.searchDomElement(keywords)
  }

  getkeywords(): Array<string> {
    return this.storage.getkeywords()
  }

  moveScrollPosition(position: number): void {
    this.whale.moveScrollPosition(position)
  }

}

export default Controller