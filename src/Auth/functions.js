import { isEmail } from "validator"

module.exports = {
  checkCredentials: (email, password, next) => {
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
  redirectUser: user => {
    this.context.setUser(user)
    this.props.navigation.navigate("Main")
  }
}
