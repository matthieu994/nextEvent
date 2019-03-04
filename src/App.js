import { createSwitchNavigator, createAppContainer } from "react-navigation"

// import the different screens
import Loading from "./Loading"
import SignUp from "./SignUp"
import Login from "./Login"
import Main from "./Main"

// create our app's navigation stack
const AuthStack = createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main
  },
  {
    initialRouteName: "Loading"
  }
)

const App = createAppContainer(AuthStack)

export default App
