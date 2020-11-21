import { IWebStorage } from "./webStorage"
import { IWhale } from "./whale"

export interface IInfrastructure {
  storage: IWebStorage
  whale: IWhale
}