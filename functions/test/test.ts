import {getRandomSongs} from '../src';
import * as chai from 'chai';


import 'mocha';

describe('getRandomSongs', () => {
  it('should return 5 songs if given a list larger than 5 with an n value of 5', () => {
    const songs = ['Like The Rain', "Boot Scootin Boogie", "Friend's In Low Places", "BEER Run", "Dead or Alive", "Redneck Yacht Club"];

    const result = getRandomSongs(songs, 5);
    chai.expect(result.length).to.equal(5);
  });
  it('should not return null results', () => {
    const songs = ['Like The Rain', "Boot Scootin Boogie", "Friend's In Low Places", "BEER Run", "Dead or Alive", "Redneck Yacht Club"];

    const result = getRandomSongs(songs, 5);
    console.log(result);
    result.forEach(song => chai.expect(song).to.not.equal(null));

  });
});
