import React, { Component } from "react"
import { View, Text, Platform } from "react-native"
import firebase from "react-native-firebase"
import { DrawerActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"
import ImagePicker from "react-native-image-picker"
import RNFetchBlob from "rn-fetch-blob"
import { UserContext } from "./Provider/UserProvider"

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class FriendsListScreen extends Component {
  static navigationOptions = {
    title: "Mes paramètres"
  }

  selectImage() {
    this.props.navigation.setParams({ test: "image" })

    ImagePicker.showImagePicker(response => {
      if (!response.didCancel && !response.error) {
        this.uploadImage(response.uri)
          .then(url => {
            firebase
              .auth()
              .currentUser.updateProfile({ photoURL: url })
              .then(() => {
                this.context.setUser(firebase.auth().currentUser)
              })
          })
          .catch(error => console.warn(error))
      }
    })
  }

  uploadImage(uri, mime = "application/octet-stream") {
    const user = firebase.auth().currentUser

    return new Promise((resolve, reject) => {
      const imageRef = firebase
        .storage()
        .ref(`${user.email}/images/`)
        .child("profile.jpg")

      return imageRef
        .put(uri, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL()
        })
        .then(url => {
          resolve(url)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={() => this.selectImage()} title="Ajouter une photo" />
      </View>
    )
  }
}

FriendsListScreen.contextType = UserContext
