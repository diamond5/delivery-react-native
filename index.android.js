import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import Navigation from './components/main';
import codePush from "react-native-code-push";
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
class DM extends Component {

  render() {
    return (
      <Navigation />
    );
  }
}

DM = codePush(codePushOptions)(DM);
AppRegistry.registerComponent('DM', () => DM);
