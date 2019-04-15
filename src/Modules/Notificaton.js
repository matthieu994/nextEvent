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
      .onNotification((notification) => {
        if (!notification)
          return
        const { title, body } = notification;
        this.context.dropdownAlert('info', title, body);
        if (notification.data.type === notificationTypes.addUser)
          this.context.getFriends()
      });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications()
      .onNotificationOpened((notificationOpen) => {
        if (!notificationOpen)
          return
        const { title, body } = notificationOpen.notification;
        this.context.dropdownAlert('info', title, body);
      });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    firebase.notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (!notificationOpen)
          return
        console.log(notificationOpen)
        const { title, body, data } = notificationOpen.notification;

        switch (data) {
          case notificationTypes.addUser:
            this.context.navigation.navigate("Amis")
            break
          default:
            this.context.dropdownAlert('info', title, body)
            break
        }
      })
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging()
      .onMessage((message) => {
        //process data message
        console.log(JSON.stringify(message));
      });
  }
}
