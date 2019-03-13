import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation"
import React from "react"
import defaultSettings from "./Drawer/header"
import Loading from "./Auth/Loading"
import SignUp from "./Auth/SignUp"
import Login from "./Auth/Login"
import EventsListScreen from "./EventsListScreen"
import FriendsListScreen from "./FriendsListScreen"
import UserSettingsScreen from "./UserSettingsScreen"
import drawerScreen from "./Drawer/drawerScreen"
import UserProvider from "./Provider/UserProvider"

const EventsListStack = createStackNavigator(
  {
    EventsList: {
      screen: EventsListScreen
    }
  },
  defaultSettings
)
const FriendsListStack = createStackNavigator(
  {
    FriendsList: {
      screen: FriendsListScreen
    }
  },
  defaultSettings
)
const UserSettingsStack = createStackNavigator(
  {
    UserSettings: {
      screen: UserSettingsScreen
    }
  },
  defaultSettings
)

const drawerNavigator = createDrawerNavigator(
  {
    EventsList: {
      screen: EventsListStack,
      navigationOptions: { drawerLabel: "Événements" }
    },
    FriendsList: {
      screen: FriendsListStack,
      navigationOptions: { drawerLabel: "Amis" }
    },
    UserSettings: {
      screen: UserSettingsStack,
      navigationOptions: { drawerLabel: "Paramètres" }
    }
  },
  {
    contentComponent: drawerScreen,
    initialRouteName: "UserSettings",
    gestureResponseDistance: {
      horizontal: 200
    }
  }
)

// create our app's navigation stack
const appStack = createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main: drawerNavigator
  },
  {
    initialRouteName: "Loading"
  }
)

const AppContainer = createAppContainer(appStack)

class App extends React.Component {
  render() {
    return (
      <UserProvider>
        <AppContainer />
      </UserProvider>
    )
  }
}

export default App
