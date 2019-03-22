import React, { Component } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import firebase from "react-native-firebase"
import { Button, Icon, ListItem } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors } from "../lib"

export default class EventsListScreen extends Component {
  static navigationOptions = () => ({
    title: "Mes événements"
  })

  renderEvents() {
    if (!this.context.events) return null
    // console.warn(this.context.events)
    return Object.keys(this.context.events).map((event, index) => {
      return (
        <ListItem
          key={index}
          title={event}
          containerStyle={{
            paddingHorizontal: 9,
            paddingVertical: 4,
            width: "100%",
            backgroundColor: "rgb(220, 230, 240)"
          }}
        />
      )
    })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {this.renderEvents()}
        <BottomButton
          onPress={() => this.props.navigation.navigate("CreateEvent")}
        />
      </View>
    )
  }
}

EventsListScreen.contextType = UserContext

class BottomButton extends Component {
  render() {
    return (
      <View
        style={{
          margin: 20,
          position: "absolute",
          bottom: 0,
          right: 0,
          borderRadius: 40,
          overflow: "hidden",
          elevation: 2
        }}
      >
        <Button
          buttonStyle={{
            backgroundColor: "rgb(81, 127, 164)",
            borderRadius: 40,
            width: 62,
            height: 62
          }}
          background={TouchableNativeFeedback.Ripple("ThemeAttrAndroid", true)}
          onPress={this.props.onPress}
          raised
          icon={
            <Icon
              name="plus"
              type="material-community"
              size={30}
              color="white"
            />
          }
        />
      </View>
    )
  }
}
