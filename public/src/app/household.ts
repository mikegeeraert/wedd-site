import {Member} from './member';
import * as moment from 'moment';

export class Household {
  id: string;
  name: string;
  members: Member[];
  accommodation: Accommodation;
  songs: string[];
  drinks: string[];
  dietaryRestrictions: string;
  response: moment.Moment;
  private rawGreeting: string;

  constructor(id: string, data: {[field: string]: any})  {
    this.id = id;
    this.name = data.name || '';
    this.rawGreeting = data.greeting || '';
    this.members = data.members || [];
    this.accommodation = data.accommodation;
    this.songs = data.songs || [];
    this.drinks = data.drinks || [];
    this.dietaryRestrictions = data.dietaryRestrictions || null;
    this.response = data.response ? moment(data.response) : null;
  }

  allowedPlusOnes(): boolean {
    return this.members.some(member => member.allowedPlusOne);
  }

  get greeting(): string {
    return this.rawGreeting ? this.rawGreeting : `Hey ${this.name}s`;
  }

  attending(): Member[] {
    return this.members.filter(member => member.isComing);
  }

  missing(): Member[] {
    return this.members.filter(member => !member.isComing);
  }
}

export enum Accommodation {
  camping = 'camping',
  hotel = 'hotel',
  home = 'home',
}
