const functions = require("firebase-functions")
const admin = require("firebase-admin")

var serviceAccount = require("./admin-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nextevent-869ce.firebaseio.com"
})

const runtimeOpts = {
  timeoutSeconds: 10
}

exports.setPhotoURL = functions
  .runWith(runtimeOpts)
  .https.onCall((photoURL, context) => {
    return admin
      .firestore()
      .collection("users")
      .doc(context.auth.token.email)
      .update({
        photoURL
      })
  })

exports.createUserDocument = functions
  .runWith(runtimeOpts)
  .https.onCall(({ displayName, familyName, email }, _context) => {
    return admin
      .firestore()
      .collection("users")
      .doc(email)
      .set({
        displayName,
        familyName
      })
  })

exports.getUserData = functions
  .runWith(runtimeOpts)
  .https.onCall((_data, context) => {
    return new Promise((resolve, reject) => {
      admin
        .firestore()
        .collection("users")
        .doc(context.auth.token.email)
        .get()
        .then(user => {
          return resolve(user.data())
        })
        .catch(error => {
          reject(error)
        })
    })
  })

/*
function deleteAllUsers(nextPageToken) {
  admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        admin
          .auth()
          .deleteUser(userRecord.uid)
          .then(function() {
            console.log("Successfully deleted user: ", userRecord.uid)
          })
          .catch(function(error) {
            console.log("Error deleting user:", error)
          })
      })
      if (listUsersResult.pageToken) {
        listAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function(error) {
      console.log("Error listing users:", error)
    })
}
deleteAllUsers()
*/
