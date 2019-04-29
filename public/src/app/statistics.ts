import {Accommodation} from './household';

export interface ResponseStatistics {
  numHouseholds: number;
  numResponses: number;
}

export interface RsvpStatistics {
  households: number;
  responses: number;
  camping: number;
  home: number;
  hotel: number;
  fiveSongs: string[];
}
