import React, { Component } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import firebase from "react-native-firebase"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Icon, ListItem, Text } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors } from "../lib"

export default class EventsListScreen extends Component {
  static navigationOptions = () => ({
    title: "Mes événements"
  })

  renderEvents() {
    if (!this.context.events) return null
    return Object.keys(this.context.events).map((doc, index) => {
      const event = this.context.events[doc]
      return (
        <View
          key={index}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "rgb(120, 130, 140)",
            paddingHorizontal: 9,
            paddingVertical: 4,
            width: "100%",
            backgroundColor: "rgb(220, 230, 240)"
          }}
        >
          <Text h3>{event.name}</Text>
          <Text h4>{event.description}</Text>
          <Text
            h4
          >{`${event.date.getDate()}/${event.date.getMonth()}/${event.date.getFullYear()}`}</Text>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, width: "100%" }}>
          {this.renderEvents()}
        </ScrollView>
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
