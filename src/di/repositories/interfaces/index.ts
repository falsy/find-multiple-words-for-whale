import { IStorageRepo } from "./storageRepo"
import { IWhaleRepo } from "./whaleRepo"

export interface IRepositories {
  storage: IStorageRepo
  whale: IWhaleRepo
}