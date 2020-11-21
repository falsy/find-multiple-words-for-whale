import { IInfrastructure } from "../infrastructures/interfaces"
import { IRepositories } from "./interfaces"
import StorageRepo from "./StorageRepo"
import WhaleRepo from "./WhaleRepo"

export default (infrastucture: IInfrastructure): IRepositories => {
  return {
    storage: new StorageRepo(infrastucture.storage),
    whale: new WhaleRepo(infrastucture.whale)
  }
}