import {Accommodation} from './household';

export interface ResponseStatistics {
  numHouseholds: number;
  numResponses: number;
}

export interface RsvpStatistics {
  numHouseholds: number;
  numResponses: number;
  distribution: Map<Accommodation, number>;
  pickFiveSongs: string[];
}
