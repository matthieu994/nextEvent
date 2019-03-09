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

  componentDidMount() {
    firebase
      .storage()
      .ref("default_profile.png")
      .getDownloadURL()
      .then(url => {
        this.setState({ defaultProfileImage: url })
      })
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
