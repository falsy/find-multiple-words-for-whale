import { IFindMultipleWords } from "./interfaces/findMultipleWords"

class FindMultipleWords implements IFindMultipleWords {

  private readonly body: HTMLElement
  private readonly color: Array<string>
  private readonly except: Array<string>
  private wordCount: Array<number>
  private wordPosition: Array<Array<number>>
  private findWords: Array<string>
  private observer: any
  private lazySearch: any

  constructor(color: Array<string>, except: Array<string>) {
    this.body = document.body
    this.color = color
    this.except = except
    this.wordCount = []
    this.wordPosition = []
    this.findWords = []
    this.observer = ''
    this.lazySearch = 0
  }

  private insertFmwElement(el: HTMLObjectElement): void {
    el.childNodes.forEach((node: HTMLObjectElement) => {
      if(node.nodeName === '#text'
        && this.except.indexOf(node.parentNode.nodeName) === -1
        && node.data.replace(/\t|\n| /gm, '') !== "") {
          this.replaceElement(node)
      } else if(node.nodeName === 'IFRAME' && node?.contentDocument) {
        node.contentDocument.body.childNodes.forEach((node: any) => {
          this.insertFmwElement(node)
        });
      } else if(node.childNodes
        && node.childNodes.length
        && this.except.indexOf(node.nodeName) === -1) {
          this.insertFmwElement(node)
      }
    })
  }

  private replaceElement(node: HTMLObjectElement): void {
    const fmwElement = document.createElement('i')
          fmwElement.className = 'fmw-style-container'
          fmwElement.style.fontStyle = 'normal'
    let nodeText = node.data

    this.findWords.forEach((word, i) => {
      const reg = new RegExp(word, 'gim')
      if(reg.test(nodeText)) {
        const className = `fmw-style fmw-style-${i}`
        const baseStyleText = "font-style: normal; display: inline; box-shadow: 1px 3px 3px rgba(0,0,0,0.2); border-radius: 4px; color: #000; white-space: initial;"
        const divisionColor = `background: ${this.color[i % 10]};`
        nodeText = nodeText.replace(reg, `<i class="${className}" style="${baseStyleText + divisionColor}">\$&</i>`)
        
        // 검색된 키워드 카운팅
        this.wordCount[i] += 1
        const targetEl = node.parentElement
        const targetPosition = window.pageYOffset + targetEl.getBoundingClientRect().top
        const marginScroll = 80
        this.wordPosition[i] = this.wordPosition[i].concat(targetPosition - marginScroll)
      }
    })

    if(node.data !== nodeText) {
      fmwElement.innerHTML = nodeText
      node.parentNode.replaceChild(fmwElement, node)
    }
  }

  private deleteFmwElement(el: HTMLObjectElement): void {
    el.childNodes.forEach((node: HTMLObjectElement) => {
      if(String(node.className).indexOf('fmw-style-container') !== -1 && node.nodeName === 'I') {
        node.outerHTML = node.textContent
      } else if(node.nodeName === 'IFRAME' && node?.contentDocument) {
        node.contentDocument.body.childNodes.forEach((node: any) => {
          this.deleteFmwElement(node)
        });
      } else if(node.childNodes
        && node.childNodes.length
        && this.except.indexOf(node.nodeName) === -1) {
          this.deleteFmwElement(node)
      }
    })
  }

  private startDomObserver(keywords: Array<string>): void {
    let observeCount = 0

    this.observer = new MutationObserver(() => {
      observeCount += 1
      
      if(this.lazySearch) clearTimeout(this.lazySearch)
      
      this.lazySearch = setTimeout(() => {
        this.observer.disconnect()
        this.searchDomElement(keywords)
      }, 1000)

      if(observeCount > 10) {
        this.observer.disconnect()
        this.searchDomElement(keywords)
      }
    })

    this.observer.observe(document.body, { 
      childList: true,
      subtree: true,
      attributes: false,
      characterData: true,
      attributeOldValue: false,
      characterDataOldValue: false
    })
  }

  searchDomElement(keywords: Array<string>): void {
    if(this.observer) this.observer.disconnect()
    if(this.lazySearch) clearTimeout(this.lazySearch)

    // // 기존 검색된 단어 제거
    this.body.childNodes.forEach((node: HTMLObjectElement) => this.deleteFmwElement(node))
    
    this.findWords = keywords
    this.wordCount = Array(keywords.length).fill(0)
    this.wordPosition = Array(keywords.length).fill([])

    // // 단어 검색
    this.body.childNodes.forEach((node: HTMLObjectElement) => this.insertFmwElement(node))

    whale.runtime.sendMessage({
      count: this.wordCount,
      position: this.wordPosition
    })

    this.startDomObserver(keywords)
  }

}

export default FindMultipleWords