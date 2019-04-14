import React from "react"
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"

export default class Loading extends React.Component {
  componentWillMount() {
    this.unsubscribe = firebase.auth()
      .onAuthStateChanged(user => {
        if (!user) {
          this.context.clearState()
          this.props.navigation.navigate("Login")
        } else {
          this.context
            .initProvider()
            .then(() => this.props.navigation.navigate("Main"))
            .catch(err => console.warn(err))
        }
      })

    this.createNotificationListeners()
  }

  componentWillUnmount() {
    this.unsubscribe()
    this.notificationListener();
    this.notificationOpenedListener();
  }

  createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        this.context.dropdownAlert('info', title, body);
      });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.context.dropdownAlert('info', title, body);
      });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    firebase.notifications()
      .getInitialNotification()
      .then(notif => notif && this.context.dropdownAlert('info', notif.title, notif.body))
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging()
      .onMessage(message => {
        //process data message
        console.warn(JSON.stringify(message));
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text h3>Chargement</Text>
        <ActivityIndicator size="large"/>
      </View>
    )
  }
}

Loading.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
