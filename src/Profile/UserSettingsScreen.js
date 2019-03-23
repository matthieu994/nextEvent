import React, {Component} from "react"
import {View, StyleSheet} from "react-native"
import firebase from "react-native-firebase"
import {Button, Icon} from "react-native-elements"
import ImagePicker from "react-native-image-picker"
import RNFetchBlob from "rn-fetch-blob"
import {UserContext} from "../Provider/UserProvider"
import {MyOverlay, types, basicOverlay, colors, checkAccountDeleteCredentials} from '../lib'

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

export default class UserSettingsScreen extends Component {
  state = {
    visibleOverlay: false
  }

  overlay = basicOverlay

  static navigationOptions = {
    title: "Mes paramètres"
  }

  componentDidMount() {
    this.dropdownAlert = this.context.dropdownAlert
  }

  toggleOverlay(component) {
    switch (component) {
      case types.DELETEUSER:
        this.overlay = {
          ...this.overlay,
          text: "Confirmation de suppression",
          action: (password, next) => this.deleteUser(password, next),
          secureTextEntry: true,
          inputPlaceholder: "Mot de passe",
          buttonTitle: "Supprimer mon compte"
        }
        break
      default:
        this.overlay = basicOverlay
        break
    }

    this.setState({ visibleOverlay: true })
  }

  deleteUser(password, next) {
    if(!checkAccountDeleteCredentials(password, next))
      return

    const credential = firebase.auth.EmailAuthProvider.credential(this.context.user.email,password)

    firebase.auth().currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        firebase.auth().currentUser.delete()
          .then(() => {
            this.dropdownAlert("success", "Votre compte a été supprimé !", "")
            this.props.navigation.navigate("Loading")
          })
          .catch(error => console.error(error))
      })
      .catch( error => console.error(error))
    this.setState({visibleOverlay: false})
  }

  selectImage() {
    this.props.navigation.setParams({ test: "image" })

    ImagePicker.showImagePicker(options, response => {
      if (!response.didCancel && !response.error) {
        this.uploadImage(response.uri)
          .then(url => {
            this.dropdownAlert("success", "Votre photo a été ajoutée !", "")

            firebase
              .functions()
              .httpsCallable("setPhotoURL")(url)
              .then(() => {
                this.context.setPhotoURL(url)
              })
              .catch(error => console.error(error))
          })
          .catch(error => console.error(error))
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
        .then(res => {
          resolve(res.downloadURL)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  deleteProfileImage() {
    if (!this.context.user.photoURL)
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
          .firestore()
          .collection("users")
          .doc(this.context.user.email)
          .update({ photoURL: null })
          .then(() => {
            this.dropdownAlert("success", "Votre photo a été supprimée !", "")
            this.context.setPhotoURL(null)
          })
      })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          icon={
            <Icon
              name="camera"
              type="material-community"
              size={18}
              color="white"
              containerStyle={styles.buttonIconStyle}
            />
          }
          buttonStyle={styles.buttonStyle}
          onPress={() => this.selectImage()}
          title="Ajouter une photo"
        />
        <Button
          icon={
            <Icon
              name="camera-off"
              type="material-community"
              size={18}
              color="white"
              containerStyle={styles.buttonIconStyle}
            />
          }
          buttonStyle={[styles.buttonStyle, { backgroundColor: "red" }]}
          onPress={() => this.deleteProfileImage()}
          title="Supprimer ma photo"
        />
        <Button
          icon={
            <Icon
              name="account-remove"
              type="material-community"
              size={18}
              color="white"
              containerStyle={styles.buttonIconStyle}
            />
          }
          onPress={() => this.toggleOverlay(types.DELETEUSER)}
          title="Supprimer mon compte"
          buttonStyle={[styles.buttonStyle, styles.deleteButton]}
        />
        <MyOverlay
          remove={() => this.setState({ visibleOverlay: false })}
          visible={this.state.visibleOverlay}
          dropdownAlert={this.dropdownAlert}
          {...this.overlay}
        />
      </View>
    )
  }
}

UserSettingsScreen.contextType = UserContext

const styles = StyleSheet.create({
  buttonIconStyle: {
    marginLeft: 1,
    marginRight: 7
  },
  buttonStyle: {
    marginTop: 10,
    elevation: 2
  },
  deleteButton: {
    backgroundColor: colors.redButtonBackground
  }
})
