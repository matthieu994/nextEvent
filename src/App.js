import React from "react"
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation"
import { fromRight } from "react-navigation-transitions"
import { flipX, zoomIn } from "./Modules/react-navigation-transitions"
import defaultSettings from "./Drawer/header"
import Loading from "./Auth/Loading"
import SignUp from "./Auth/SignUp"
import Login from "./Auth/Login"
// import UserProfileScreen from "./Profile/UserProfileScreen"
import EventsListScreen from "./Profile/EventsListScreen"
import CreateEventScreen from "./Event/CreateEventScreen"
import FriendsListScreen from "./Profile/FriendsListScreen"
import UserSettingsScreen from "./Profile/UserSettingsScreen"
import drawerScreen from "./Drawer/drawerScreen"
import UserProvider from "./Provider/UserProvider"

// const UserProfileStack = createStackNavigator(
//   {
//     UserProfile: {
//       screen: UserProfileScreen
//     }
//   },
//   defaultSettings
// )
const EventsListStack = createStackNavigator(
  {
    EventsList: {
      screen: EventsListScreen
    },
    CreateEvent: {
      screen: CreateEventScreen
    }
  },
  {
    defaultNavigationOptions: defaultSettings.defaultNavigationOptions,
    transitionConfig: () => fromRight()
  }
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
    initialRouteName: "EventsList",
    gestureResponseDistance: {
      horizontal: 300
    }
  }
)

const handleCustomTransition = ({ scenes }) => {
  if (!scenes) return zoomIn()
  const prevScene = scenes[scenes.length - 2]
  const nextScene = scenes[scenes.length - 1]
  if (
    prevScene &&
    prevScene.route.routeName == "Login" &&
    nextScene.route.routeName == "SignUp"
  )
    return flipX(800)
  if (
    prevScene &&
    prevScene.route.routeName === "SignUp" &&
    nextScene.route.routeName === "Login"
  )
    return flipX(800)
  return zoomIn()
}

const appStack = createSwitchNavigator(
  {
    Loading: {
      screen: Loading
    },
    SignUp: {
      screen: SignUp
    },
    Login: {
      screen: Login
    },
    Main: {
      screen: drawerNavigator
    }
  },
  {
    initialRouteName: "Loading",
    transitionConfig: nav => handleCustomTransition(nav)
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
