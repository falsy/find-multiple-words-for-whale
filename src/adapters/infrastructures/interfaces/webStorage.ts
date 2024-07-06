export interface IWebStorage {
  setKeywords(keywords: Array<string>): void
  getKeywords(): Array<string>
  removeKeywords(): void
}