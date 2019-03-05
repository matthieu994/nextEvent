import React from "react"
import { StyleSheet, Platform, Image, Text, View } from "react-native"
import firebase from "react-native-firebase"
import { Button } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"

export default class Main extends React.Component {
  state = { currentUser: null }

  componentDidMount() {
    const { currentUser } = firebase.auth()

    this.setState({ currentUser })
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => this.props.navigation.navigate("Login"))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    const { currentUser } = this.state

    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          buttonStyle={{ backgroundColor: "red", margin: 20 }}
          iconRight
          title="Logout"
          onPress={() => this.handleLogout()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
