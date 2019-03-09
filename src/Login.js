import React from "react"
import { StyleSheet, Text, View } from "react-native"
import firebase from "react-native-firebase"
import { Button, Input } from "react-native-elements"
import { isEmail } from "validator"
import { UserContext } from "./Provider"

export default class Login extends React.Component {
  state = { email: "", password: "", errorMessage: null }

  handleLogin = () => {
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
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        this.context.setUser(userCredentials.user)
        this.props.navigation.navigate("Main")
      })
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <Input
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Mot de passe"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Se connecter" onPress={this.handleLogin} />
        <Text onPress={() => this.props.navigation.navigate("SignUp")}>
          Vous n'avez pas encore de compte ?
        </Text>
      </View>
    )
  }
}

Login.contextType = UserContext

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
