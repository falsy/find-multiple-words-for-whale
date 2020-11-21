export interface IFindMultipleWords {
  clearTimeoutSearch(): void
  searchDomElement(keywords: Array<string>): void
}