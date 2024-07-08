import { IBgeDTO } from "../../dto/BgeDTO"
import { IStorageRepo } from "../repositories/interfaces/storageRepo"
import { IWhaleRepo } from "../repositories/interfaces/whaleRepo"
import { IController } from "./interface"

class Controller implements IController {
  constructor(
    private readonly whaleRepo: IWhaleRepo,
    private readonly storageRepo: IStorageRepo
  ) {}

  private async setActiveTabList(
    tabList: Array<number>,
    setTabList: Function
  ): Promise<void> {
    const currentTabId = await this.whaleRepo.getCurruntTabId()
    if (
      typeof currentTabId === "number" &&
      tabList.includes(currentTabId) === false
    ) {
      setTabList([...tabList, currentTabId])
    }
  }

  addWhaleEventListener(
    setKeywords: Function,
    tabList: Array<number>,
    setTabList: Function,
    setCountList: Function,
    setPositionList: Function
  ): void {
    // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
    this.whaleRepo.onUpdateEvent(() => {
      const keywords = this.storageRepo.getKeywords()
      setKeywords(keywords)
    })
    // 다른 탭이 활성화 되었을때, 다시 문서에서 단어를 검색하도록
    this.whaleRepo.onActivatedEvent(() => {
      const keywords = this.storageRepo.getKeywords()
      this.setActiveTabList(tabList, setTabList)
      setKeywords(keywords)
    })
    // 탭이 종료되었을때
    this.whaleRepo.onRemovedEvent((tabId: number) => {
      setTabList(tabList.filter((id) => id !== tabId))
    })
    // 키워드 검색 후 키워드 개수 및 위치 값 저장
    this.whaleRepo.onMessageEvent(async (data: IBgeDTO) => {
      const tabId = await this.whaleRepo.getCurruntTabId()
      if (tabId === data.tabId) {
        setCountList(data.count)
        setPositionList(data.position)
      }
    })
  }

  searchExecute(
    keywords: Array<string>,
    setCountList: Function,
    setPositionList: Function,
    setUnsupportedPage: Function
  ): void {
    this.storageRepo.setKeywords(keywords)
    this.whaleRepo.searchDomElement(
      keywords,
      setCountList,
      setPositionList,
      setUnsupportedPage
    )
  }

  getKeywords(): Array<string> {
    return this.storageRepo.getKeywords()
  }

  moveScrollPosition(position: number): void {
    this.whaleRepo.moveScrollPosition(position)
  }
}

export default Controller
