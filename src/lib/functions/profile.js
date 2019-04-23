import firebase from "react-native-firebase"
import { notificationTypes } from "../responsive";

export const changeFriendStatus = (currentEmail, email, status, setFriend) => {
  if (currentEmail === email) return

  if (status === "DELETE") {
    removeFriend(currentEmail, email, setFriend)
    removeFriend(email, currentEmail)
    return
  }

  firebase
    .firestore()
    .collection("users")
    .doc(currentEmail)
    .collection("friends")
    .doc(email)
    .set({ status })
    .then(() => {
      if (status === "SENT") {
        setFriend(email, status)
        changeFriendStatus(email, currentEmail, "PENDING")
      }
      if (status === "OK" && setFriend) {
        setFriend(email, status)
        changeFriendStatus(email, currentEmail, "OK")
        let message = {
          notification: {
            title: 'Demande d\'ami accepté',
            body: `${currentEmail} a accepté votre demande !`
          },
          data: {
            type: notificationTypes.friendReqAccepted
          }
        }

        firebase.functions()
          .httpsCallable("sendNotification")({message, email})
      }
    })
    .catch(error => console.warn(error))
}

const removeFriend = (currentEmail, email, setFriend) => {
  firebase
    .firestore()
    .collection("users")
    .doc(currentEmail)
    .collection("friends")
    .doc(email)
    .delete()
    .then(() => setFriend && setFriend(email, "DELETE"))
    .catch(error => console.warn(error))
}
