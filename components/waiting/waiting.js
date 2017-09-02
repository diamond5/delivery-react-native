import { Image, StyleSheet, View, Text, ScrollView, TouchableHighlight,KeyboardAvoidingView, TextInput} from 'react-native'
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel, Button, FormInput,Icon
} from 'react-native-elements'
// import Icon from 'react-native-vector-icons/Ionicons'
var SignaturePad = require('react-native-signature-pad');

import * as Storage from '../../lib/localstorage';
import colors from 'HSColors'
import Api from '../../lib/api'
import SyncHelper from '../../lib/synchelper'
var _ = require('lodash')

var styles = require('../../styles/styles');
import { Actions } from 'react-native-router-flux'

class Waiting extends React.Component {

  constructor(props) {
    super(props);

    this._saveWaitTime = this._saveWaitTime.bind(this);

    Storage.get('userId').then((value) => {
      this.setState({
        userId: value,
        loading: false,
        addressType: this.props.addressType,
        addressId: this.props.addressId,
        signature : '',
        time: this.props.time != null ? String(this.props.time):""
      });
    });

  }

  componentWillMount() {
  }

  _saveWaitTime() {

    if (!this.state.time){
        alert('Please enter time');
        return;
    }

    if (!this.state.name){
        alert('Please enter name');
        return;
    }

    if (!this.state.signature){
        alert('Please take signature');
        return;
    }

    let waitingModel = {
      "time": this.state.time,
      "userId": this.state.userId,
      "addressId": this.state.addressId,
      "type": this.state.addressType,
      "personName": this.state.name,
      "sign": this.state.signature,
      "description": ''
    };

    Api.post('waiting', waitingModel).then((response) => {
      console.log(response);
      Actions.pop();
    }).catch((err) => {

      if (err.message == 'Network request failed') {

        SyncHelper.addItemsToQueue('waitingQueue', waitingModel);

      }
    });
  }

  _signaturePadError = (error) => {
    console.error(error);
  };

  _signaturePadChange = ({base64DataUrl}) => {
    //console.log("Got new signature: " + base64DataUrl);
    this.setState({ signature: base64DataUrl });
  };

  _clearSign(){
    this.setState({ signature : '-'});
    setTimeout( () => {
        this.setState({ signature : null });
    }, 10);
  }

  render() {

    let clearButton = null;
    const waitingDisabled = null;

    if (!this.state){
      return null;
    }

    let signature = this.state.signature;
    let signatureBox = null;

    if ((signature && waitingDisabled)|| this.state.signature == '-') {
        signatureBox = <Image style={{
            flex: 1,
            resizeMode: 'contain'
        }} source={{
            uri: signature
        }} />;
    } else {
        signatureBox = <SignaturePad onError={this._signaturePadError} onChange={this._signaturePadChange} value={this.state.signature} style={{
            flex: 1,
            backgroundColor: '#FFF',
            marginTop: 10
        }} />;
      }

    if (!waitingDisabled) {
        clearButton = <TouchableHighlight onPress={() => this._clearSign() }>
        <View>
        <Text style={{ color: colors.stumbleupon, alignSelf: 'center' }}>
        Clear sign
        </Text>
        </View>
        </TouchableHighlight>;
    }

    return (
       <ScrollView style={{ paddingTop: 10, flex: 1 , backgroundColor: colors.grey6}}>
         <KeyboardAvoidingView behavior='padding' >
      <View style={{ paddingTop: 5 }}>
       <View style={[styles.singleLineBox,{paddingHorizontal : 0, minHeight:50, backgroundColor: colors.grey6, paddingVertical : 13}]}>
            <Grid>
                <Row>
                  <Col>
                      <Button borderRadius={5} buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} title="CANCEL" onPress={() => Actions.pop()}></Button>
                  </Col>
                  <Col>
                      <Button borderRadius={5} buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} backgroundColor={colors.stumbleupon}  title="ACCEPT" onPress={() => this._saveWaitTime()}></Button>
                  </Col>
              </Row>
            </Grid>
      </View>

       <View style={[styles.singleLineBox,{paddingHorizontal :0,marginHorizontal :8, backgroundColor: '#FFF', marginBottom :0,paddingBottom : 0}]}>
        <Grid>
          <Row  style={{ marginVertical : 0, paddingVertical : 0}}>
            <Col size={1.8} style={{ marginVertical : 0, paddingVertical : 0}}>
              <Icon name="clock" type='material-community' color='#4d4d4d' size={26}></Icon>
            </Col>
            <Col size={7} style={{ marginVertical : 0, paddingVertical : 0}}>
              <Text style={[styles.labelText]}>Add time in mins</Text>
            </Col>
            <Col size={3} style={{ marginVertical : 0, paddingVertical : 0}}>
              <FormInput
                keyboardType='numeric'
                value={this.state.time}
                inputStyle={{color: colors.stumbleupon}}
                maxLength={3}
                placeholder='time' onChangeText={time => this.setState({ time: time })}
                />
            </Col>
          </Row>
          <View style={styles.controlBottomLine}></View>
          <Row size={1} style={{paddingTop : 10, height: 75}}>
            <Col size={1.8}>
              <Icon name="account" type='material-community' color='#4d4d4d' size={26}></Icon>
            </Col>
            <Col size={10}>
              <Text style={styles.labelText}>Name</Text>
              <TextInput
                style={{flex: 1, paddingLeft: 0}}
                value={this.state.name}
                underlineColorAndroid="transparent"
                containerStyle={{ marginLeft: 0 }}
                placeholder='Please enter name'
                inputStyle={[styles.labelText]}
                onChangeText={username => this.setState({ name: username })}/>
            </Col>
          </Row>
          <View style={styles.controlBottomLine}></View>
          <Row size={1} style={{paddingTop : 10,paddingHorizontal :10}}>
                        <Col size={1}><Text style={styles.labelText}>Signature</Text></Col>
                        <Col size={1} style={{alignItems : 'flex-end'}}>
                            {clearButton}
                        </Col>
                    </Row>
          <Row size={8} style={{flex: 1, height: 250, borderColor : colors.grey4, borderWidth : 1,borderRadius:4,marginHorizontal :10}}>
            {signatureBox}
          </Row>
        </Grid>
        <View style={styles.controlBottomLine}></View>
      </View>

      </View>
      </KeyboardAvoidingView>
       </ScrollView>
    )
  }
}

module.exports = Waiting;
