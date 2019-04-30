
export enum MemberType {
  invitee = 'invitee',
  plusOne = 'plusOne'
}


export class Member {
  id: string;
  type: MemberType;
  first: string;
  last: string;
  isComing: boolean;
  allowedPlusOne: boolean;
  bringingPlusOne: boolean;
  plusOne: PlusOne;
  dietaryRestrictions: string[];

  constructor(id: string, data: {[field: string]: any}) {
    this.id = id;
    this.type  = data.type || MemberType.invitee;
    this.first = data.first || '';
    this.last = data.last || '';
    this.isComing = !!data.isComing;
    this.allowedPlusOne = !!data.allowedPlusOne;
    this.bringingPlusOne = !!data.hasPlusOne;
    this.plusOne = data.PlusOne || null;
    this.dietaryRestrictions = data.dietaryRestrictions || [];
  }

}

export class PlusOne extends Member {
  parentId: string;

  constructor(id: string, data: {[field: string]: any}) {
    super(id, data);
    this.type = data.type || MemberType.plusOne;
    this.parentId = data.parentId || '';
  }
}
