import React, { createContext, Component } from "react"
import firebase from "react-native-firebase"
import DropdownAlert from "react-native-dropdownalert"

export const UserContext = createContext({
  user: "",
  setUser: () => {}
})

class UserProvider extends Component {
  state = {
    user: firebase.auth().currentUser,
    setUser: user => {
      this.setState({ user })
    },
    updateUser: () => {
      firebase.auth().onAuthStateChanged(user => {
        this.state.setUser(user)
      })
    },
    dropdownAlert: (type, displayType, errorMessage) => {
      this.dropdown.alertWithType(type, displayType, errorMessage)
    }
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          closeInterval={2500}
        />
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserProvider
