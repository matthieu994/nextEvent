import React, { Component } from "react"
import { View, DatePickerAndroid, Keyboard } from "react-native"
import firebase from "react-native-firebase"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Button, Icon, Text, Input } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors, inputContainer } from "../lib"
import { displayDate } from "../lib/functions/tools"
import FriendsList from "../Modules/FriendsList"

export default class EditEvent extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        >
          <Icon name="arrow-back" color="rgb(240, 240, 240)"/>
        </TouchableOpacity>
      ),
      headerRight: null,
      title: "Modifier un événement"
    }
  }

  constructor(props, context) {
    super(props, context)
    let event = {}
    Object.assign(event, this.context.events.find(e => e.id === this.context.currentEvent))
    event = event.properties
    let { [this.context.user.email]: currentUser, ...rest } = event.users

    event.users = rest

    const date = new Date(event.date),
      now = new Date()
    let displayCalendar = true,
      selectedFriends = Object.keys(event.users)

    if (date.getFullYear() < now.getFullYear() ||
      date.getMonth() < now.getMonth() ||
      date.getDate() < now.getDate())
      displayCalendar = false

    this.state = {
      name: event.name,
      desc: event.description,
      date,
      displayCalendar,
      coords: event.coords,
      loading: false,
      users: event.users,
      selectedFriends,
      owner: event.owner
    }
  }

  componentWillMount(): void {
    if (this.context.user.email !== this.state.owner) {
      this.setState({ displayPage: false })
      this.context.dropdownAlert('error', 'Erreur', 'Vous ne pouvez pas modifier Cet événement !')
      return this.props.navigation.goBack()
    }
    this.setState({ displayPage: true })
  }

  async datePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date()
      })
      if (action !== DatePickerAndroid.dismissedAction)
        this.setState({ date: new Date(year, month, day) })
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message)
    }
  }

  modifyEvent() {
    if (!this.state.name)
      return this.context.dropdownAlert(
        "error",
        "Erreur",
        "Le nom ne peut pas être vide."
      )

    let obj = {
      name: this.state.name,
      description: this.state.desc,
      date: this.state.date,
      users: [...this.state.selectedFriends, this.context.user.email],
      coords: new firebase.firestore.GeoPoint(
        this.state.coords.latitude,
        this.state.coords.longitude
      )
    }

    const callback = () => firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .update(obj)
      .then(() => Object.keys(this.state.users)
        .forEach(async index => {
          if (this.state.selectedFriends.includes(index))
            return

          await firebase
            .firestore()
            .collection(`users/${index}/events`)
            .doc(this.context.currentEvent)
            .delete()
            .catch(err => Promise.reject(err))
        })
      )
      .then(() => this.state.selectedFriends.forEach(async user => {
        if (this.state.users[user])
          return

        await firebase
          .firestore()
          .collection(`users/${user}/events`)
          .doc(this.context.currentEvent)
          .set()
          .catch(err => Promise.reject(err))
      }))
      .then(() =>
        this.setState({ loading: false },
          () => this.props.navigation.navigate("EventsList", { refresh: true })
        )
      )
      .catch(err => {
        this.setState({ loading: false })
        this.context.dropdownAlert("error", "Erreur", "Une erreur est survenue")
        console.warn(err)
      })

    Keyboard.dismiss()
    this.setState({ loading: true }, callback)
  }

  selectFriend = friend => {
    let selectedFriends = this.state.selectedFriends

    if (selectedFriends.includes(friend))
      selectedFriends.splice(selectedFriends.indexOf(friend), 1)
    else
      selectedFriends.push(friend)

    this.setState({ selectedFriends })
  }

  render() {
    return !this.state.displayPage ? null :
      (
        <View style={{
          flex: 1,
          alignItems: 'center'
        }}>
          <Input
            placeholder="nom"
            placeholderTextColor={colors.inputPlaceholder}
            inputContainerStyle={[
              inputContainer,
              {
                backgroundColor: colors.clearInputBackground,
                marginTop: 8
              }
            ]}
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
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
            placeholderTextColor={colors.inputPlaceholder}
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
          <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            {this.state.displayCalendar && <Button
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
            />}
            <Text style={{ fontSize: 18 }}>
              {displayDate(this.state.date, "dddd D MMMM YYYY")}
            </Text>
          </View>
          <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Button
              containerStyle={{
                marginBottom: 10,
                marginTop: 2
              }}
              onPress={() => this.props.navigation.navigate("MapPicker", {
                name: this.state.name,
                setCoords: coords => this.setState({ coords }),
                route: () => this.props.navigation.navigate("EditEvent")
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
                containerStyle={{
                  margin: 5,
                  marginBottom: 16
                }}
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
            <View style={{
              flexDirection: "row",
              flexWrap: "wrap"
            }}>
              <FriendsList
                friends={{ ...this.state.users, ...this.context.friends }}
                defaultProfileURL={this.context.defaultProfileURL}
                selectFriend={this.selectFriend}
                selectedFriends={this.state.selectedFriends}
                edit={true}
              />
            </View>
          </ScrollView>
          <Button
            inputStyle={{ color: colors.inputStyle }}
            containerStyle={{ margin: 10 }}
            inputContainerStyle={inputContainer}
            onPress={() => !this.state.loading && this.modifyEvent()}
            title="Modifier"
            loading={this.state.loading}
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

EditEvent.contextType = UserContext
