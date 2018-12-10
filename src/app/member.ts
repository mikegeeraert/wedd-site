
export class Member {
  id: string;
  type: MemberType;
  first: string;
  last: string;
  isComing: boolean;
  allowedPlusOne: boolean;
  plusOne: PlusOne;
  dietaryRestrictions: string[];

  constructor(id: string, data: {[field: string]: any}) {
    this.id = data.id;
    this.type  = data.type || MemberType.invitee;
    this.first = data.first || '';
    this.last = data.last || '';
    this.isComing = data.isComing || false;
    this.allowedPlusOne = data.allowedPlusOne || false;
    this.plusOne = data.PlusOne || null;
    this.dietaryRestrictions = data.dietaryRestrictions || [];
  }
}

export enum MemberType {
  invitee = 'invitee',
  plusOne = 'plusOne'
}


export class PlusOne extends Member {
  parentId: string;

  constructor(id: string, data: {[field: string]: any}) {
    super(id, data);
    this.type = data.type || MemberType.plusOne;
    this.parentId = data.parentId || '';
  }
}
