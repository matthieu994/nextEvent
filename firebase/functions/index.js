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
const bucket = admin.storage().bucket()

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
  .onCall(({ displayName, familyName, email }) => {
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
      getUser(context.auth.token.email)
        .then(user => resolve(user))
        .catch(error => reject(error))
    })
  })

exports.searchUser = functions
  .runWith(runtimeOpts)
  .https
  .onCall(({ email }, context) => {
    return getUser(email)
      .catch(error => {
        return error
      })
  })

exports.sendNotification = functions
  .runWith(runtimeOpts)
  .https
  .onCall(({notification}) => admin.messaging().send(notification))

exports.eventNotification = functions.firestore.document('events/{eventId}')
  .onCreate(async (change, context) => {
    const event = change.data()

    event.users.splice(event.users.findIndex(user => user === event.owner),1)
    const eventOwner = await getUser(event.owner)
    event.users.forEach(async user => {
      const {fcmToken} = await getUser(user)
      console.log(fcmToken)
      if(!fcmToken) return

      const message = {
        token: fcmToken,
        notification: {
          title: 'Nouvel Evénement !!',
          body: eventOwner.displayName + " vous a ajouté dans l'événement : " + event.name
        }
      }

      exports.sendNotification(message)
        .then(() => console.log('Message de l\'événement ' + event.name))
        .catch(err => console.error(err))
    })
  })

function getUser(user) {
  return admin.firestore().collection('users').doc(user).get().then(user => user.data() )
}

exports.deletePhoto = functions.firestore.document('users/{emailId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const { emailId } = context.params

    if (!newValue.photoURL)
      bucket.file(`${emailId}/images/profile.jpg`)
        .delete()
        .then(() => {
          return console.log("photo supprimé")
        })
        .catch(err => console.error(err))

    return change.after.ref.set(newValue)
      .then(() => console.log("all done !!"))
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
