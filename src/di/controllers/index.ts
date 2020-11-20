import FindMultipleWords from "../data/FindMultipleWords"
import { IRepositories } from "../repositories/interfaces"

class Controller {

  constructor(
    private readonly repo: IRepositories
  ) {}

  insertClassFmw(): void {
    this.repo.whale.initClassFMW(FindMultipleWords);
  }

  searchExecute(keywords: Array<string>) {
    this.repo.whale.searchDomElement(keywords);
  }

  getkeywords(): Array<string> {
    return this.repo.storage.getkeywords();
  }

}

export default Controller