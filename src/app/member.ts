
export class Member {
  first: string;
  last: string;
  isComing: boolean;
  allowedPlusOne: boolean;
  hasPlusOne: boolean;

  constructor(data: {[field: string]: any}) {
    this.first = data.first || '';
    this.last = data.last || '';
    this.isComing = data.isComing || false;
    this.allowedPlusOne = data.allowedPlusOne || false;
    this.hasPlusOne = data.hasPlusOne || false;
  }
}
