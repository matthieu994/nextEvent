/* eslint-disable no-underscore-dangle */
import React, {Component} from "react"
import {StyleSheet, View} from "react-native"
import {Button, Input, Text} from "react-native-elements"
import firebase from "react-native-firebase"
import DropdownAlert from "react-native-dropdownalert"
import {checkLoginCredentials} from "./functions"
import {UserContext} from "../Provider/UserProvider"

export default class Login extends Component {
  state = {email: "", password: "", buttonLoading: false}

  constructor(props) {
    super(props)
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  handleLogin = () => {
    const {email, password} = this.state

    if (!checkLoginCredentials(email, password, this.setMessage)) return

    this.setState({buttonLoading: true}, () => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.context.updateUser()
          this.context.getUserData()
          this.props.navigation.navigate("Main")
        })
        .catch(error => this._isMounted && this.getMessage(error.code))
    })
  }

  setMessage = errorMessage => {
    this.dropdown.alertWithType("error", "Erreur", errorMessage)
  }

  getMessage(errorCode) {
    if (errorCode === "auth/user-disabled")
      this.setMessage("Votre compte a été supprimé.")
    if (errorCode === "auth/invalid-email")
      this.setMessage("Votre adresse email n'est pas valide.")
    if (errorCode === "auth/user-not-found")
      this.setMessage("L'adresse email n'est pas reconnue.")
    if (errorCode === "auth/wrong-password")
      this.setMessage("Votre mot de passe n'est pas reconnu.")
  }

  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          closeInterval={2500}
        />
        <Text h2 style={[styles.title, styles.text]}>
          Se connecter
        </Text>
        <Input
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <Input
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Mot de passe"
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button
          title="Se connecter"
          onPress={this.handleLogin}
          style={styles.button}
          loading={this.state.buttonLoading}
        />
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
    marginTop: 8,
    marginBottom: 10
  },
  title: {
    margin: 20
  },
  button: {
    margin: 15
  }
})
