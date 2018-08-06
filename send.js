import { Util, Permissions, Notifications, Constants } from 'expo'
const PUSH_ENDPOINT = 'https://exponent-push-server.herokuapp.com/tokens';
import * as firebase from "firebase";
//import {notifications} from "./data/raw/notifications";


export const sendPushNotification = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    )

    this.tokens = [];
    await firebase.database().ref('/users').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            if(this.tokens.indexOf(childSnapshot.val().token) == -1){
                console.log(childSnapshot.val().token);
                this.tokens.push(childSnapshot.val().token);
            }
        });
    });
    let i=0;
    console.log(this.tokens.length);
    for(i=0; i < this.tokens.length; i++)
    {
        console.log(this.tokens[i]);
        await fetch('https://exp.host/--/api/v2/push/send', {
            body: JSON.stringify({
                "to": this.tokens[i],
                "title": "A New Kefigram Delivered",
                "body": "Body of your Notification"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Accept': 'application/json'
            },
            method: 'POST',
        });
    }
}