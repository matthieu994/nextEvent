import React, { Component } from "react"
import { StyleSheet, View, BackHandler } from "react-native"
import firebase from "react-native-firebase"
import { Button, Icon, Text } from "react-native-elements"
import { colors, bottomContainer } from "../lib"
import { UserContext } from "../Provider/UserProvider"
import { ScrollView } from "react-native-gesture-handler"

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
    this.getSpentList()
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack()
      return true
    })
  }

  getSpentList() {
    firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .get()
      .then(payment => {
        let payments = []
        payment.forEach(doc => {
          payments[doc.id] = doc.data()
        })
        this.setState({ payments })
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
        <Chart event={this.state.event} payments={this.state.payments} />
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

class Chart extends Component {
  renderUsersBalance() {
    return (
      this.props.event.users &&
      this.props.event.users.map(user => <UserBalance key={user} user={user} />)
    )
  }

  render() {
    // console.warn(this.props.payments)
    return (
      <ScrollView style={styles.container}>
        {this.renderUsersBalance()}
      </ScrollView>
    )
  }
}

class UserBalance extends Component {
  render() {
    return (
      <View>
        <Text>{this.props.user}</Text>
      </View>
    )
  }
}

UserBalance.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
