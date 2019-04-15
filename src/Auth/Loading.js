import React from "react"
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"

export default class Loading extends React.Component {
  componentWillMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.context.clearState()
        this.props.navigation.navigate("Login")
      } else {
        this.context
          .initProvider()
          .then(() => this.props.navigation.navigate("Main"))
          .catch(err => console.warn(err))
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text h3>Chargement</Text>
        <ActivityIndicator size="large"/>
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
