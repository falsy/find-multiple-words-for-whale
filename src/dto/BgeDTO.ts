export interface IBgeParams {
  tabId: number
  count: number
  position: number
}

export interface IBgeDTO {
  tabId: number
  count: number
  position: number
}

class BgeDTO implements IBgeDTO {
  tabId: number
  count: number
  position: number

  constructor(dataParams: IBgeParams) {
    this.tabId = dataParams.tabId
    this.count = dataParams.count
    this.position = dataParams.position
  }
}

export default BgeDTO
