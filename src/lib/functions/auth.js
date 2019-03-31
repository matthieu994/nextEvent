import { isEmail, isAlpha } from "validator"
import firebase from "react-native-firebase"

const errorText = {
  emptyPassword: "Votre mot de passe ne peut pas être vide.",
  wrongMailFormat: "Votre adresse email n'est pas valide.",
  wrongFormatDisplayName: "Votre nom d'utilisateur n'est pas valide.",
  wrongFormatFamilyName: "Votre nom de famille n'est pas valide."
}

module.exports = {
  checkLoginCredentials: (email, password, next) => {
    let errorMessage = null

    if (!isEmail(email)) errorMessage = errorText.wrongMailFormat
    else if (!password)
      errorMessage = errorText.emptyPassword

    if (errorMessage) {
      next(errorMessage)
      return false
    }

    return true
  },

  checkSignupCredentials: (email, password, displayName, familyName, next) => {
    let errorMessage = null

    if (!isEmail(email)) errorMessage = errorText.wrongMailFormat
    else if (!isAlpha(displayName) || !displayName)
      errorMessage = errorText.wrongFormatDisplayName
    else if (!isAlpha(familyName) || !familyName)
      errorMessage = errorText.wrongFormatFamilyName
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
  },

  checkAccountDeleteCredentials: (password, next) => {
    let errorMessage = null

    if (!password)
      errorMessage = errorText.emptyPassword

    if (errorMessage) {
      next(errorMessage)
      return false
    }

    return true
  },

  checkNames: (displayName, familyName, next) => {
    let errMessage = null

    if (!isAlpha(displayName))
      errMessage = errorText.wrongFormatDisplayName
    if (!isAlpha(familyName))
      errMessage = errorText.wrongFormatFamilyName

    if(errMessage) {
      next(errMessage)
      return false
    }

    return true
  }
}
