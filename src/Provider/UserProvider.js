/* eslint-disable react/no-unused-state */
import React, { createContext, Component } from "react"
import firebase from "react-native-firebase"
import DropdownAlert from "react-native-dropdownalert"

export const UserContext = createContext({
  user: firebase.auth().currentUser
})

class UserProvider extends Component {
  getUserData = () => {
    if (!this.state || !this.state.user) return

    firebase
      .functions()
      .httpsCallable("getUserData")()
      .then(res => {
        this.setState({
          photoURL: res.data.photoURL,
          friends: res.data.friends
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  setPhotoURL = photoURL => {
    this.setState({ photoURL })
  }

  updateUser = () => {
    this.setState({ user: firebase.auth().currentUser })
  }

  dropdownAlert = (type, displayType, errorMessage) => {
    this.dropdown.alertWithType(type, displayType, errorMessage)
  }

  componentDidMount() {
    this.state.getUserData()
  }

  state = {
    user: firebase.auth().currentUser,
    photoURL: null,
    setPhotoURL: this.setPhotoURL,
    updateUser: this.updateUser,
    getUserData: this.getUserData,
    dropdownAlert: this.dropdownAlert
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
