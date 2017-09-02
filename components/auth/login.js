import { Image, StyleSheet, View, ScrollView, ActivityIndicator, TouchableHighlight,Platform } from 'react-native'
import React from 'react'
import { Button, Text, FormInput, FormLabel, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux'
import Spinner from 'react-native-loading-spinner-overlay';

import Api from '../../lib/api'
import * as Storage from '../../lib/localstorage'
import Parameters from '../../lib/parameters'
import styles from '../../styles/styles'
import colors from 'HSColors'
import GeolocationHelper from '../../lib/geoLocation'
import DeviceInfo from 'react-native-device-info';


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false
    };

    Storage.get('userName').then((value) => {
      if(value != null)
        this.setState({username: value});
    });


    this._handlePress = this._handlePress.bind(this);
  }

  _handlePress() {
    var status = 200;

    this.setState({
      loading: true
    })
    let deviceOtherInfo = { 
                app_version  : DeviceInfo.getReadableVersion(),
                device_manufacturer : DeviceInfo.getManufacturer(),
                device_brand : DeviceInfo.getBrand(),
                device_model : DeviceInfo.getModel(),
                device_ID : DeviceInfo.getDeviceId(),
                system_name : DeviceInfo.getSystemName(),
                system_version : DeviceInfo.getSystemName(),
                device_name : DeviceInfo.getDeviceName()
              };
    // validation
    let loginState = this;
    if (this.state.username === '' || this.state.password === '') {
      loginState.setState({
        loading: false
      });
      alert('Username and password required');
      return;
    }
    else{
            loginState.setState({loading: false });
            // console.log(Platform.OS)
            // console.log(DeviceInfo.getUniqueID())
            Storage.multiGet(['token','PushNotificationTOKEN']).then((value) => {
            if(value != null && value[0][1] != null)
            {
              //alert("pushNotificationTOKEN at login time : "+value[1][1]);
              let pushNotificationTOKEN = value[1][1];
              let deviceType = Platform.OS;
              let deviceUniqueId = DeviceInfo.getUniqueID();
              let appVersion  = DeviceInfo.getReadableVersion();
              
              loginState.setState({loading: true });
              alert(pushNotificationTOKEN);
              // Api.post('login', { 
              //   username: this.state.username,
              //   password: this.state.password,
              //   device_type: deviceType,
              //   device_id: deviceUniqueId,
              //   device_push_token : pushNotificationTOKEN,
              //   device_other_info : deviceOtherInfo
              //  }).then((resp) => {
              //       console.log(resp);
              //       loginState.setState({
              //         loading: false
              //       });
              //       Storage.set('userId', String(resp.data.UserId)).then((value) => {
              //         GeolocationHelper.startGeolocationHelper();
              //         Actions.main({ type: 'reset', userId: resp.data.UserId })
              //       });
              //        Storage.set('userName', resp.data.UserName).then((value) => {});
              // }).catch((err) => {
              //       console.log(err);
              //       loginState.setState({
              //         loading: false
              //       });
              //       alert(err.message);
              // });
            }
            else{
              Actions.register({ isFromLoinError: true });
            }
        }).catch((err) => {
          Actions.register({ isFromLoinError: true });
        });
    }

   
    
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner visible={this.state.loading} textStyle={{ color: '#FFF' }} />
        <Image style={{
          height: 65, width: 275, marginBottom:30
        }} resizeMode={"contain"} source={require('../../images/logo.png')} />
        <View style={{ width: 320, marginTop: 10 }}>
          <FormLabel
            containerStyle={styles.labelContainerStyle}>User Name</FormLabel>
          <FormInput
            ref='username'
            containerRef='containerRef'
            textInputRef='textInputRef'
            placeholder='Please enter your username' value={this.state.username} onChangeText={username => this.setState({ username })}
          />
          <FormLabel
            containerStyle={styles.labelContainerStyle}>Password</FormLabel>
          <FormInput
            ref='password'
            containerRef='containerRef'
            textInputRef='textInputRef'
            placeholder='Please enter your password' value={this.state.password} secureTextEntry onChangeText={password => this.setState({ password })} />


          <Button
            onPress={() => this._handlePress(this.state.username, this.state.password)}
            buttonStyle={{ marginTop: 15 }}
            fontSize = {20}
            backgroundColor={colors.stumbleupon}
            borderRadius={5}
            title='Log in' />


            <TouchableHighlight onPress={() => {
            Actions.register()
          }} >
              <View>
          <Text style={{ color: colors.stumbleupon, alignSelf: 'center', fontSize: 16, marginTop: 17 }}>
            Register here
            </Text>
            </View>
            </TouchableHighlight>
        </View>
      </View>
    )
  }
}

module.exports = Login
