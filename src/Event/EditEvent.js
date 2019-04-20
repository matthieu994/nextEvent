import React, { Component } from "react"
import {
  View,
  DatePickerAndroid,
  TouchableHighlight,
  BackHandler
} from "react-native"
import firebase from "react-native-firebase"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Button, Icon, ListItem, Text, Input } from "react-native-elements"
import { UserContext } from "../Provider/UserProvider"
import { colors, inputContainer } from "../lib"
import { displayDate } from "../lib/functions/tools"
import BottomButton from "../Modules/BottomButton"

export default class EditEvent extends Component {
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
      title: "Modifier un événement"
    }
  }

  render() {
    return null
  }
}

EditEvent.contextType = UserContext
