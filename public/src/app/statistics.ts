import {Accommodation} from './household';

export interface ResponseStatistics {
  numHouseholds: number;
  numResponses: number;
}

export interface AccommodationStatistics {
  total: number;
  distribution: Map<Accommodation, number>;
}
