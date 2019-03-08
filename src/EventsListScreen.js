import React, { Component } from "react"
import { View, Text } from "react-native"
import { DrawerActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"

export default class EventsListScreen extends Component {
  static navigationOptions = {
    title: "Mes événements"
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <Button
          onPress={() =>
            this.props.navigation.dispatch(DrawerActions.toggleDrawer())
          }
          title="Voir mes amis"
        /> */}
      </View>
    )
  }
}
