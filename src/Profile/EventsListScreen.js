import React, { Component } from "react"
import { View, TouchableNativeFeedback, StyleSheet } from "react-native"
import firebase from "react-native-firebase"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Button, Icon, ListItem, Text } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors } from "../lib"

export default class EventsListScreen extends Component {
  static navigationOptions = () => ({
    title: "Mes événements"
  })

  renderEvents() {
    if (!this.context.events) return null
    return Object.keys(this.context.events).map(doc => {
      return (
        <SingleEvent
          event={this.context.events[doc]}
          id={doc}
          key={doc}
          navigation={this.props.navigation}
        />
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

class SingleEvent extends Component {
  redirectToEvent() {
    this.props.navigation.navigate("SingleEvent", {
      event: this.props.event,
      id: this.props.id
    })
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={() => this.redirectToEvent()}
      >
        <View style={styles.singleEventContainer}>
          <View style={{ width: "68%", marginRight: 5 }}>
            <Text h3 h3Style={{ color: "black" }}>
              {this.props.event.name}
            </Text>
            <Text>{this.props.event.description}</Text>
          </View>
          <View
            style={{
              margin: 0
            }}
          >
            <Text
              h4
            >{`${this.props.event.date.getDate()}/${this.props.event.date.getMonth()}/${this.props.event.date.getFullYear()}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  singleEventContainer: {
    borderBottomWidth: 0.75,
    borderBottomColor: "rgb(120, 130, 140)",
    paddingHorizontal: 9,
    paddingBottom: 6,
    width: "100%",
    backgroundColor: "rgb(245, 250, 250)",
    flexDirection: "row",
    alignItems: "baseline"
  }
})

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
