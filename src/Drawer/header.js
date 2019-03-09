import React from "react"
import firebase from "react-native-firebase"
import { Icon } from "react-native-elements"
import { DrawerActions } from "react-navigation"

export default {
  defaultNavigationOptions: ({ navigation }) => ({
    headerLeft: (
      <Icon
        name="menu"
        containerStyle={{ marginLeft: 10, borderRadius: 10 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        underlayColor="rgb(240, 240, 240)"
      />
    ),
    headerRight: (
      <Icon
        name="logout-variant"
        type="material-community"
        underlayColor="rgb(240, 240, 240)"
        containerStyle={{ marginRight: 15, borderRadius: 10 }}
        onPress={() =>
          firebase
            .auth()
            .signOut()
            .then(() => navigation.navigate("Login"))
        }
      />
    )
  })
}
