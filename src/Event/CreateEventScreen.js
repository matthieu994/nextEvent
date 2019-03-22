import React, { Component } from "react"
import { View, DatePickerAndroid } from "react-native"
import firebase from "react-native-firebase"
import { Button, Icon, ListItem, Text, Input } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors, inputContainer } from "../lib"

export default class CreateEventScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Icon
        name="arrow-left"
        type="feather"
        onPress={() => navigation.goBack()}
        containerStyle={{ marginLeft: 10, borderRadius: 10 }}
        underlayColor="rgb(240, 240, 240)"
      />
    ),
    headerRight: null
  })

  state = {
    name: "",
    desc: "",
    friends: [],
    date: new Date()
  }

  async datePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date()
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

  getDate() {
    return `${this.state.date.getDate()}/${this.state.date.getMonth()}/${this.state.date.getFullYear()}`
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
          <Text>{this.getDate()}</Text>
          <Button
            inputStyle={{ color: colors.inputStyle }}
            inputContainerStyle={inputContainer}
            onPress={() => this.datePicker()}
            title="Changer la date"
          />
        </View>
      </View>
    )
  }
}

CreateEventScreen.contextType = UserContext
