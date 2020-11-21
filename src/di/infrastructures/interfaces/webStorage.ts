export interface IWebStorage {
  setKeywords(keywords: Array<string>): void
  getkeywords(): Array<string>
  removeKeywords(): void
}