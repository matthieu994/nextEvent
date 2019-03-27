import React, { Component } from "react"
import { View, Text, BackHandler } from "react-native"
import firebase from "react-native-firebase"
import { DrawerActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"
import { colors, bottomContainer } from "../lib"
import { UserContext } from "../Provider/UserProvider"

export default class SingleEventScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Événement"
    }
  }

  state = {
    event: {}
  }

  componentDidMount() {
    this.setState({ event: this.context.events[this.context.currentEvent] })
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack()
      return true
    })
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  goBack = async eventId => {
    if (eventId)
      this.props.navigation.navigate("EventsList", { delete: eventId })
    else this.props.navigation.navigate("EventsList")
  }

  isOwner() {
    return this.state.event.owner === this.context.user.email
  }

  deleteEvent() {
    const eventId = this.context.currentEvent

    firebase
      .firestore()
      .collection("events")
      .doc(eventId)
      .delete()
      .then(() => {
        this.context.userRef
          .collection("events")
          .doc(eventId)
          .delete()

        this.state.event.users.forEach(friend => {
          firebase
            .firestore()
            .collection("users")
            .doc(friend)
            .collection("events")
            .doc(eventId)
            .delete()
        })

        this.goBack(eventId)
      })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          onPress={() => this.props.navigation.navigate("PaymentList")}
          title="Voir ma liste de dépense"
        />
        {this.isOwner() && (
          <View style={[bottomContainer]}>
            <Button
              buttonStyle={{ backgroundColor: colors.redButtonBackground }}
              icon={
                <Icon
                  name="delete"
                  type="material-community"
                  size={18}
                  color="white"
                  containerStyle={{ marginRight: 5 }}
                />
              }
              onPress={() => this.deleteEvent()}
              title="Supprimer cet événement"
            />
          </View>
        )}
      </View>
    )
  }
}

SingleEventScreen.contextType = UserContext
