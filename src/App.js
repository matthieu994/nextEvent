import React, { Component } from "react"
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createMaterialTopTabNavigator
} from "react-navigation"
import { fromRight } from "react-navigation-transitions"
import { flipX, zoomIn } from "./Modules/react-navigation-transitions"
import defaultSettings from "./Drawer/header"
import Loading from "./Auth/Loading"
import SignUp from "./Auth/SignUp"
import Login from "./Auth/Login"
import drawerScreen from "./Drawer/drawerScreen"
import EventsListScreen from "./Profile/EventsListScreen"
import FriendsListScreen from "./Profile/FriendsListScreen"
import UserSettingsScreen from "./Profile/UserSettingsScreen"
import EventHeader from "./Event/Header"
import CreateEventScreen from "./Event/CreateEventScreen"
import SingleEventScreen from "./Event/SingleEventScreen"
import PaymentListScreen from "./Event/PaymentListScreen"
import ModifyPayment from "./Event/ModifyPayment"
import CreatePayment from "./Event/CreatePayment"
import UserProvider from "./Provider/UserProvider"

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

const PaymentStack = createStackNavigator(
  {
    PaymentList: {
      screen: PaymentListScreen
    },
    ModifyPayment,
    CreatePayment
  },
  {
    headerMode: "none"
  }
)

const EventTabNavigator = createMaterialTopTabNavigator(
  {
    SingleEvent: {
      screen: SingleEventScreen
    },
    PaymentStack: {
      screen: PaymentStack,
      navigationOptions: {
        tabBarLabel: "Dépenses"
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: "rgb(39, 137, 173)"
      },
      indicatorStyle: {
        backgroundColor: "rgb(88, 221, 195)"
      }
    }
  }
)

const EventStackTabNavigator = createStackNavigator(
  {
    EventTabNavigator
  },
  {
    headerMode: "screen",
    defaultNavigationOptions: EventHeader.defaultNavigationOptions
  }
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

const LoginSwitch = createSwitchNavigator(
  {
    Loading: {
      screen: Loading
    },
    SignUp: {
      screen: SignUp
    },
    Login: {
      screen: Login
    }
  },
  {
    initialRouteName: "Loading"
  }
)

const appStack = createSwitchNavigator(
  {
    LoginSwitch: {
      screen: LoginSwitch
    },
    Main: {
      screen: drawerNavigator
    },
    Event: {
      screen: EventStackTabNavigator
    }
  },
  {
    initialRouteName: "LoginSwitch",
    transitionConfig: nav => handleCustomTransition(nav)
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
