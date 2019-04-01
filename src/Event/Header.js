import React, { Component } from "react"
import firebase from "react-native-firebase"
import { Icon } from "react-native-elements"
import { DrawerActions } from "react-navigation"
import { TouchableOpacity } from "react-native-gesture-handler"
import { UserContext } from "../Provider/UserProvider"

const Header = {
  defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: {
      elevation: 0,
      backgroundColor: "rgb(39, 137, 173)"
    },
    headerLeft: (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate("Main")}
        style={{ padding: 10 }}
      >
        <Icon name="arrow-back" color="rgb(240, 240, 240)" />
      </TouchableOpacity>
    ),
    title: this.contextType,
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() =>
          firebase
            .auth()
            .signOut()
            .then(() => navigation.navigate("Login"))
            .catch(err => console.warn(err))
        }
        style={{ padding: 10 }}
      >
        <Icon
          name="logout-variant"
          type="material-community"
          color="rgb(240, 240, 240)"
        />
      </TouchableOpacity>
    )
  })
}

Header.contextType = UserContext
export default Header
