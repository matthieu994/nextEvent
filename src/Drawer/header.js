import React from "react"
import firebase from "react-native-firebase"
import { Icon } from "react-native-elements"
import { DrawerActions } from "react-navigation"

export default {
  defaultNavigationOptions: ({ navigation }) => ({
    headerLeft: (
      <Icon
        containerStyle={{ marginLeft: 10 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        name="menu"
      />
    ),
    headerRight: (
      <Icon
        containerStyle={{ marginRight: 15 }}
        onPress={() =>
          firebase
            .auth()
            .signOut()
            .then(() => navigation.navigate("Login"))
        }
        type="material-community"
        name="logout-variant"
      />
    )
  })
}
