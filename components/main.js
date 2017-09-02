import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Navigator, TouchableOpacity, AppState, Platform } from 'react-native';
import { Scene, Router, Actions, Modal, ActionConst, Reducer } from 'react-native-router-flux';
// import Icon from 'react-native-vector-icons/Ionicons'
import { Icon,Grid,
  Col,
  Row } from 'react-native-elements';
// import app pages here
import Login from './auth/login';
import Register from './auth/register';
import Logout from './auth/logout';
import Jobs from './jobs/jobs';
import CompletedJobs from './completedjobs/jobs';
import CompletedJob from './completedjob/completedjob';
import JobDetails from './job/job';
import TabIcon from './common/TabIcon'
import Messages from './messages/messages'
import Break from './break/break'
import AddressDetail from './job/addressdetail'
import Waiting from './waiting/waiting'
import Poc from './poc/poc'
import Pod from './pod/pod'
import SendMessage from './messages/sendmessage'
import MessageDetail from './messages/messagedetail'
import Splash from './splash/splash'
import RouteMap from './routemap/routemap'
import Exception from './exception/exception'


import * as Storage from '../lib/localstorage'
import styles from '../styles/styles'
import colors from '../config/colors'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import GeolocationHelper from '../lib/geoLocation'
import PushNotification from 'react-native-push-notification';
import PushNotificationHelper from '../lib/pushNotificationConfig';

class MyApp extends Component {
}

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  //console.log("params:", params);
  return (state, action) => {
    //console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
}

const renderLogoutButton = function () {

  return (
    <TouchableOpacity onPress={() => {  Actions.logoutModal()  } }>
      <View style={{ alignItems: 'center' }}>
        <Icon name="ios-settings-outline" type='ionicon' size={24} color='#464646' ></Icon>
      </View>
    </TouchableOpacity>
  );
}

const renderWriteMessageButton = function () {
  return (
    <TouchableOpacity onPress={() => { Actions.sendmessage() } }>
      <View style={{ alignItems: 'center' }}>
        <Icon name="ios-send-outline" type='ionicon' color='#464646' size={24}></Icon>
      </View>
    </TouchableOpacity>
  );
}

const renderCompletedJobButton = function () {
  return (
    <TouchableOpacity onPress={() => { Actions.completedjobs() } }>
      <View style={{ alignItems: 'center' }}>
        <Icon name="clipboard-check" type='material-community' size={24} color='#464646'></Icon>
      </View>
    </TouchableOpacity>
  );
}

const renderRouteButton = function () {
    return (
    <TouchableOpacity onPress={() => { Actions.routemap() } }>
      <View style={{ alignItems: 'center' }}>
        <Icon name="map" type='material-community' size={24} color='#464646'></Icon>
      </View>
    </TouchableOpacity>
  );
}

const refreshOnBack = () => {
    Actions.pop({refresh : {}});
    setTimeout(() => {
      Actions.refresh({});
    }, 10);
}

class Navigation extends  Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillMount() {
    PushNotificationHelper.configurePushNotificationHelper();
    GeolocationHelper.configureGeolocationHelper();
      Storage.get('userId').then((data) => {
           if(data != null) {
                GeolocationHelper.startGeolocationHelper();
           }
      });
  }

  render() {

    return (
      <Router createReducer={reducerCreate} navigationBarStyle={styles.navigationBarStyle} sceneStyle={{ backgroundColor: colors.grey6 }} backButtonTextStyle={{color: colors.grey6}}>
        <Scene key="splash" component={Splash} hideNavBar={true} initial={true} />
        <Scene key="launch" component={Login} title="Launch" hideNavBar={true} />
        <Scene key="register" type={ActionConst.PUSH} component={Register} title={Register} />
        <Scene key="main" tabs={true} tabBarStyle={styles.tabBarStyle} >
          <Scene key="jobs" titleStyle={styles.navBarTitleStyle} renderLeftButton={renderCompletedJobButton} component={Jobs} icon={TabIcon} renderRightButton={renderLogoutButton} title="Jobs List" sceneStyle={styles.sceneStyle}>
          </Scene>
          <Scene key="messages" component={Messages} icon={TabIcon} title="Messages" sceneStyle={styles.sceneStyle} renderLeftButton={renderWriteMessageButton} renderRightButton={renderLogoutButton} />
          <Scene key="break" component={Break} icon={TabIcon} title="Break" sceneStyle={styles.sceneStyle} renderRightButton={renderLogoutButton} />
        </Scene>
        <Scene key="job" type={ActionConst.PUSH} component={JobDetails} title="Details" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}}  />
        <Scene key="addressdetail" type={ActionConst.PUSH} component={AddressDetail} title="" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="waiting" type={ActionConst.PUSH} component={Waiting} title="Wait time" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="poc" type={ActionConst.PUSH} component={Poc} title="Proof of Collection"  sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="pod" type={ActionConst.PUSH} component={Pod} title="Proof of Delivery" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="exception" type={ActionConst.PUSH} component={Exception} title="Exceptions" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="routemap" type={ActionConst.PUSH} component={RouteMap} title="" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="sendmessage" type={ActionConst.PUSH} component={SendMessage} title="Send us a Message" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="messagedetail" type={ActionConst.PUSH} component={MessageDetail} title="Message Details" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="completedjobs" component={CompletedJobs} icon={TabIcon} renderRightButton={renderLogoutButton} title="Completed Jobs" sceneStyle={styles.sceneStyleWithoutBottom} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="completedjob" component={CompletedJob}  renderRightButton={renderLogoutButton} title="Completed Job Details" sceneStyle={styles.sceneStyleWithoutBottom} onBack={refreshOnBack} leftButtonIconStyle={{tintColor: colors.grey7}} />
        <Scene key="logoutModal" component={Logout} title="Logout" leftButtonIconStyle={{tintColor: colors.grey7}} />
      </Router>
    )
  }
}

AppRegistry.registerComponent('Navigation', () => Navigation);
module.exports = Navigation;
