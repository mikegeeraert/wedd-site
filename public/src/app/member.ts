
export enum MemberType {
  invitee = 'invitee',
  plusOne = 'plusOne'
}


export class Member {
  id: string;
  householdId: string;
  type: MemberType;
  first: string;
  last: string;
  email: string;
  isComing: boolean;
  allowedPlusOne: boolean;
  bringingPlusOne: boolean;
  plusOne: PlusOne;
  dietaryRestrictions: string[];

  constructor(id: string, data: {[field: string]: any}) {
    this.id = id;
    this.householdId = data.householdId || '';
    this.type  = data.type || MemberType.invitee;
    this.first = data.first || '';
    this.last = data.last || '';
    this.email = data.email || '';
    // if isComing is not set in firebase, we haven't received a response yet
    this.isComing = data.isComing !== undefined ? data.isComing : null;
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
