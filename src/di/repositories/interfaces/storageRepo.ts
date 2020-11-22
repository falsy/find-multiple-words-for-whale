export interface IStorageRepo {
  setKeywords(keywords: Array<string>): void
  getKeywords(): Array<string>
  removeKeywords(): void
}