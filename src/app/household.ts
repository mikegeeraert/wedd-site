import {Member} from './member';

export class Household {
  id: string;
  name: string;
  greeting: string;
  members: Member[];
  accommodation: Accommodation;
  songs: string[];
  drinks: string[];
  dietaryRestrictions: string;

  constructor(id: string, data: {[field: string]: any})  {
    this.id = id,
    this.name = data.name || '';
    this.greeting = data.greeting || '';
    this.members = data.members || [];
    this.accommodation = data.accommodation || null;
    this.songs = data.songs || [];
    this.drinks = data.drinks || [];
    this.dietaryRestrictions = data.dietaryRestrictions || [];
  }

  allowedPlusOnes(): boolean {
    return this.members.some(member => member.allowedPlusOne);
  }
}

enum Accommodation {
  camping = 'camping',
  hotel = 'hotel',
  home = 'home',
}
