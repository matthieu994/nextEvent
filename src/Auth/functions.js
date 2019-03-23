import { isEmail, isAlpha } from "validator"
import firebase from "react-native-firebase"

module.exports = {
  checkLoginCredentials: (email, password, next) => {
    let errorMessage = null

    if (!isEmail(email)) errorMessage = "Votre adresse email n'est pas valide."
    else if (!password)
      errorMessage = "Votre mot de passe ne peut pas être vide."

    if (errorMessage) {
      next(errorMessage)
      return false
    }

    return true
  },
  checkSignupCredentials: (email, password, displayName, familyName, next) => {
    let errorMessage = null

    if (!isEmail(email)) errorMessage = "Votre adresse email n'est pas valide."
    else if (!isAlpha(displayName) || !displayName)
      errorMessage = "Votre nom d'utilisateur n'est pas valide."
    else if (!isAlpha(familyName) || !familyName)
      errorMessage = "Votre nom de famille n'est pas valide."
    else if (!password)
      errorMessage = "Votre mot de passe ne peut pas être vide."

    if (errorMessage) {
      next(errorMessage)
      return false
    }

    return true
  },
  createUser: (email, displayName, familyName) => {
    return firebase
      .firestore()
      .collection("users")
      .doc(email)
      .set({
        displayName,
        familyName
      })
  }
}
