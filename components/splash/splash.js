import { Image, StyleSheet, View, ScrollView, ActivityIndicator, NetInfo, AsyncStorage } from 'react-native';
import React from 'react';
import { Actions } from 'react-native-router-flux';
import SyncHelper from '../../lib/synchelper';

import * as Storage from '../../lib/localstorage';
import styles from './splash.styles';

class Splash extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

        setTimeout(function(){
        
            var value = Storage.get('userId').then((value) => {
              if(value != null && value != 'undefined'){
                Actions.main({type: 'reset', userId : value})
              }
              else{
                Actions.launch({type: 'reset'})
              }
            });
        
        }, 500);

        SyncHelper.Sync();

    }

    render() {
        return (
            <View style={styles.splashContainer}>
                <Image style={styles.logoImage} resizeMode={"contain"} source={require('../../images/logo.png')} />
            </View>
        );
    }
}

module.exports = Splash;
