import React, { Component } from "react"
import {
  View,
  DatePickerAndroid,
  TouchableHighlight,
  BackHandler
} from "react-native"
import firebase from "react-native-firebase"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Icon, ListItem, Text, Input } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors, inputContainer } from "../lib"
import { displayDate } from "../lib/functions/tools"

export default class CreateEventScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Icon
          name="arrow-left"
          type="feather"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginLeft: 10, borderRadius: 10 }}
          underlayColor="rgb(240, 240, 240)"
        />
      ),
      headerRight: null,
      title: "Créer un événement"
    }
  }

  state = {
    name: "",
    desc: "",
    date: new Date(),
    selectedFriends: []
  }

  async datePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date()
      })
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ date: new Date(year, month, day) })
      } else {
        this.setState({ date: new Date() })
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message)
    }
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

  createEvent() {
    if (!this.state.name)
      return this.context.dropdownAlert(
        "error",
        "Erreur",
        "Le nom ne peut pas être vide."
      )

    let users = this.state.selectedFriends
    users.push(this.context.user.email)

    firebase
      .firestore()
      .collection("events")
      .add({
        name: this.state.name,
        description: this.state.desc,
        date: this.state.date,
        users,
        owner: this.context.user.email
      })
      .then(event => {
        this.context.userRef
          .collection("events")
          .doc(event.id)
          .set()

        this.state.selectedFriends.forEach(friend => {
          firebase
            .firestore()
            .collection("users")
            .doc(friend)
            .collection("events")
            .doc(event.id)
            .set()
        })

        this.context.getEvents()

        this.props.navigation.navigate("EventsList", { refresh: true })
      })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Input
          inputStyle={{ color: colors.inputStyle }}
          placeholderTextColor="#62717E"
          inputContainerStyle={[
            inputContainer,
            { backgroundColor: colors.clearInputBackground, marginTop: 8 }
          ]}
          placeholder="Nom"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
          leftIconContainerStyle={{ marginLeft: 0 }}
          leftIcon={
            <Icon
              name="pencil"
              type="material-community"
              size={24}
              color="black"
            />
          }
        />
        <Input
          multiline
          numberOfLines={2}
          inputStyle={{ color: colors.inputStyle }}
          placeholderTextColor="#62717E"
          inputContainerStyle={[
            inputContainer,
            { backgroundColor: colors.clearInputBackground }
          ]}
          placeholder="Description"
          onChangeText={desc => this.setState({ desc })}
          value={this.state.desc}
          leftIconContainerStyle={{ marginLeft: 0 }}
          leftIcon={
            <Icon
              name="text"
              type="material-community"
              size={24}
              color="black"
            />
          }
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            inputStyle={{ color: colors.inputStyle }}
            containerStyle={{ margin: 10 }}
            inputContainerStyle={inputContainer}
            onPress={() => this.datePicker()}
            title="Changer la date"
            icon={
              <Icon
                containerStyle={{ marginRight: 5 }}
                name="calendar"
                type="material-community"
                size={24}
                color="white"
              />
            }
          />
          <Text style={{ fontSize: 18 }}>
            {displayDate(this.state.date, "dddd D MMMM YYYY")}
          </Text>
        </View>
        <ScrollView
          style={{
            width: "100%"
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <FriendsList
              friends={this.context.friends}
              defaultProfileURL={this.context.defaultProfileURL}
              selectFriend={this.selectFriend}
              selectedFriends={this.state.selectedFriends}
            />
          </View>
        </ScrollView>
        <Button
          inputStyle={{ color: colors.inputStyle }}
          containerStyle={{ margin: 10 }}
          inputContainerStyle={inputContainer}
          onPress={() => this.createEvent()}
          title="Créer"
          icon={
            <Icon
              containerStyle={{ marginRight: 5 }}
              name="check"
              type="material-community"
              size={24}
              color="white"
            />
          }
        />
      </View>
    )
  }
}

CreateEventScreen.contextType = UserContext

class FriendsList extends Component {
  render() {
    return Object.keys(this.props.friends).map((friend, index) => {
      if (this.props.friends[friend].status != "OK") return null
      const selected = this.props.selectedFriends.includes(friend)
      return (
        <View key={index} style={{ width: "50%" }}>
          <TouchableHighlight
            activeOpacity={0.9}
            onPress={() => this.props.selectFriend(friend)}
          >
            <ListItem
              key={index}
              title={friend}
              containerStyle={[
                {
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderWidth: 0.5,
                  borderColor: "rgba(150, 150, 160, 0.5)",
                  backgroundColor: "rgb(242, 245, 250)"
                },
                selected && {
                  backgroundColor: "rgb(210, 215, 230)",
                  elevation: 1
                }
              ]}
              leftAvatar={{
                rounded: true,
                size: 35,
                source: {
                  uri:
                    this.props.friends[friend].photoURL ||
                    this.props.defaultProfileURL
                }
              }}
            />
          </TouchableHighlight>
        </View>
      )
    })
  }
}
