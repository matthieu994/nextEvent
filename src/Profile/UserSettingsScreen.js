import React, { Component } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import firebase from "react-native-firebase"
import { Button, Divider, Icon } from "react-native-elements"
import ImagePicker from "react-native-image-picker"
import RNFetchBlob from "rn-fetch-blob"
import { UserContext } from "../Provider/UserProvider"
import {
  MyOverlay,
  types,
  basicOverlay,
  colors,
  checkAccountDeleteCredentials,
  checkNames,
  firebaseErrorCode
} from '../lib'

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
    visibleOverlay: false,
    loadingUploadingButton: false,
    loadingDeletePhotoButton: false
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
          ...basicOverlay,
          action: ({ text }, next) => this.deleteUser(text, next),
          inputPlaceholder: "Mot de passe",
          buttonTitle: "Supprimer mon compte"
        }
        break
      case types.CHANGEPASSWORD:
        this.overlay = {
          ...basicOverlay,
          action: (texts, next) => this.changePassword(texts, next),
          secondTextEntry: true,
          inputPlaceholder: 'Mot de passe actuel',
          inputPlaceholder2: 'Nouveau mot de passe',
          buttonTitle: "Changer le mot de passe"
        }
        break;
      case types.CHANGENAMES:
        this.overlay = {
          ...basicOverlay,
          inputPlaceholder: this.context.user.displayName,
          inputPlaceholder2: this.context.user.familyName,
          buttonTitle: "Modifier les noms",
          secondTextEntry: true,
          secureTextEntry: false,
          secureTextEntry2: false,
          action: (texts, next) => this.changeNames(texts, next)
        }
        break
      default:
        this.overlay = basicOverlay
        break
    }

    this.setState({ visibleOverlay: true })
  }

  changePassword({ text, text2 }, next) {
    if (!checkAccountDeleteCredentials(text, next))
      return
    this.checkCredentials(text)
      .then(() => {
        firebase.auth()
          .currentUser
          .updatePassword(text2)
          .then(() => this.dropdownAlert("success", "Votre mot de passe a été mis à jour", ""))
          .catch(err => console.error(err))
      })
  }

  changeNames({ text, text2 }, next) {
    if (text === "")
      text = this.context.user.displayName
    if (text2 === "")
      text2 = this.context.user.familyName

    if (!checkNames(text, text2, next))
      return

    firebase.firestore()
      .collection('users')
      .doc(this.context.user.email)
      .update({
        displayName: text,
        familyName: text2
      })
      .then(() => {
        this.dropdownAlert("success", "Vos informations sont mis à jour", "")
        this.context.setUserState({
          displayName: text,
          familyName: text2
        })
      })
  }

  checkCredentials(password) {
    const credential = firebase.auth.EmailAuthProvider.credential(this.context.user.email, password)
    return firebase.auth()
      .currentUser
      .reauthenticateWithCredential(credential)
      .catch(err => this.dropdownAlert("error", firebaseErrorCode(err.code), ""))
  }

  deleteUser(password, next) {
    if (!checkAccountDeleteCredentials(password, next))
      return

    this.checkCredentials(password)
      .then(() => {
        firebase.auth()
          .currentUser
          .delete()
          .then(() => {
            this.dropdownAlert("success", "Votre compte a été supprimé !", "")
            this.props.navigation.navigate("Loading")
          })
          .catch(err => {
          })
      })
    this.setState({ visibleOverlay: false })
  }

  selectImage() {
    if(this.state.loadingDeletePhotoButton || this.state.loadingUploadingButton)
      return

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel || response.error)
        return
      const callBack = () => {
        this.uploadImage(response.uri)
          .then(url => {
            firebase
              .functions()
              .httpsCallable("setPhotoURL")(url)
              .then(() => this.setState({ loadingUploadingButton: false }, () => {
                this.context.setPhotoURL(url)
                  .then(() => this.dropdownAlert("success", "Votre photo a été ajoutée !", ""))
              }))
              .catch(error => console.error(error) && this.setState({ loadingUploadingButton: false }))
          })
          .catch(error => console.error(error) && this.setState({ loadingUploadingButton: false }))
      }

      this.setState({ loadingUploadingButton: true }, callBack)
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
    if(this.state.loadingDeletePhotoButton || this.state.loadingUploadingButton)
      return
    if (!this.context.user.photoURL)
      return this.dropdownAlert(
        "error",
        "Vous n'avez pas de photo de profil !",
        ""
      )

    this.setState({ loadingDeletePhotoButton: true }, () => {
      firebase
        .firestore()
        .collection("users")
        .doc(this.context.user.email)
        .update({ photoURL: null })
        .then(() => this.setState({ loadingDeletePhotoButton: false },
          () => {
            this.context.setPhotoURL(null)
            this.dropdownAlert("success", "Votre photo a été supprimée !", "")
          }))
        .catch(() => this.setState({ loadingDeletePhotoButton: false },
          err => console.error(err)))
    })
  }


  render() {
    return (
      <ScrollView contentContainerStyle={{
        justifyContent: 'space-between',
        flex: 1
      }}>
        <View style={styles.container}>
          <Button
            icon={
              <Icon
                name="pencil-outline"
                type="material-community"
                size={18}
                color="white"
                containerStyle={styles.buttonIconStyle}
              />
            }
            buttonStyle={[styles.buttonStyle, { minWidth: '60%' }]}
            onPress={() => this.toggleOverlay(types.CHANGENAMES)}
            title="Modifier nom et prénom"
          />

          <Button
            icon={
              <Icon
                name="pencil-outline"
                type="material-community"
                size={18}
                color="white"
                containerStyle={styles.buttonIconStyle}
              />
            }
            buttonStyle={[styles.buttonStyle, { minWidth: '60%' }]}
            onPress={() => this.toggleOverlay(types.CHANGEPASSWORD)}
            title="Changer mon mot de passe"
          />
          <Divider style={styles.divider}/>
          <View style={styles.photo}>
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
              loading={this.state.loadingUploadingButton}
              buttonStyle={styles.buttonStyle}
              containerStyle={{ width: '48%' }}
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
              loading={this.state.loadingDeletePhotoButton}
              buttonStyle={[styles.buttonStyle, { backgroundColor: "red" }]}
              containerStyle={{ width: '48%' }}
              disabled={!this.context.user.photoURL}
              onPress={() => this.deleteProfileImage()}
              title="Supprimer ma photo"
            />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Divider style={styles.divider}/>
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
        </View>
        <MyOverlay
          remove={() => this.setState({ visibleOverlay: false })}
          visible={this.state.visibleOverlay}
          dropdownAlert={this.dropdownAlert}
          {...this.overlay}
        />
      </ScrollView>
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
    elevation: 5
  },
  deleteButton: {
    backgroundColor: colors.redButtonBackground,
    marginBottom: 40
  },
  container: {
    alignItems: 'center',
    flex: 1,
  },
  photo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%'
  },
  divider: {
    height: 2,
    backgroundColor: 'gray',
    width: '100%',
    marginTop: 15,
    marginBottom: 15
  }
})
