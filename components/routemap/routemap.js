import { Image, StyleSheet, View, Text, ScrollView,TouchableHighlight } from 'react-native';
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel, Button
} from 'react-native-elements';
import * as Storage from '../../lib/localstorage';
import colors from 'HSColors';
import Api from '../../lib/api';

var _ = require('lodash');

var styles = require('../../styles/styles');
import { Actions } from 'react-native-router-flux';

class RouteMap extends React.Component {

  constructor(props) {
    super(props);

    this._loadAddress = this._loadAddress.bind(this);
    this.state = {
      addressDetails: null,
      region:null
    };
    Storage.get('userId').then((value) => {
      this.setState({
        userId: value,
        initialPosition:null
      });
    })
  }

  _loadAddress() {
    let that = this;
    Storage.get('routeAddressDetails').then((value) => {
        that.setState({ addressDetails: JSON.parse(value) });
        navigator.geolocation.getCurrentPosition((position) => {
            var initialPosition = JSON.stringify(position);
            console.log(position)
            that.setState({ initialPosition: position ,region:{ 
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            },
            initialPositionLatLong:{
              latitude: position.latitude,
              longitude: position.longitude
            }
          });
        },
        (error) =>{ 
          console.log(JSON.stringify(error));
        });
    });
  }

  onRegionChange(region) {
  this.setState({ region });
  } 

  componentWillMount() {    
     this._loadAddress(); 
  }

  componentWillReceiveProps(){
     this._loadAddress(); 
  }


  render() {

    const addressDetails = this.state.addressDetails;
    if (!addressDetails) {
      return null;
    };
    console.log(addressDetails)

    return (
  <ScrollView style={{marginTop : 20}}>
    <View style={styles.detailBox}>
       
    </View>
  </ScrollView>
    );
  }
}

module.exports = RouteMap;
