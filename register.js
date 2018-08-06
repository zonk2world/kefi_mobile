 import { Util, Permissions, Notifications, Constants } from 'expo'
const PUSH_ENDPOINT = 'https://exponent-push-server.herokuapp.com/tokens';
 import {
     AsyncStorage
 } from 'react-native';
 import * as firebase from "firebase";

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      return
    }

    let token = await Notifications.getExpoPushTokenAsync()
    const zone = await Util.getCurrentTimeZoneAsync()
    AsyncStorage.getItem('user_id', (err, userId) => {
        firebase.database().ref('/users/'+userId).set({token:token});
    });

}