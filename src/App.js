import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation"
import defaultSettings from "./Drawer/header"
import Loading from "./Loading"
import SignUp from "./SignUp"
import Login from "./Login"
import EventsListScreen from "./EventsListScreen"
import FriendsListScreen from "./FriendsListScreen"
import UserSettingsScreen from "./UserSettingsScreen"
import drawerScreen from "./Drawer/drawerScreen"

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
      navigationOptions: { drawerLabel: "Mes événements" }
    },
    FriendsList: {
      screen: FriendsListStack,
      navigationOptions: { drawerLabel: "Mes amis" }
    },
    UserSettings: {
      screen: UserSettingsStack,
      navigationOptions: { drawerLabel: "Paramètres" }
    }
  },
  { contentComponent: drawerScreen }
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

const App = createAppContainer(appStack)

export default App
