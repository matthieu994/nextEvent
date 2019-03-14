import firebase from "react-native-firebase"

export const changeFriendStatus = (
  currentEmail,
  email,
  status,
  setFriend
) => {
  if (currentEmail === email) return

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
    })
    .catch(error => console.warn(error))
}
