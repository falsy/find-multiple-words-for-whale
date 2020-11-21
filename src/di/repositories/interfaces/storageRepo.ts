export interface IStorageRepo {
  setKeywords(keywords: Array<string>): void
  getkeywords(): Array<string>
  removeKeywords(): void
}