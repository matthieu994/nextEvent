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
const bucket = admin.storage()
  .bucket()

const notifcationTypes = {
  newEvent: 'Event',
  addUser: 'addUser',
  newPayment: 'newPayment'
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

async function sendNotification(message, email = null) {
  if (email) {
    let { fcmToken } = await getDocument('users', email)
    message.token = fcmToken
  }

  if (!message.token)
    return Promise.resolve()

  return admin.messaging()
    .send(message)
}

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
  .onCall((_data, context) =>
    getDocument('users', context.auth.token.email)
      .catch(error => {
        return error
      })
  )


exports.searchUser = functions
  .runWith(runtimeOpts)
  .https
  .onCall(({ email }) =>
    getDocument('users', email)
      .catch(error => {
        return error
      }))

exports.sendNotification = functions
  .runWith(runtimeOpts)
  .https
  .onCall(data => sendNotification(data.message, data.email))

exports.paymentsNotification = functions.firestore.document('events/{eventId}/payments/{paymentId}')
  .onCreate(async (change, context) => {
    const { name, users } = await getDocument('events', context.params.eventId)//getEvent(context.params.eventId)

    let message = {
      notification: {
        title: 'Nouvelle dépense',
        body: `Une nouvelle dépense a été ajoutée dans ${name}`
      },
      data: {
        type: notifcationTypes.newPayment
      }
    }

    users.splice(users.indexOf(context.auth.token.email), 1)

    users.forEach(async user => {
      await sendNotification(message, user)
        .then(() => console.log(`Nouveau payement ${name}`))
        .catch(err => console.error(err))
    })
  })

exports.eventNotification = functions.firestore.document('users/{userId}/events/{eventId}')
  .onCreate(async (change, context) => {
    const { owner, name: eventName } = await getDocument('events', context.params.eventId)

    if (context.params.userId === owner)
      return

    const { displayName, familyName } = await getDocument('users', owner)
    const message = {
      notification: {
        title: 'Nouvel événement',
        body: `${displayName} ${familyName} vous a ajouté dans l'événement : ${eventName}`,
      },
      data: {
        type: notifcationTypes.newEvent
      }
    }

    await sendNotification(message, context.params.userId)
      .then(() => console.log(`${context.params.userId} invité dans l'événement ${eventName}`))
      .catch(err => console.error(err))
  })

/*exports.eventNotification = functions.firestore.document('events/{eventId}')
  .onCreate(async (change, context) => {
    const event = change.data()

    event.users.splice(event.users.findIndex(user => user === event.owner), 1)
    const eventOwner = await getUser(event.owner)
    event.users.forEach(async user => {
      const { fcmToken } = await getUser(user)
      if (!fcmToken) return

      const message = {
        token: fcmToken,
        notification: {
          title: 'Nouvel Evénement !!',
          body: eventOwner.displayName + " vous a ajouté dans l'événement : " + event.name
        },
        data: {
          type: notifcationTypes.newEvent
        }
      }

      sendNotification({ message })
        .then(() => console.log('Message de l\'événement ' + event.name))
        .catch(err => console.error(err))
    })
  })*/

function getDocument(path, doc) {
  return admin.firestore()
    .collection(path)
    .doc(doc)
    .get()
    .then(_doc => _doc.data())
}

exports.deletePhoto = functions.firestore.document('users/{emailId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const { emailId } = context.params

    if (!newValue.photoURL)
      bucket.file(`${emailId}/images/profile.jpg`)
        .delete()
        .then(() => console.log("photo supprimé"))
        .catch(err => console.error(err))

    return change.after.ref.set(newValue)
      .then(() => console.log("photo supprimé !"))
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
