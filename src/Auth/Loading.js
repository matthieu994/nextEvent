import React from "react"
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  AppState
} from "react-native"
import firebase from "react-native-firebase"

export default class Loading extends React.Component {
  componentWillMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "Main" : "Login")
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
