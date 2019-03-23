import React, { Component } from "react"
import { View, Text, BackHandler } from "react-native"
import firebase from "react-native-firebase"
import { DrawerActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"
import { colors } from "../lib"

export default class SingleEventScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Événement"
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack()
      return true
    })
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  goBack = async () => {
    this.props.navigation.navigate("EventsList")
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          onPress={() => this.props.navigation.navigate("PaymentList")}
          title="Voir ma liste de dépense"
        />
      </View>
    )
  }
}
