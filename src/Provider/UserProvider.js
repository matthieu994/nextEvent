/* eslint-disable react/no-unused-state */
import React, { createContext, Component, useReducer } from "react"
import firebase from "react-native-firebase"
import DropdownAlert from "react-native-dropdownalert"

export const UserContext = createContext()

class UserProvider extends Component {
  constructor() {
    super()

    this.state = {
      user: {},
      userRef: this.userRef,
      events: [],
      currentEvent: null,
      setCurrentEvent: this.setCurrentEvent,
      getEvents: () => this.getEvents(),
      defaultProfileURL: null,
      setPhotoURL: this.setPhotoURL,
      setDefaultProfileImage: this.setDefaultProfileImage,
      setFriend: this.setFriend,
      getFriends: this.getFriends,
      dropdownAlert: this.dropdownAlert,
      initProvider: () => this.initProvider(),
      clearState: () => this.clearState(),
      setUserState: obj => this.setState({user: {...this.state.user, ...obj}})
    }
  }

  getUserData() {
    // if (!this.state || !this.state.user) return

    return new Promise((resolve, reject) => {
      firebase
        .functions()
        .httpsCallable("getUserData")()
        .then(res => {
          let user = {}
          user.photoURL = firebase.auth().currentUser.photoURL
          user.email = firebase.auth().currentUser.email
          Object.assign(user, res.data)
          this.setState({
            user
          })
          this.getFriends()
          this.getEvents()
          resolve(user)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  }

  setCurrentEvent = id => {
    this.setState({ currentEvent: id })
  }

  getEvents() {
    return this.userRef
      .collection("events")
      .get()
      .then(async docs => {
        let events = {}
        docs.forEach(doc => {
          events[doc.id] = {}
        })
        Promise.all(
          Object.keys(events).map(async doc => {
            events[doc] = await this.getEventData(doc)
            return events[doc]
          })
        ).then(() => {
          const sortedEvents = Object.keys(events)
            .sort((a, b) => new Date(events[a].date) < new Date(events[b].date))
            .reduce(
              (_sortedObj, key) => ({
                ..._sortedObj,
                [key]: events[key]
              }),
              {}
            )
          this.setState({
            events: sortedEvents
          })
        })
      })
      .catch(err => {
        console.warn(err)
      })
  }

  getEventData(id) {
    return new Promise(resolve => {
      firebase
        .firestore()
        .collection("events")
        .doc(id)
        .get()
        .then(doc => {
          resolve(doc.data())
        })
    })
  }

  getFriends = () => {
    return this.userRef
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
    if (status === "DELETE") delete friends[email]
    else friends[email] = status
    user.friends = friends
    this.setState({ user })
  }

  setPhotoURL = async photoURL => {
    let user = this.state.user
    user.photoURL = photoURL
    await this.setState({ user })
  }

  setDefaultProfileImage = defaultProfileURL => {
    this.setState({ defaultProfileURL })
  }

  dropdownAlert = (type, displayType, errorMessage) => {
    this.dropdown.alertWithType(type, displayType, errorMessage)
  }

  clearState() {
    this.setState({ user: null, events: [] })
  }

  initProvider() {
    this.userRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.email)

    this.setState({ userRef: this.userRef })

    return this.getUserData()
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
