const functions = require("firebase-functions")
const admin = require("firebase-admin")
const serviceAccount = require("./admin-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nextevent-869ce.firebaseio.com",
  storageBucket: "nextevent-869ce.appspot.com"
})

const runtimeOpts = {
  timeoutSeconds: 10
}

exports.setPhotoURL = functions
  .runWith(runtimeOpts)
  .https
  .onCall((photoURL, context) => {
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
  .https
  .onCall(({ displayName, familyName, email }, _context) => {
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
  .https
  .onCall((_data, context) => {
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

exports.searchUser = functions
  .runWith(runtimeOpts)
  .https
  .onCall(({ email }, context) => {
    return admin
      .firestore()
      .collection("users")
      .doc(email)
      .get()
      .then(user => {
        return user.data()
      })
      .catch(error => {
        return error
      })
  })

exports.deletePhoto = functions.firestore.document('users/{emailId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()

      admin.storage()
        .bucket()
        .getFiles((err, data)=> {
          if(err) {
            console.error(err)
            return
          }
          console.log("les fichiers :")
          console.log(data)
        })

    return Promise.all([() => {
      if (newValue.photoURL)
        return
      admin.storage()
        .bucket()
        .file(`${context.params.emailId}/images/profile.jpg`)
        .delete()
        .then(() => {
          return console.log(`photo supprimé user:${context.params.emailId}`);
        })
        .catch(err => console.error(err))
    }, () => {
      change.after.ref.set(newValue)
    }])
      .then(() => console.log("all done"))
      .catch(err => console.error(err))

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
