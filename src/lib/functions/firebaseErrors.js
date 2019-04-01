export default errorCode => {
  let res = ""

  if (errorCode === "auth/user-disabled")
    res = "Votre compte a été supprimé."
  if (errorCode === "auth/invalid-email")
    res = "Votre adresse email n'est pas valide."
  if (errorCode === "auth/user-not-found")
    res = "L'adresse email n'est pas reconnue."
  if (errorCode === "auth/wrong-password")
    res = "Votre mot de passe n'est pas reconnu."
  if (errorCode === "auth/email-already-in-use")
    res = "L'adresse email est deja utilisée."
  if (errorCode === "auth/weak-password")
    res = "Le mot de passe doit faire plus de 6 caractères."

  return res
}
