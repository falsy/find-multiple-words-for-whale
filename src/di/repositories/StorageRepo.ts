import { IWebStorage } from "../infrastructures/interfaces/webStorage"
import { IStorageRepo } from "./interfaces/storageRepo"

class StorageRepo implements IStorageRepo {
  
  constructor(
    private readonly storage: IWebStorage
  ) {}

  setKeywords(keywords: Array<string>): void {
    this.storage.setKeywords(keywords)
  }

  getkeywords(): Array<string> {
    return this.storage.getkeywords()
  }

  removeKeywords(): void {
    this.storage.removeKeywords()
  }

}

export default StorageRepo