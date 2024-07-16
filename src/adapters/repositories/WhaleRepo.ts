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
          const fmwKeywords: string[] = data["fmwKeywords"]
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
            "#efee9f"
          ]
          const EXCEPT_NODE_NAME = [
            "SCRIPT",
            "NOSCRIPT",
            "LINK",
            "STYLE",
            "MAT-ICON",
            "svg",
            "TEXTAREA"
          ]

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
            characterDataOldValue: false
          }
          const observer = new MutationObserver(() => {
            if (lazySearch) clearTimeout(lazySearch)
            lazySearch = setTimeout(searchActions, 500)
          })

          // FMW 엘리먼트를 텍스트 노드로 변경
          // 연속된 텍스트 노드를 하나의 텍스트 노드로 합침
          const replaceClassNodeWithText = (node: Node) => {
            if (!node.parentNode) return

            const parentNode = node.parentNode
            const textNode = document.createTextNode(node.textContent || "")
            parentNode.replaceChild(textNode, node)

            const mergeTextNode = []

            parentNode.childNodes.forEach((replaceNode) => {
              const lastNode = mergeTextNode[mergeTextNode.length - 1]
              if (
                lastNode &&
                lastNode.nodeType === Node.TEXT_NODE &&
                replaceNode.nodeType === Node.TEXT_NODE
              ) {
                lastNode.textContent += replaceNode.textContent
              } else {
                mergeTextNode.push(replaceNode)
              }
            })

            while (parentNode?.firstChild) {
              parentNode.removeChild(parentNode.firstChild)
            }

            mergeTextNode.forEach((newNode) => {
              parentNode.appendChild(newNode)
            })
          }

          // FMW 엘리먼트 삭제
          const deleteFmwElement = (el: HTMLObjectElement) => {
            const stack: Node[] = Array.from(el.childNodes)

            while (stack.length > 0) {
              const node = stack.pop() as HTMLObjectElement

              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.nodeName === "I" &&
                node.classList.contains("fmw-style")
              ) {
                replaceClassNodeWithText(node)
              } else if (node.nodeName === "IFRAME" && node?.contentDocument) {
                const iframeDocument = node.contentDocument
                if (iframeDocument.body?.childNodes) {
                  stack.push(...Array.from(iframeDocument.body.childNodes))
                }
              } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.childNodes.length > 0 &&
                EXCEPT_NODE_NAME.indexOf(node.nodeName) === -1
              ) {
                stack.push(...Array.from(node.childNodes))
              }
            }
          }

          const compiledKeywords = fmwKeywords.map(
            (word: string, i: number) => ({
              keyword: word,
              regex: new RegExp(word, "gi"),
              className: `fmw-style fmw-style-${i}`,
              style: `font-style: normal; display: inline; box-shadow: 1px 3px 3px rgba(0,0,0,0.2); border-radius: 4px; color: #000; white-space: initial; background: ${
                KEYWORDS_COLOR_SET[i % KEYWORDS_COLOR_SET.length]
              };`
            })
          )

          // FMW 엘리먼트 변환
          const replaceElement = (node: HTMLObjectElement) => {
            let cacheFragment = [node.cloneNode(true)]
            compiledKeywords.forEach(({ regex, className, style }, i) => {
              const cacheFragByKeyword = []
              cacheFragment.forEach((detailNode) => {
                if (detailNode.nodeType !== Node.TEXT_NODE) {
                  cacheFragByKeyword.push(detailNode)
                } else {
                  const textNode = detailNode.textContent
                  const parts = textNode.split(regex)
                  parts.forEach((part, j) => {
                    if (j > 0) {
                      const keywordEl = document.createElement("i")
                      keywordEl.textContent = textNode.match(regex)[j - 1]
                      keywordEl.className = className
                      keywordEl.style.cssText = style
                      cacheFragByKeyword.push(keywordEl)

                      // 검색된 키워드 카운팅 및 위치값 기록
                      wordCount[i] += 1
                      const targetEl = node.parentElement
                      const targetPosition =
                        window.scrollY + targetEl.getBoundingClientRect().top
                      const marginScroll = 20
                      wordPosition[i] = [targetPosition - marginScroll].concat(
                        wordPosition[i]
                      )
                    }
                    cacheFragByKeyword.push(document.createTextNode(part))
                  })
                }
              })
              cacheFragment = cacheFragByKeyword
            })

            const fragment = document.createDocumentFragment()

            cacheFragment.forEach((replaceNode) => {
              fragment.appendChild(replaceNode)
            })

            if (
              !(
                cacheFragment.length === 1 &&
                cacheFragment[0].textContent === node.textContent
              )
            ) {
              node.parentNode.replaceChild(fragment, node)
            }
          }

          const hasFMWElement = (node: HTMLElement): boolean => {
            return (
              node.nodeType === Node.ELEMENT_NODE &&
              node.nodeName === "I" &&
              node.classList.contains("fmw-style")
            )
          }

          // FMW 엘리먼트 검색
          const insertFmwElement = (el: HTMLObjectElement) => {
            const stack: Node[] = Array.from(el.childNodes)

            while (stack.length > 0) {
              const node = stack.pop() as HTMLElement

              if (
                node.nodeType === Node.TEXT_NODE &&
                EXCEPT_NODE_NAME.indexOf(node.parentNode?.nodeName || "") ===
                  -1 &&
                node.textContent?.replace(/\t|\n| /gm, "") !== ""
              ) {
                replaceElement(node as HTMLObjectElement)
              } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.nodeName === "IFRAME" &&
                (node as HTMLIFrameElement).contentDocument
              ) {
                const iframeDocument = (node as HTMLIFrameElement)
                  .contentDocument
                if (iframeDocument.body?.childNodes) {
                  stack.push(...Array.from(iframeDocument.body.childNodes))
                }
              } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.childNodes.length > 0 &&
                EXCEPT_NODE_NAME.indexOf(node.nodeName) === -1 &&
                !hasFMWElement(node)
              ) {
                stack.push(...Array.from(node.childNodes))
              }
            }
          }

          const searchActions = () => {
            // DOM 변화 감시 중단
            observer.disconnect()
            if ((window as any).fmwMutationObserver) {
              ;(window as any).fmwMutationObserver.disconnect()
            }

            // Body의 자식 노드를 순회하며 FMW 엘리먼트 삭제
            document.body.childNodes.forEach(deleteFmwElement)

            // 단어의 개수와 포지션값 초기화
            wordCount = Array(fmwKeywords.length).fill(0)
            wordPosition = Array(fmwKeywords.length).fill([])

            // Body의 자식 노드를 순회하며 FMW 엘리먼트 적용
            document.body.childNodes.forEach(insertFmwElement)

            // 검색어에 따른 FMW 엘리먼트 카운팅 및 포지션 캐시
            ;(window as any).whale.runtime.sendMessage({
              tabId: tabId,
              count: wordCount,
              position: wordPosition
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
