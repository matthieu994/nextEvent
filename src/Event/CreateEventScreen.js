import React, { Component } from "react"
import { View, DatePickerAndroid } from "react-native"
import firebase from "react-native-firebase"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Icon, Text, Input } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors, inputContainer } from "../lib"
import { displayDate } from "../lib/functions/tools"
import BottomButton from "../Modules/BottomButton"
import FriendsList from "../Modules/FriendsList"

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
    selectedFriends: [],
    coords: { latitude: null, longitude: null }
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
        owner: this.context.user.email,
        coords: new firebase.firestore.GeoPoint(
          this.state.coords.latitude,
          this.state.coords.longitude
        )
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

  setCoords = coords => {
    this.setState({ coords })
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            containerStyle={{ marginBottom: 10, marginTop: 2 }}
            onPress={() =>
              this.props.navigation.navigate("MapPicker", {
                name: this.state.name,
                setCoords: this.setCoords
              })
            }
            title="Définir la localisation"
            icon={
              <Icon
                containerStyle={{ marginRight: 5 }}
                name="map"
                type="material-community"
                size={24}
                color="white"
              />
            }
          />
          {this.state.coords.latitude && (
            <Icon
              containerStyle={{ margin: 5, marginBottom: 16 }}
              name="check"
              type="material-community"
              size={24}
              color="green"
            />
          )}
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
