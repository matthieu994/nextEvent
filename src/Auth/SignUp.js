/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from "react"
import { Keyboard, StyleSheet, View } from "react-native"
import { Input, Button, Icon, Text } from "react-native-elements"
import firebase from "react-native-firebase"
import DropdownAlert from "react-native-dropdownalert"
import { checkSignupCredentials, createUser, colors, firebaseErrorCode } from "../lib"
import { UserContext } from "../Provider/UserProvider"

export default class SignUp extends Component {
  state = {
    email: "",
    password: "",
    displayName: "",
    familyName: "",
    buttonLoading: false
  }

  constructor(props) {
    super(props)
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.context.clearState()
  }

  handleSignUp = () => {
    const { email, password, displayName, familyName } = this.state

    if (
      !checkSignupCredentials(
        email,
        password,
        displayName,
        familyName,
        this.setMessage
      )
    )
      return

    this.setState({ buttonLoading: true }, () => {
      Keyboard.dismiss()
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          createUser(email, displayName, familyName)
            .then(() => {
              this.props.navigation.navigate("Loading")
            })
            .catch(error => console.log(error))
        })
        .catch(error => {
          if (this._isMounted) this.setMessage(firebaseErrorCode(error.code))
          this.setState({ buttonLoading: false })
        })
    })
  }

  setMessage = errorMessage => {
    this.dropdown.alertWithType("error", "Erreur", errorMessage)
  }

  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          closeInterval={2500}
        />
        {/* <Icon
          name="user-plus"
          containerStyle={{
            borderWidth: 3,
            borderRadius: 15,
            borderColor: "rgb(46, 97, 113)",
            padding: 20,
            marginBottom: 10
          }}
          color="rgb(46, 97, 113)"
          size={70}
          type="feather"
        /> */}
        <Text
          h2
          style={[styles.title, { fontFamily: "Roboto", fontWeight: "100" }]}
        >
          Créer un compte
        </Text>
        <Input
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
          inputStyle={{ color: colors.inputStyle }}
          placeholderTextColor={colors.inputPlaceholder}
          inputContainerStyle={styles.inputContainer}
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          leftIconContainerStyle={{ marginLeft: 0 }}
          leftIcon={<Icon name="mail" type="feather" size={24} color="black" />}
        />
        <View style={styles.nameInputView}>
          <Input
            autoComplete="name"
            inputStyle={{ color: colors.inputStyle }}
            placeholderTextColor={colors.inputPlaceholder}
            containerStyle={[styles.nameInput]}
            inputContainerStyle={styles.inputContainer}
            autoCapitalize="none"
            placeholder="Nom d'utilisateur"
            onChangeText={displayName => this.setState({ displayName })}
            value={this.state.displayName}
            leftIconContainerStyle={{ marginLeft: 0 }}
            leftIcon={
              <Icon name="user" type="feather" size={24} color="black" />
            }
          />
          <Input
            autoComplete="name"
            inputStyle={{ color: colors.inputStyle }}
            placeholderTextColor={colors.inputPlaceholder}
            containerStyle={[styles.nameInput]}
            inputContainerStyle={styles.inputContainer}
            autoCapitalize="none"
            placeholder="Nom de famille"
            onChangeText={familyName => this.setState({ familyName })}
            value={this.state.familyName}
            leftIconContainerStyle={{ marginLeft: 0 }}
            leftIcon={
              <Icon name="users" type="feather" size={24} color="black" />
            }
          />
        </View>
        <Input
          autoComplete="off"
          inputStyle={{ color: colors.inputStyle }}
          inputContainerStyle={styles.inputContainer}
          placeholderTextColor={colors.inputPlaceholder}
          secureTextEntry
          placeholder="Mot de passe"
          autoCapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          leftIconContainerStyle={{ marginLeft: 0 }}
          leftIcon={<Icon name="lock" type="feather" size={24} color="black" />}
        />
        <Button
          containerStyle={styles.button}
          buttonStyle={{ backgroundColor: colors.buttonBackground }}
          title="Créer un compte"
          onPress={this.handleSignUp}
          loading={this.state.buttonLoading}
          titleStyle={{ color: "white" }}
        />
        <Text
          style={{
            color: colors.text,
            textDecorationLine: "underline"
          }}
          onPress={() => !this.state.buttonLoading && this.props.navigation.navigate("Login")}
        >
          Vous avez déjà un compte ?
        </Text>
      </View>
    )
  }
}

SignUp.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.signUpBackground
  },
  title: {
    margin: 20,
    color: colors.title
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
    backgroundColor: colors.inputBackground
  },
  button: {
    margin: 15
  }
})
