import { Image, StyleSheet, View, Text, ScrollView } from 'react-native';
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
import Datehelpers from '../../lib/datehelpers';
import { Actions } from 'react-native-router-flux';

var _ = require('lodash')
var styles = require('../../styles/styles');

class MessageDetail extends React.Component {

  constructor(props) {
    super(props);

    this._loadMessage = this._loadMessage.bind(this)
    this.state = {
      messageDetail: null
    }
  }

  componentWillMount() {
    this._loadMessage()
  }

  _loadMessage() {

    let userId = this.props.userId
    let that = this
    let messageId = this.props.messageId

    Api.get('message?userId=' + userId + '&messageId=' + this.props.messageId).then(function (response) {

      console.log(response.data[0]);
      that.setState({
        messageDetail: response.data[0],
        loading: false
      })

      Storage.set('message-' + messageId, JSON.stringify(response.data[0])).then(() => {
        console.log('saved message - ' + messageId + ' in localstorage')
      })

    }).catch((err) => {

      // load message from local storage
      Storage.get('message-' + messageId).then((data) => {
        that.setState({
          messageDetail: JSON.parse(data),
          loading: false
        })
      })

    });;
  }

  render() {

    if (this.state.messageDetail === null) {
      return null
    }

    let message = this.state.messageDetail

    return (
   <ScrollView style={{ paddingTop: 20, flex: 1, backgroundColor: colors.grey6 }}>

  <View style={{ paddingTop: 0, marginTop:15, marginHorizontal:8}}>
      <View style={[styles.singleLineBox,{paddingHorizontal : 10, backgroundColor: "#FFF"}]}>
          <Grid>
              <Row size={10}>
                <Col size={10}>
                  <Icon name="ios-mail-open-outline" type='ionicon' color='#4d4d4d' size={26}></Icon>
                </Col>
                <Col size={60} style={{paddingLeft : 10}}>
                  <Text style={styles.label}>From</Text>
                  <Text style={styles.labelText}>{message.Type == 0 ? "System":"You"}</Text>
                </Col>
                <Col size={30} style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.labelText,{fontSize: 11}]}>{Datehelpers.GetFormattedTime(message.TimeSent)}</Text>
                  <Text style={[styles.labelText,{fontSize: 11}]}>{Datehelpers.GetFormattedDate(message.DateSent)}</Text>
                </Col>
            </Row>
          </Grid>
      </View> 
      <View style={styles.controlBottomLine}></View> 
       <View style={[styles.singleLineBox,{paddingHorizontal : 10,paddingVertical : 10, backgroundColor: "#FFF" }]}>
          <Grid>
              <Row>
                <Col>
                  <Text style={[styles.labelText]}>{message.Message}</Text>
                </Col>
            </Row>
          </Grid>
      </View> 
      <View style={styles.controlBottomLine}></View> 
       <View style={[{paddingVertical : 10, marginTop:40}]}>
          <Grid>
              <Row>
                <Col>
              <Button borderRadius={5} title="Reply" disabled={message.Type == 1} backgroundColor={colors.stumbleupon} onPress={() => Actions.sendmessage()}></Button>
            </Col>
            </Row>
          </Grid>
      </View> 
  </View>
      </ScrollView>
    )
  }
}

module.exports = MessageDetail;
