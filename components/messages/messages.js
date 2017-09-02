import { Image, StyleSheet, View, Modal, TouchableHighlight, ListView, Text, ScrollView, RefreshControl } from 'react-native';
import React, { Component } from 'react';
import { List, ListItem, Grid, Col, Row,Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
// import Icon from 'react-native-vector-icons/Ionicons';

import Api from '../../lib/api';
import Datehelpers from '../../lib/datehelpers';
import Parameters from '../../lib/parameters';
import colors from 'HSColors';
import * as Storage from '../../lib/localstorage';
//import styles from '../../styles/styles';
import styles from '../jobs/jobs.styles'
class Messages extends React.Component {

  constructor(props) {
    super(props);

    this.loadMessages = this.loadMessages.bind(this);
    this._openDetails = this._openDetails.bind(this);
    this.state = {
      messagesDS: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      loading: false,
      isRefreshing : false
    };
  }

  componentWillMount() {
    this.setState({loading: true});
    let that = this;
    Storage.get('userId').then((value) => {
        that.setState({userId: value});
        that.loadMessages();
    });
    
  }

   componentWillReceiveProps() {
        this.loadMessages();
    }

  _openDetails(messageId) {
    Actions.messagedetail({ userId: this.props.userId == null? this.state.userId : this.props.userId, messageId: messageId });
  }

  loadMessages() {

    let userId = this.props.userId == null? this.state.userId : this.props.userId;
    let that = this;

    Api.get('messages?userId=' + userId).then(function (response) {
      
      that.setState({
        messagesDS: that.state.messagesDS.cloneWithRows(response.data),
        loading: false,
        isRefreshing : false
      });

      // save in local storage
      Storage.set('messages', JSON.stringify(response.data)).then(() => {
        console.log('saved messages in localstorage');
      });

    }).catch((err) => {
      
      console.log(err);

      // load from storage
      Storage.get('messages').then((data) => {
        console.log(data);
        that.setState({
          messagesDS: that.state.messagesDS.cloneWithRows(JSON.parse(data))
        });
      });
      that.setState({
          loading: false,
          isRefreshing : false
      });

    });
  }

  renderMessageItem(msg) {

    let bgColor = (msg.IsRead !== true) ? colors.stumbleupon : '#FFF'
    let mailIcon = (msg.IsRead !== true) ? 'ios-mail-outline' : 'ios-mail-open-outline'
    let iconColor = (msg.IsRead !== true) ? '#FFF' : colors.stumbleupon
    let secndIcon= (msg.Type !== 1) ?'ios-undo' : 'ios-share-alt-outline'

    return (
      <TouchableHighlight onPress={() => {
        this._openDetails(msg.MessageID)
      } } style={{backgroundColor : colors.grey6}}>

      <View style={styles.jobsRow}>
        <Grid>
          <Row style={{ paddingRight : 10}}>
            <Col size={1} backgroundColor={bgColor} style={{ flex: 0,width:63, justifyContent: 'center', alignItems: 'center'}}>
                 <Icon type='ionicon' name={mailIcon} color={iconColor}  size={30}></Icon>
            </Col>
             <Col style={{ justifyContent: 'center', alignItems: 'center',left:-25,width : 20}}>
                 <Icon type='ionicon' name={secndIcon} color={iconColor}  size={20}></Icon>
            </Col>
          <Col style={{  width : 1, borderStyle:'dashed', borderColor : '#969696', borderWidth : 1,left:-20}}></Col>
          <Col size={4} style={{ padding : 10,left:-25 }}>
            <Row style={{ marginBottom: 2}}>
              <Col> 
                  <Text style={styles.customerName}>
                    {(msg.Message !='' && msg.Message != null && String(msg.Message).length>50) ? 
                          String(msg.Message).substr(0,49) + ' ...': String(msg.Message) }</Text>
              </Col>
            </Row>
          </Col>
          <Col size={2.5} style={{ alignItems: 'flex-end',paddingTop: 10,paddingBottom: 10}}>
            <Row style={{ marginBottom: 3}}>
              <Col style={{ alignItems: 'flex-end'}}>
                  <Text style={styles.timeText}>{Datehelpers.GetFormattedTime(msg.TimeSent)}</Text>
                  <Text style={styles.timeText}>{Datehelpers.GetFormattedDate(msg.DateSent)}</Text>
              </Col>
            </Row>
            <Row>
               <Col style={{ alignItems: 'flex-end'}}>
                 <Icon type='ionicon' name='ios-arrow-forward-outline' color='#969696'  size={14}></Icon>
               </Col>
            </Row>
          </Col>
          </Row>
        </Grid>
      </View>
      </TouchableHighlight>
    )
  }

   _onRefresh = () => {
        this.setState({ isRefreshing: true });
        this.loadMessages();
    }

  render() {
console.log(this.props);
    if (this.state.messagesDS == null) {
      return;
    }

    return (
      <ScrollView refreshControl={
            <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="#ff0000"
                title="Loading..."
                titleColor="#00ff00"
                colors={['#4285f4', '#ea4335', '#fbbc05', '#34a853']}
            />
        }>
        <Spinner visible={this.state.loading} textStyle={{ color: '#FFF' }} />
         <View style={styles.outerAllRows}>
            <View style={styles.listTopLine}></View> 
            <List>
              <ListView enableEmptySections={true}
                dataSource={this.state.messagesDS}
                renderRow={this.renderMessageItem.bind(this)}
                />
            </List>
            <View style={styles.listBottomLine}></View> 
        </View>
      </ScrollView>
    );
  }
}

module.exports = Messages;
