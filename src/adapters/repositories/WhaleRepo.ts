import { IBgeDTO } from "../../dto/BgeDTO"
import { IWhale } from "../../adapters/infrastructures/interfaces/whale"
import { IWhaleRepo } from "./interfaces/whaleRepo"

class WhaleRepo implements IWhaleRepo {
  private readonly whale: IWhale

  constructor(whale: IWhale) {
    this.whale = whale
  }

  async moveScrollPosition(position: number): Promise<void> {
    await this.whale.setLocalStoage("fmwPosition", position)
    this.whale.executeScript(() => {
      ;(window as any).whale.storage.local.get(["fmwPosition"], (data: any) => {
        const fmwPosition = data["fmwPosition"]
        document.documentElement.scrollTop = fmwPosition
      })
    })
  }

  async searchDomElement(
    keywords: Array<string>,
    setCountList: Function,
    setPositionList: Function,
    setUnsupportedPage: Function
  ): Promise<void> {
    const tabData = await this.whale.getCurruntTabData()

    if (
      !tabData.url ||
      tabData.url.startsWith("chrome://") ||
      tabData.url.startsWith("chrome-extension://") ||
      tabData.url.startsWith("https://store.whale.naver.com/")
    ) {
      setCountList(Array(keywords.length).fill(0))
      setPositionList(Array(keywords.length).fill([]))
      setUnsupportedPage(true)
      return
    }

    await this.whale.setLocalStoage("fmwActiveTabId", tabData.id)
    await this.whale.setLocalStoage("fmwKeywords", keywords)
    this.whale.executeScript(() => {
      ;(window as any).whale.storage.local.get(
        ["fmwActiveTabId", "fmwKeywords"],
        (data: any) => {
          const tabId = data["fmwActiveTabId"]
          const fmwKeywords = data["fmwKeywords"]
          const KEYWORDS_COLOR_SET = [
            "#AEDFDB",
            "#F4D94E",
            "#F38D9B",
            "#BEA6F9",
            "#99d45D",
            "#88cfea",
            "#eabf88",
            "#e4bdf4",
            "#d0ef9f",
            "#efee9f",
          ]
          const EXCEPT_NODE_NAME = ["SCRIPT", "LINK", "STYLE", "MAT-ICON"]

          let lazySearch = null
          let wordCount: number[] = null
          let wordPosition: number[][] = null

          // DOM 변화 확인
          const observerConfig = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: true,
            attributeOldValue: false,
            characterDataOldValue: false,
          }
          const observer = new MutationObserver(() => {
            if (lazySearch) clearTimeout(lazySearch)
            lazySearch = setTimeout(searchActions, 1000)
          })

          // FMW 엘리먼트 삭제
          const deleteFmwElement = (el: HTMLObjectElement) => {
            el.childNodes.forEach((node: HTMLObjectElement) => {
              if (
                String(node.className).indexOf("fmw-style-container") !== -1 &&
                node.nodeName === "I"
              ) {
                node.outerHTML = node.textContent
              } else if (node.nodeName === "IFRAME" && node?.contentDocument) {
                node.contentDocument.body.childNodes.forEach((node: any) => {
                  deleteFmwElement(node)
                })
              } else if (
                node.childNodes &&
                node.childNodes.length &&
                EXCEPT_NODE_NAME.indexOf(node.nodeName) === -1
              ) {
                deleteFmwElement(node)
              }
            })
          }

          const compiledKeywords = fmwKeywords.map(
            (word: string, i: number) => ({
              regex: new RegExp(word, "gim"),
              className: `fmw-style fmw-style-${i}`,
              style: `font-style: normal; display: inline; box-shadow: 1px 3px 3px rgba(0,0,0,0.2); border-radius: 4px; color: #000; white-space: initial; background: ${
                KEYWORDS_COLOR_SET[i % KEYWORDS_COLOR_SET.length]
              };`,
            })
          )

          // FMW 엘리먼트 변환
          const replaceElement = (node: HTMLObjectElement) => {
            const fmwElement = document.createElement("i")
            fmwElement.className = "fmw-style-container"
            fmwElement.style.fontStyle = "normal"
            let nodeText = node.data
            compiledKeywords.forEach(
              ({ regex, className, style }, i: number) => {
                if (regex.test(nodeText)) {
                  nodeText = nodeText.replace(
                    regex,
                    `<i class="${className}" style="${style}">\$&</i>`
                  )

                  // 검색된 키워드 카운팅 및 위치값 기록
                  wordCount[i] += 1
                  const targetEl = node.parentElement
                  const targetPosition =
                    window.scrollY + targetEl.getBoundingClientRect().top
                  const marginScroll = 20
                  wordPosition[i].push(targetPosition - marginScroll)
                }
              }
            )
            if (node.data !== nodeText) {
              fmwElement.innerHTML = nodeText
              node.parentNode.replaceChild(fmwElement, node)
            }
          }

          // FMW 엘리먼트 검색
          const insertFmwElement = (el: HTMLObjectElement) => {
            el.childNodes.forEach((node: HTMLObjectElement) => {
              if (
                node.nodeName === "#text" &&
                EXCEPT_NODE_NAME.indexOf(node.parentNode.nodeName) === -1 &&
                node.data.replace(/\t|\n| /gm, "") !== ""
              ) {
                replaceElement(node)
              } else if (node.nodeName === "IFRAME" && node?.contentDocument) {
                node.contentDocument.body.childNodes.forEach((node: any) => {
                  insertFmwElement(node)
                })
              } else if (
                node.childNodes &&
                node.childNodes.length &&
                EXCEPT_NODE_NAME.indexOf(node.nodeName) === -1
              ) {
                insertFmwElement(node)
              }
            })
          }

          const searchActions = () => {
            // DOM 변화 감시 중단
            observer.disconnect()
            if ((window as any).fmwMutationObserver) {
              ;(window as any).fmwMutationObserver.disconnect()
            }

            // 엘리먼트 순회하며 FMW 엘리먼트 삭제
            document.body.childNodes.forEach(deleteFmwElement)

            wordCount = Array(fmwKeywords.length).fill(0)
            wordPosition = Array(fmwKeywords.length).fill([])

            // 엘리먼트 순회하며 FMW 엘리먼트 적용
            document.body.childNodes.forEach(insertFmwElement)

            // 검색어에 따른 FMW 엘리먼트 카운팅 및 포지션 캐시
            ;(window as any).whale.runtime.sendMessage({
              tabId: tabId,
              count: wordCount,
              position: wordPosition,
            })

            // DOM 변화 감시 시작
            observer.observe(document.body, observerConfig)
            ;(window as any).fmwMutationObserver = observer
          }

          searchActions()
        }
      )
    })
  }

  async getCurruntTabId(): Promise<number> {
    const tabData = await this.whale.getCurruntTabData()
    return tabData.id
  }

  onUpdateEvent(callback: Function): void {
    this.whale.onUpdateEvent((changeInfo: any) => {
      if (changeInfo.status === "complete") callback()
    })
  }

  onActivatedEvent(callback: Function): void {
    this.whale.onActivatedEvent(callback)
  }

  onRemovedEvent(callback: Function): void {
    this.whale.onRemovedEvent(callback)
  }

  onMessageEvent(callback: Function): void {
    this.whale.onMessageEvent((data: IBgeDTO) => {
      callback(data)
    })
  }
}

export default WhaleRepo
