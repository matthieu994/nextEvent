import React from "react"
import { StyleSheet, Text, TextInput, View, Button } from "react-native"
import firebase from "react-native-firebase"
import { isEmail } from "validator"

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
      .then(() => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
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