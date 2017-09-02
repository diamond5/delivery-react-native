import * as Storage from './localstorage'
import Api from './api'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import {Platform,Alert}  from 'react-native'

class GeolocationHelper {

  static configureGeolocationHelper() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 5,
      locationTimeout: 30,
      notificationTitle: 'Delivery Master tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      maxLocations:1000,
      activityType:'AutomotiveNavigation'
    });

    BackgroundGeolocation.on('location', (location) => {
        //handle your locations here
          console.log('location :'+JSON.stringify(location));
           Storage.get('userId').then((data) => {
           if(data != null){

               Api.post('savelocation', { userId: data,
                                  speed:location.speed,
                                  accuracy:location.accuracy,
                                  bearing:location.bearing,
                                  longitude:location.longitude,
                                  altitude:location.altitude,
                                  latitude:location.latitude,
                                  time:new Date(),
                                  locationprovider:location.locationprovider
               }).then((resp) => {
                      console.log(resp);
              }).catch((err) => {
                      console.log(err);
              });
            }
          });
      });

    if (Platform.OS == 'android') {
      BackgroundGeolocation.isLocationEnabled((enabled)=>{
        console.log(enabled)
         if(enabled == 0)
          {
            let alertMsg = (Platform.OS == 'android')?"To use Delivery Master, you must ON the Location Services Settings.":
            "To use Delivery Master, you must enable 'Always' in the Location Services Settings.";
            Alert.alert(
              'Location Service are OFF',
              alertMsg,
              [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                {text: 'Settings', onPress: () => BackgroundGeolocation.showLocationSettings()},
              ],
              { cancelable: false }
            )
          }
      },(err)=>{
            console.log(enabled);
      });
    }
  }

  static startGeolocationHelper() {
      Storage.set('GeolocationStarted', 'True').then((value) => {
            BackgroundGeolocation.start(() => {
               console.log('[DEBUG] BackgroundGeolocation started successfully');
           });
      });
  }

   static stopGeolocationHelper() {
      Storage.remove('GeolocationStarted').then((value) => {
           BackgroundGeolocation.stop(() => {
              console.log('[DEBUG] BackgroundGeolocation stoped successfully');
          });
      });
  }

}

export default GeolocationHelper
