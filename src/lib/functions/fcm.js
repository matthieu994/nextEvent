import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";

export const checkPermission = () => {
  return firebase
    .messaging()
    .hasPermission()
    .then(enabled => {
      if(enabled)
        return getToken()

      return requestPermission()
    })

}

async function getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if(!fcmToken) {
    fcmToken = await firebase.messaging().getToken()
    if(fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
  return fcmToken
}

async function requestPermission() {
  await firebase.messaging().requestPermission()
    .then(getToken)
    .catch(err => console.warn("accepte batard") && console.warn(err.message))
}
