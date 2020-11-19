export interface IBgeParams {
  count: number
  position: number
}

export interface IBgeDTO {
  count: number
  position: number
}

class BgeDTO implements IBgeDTO {
  count: number;
  position: number;
  
  constructor(dataParams: IBgeParams) {
    this.count = dataParams.count;
    this.position = dataParams.position;
  }
}

export default BgeDTO