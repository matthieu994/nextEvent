import firebase from "react-native-firebase"

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
