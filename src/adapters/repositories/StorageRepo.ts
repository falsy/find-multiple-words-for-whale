import { IWebStorage } from "../../adapters/infrastructures/interfaces/webStorage"
import { IStorageRepo } from "./interfaces/storageRepo"

class StorageRepo implements IStorageRepo {
  constructor(private readonly storage: IWebStorage) {}

  setKeywords(keywords: Array<string>): void {
    this.storage.setKeywords(keywords)
  }

  getKeywords(): Array<string> {
    return this.storage.getKeywords()
  }

  removeKeywords(): void {
    this.storage.removeKeywords()
  }
}

export default StorageRepo
