import React from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"

export default class Loading extends React.Component {
  componentWillMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "Main" : "SignUp")
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

Loading.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
