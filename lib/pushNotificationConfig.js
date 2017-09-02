import * as Storage from './localstorage'
import Api from './api'
import {Platform,Alert}  from 'react-native'
import PushNotification from 'react-native-push-notification';

class PushNotificationHelper {

  static configurePushNotificationHelper() {

     Api.get('getgcmsenderid').then((resp) => {
          console.log(resp);
          PushNotification.configure({
                onNotification: function(notification) {
                    //console.log( 'NOTIFICATION:', notification );
                 },
                onRegister: function(token) {
                    //console.log( 'TOKEN:', token );
                    //alert(JSON.stringify(token));
                    Storage.set('PushNotificationTOKEN', token.token).then(() => {
                        //alert(JSON.stringify(token));
                            console.log('added PushNotificationTOKEN to storage');
                    });
                 },
                senderID: resp.data.SenderID //"775155425384",
          });
      }).catch((err) => {
            console.log(err);
      });

  }

}

export default PushNotificationHelper
