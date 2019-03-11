import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
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
const options = {
  title: "Choisir ma photo de profil",
  takePhotoButtonTitle: "Prendre une photo",
  cancelButtonTitle: "Annuler",
  chooseFromLibraryButtonTitle: "Choisir dans ma Galerie",
  mediaType: "photo",
  cameraType: "front"
}

export default class FriendsListScreen extends Component {
  static navigationOptions = {
    title: "Mes paramètres"
  }

  componentDidMount() {
    this.dropdownAlert = this.context.dropdownAlert
  }

  deleteUser() {
    firebase
      .auth()
      .currentUser.delete()
      .then(() => {
        this.dropdownAlert("success", "Votre compte a été supprimé !", "")
        this.props.navigation.navigate("Loading")
      })
      .catch(error => console.warn(error))
  }

  selectImage() {
    this.props.navigation.setParams({ test: "image" })

    ImagePicker.showImagePicker(options, response => {
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
    this.dropdownAlert("success", "Votre photo a été ajoutée !", "")

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

  deleteProfileImage() {
    if (!this.context.user || !this.context.user.photoURL)
      return this.dropdownAlert(
        "error",
        "Vous n'avez pas de photo de profil !",
        ""
      )

    firebase
      .storage()
      .ref(`${this.context.user.email}/images/profile.jpg`)
      .delete()
      .then(() => {
        firebase
          .auth()
          .currentUser.updateProfile({ photoURL: null })
          .then(() => {
            this.dropdownAlert("success", "Votre photo a été supprimée !", "")
            this.context.updateUser()
          })
      })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={() => this.selectImage()} title="Ajouter une photo" />
        <Button
          buttonStyle={[styles.buttonStyle, { backgroundColor: "red" }]}
          onPress={() => this.deleteProfileImage()}
          title="Supprimer ma photo"
        />
        <Button
          onPress={() => this.deleteUser()}
          title="Supprimer mon compte"
          buttonStyle={[styles.buttonStyle, { backgroundColor: "red" }]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 10
  }
})

FriendsListScreen.contextType = UserContext
