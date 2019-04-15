/* eslint-disable react/no-unused-state */
import React, { createContext, Component, useReducer } from "react"
import firebase from "react-native-firebase"
import { sortObject, checkPermission, notificationTypes } from "../lib"
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
      friends: [],
      setFriend: this.setFriend,
      getFriends: this.getFriends,
      defaultProfileURL: null,
      setPhotoURL: this.setPhotoURL,
      setDefaultProfileImage: this.setDefaultProfileImage,
      dropdownAlert: this.dropdownAlert,
      initProvider: () => this.initProvider(),
      clearState: () => this.clearState(),
      setUserState: obj =>
        this.setState({ user: { ...this.state.user, ...obj } })
    }
  }

  updateToken() {
    checkPermission()
      .then(fcmToken => {
        if (!fcmToken || fcmToken === this.state.user.fcmToken) return
        return this.userRef.update({ fcmToken })
      })
      .catch(err => console.error(err))
  }

  getUserData() {
    // if (!this.state || !this.state.user) return

    return new Promise((resolve, reject) => {
      firebase
        .functions()
        .httpsCallable("getUserData")()
        .then(res => {
          let user = {}
          user.email = firebase.auth().currentUser.email
          Object.assign(user, res.data)
          this.setState(
            {
              user
            },
            this.updateToken
          )
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

  setCurrentEvent = id => this.setState({ currentEvent: id })

  getEvents() {
    return this.userRef
      .collection("events")
      .get()
      .then(async docs => {
        let events = {}
        docs.forEach(doc => {
          events[doc.id] = {}
        })
        return Promise.all(
          Object.keys(events).map(async doc => {
            events[doc] = await this.getEventData(doc)
            return events[doc]
          })
        ).then(() => {
          let sortedEvents = sortObject(events, "date")

          return Promise.all(
            sortedEvents.map(async event => {
              event.properties.users = await this.getEventUsers(event)
            })
          ).then(() => {
            this.setState({
              events: sortedEvents
            })
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
          resolve(doc.data() || [])
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
        Promise.all(
          Object.keys(friends).map(async friendID => {
            await firebase
              .firestore()
              .collection("users")
              .doc(friendID)
              .get()
              .then(friend => {
                const status = friends[friendID]
                friends[friendID] = friend.data()
                friends[friendID].status = status
              })
          })
        ).then(() => {
          this.setState({
            friends
          })
        })
      })
      .catch(err => {
        console.warn("Error getting documents", err)
      })
  }

  async getEventUsers(event) {
    if (!event.properties || !event.properties.users) return []

    const friends = this.state.friends
    let users = {}

    await Promise.all(
      event.properties.users.map(async userID => {
        await firebase
          .firestore()
          .collection("users")
          .doc(userID)
          .get()
          .then(doc => {
            users[userID] = doc.data()
          })
      })
    )

    return users
  }

  setFriend = (email, status) => {
    let friends = this.state.friends
    if (status === "SENT") {
      this.getFriends()
      const message = {
        notification: {
          title: "Nouvelle demande d'ami !",
          body:
            this.state.user.displayName + " vous a envoyé une demande d'ami !"
        },
        data: {
          type: notificationTypes.addUser
        }
      }

      return firebase
        .functions()
        .httpsCallable("sendNotification")({ message, email })
        .catch(err => console.error(err))
    }
    if (status === "DELETE") delete friends[email]
    else friends[email].status = status
    this.setState({ friends })
  }

  setPhotoURL = async photoURL => {
    let user = this.state.user
    user.photoURL = photoURL
    await this.setState({ user })
  }

  setDefaultProfileImage = defaultProfileURL => {
    this.setState({ defaultProfileURL })
  }

  // type: 'info' | 'warn' | 'error' | 'custom' | 'success'
  dropdownAlert = (type, displayType, errorMessage) => {
    this.dropdown.alertWithType(type, displayType, errorMessage)
  }

  clearState() {
    this.setState({
      user: null,
      events: []
    })
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
          safeAreaStyle={{}}
          ref={ref => (this.dropdown = ref)}
          closeInterval={2500}
        />
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserProvider
