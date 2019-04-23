import firebase from 'react-native-firebase';
import { notificationTypes } from "../lib";

export default class Notification {
  constructor(UserContext) {
    this.context = UserContext
  }

  createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications()
      .onNotification(notification => {
        if (!notification)
          return
        const { title, body, data } = notification;
        this.context.dropdownAlert('info', title, body);
        switch (data.type) {
          case notificationTypes.addUser:
            this.context.getFriends()
            break
          case notificationTypes.friendReqAccepted:
            this.context.getFriends()
            this.context.navigation.navigate("Amis")
            break
          case notificationTypes.newEvent:
            this.context.getEvents()
            break
        }
      });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications()
      .onNotificationOpened((notificationOpen) => {
        if (!notificationOpen)
          return
        //const { title, body } = notificationOpen.notification;
        console.warn(notificationOpen)
      });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    firebase.notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (!notificationOpen)
          return

        const { title, body, data } = notificationOpen.notification;

        switch (data) {
          case notificationTypes.addUser:
            this.context.getFriends()
            break
          case notificationTypes.friendReqAccepted:
            this.context.getFriends()
            break
          default:
            //this.context.dropdownAlert('info', title, body)
            console.warn(notificationOpen)
            break
        }
      })
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging()
      .onMessage(message => console.log(JSON.stringify(message)));
  }
}
