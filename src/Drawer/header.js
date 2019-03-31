import React from "react"
import firebase from "react-native-firebase"
import { Icon } from "react-native-elements"
import { DrawerActions } from "react-navigation"
import { TouchableOpacity } from "react-native-gesture-handler"

export default {
  defaultNavigationOptions: ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ padding: 10 }}
      >
        <Icon name="menu" underlayColor="rgb(240, 240, 240)" />
      </TouchableOpacity>
    ),
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
          underlayColor="rgb(240, 240, 240)"
          containerStyle={{ marginRight: 15 }}
        />
      </TouchableOpacity>
    )
  })
}
