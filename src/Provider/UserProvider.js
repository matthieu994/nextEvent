import React, { createContext, Component } from "react"
import firebase from "react-native-firebase"

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
    }
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserProvider
