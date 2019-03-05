import React from "react"
import { StyleSheet, Text, TextInput, View, Button } from "react-native"
import firebase from "react-native-firebase"
import { isEmail } from "validator"

export default class SignUp extends React.Component {
  state = { email: "", password: "", errorMessage: null }

  handleSignUp = () => {
    const { email, password } = this.state

    if (!isEmail(email)) {
      this.setState({ errorMessage: "Votre adresse email n'est pas valide." })
      return
    } else if (!password) {
      this.setState({
        errorMessage: "Votre mot de passe ne peut pas être vide."
      })
      return
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Mot de passe"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
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
