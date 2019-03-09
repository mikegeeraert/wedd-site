import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({
  serviceAccountId: 'firebase-adminsdk-psau6@wedding-49e7e.iam.gserviceaccount.com'
});


export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// noinspection JSUnusedGlobalSymbols
export const emailAuthentication = functions.https.onCall((data, context) => {
  if (data.emailAddress && data.householdId) {
    // TODO: Check that email Address belongs to household first
    admin.auth().createCustomToken(data.emailAddress)
      .then(function(customToken) {
        return customToken;
      })
      .catch(function(error) {
        console.log("Error creating custom token:", error);
        throw new functions.https.HttpsError('permission-denied', error.toString())
      });
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'either emailAddress or householdId were not passed to function in data');
  }
});
