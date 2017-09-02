import { Image, StyleSheet, View, ScrollView, Alert, TouchableHighlight } from 'react-native'
import React from 'react'
import { Button, Text, FormInput, FormLabel, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux'
import Spinner from 'react-native-loading-spinner-overlay';

import * as Storage from '../../lib/localstorage';
import styles from '../../styles/styles';
import colors from 'HSColors';
import GeolocationHelper from '../../lib/geoLocation'
import Api from '../../lib/api'

import codePush from 'react-native-code-push';

class Logout extends React.Component {

    constructor(props) {
        super(props);
        this._handlePress = this._handlePress.bind(this);
    }

    _handlePress() {

        Storage.get('userId').then((value) => {
          if(value != null)
            {
                Api.post('logout', {
                userId: value
               }).then((resp) => {
                    Storage.remove('userId').then((value) => {
                        Actions.splash({ type: 'reset' });
                        GeolocationHelper.stopGeolocationHelper();
                    });
              }).catch((err) => {
                    alert(err.message);
              });
            }
        });
    }

    _checkForUpdates() {
        codePush.checkForUpdate()
            .then((update) => {
                if (!update) {
                    alert("The app is up to date");
                } else {
                    Alert.alert(
                        'App Update',
                        'New version found',
                        [
                            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                            {
                                text: 'OK', onPress: () => {
                                    codePush.sync({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                }
            });
    }

    render() {
      return (
        <View style={{
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
          <Text>Are you sure you want to logout ?</Text>
          <View style={{ width: 320, marginTop: 10 }}>
            <Button  onPress={() => this._handlePress()}
              buttonStyle={{ marginTop: 12 }}
              fontSize = {18}
              backgroundColor={colors.stumbleupon}
              borderRadius={5} title='Log out' />
          </View>
          <View style={{marginBottom: 10,marginTop: 25,height: 30 }}>
            <Text style={[styles.labelText,{ color: colors.grey8,}]}>Delivery Master™</Text>
          </View>
          <View style={{marginBottom: 10,marginTop: 10,height: 30, }}>
            <Text style={[styles.labelText,{ color: colors.grey8,}]}>App Version 1.0.0</Text>
          </View>
        </View>
      )
    }
}

module.exports = Logout
