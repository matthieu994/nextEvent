import React from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import firebase from "react-native-firebase"
import { Input, Button } from "react-native-elements"
import { isEmail } from "validator"

export default class SignUp extends React.Component {
  state = { email: "", password: "", errorMessage: null , errorCode: null}

  handleSignUp = () => {
    const { email, password } = this.state

    if (!isEmail(email)) {
      this.setState({ errorMessage: "Votre adresse email n'est pas valide." })
      return
    }
    if (!password) {
      this.setState({
        errorMessage: "Votre mot de passe ne peut pas être vide."
      })
      return
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ errorCode: error.code }))
  }

  getMessage() {
    if (!this.state.errorCode) return this.state.errorMessage
    
    if (this.state.errorCode === "auth/email-already-in-use")
      return "L'adresse email est deja utilisée."
    if (this.state.errorCode === "auth/invalid-email")
      return "L'adresse email n'est pas valide."
    if (this.state.errorCode === "auth/weak-password")
      return "Le mot de passe doit faire plus de 6 caractères."
    
    else return ""
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.getMessage()}</Text>
        )}
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
        <Button
          title="Créer un compte"
          onPress={this.handleSignUp}
        />
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
