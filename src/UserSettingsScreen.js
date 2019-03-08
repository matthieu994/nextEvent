import React, { Component } from "react"
import { View, Text } from "react-native"
import { DrawerActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"

export default class FriendsListScreen extends Component {
  static navigationOptions = {
    title: "Mes paramètres"
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <Button
          onPress={() => this.props.navigation.navigate("EventsList")}
          title="Voir mes events"
        /> */}
      </View>
    )
  }
}
