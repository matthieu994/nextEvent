/* eslint-disable no-underscore-dangle */
import React, { Component } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Input, Icon, Text } from "react-native-elements"
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
        .catch(error => this._isMounted && this.getMessage(error.code) && this.setState({buttonLoading: false}))
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
          inputStyle={{ color: "#2E6171" }}
          placeholderTextColor="#62717E"
          inputContainerStyle={styles.inputContainer}
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          value={this.state.email}
          leftIconContainerStyle={{ marginLeft: 0 }}
          leftIcon={<Icon name="mail" type="feather" size={24} color="black" />}
        />
        <Input
          inputStyle={{ color: "#2E6171" }}
          inputContainerStyle={styles.inputContainer}
          placeholderTextColor="#62717E"
          secureTextEntry
          placeholder="Mot de passe"
          onChangeText={password => this.setState({password})}
          autoCapitalize="none"
          value={this.state.password}
          leftIconContainerStyle={{ marginLeft: 0 }}
          leftIcon={<Icon name="lock" type="feather" size={24} color="black" />}
        />
        <Button
          containerStyle={styles.button}
          buttonStyle={{ backgroundColor: "#2E6171" }}
          title="Se connecter"
          onPress={this.handleLogin}
          titleStyle={{ color: "white" }}
          loading={this.state.buttonLoading}
        />
        <Text
          style={{
            color: "#2E6171",
            textDecorationLine: "underline"
          }}
          onPress={() => !this.state.buttonLoading && this.props.navigation.navigate("SignUp")}
        >
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
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(232, 243, 250)"
  },
  title: {
    margin: 20,
    color: "#2E6171"
  },
  nameInputView: {
    flexDirection: "row"
  },
  nameInput: {
    width: "49%",
    paddingHorizontal: 5
  },
  inputContainer: {
    paddingHorizontal: 5,
    marginVertical: 3,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "rgb(210, 225, 230)"
  },
  button: {
    margin: 15
  }
})
