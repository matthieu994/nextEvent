import React, { Component } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { Input, Button } from "react-native-elements"
import firebase from "react-native-firebase"
import DropdownAlert from "react-native-dropdownalert"
import { checkCredentials, redirectUser } from "./functions"

export default class SignUp extends Component {
  state = { email: "", password: "" }

  constructor(props) {
    super(props)
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
  }

  handleSignUp = () => {
    const { email, password } = this.state

    if (!checkCredentials(email, password, this.setMessage)) return

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        redirectUser(userCredentials.user).bind(this)
      })
      .catch(error => this._isMounted && this.getMessage(error.code))
  }

  setMessage = errorMessage => {
    this.dropdown.alertWithType("error", "Erreur", errorMessage)
  }

  getMessage(errorCode) {
    if (errorCode === "auth/email-already-in-use")
      this.setMessage("L'adresse email est deja utilisée.")
    if (errorCode === "auth/invalid-email")
      this.setMessage("L'adresse email n'est pas valide.")
    if (errorCode === "auth/weak-password")
      this.setMessage("Le mot de passe doit faire plus de 6 caractères.")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          closeInterval={2500}
        />
        <Input
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          secureTextEntry
          placeholder="Mot de passe"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Créer un compte" onPress={this.handleSignUp} />
        <Text onPress={() => this.props.navigation.navigate("Login")}>
          Vous avez déjà un compte ?
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  }
})
