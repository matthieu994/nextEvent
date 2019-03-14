/* eslint-disable react/no-unused-state */
import React, { createContext, Component, useReducer } from "react"
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
        res.data.email = firebase.auth().currentUser.email
        this.setState({
          user: res.data
        })
        this.getFriends()
      })
      .catch(error => {
        console.log(error)
      })
  }

  getFriends = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user.email)
      .collection("friends")
      .get()
      .then(docs => {
        let friends = {}
        docs.forEach(doc => {
          friends[doc.id] = doc.data().status
        })
        let user = this.state.user
        user.friends = friends
        this.setState({
          user
        })
      })
      .catch(err => {
        console.warn("Error getting documents", err)
      })
  }

  setFriend = (email, status) => {
    let user = this.state.user
    let friends = this.state.user.friends
    friends[email] = status
    user.friends = friends
    this.setState({ user })
  }

  setPhotoURL = photoURL => {
    let user = this.state.user
    user.photoURL = photoURL
    this.setState({ user })
  }

  setDefaultProfileImage = defaultProfileURL => {
    this.setState({ defaultProfileURL })
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
    defaultProfileURL: null,
    setPhotoURL: this.setPhotoURL,
    setDefaultProfileImage: this.setDefaultProfileImage,
    updateUser: this.updateUser,
    getUserData: this.getUserData,
    setFriend: this.setFriend,
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
