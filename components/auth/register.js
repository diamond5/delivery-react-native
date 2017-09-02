import { Image, StyleSheet, View, ScrollView, ActivityIndicator, TouchableHighlight } from 'react-native';
import React from 'react';
import { Button, Text, FormInput, FormLabel, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';

import Api from '../../lib/api';
import * as Storage from '../../lib/localstorage'
import Parameters from '../../lib/parameters';
import styles from '../../styles/styles';
import colors from 'HSColors';

class Register extends React.Component {

  constructor(props) {
    super(props);

    if(this.props.isFromLoinError != null && this.props.isFromLoinError){
      alert('Please first register with your token.');
    }
    this.state = {
      token: '',
      loading: false
    };
    Storage.get('token').then((value) => {
      if(value != null)
        this.setState({token: value});
    });
    this._handlePress = this._handlePress.bind(this);
  }

  _handlePress() {
    var status = 200;
 
    this.setState({
      loading: true
    });
    // validation
    let registerState = this;
    if (!this.state.token) {
      registerState.setState({ loading: false });
      alert('Token required');
      return;
    }

    Api.post('register', {token: this.state.token}).then((resp) => {
      console.log(resp);
      registerState.setState({ loading: false });
      Storage.set('token', String(this.state.token)).then(() => {
        Actions.pop({refresh : {}});
      });

    }).catch((err) => {
      console.log(err);
       registerState.setState({ loading: false });
      alert('Invalid token');
    });
    
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner visible={this.state.loading} textStyle={{ color: '#FFF' }} />
        <Image style={{
          height: 65, width: 320
        }} resizeMode={"contain"} source={require('../../images/logo.png')} />
        <View style={{ width: 320, marginTop: 10 }}>
          <FormLabel
            containerStyle={styles.labelContainerStyle}>Token</FormLabel>
          <FormInput
            containerRef='containerRef'
            textInputRef='textInputRef'
            placeholder='Please enter identification token' value={this.state.token} onChangeText={token => this.setState({ token })}
            />
          <Button borderRadius={3}
            onPress={() => this._handlePress(this.state.token)}
            buttonStyle={{ marginTop: 15 }}
            fontSize = {20}
            backgroundColor={colors.stumbleupon}
            borderRadius={5}
            title='Register' />
   <TouchableHighlight onPress={() => {
            Actions.pop({refresh : {}})
          }} >
              <View>
          <Text style={{ color: colors.stumbleupon, alignSelf: 'center', fontSize: 22, marginTop: 20 }}>
            back
            </Text>
            </View>
            </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = Register;
