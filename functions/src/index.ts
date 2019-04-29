import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// generate this file at https://console.firebase.google.com/u/0/project/wedding-49e7e/settings/serviceaccounts/adminsdk
const serviceAccount = require('./../serviceAccountKey.json'); // Needs to be deployed to functions environment


enum Accommodation {
  camping = 'camping',
  hotel = 'hotel',
  home = 'home',
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

export const getAccommodationStats = functions.https.onCall((data, context) => {
  const respondedHouseholds = db.collection('households').where('response', '==', true);
  return respondedHouseholds.get().then(
    (results) => {
      const stats = {
        numHouseholds: 0,
        numResponses: 0,
        distribution: new Map<Accommodation, number>([
          [Accommodation.camping, 0],
          [Accommodation.home, 0],
          [Accommodation.hotel, 0]
        ]),
      };
      if (!results.empty) {
        results.forEach((result) => {
          const accommodation = result.data().accommodation;
          stats.numResponses += 1;
          switch (accommodation) {
            case Accommodation.camping:
              const campingVal = stats.distribution.get(Accommodation.camping) + 1;
              stats.distribution.set(Accommodation.camping, campingVal);
              break;
            case Accommodation.home:
              const homeVal = stats.distribution.get(Accommodation.home) + 1;
              stats.distribution.set(Accommodation.home, homeVal);
              break;
            case Accommodation.hotel:
              const hotelVal = stats.distribution.get(Accommodation.hotel) + 1;
              stats.distribution.set(Accommodation.camping, hotelVal);
              break;
          }
        });
      }
      return stats;
    }
  );
});
