import React, { Component } from "react"
import { View, TouchableNativeFeedback, StyleSheet } from "react-native"
import firebase from "react-native-firebase"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Button, Icon, ListItem, Text } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import BottomButton from "../Modules/BottomButton"
import { colors } from "../lib"

export default class EventsListScreen extends Component {
  static navigationOptions = () => ({
    title: "Mes événements"
  })

  state = {
    events: []
  }

  renderEvents() {
    if (!this.state.events) return null
    return this.state.events.map(doc => {
      let event = this.state.events.find(e => e.id === doc.id)
      if (event.properties)
        return (
          <SingleEvent
            event={event}
            id={event.id}
            key={event.id}
            navigation={this.props.navigation}
          />
        )
    })
  }

  refresh() {
    this.context.getEvents()
      .then(() => this.setState({ events: this.context.events }))
  }

  componentDidMount() {
    if (this.context.events) this.setState({ events: this.context.events })
  }

  componentWillReceiveProps() {
    if (this.context.events) this.setState({ events: this.context.events })

    if (
      this.context.events &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.delete
    ) {
      this.deleteEvent(this.props.navigation.state.params.delete)
    }

    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.refresh === true
    ) {
      this.refresh()
    }
  }

  deleteEvent(eventId) {
    // let events = this.context.events
    // const index = events.indexOf(eventId)
    // if (index > -1) events.splice(index, 1)
    // this.setState({ events })
    // console.warn(events)
    this.refresh()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          alignItems: "center"
        }}>
          <ScrollView>{this.renderEvents()}</ScrollView>
        </View>
        <BottomButton
          onPress={() => this.props.navigation.navigate("CreateEvent")}
          style={{ alignItems: "flex-start" }}
        />
        <BottomButton
          name="map"
          width={60}
          onPress={() =>
            this.props.navigation.navigate("EventsMap", {
              refreshEvents: () => this.refresh()
            })
          }
        />
      </View>
    )
  }
}

EventsListScreen.contextType = UserContext

class SingleEvent extends Component {
  redirectToEvent() {
    this.props.navigation.setParams({ name: this.props.event.properties.name })
    this.context.setCurrentEvent(this.props.id)
    this.props.navigation.navigate("Event", { eventName: "test" })
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={() => this.redirectToEvent()}
      >
        <View style={styles.singleEventContainer}>
          <View style={styles.nameContainer}>
            <Text h4 style={{ color: "black" }}>
              {this.props.event.properties.name}
            </Text>
            <Text>{this.props.event.properties.description}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {`${this.props.event.properties.date.getDate()}/${this.props.event.properties.date.getMonth() +
                1}/${this.props.event.properties.date.getFullYear()}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

SingleEvent.contextType = UserContext

const styles = StyleSheet.create({
  singleEventContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgb(120, 130, 140)",
    paddingHorizontal: 8,
    paddingBottom: 6,
    flex: 1,
    backgroundColor: "rgb(245, 250, 250)",
    flexDirection: "row",
    alignItems: "center"
  },
  nameContainer: {
    alignItems: "flex-start",
    width: "70%"
    // borderWidth: 1
  },
  dateContainer: {
    alignItems: "flex-end",
    width: "30%"
    // borderWidth: 1
  },
  date: {
    fontSize: 22
  }
})
