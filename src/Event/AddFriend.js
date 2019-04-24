import React, { Component } from "react"
import { View, BackHandler } from "react-native"
import { Text, Icon, Button } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import { UserContext } from "../Provider/UserProvider"
import { FriendsList } from "./CreateEventScreen"
import BottomButton from "../Modules/BottomButton"
import { colors, bottomContainer } from "../lib"
import firebase from "react-native-firebase"

export default class AddFriend extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        >
          <Icon name="arrow-back" color="rgb(240, 240, 240)" />
        </TouchableOpacity>
      ),
      headerRight: null,
      title: "Ajouter un ami"
    }
  }

  state = {
    selectedFriends: [],
    friendsNotInEvent: []
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack()
      return true
    })
    const usersInEvent = this.context.events.find(
      event => event.id === this.context.currentEvent
    ).properties.users

    let friendsNotInEvent = []
    Object.keys(this.context.friends).forEach(friend => {
      if (!usersInEvent[friend])
        friendsNotInEvent[friend] = this.context.friends[friend]
    })
    this.setState({ friendsNotInEvent })
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  selectFriend = friend => {
    let selectedFriends = this.state.selectedFriends

    if (selectedFriends.includes(friend)) {
      selectedFriends.splice(selectedFriends.indexOf(friend), 1)
    } else {
      selectedFriends.push(friend)
    }

    this.setState({
      selectedFriends
    })
  }

  addToEvent() {
    this.state.selectedFriends.forEach(friend => {
      firebase
        .firestore()
        .collection("events")
        .doc(this.context.currentEvent)
        .update({
          users: firebase.firestore.FieldValue.arrayUnion(friend)
        })
        .then(() => {
          firebase
            .firestore()
            .collection("users")
            .doc(friend)
            .collection("events")
            .doc(this.context.currentEvent)
            .set()
        })
    })
    this.context.getEvents()
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FriendsList
          friends={this.state.friendsNotInEvent}
          defaultProfileURL={this.context.defaultProfileURL}
          selectFriend={this.selectFriend}
          selectedFriends={this.state.selectedFriends}
        />
        <BottomButton
          title="Ajouter à l'événement"
          width="auto"
          style={{ alignItems: "center" }}
          onPress={() => {
            this.addToEvent()
          }}
        />
      </View>
    )
  }
}

AddFriend.contextType = UserContext
