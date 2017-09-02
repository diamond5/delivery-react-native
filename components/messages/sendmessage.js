import { Image, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel, Button, FormInput,Icon
} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/Ionicons';

import * as Storage from '../../lib/localstorage';
import colors from 'HSColors';
import Api from '../../lib/api';
import SyncHelper from '../../lib/synchelper';
import { Actions } from 'react-native-router-flux';

var styles = require('../../styles/styles');

class SendMessage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }

    Storage.get('userId').then((value) => {
      this.setState({
        userId: value
      })
    })

    this._sendMessage = this._sendMessage.bind(this);
  }

  _sendMessage() {

    if(!this.state.message){
      alert('Please enter a message');
      return;
    }

    let messageModel = { userId: this.state.userId, messageText: this.state.message };
    let userId = this.state.userId;
    Api.post('sendmessage', messageModel).then(function (data) {
        //Actions.messages({ userId: userId });
         Actions.pop({refresh : {} });
      }).catch((err) => {
      console.log(err);
      if (err.message == 'Network request failed') {
        SyncHelper.addItemsToQueue('messageQueue', messageModel);
      }
       Actions.pop({refresh : {} });
    });
  }

  componentDidMount() {
  }

  render() {

    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.grey6 }}>
        <View style={[{paddingVertical : 10, marginTop:40}]}>
          <Grid>
            <Row>
              <Col>
                <Button borderRadius={5} title="Send" backgroundColor={colors.stumbleupon} onPress={() => this._sendMessage()}></Button>
              </Col>
            </Row>
          </Grid>
        </View>
       <View style={[styles.singleLineBox,{paddingHorizontal :0, paddingTop: 10,marginHorizontal :8}]}>
           <Grid>
              <Row size={1} style={{paddingVertical : 10,backgroundColor: "#FFF" }}>
                  <Col size={1.8}>
                      <Icon name="account" type='material-community' color='#4d4d4d' size={26}></Icon>
                  </Col>
                   <Col size={9}>
                      <Text style={styles.label}>To</Text>
                      <Text style={styles.labelText}>System</Text>
                   </Col>
              </Row>
              <View style={styles.controlBottomLine}></View>
               <Row size={4} style={{paddingVertical : 10,backgroundColor: "#FFF", height: 150}}>
                    <Col size={1.8}>
                      <Icon name="message-reply-text" type='material-community'  color='#4d4d4d' size={26}></Icon>
                    </Col>
                    <Col size={9} style={{backgroundColor: "#FFF"}}>
                      <TextInput
                        multiline={true}
                        style={{backgroundColor: "#FFF", flex: 1}}
                        numberOfLines={5} placeholder="Please enter message here"
                        onChangeText={(text) => this.setState({ message: text })}
                        />
                    </Col>
               </Row>
               <View style={styles.controlBottomLine}></View>
          </Grid>
       </View>




      {/*<View style={{ paddingTop: 40, flex: 1,marginHorizontal :8 }}>
        <Grid >
          <Row size={1} style={{paddingHorizontal :10, backgroundColor: '#FFF'}}>
            <Col size={1.8}>
              <Icon name="account" type='material-community' color='#4d4d4d' size={26}></Icon>
            </Col>
            <Col size={9}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.labelText}>System</Text>
            </Col>
          </Row>
         <View style={styles.controlBottomLine}></View>
          <Row size={4} style={{paddingVertical : 10,paddingHorizontal :10,backgroundColor: '#FFF'}}>
            <Col size={1.8}>
              <Icon name="message-reply-text" type='material-community'  color='#4d4d4d' size={26}></Icon>
            </Col>
            <Col size={9} style={{backgroundColor: "#FFF"}}>
              <TextInput
                multiline={true}
                style={{backgroundColor: "#FFF"}}
                numberOfLines={5} placeholder="Please enter message here"
                onChangeText={(text) => this.setState({ message: text })}
                />
            </Col>
          </Row>
          <Row size={5}>
            <Col>
              <Button borderRadius={5} title="Send" backgroundColor={colors.stumbleupon} onPress={() => this._sendMessage()}></Button>
            </Col>
          </Row>
        </Grid>
      </View>*/}
      </ScrollView>
    )
  }
}

module.exports = SendMessage;
