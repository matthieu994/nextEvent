import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import { UserContext } from "../Provider/UserProvider"

export default class UserProfileScreen extends Component {
  static navigationOptions = {
    title: "Mon Profil"
  }

  render() {
    return <View style={styles.container} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

UserProfileScreen.contextType = UserContext
