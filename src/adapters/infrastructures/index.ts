import { IInfrastructure } from "./interfaces"
import WebStorage from "./WebStorage"
import Whale from "./Whale"

export default (): IInfrastructure => {
  return {
    storage: new WebStorage(),
    whale: new Whale
  }
}