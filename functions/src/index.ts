
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// generate this file at https://console.firebase.google.com/u/0/project/wedding-49e7e/settings/serviceaccounts/adminsdk
const serviceAccount = require('./../serviceAccountKey.json'); // Needs to be deployed to functions environment


enum Accommodation {
  camping = 'camping',
  hotel = 'hotel',
  home = 'home',
}

export class RsvpStatistics {
  households: number;
  responses: number;
  camping: number;
  home: number;
  hotel: number;
  fiveSongs: string[];

  constructor() {
    this.households = 0;
    this.responses = 0;
    this.camping = 0;
    this.home = 0;
    this.hotel = 0;
    this.fiveSongs = [];
  }

}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedding-49e7e.firebaseio.com'
});

const db = admin.firestore();

// noinspection JSUnusedGlobalSymbols
export const authenticateWithEmail = functions.https.onCall((data, context) => {
  if (data.emailAddress && data.householdId) {

    // Check that email Address belongs to someone in that household first
    const matchingGuestRef = db.collection('guests').where('householdId','==', data.householdId).where('email', '==', data.emailAddress);
    const isValidGuest = matchingGuestRef.get().then( results => results.empty ? false : true);
    if (!isValidGuest) {
      throw new functions.https.HttpsError('permission-denied', 'Not a valid guest')
    }

    // Create custom token and return token if successful
    return admin.auth().createCustomToken(data.emailAddress)
      .then(customToken =>  {
          return { token: customToken };
        }
      )
      .catch(function(error) {
        console.log("Error creating custom token:", error);
        throw new functions.https.HttpsError('permission-denied', error.toString())
      });
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'either emailAddress or householdId were not passed to function in data');
  }
});

// noinspection JSUnusedGlobalSymbols
export const getAccommodationStats = functions.https.onCall(() => {
  const respondedHouseholds = db.collection('households');
  return respondedHouseholds.get().then(
    (results) => {
      const stats = new RsvpStatistics();
      const allSongs: string[] = [];
      if (!results.empty) {
        results.forEach((result) => {
          const accommodation = result.data().accommodation;
          const responded = result.data().response;
          const songs  = result.data().songs;
          stats.households += 1;
          if (responded) {
            stats.responses += 1;
          }
          if (songs && songs.length > 0) {
            allSongs.push(...songs)
          }
          switch (accommodation) {
            case Accommodation.camping:
              stats.camping += 1;
              break;
            case Accommodation.home:
              stats.home += 1;
              break;
            case Accommodation.hotel:
              stats.hotel += 1;
              break;
          }
        });
        const songsLength = allSongs.length;
        if (songsLength >= 5) {
          stats.fiveSongs = getRandomSongs(allSongs, 5)
        } else {
          stats.fiveSongs = allSongs;
        }
      }
      return stats;
    }
  );
});


export function getRandomSongs(arr: string[], n: number): string[] {
  let numRand = n;
  let len = arr.length;
  const result = new Array(numRand),
    taken = new Array(numRand);
  if (numRand > len)
    throw new RangeError("getRandomSongs: more elements taken than available");
  while (numRand--) {
    const x = Math.floor(Math.random() * len);
    result[numRand] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
