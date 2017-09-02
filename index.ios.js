import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import Navigation from './components/main';

class DM extends Component {
    render() {
        return (
            <Navigation />
        );
    }
}

AppRegistry.registerComponent('DM', () => DM);
