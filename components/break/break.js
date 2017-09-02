import { Image, StyleSheet, View, Text, ScrollView, TextInput,Picker, Platform } from 'react-native'
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel, Button, FormInput,Icon
} from 'react-native-elements'
//import Icon from 'react-native-vector-icons/Ionicons'
var SignaturePad = require('react-native-signature-pad');
import PickerView from '../../lib/picker';

import * as Storage from '../../lib/localstorage';
import colors from 'HSColors';
import Api from '../../lib/api';

var styles = require('../../styles/styles');
import { Actions } from 'react-native-router-flux';
const Item = Picker.Item;
class Break extends React.Component {

  constructor(props) {
    super(props);

    this._gotobreak = this._gotobreak.bind(this);
    this._offbreak = this._offbreak.bind(this);

    this.state = {
      onbreak: false,
      time:10
    };

    Storage.get('userId').then((value) => {
      this.setState({
        userId: value
      });
    });

    Storage.get('onbreak').then((value) => {
      this.setState({
        onbreak: value
      });
    });

  }

  componentDidMount() {
  }

  _gotobreak() {

    if(!this.state.time){
      alert('Please select time');
      return;
    }

    if(!this.state.comments){
      alert('Please enter comments');
      return;
    }

    let that = this;
    Api.post('gotobreak', { time: this.state.time, userId: this.state.userId, feedback: this.state.comments }).then(function (data) {

      Storage.set('onbreak', 'true').then((value) => {
        console.log('driver is on break');
           that.setState({
            onbreak : 'true'
           });
      });

      console.log(data);

    }).catch((err) => {
      console.log(err);
    });
  }

  _offbreak() {

    let that = this;
    Api.post('offbreak', { userId: this.state.userId }).then(function (data) {

      Storage.set('onbreak', 'false').then((value) => {
          that.setState({
            onbreak : 'false'
          });
      });

      console.log(data);

    }).catch((err) => {

    });
  }

  render() {

    if (this.state.onbreak == 'true') {
      return (
        <View style={{ paddingTop: 40, paddingLeft: 20, paddingRight: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.labelText, { margin: 10 ,fontSize: 15}]}>You are on a break</Text>
          <Button borderRadius={5}  title="Go off break" backgroundColor={colors.stumbleupon} onPress={() => this._offbreak()}></Button>
        </View>
      )
    }
    else {
      return (
        <ScrollView style={{ paddingTop: 20, flex: 1, backgroundColor: colors.grey6 }}>

<View style={{ paddingTop: 0, marginTop:15, marginHorizontal:7}}>
      <View style={[styles.singleLineBox,{paddingHorizontal : 10}]}>
          <Grid>
              <Row>
                <Col style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[styles.labelText,{ fontSize: 23}]}>Go on a Break</Text>
                </Col>
            </Row>
          </Grid>
      </View>
       <View style={[styles.singleLineBox,{paddingHorizontal : 10, marginVertical:3,paddingVertical : 10}]}>
          <Grid>
              <Row>
                <Col style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingVertical:5}}>
                  <Text style={[styles.labelText,{color:colors.grey8}]}>Select Min</Text>
                </Col>
              </Row>
              <Row>
                <Col style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingVertical:5}}>
                {
                  Platform.OS == 'android' ? (
                      <Picker
                        selectedValue={this.state.time}
                        style={{width: 220,backgroundColor:'#FFF'}}
                        onValueChange={(text) => this.setState({ time: text })}
                        mode="dropdown">
                        <Item label="10 min"  color={colors.grey8} value={10} />
                        <Item label="15 min"  color={colors.grey8} value={15} />
                        <Item label="20 min"  color={colors.grey8} value={20} />
                        <Item label="25 min"  color={colors.grey8} value={25} />
                        <Item label="30 min"  color={colors.grey8} value={30} />
                        <Item label="35 min"  color={colors.grey8} value={35} />
                        <Item label="40 min"  color={colors.grey8} value={40} />
                        <Item label="45 min"  color={colors.grey8} value={45} />
                        <Item label="50 min"  color={colors.grey8} value={50} />
                        <Item label="55 min"  color={colors.grey8} value={55} />
                        <Item label="60 min"  color={colors.grey8} value={60} />
                      </Picker>
                    ) : (
                      <PickerView
                        style={{
                          width: 220,
                          height: 50,
                          backgroundColor:'#FFF',
                          justifyContent: 'center'
                        }}
                        textStyle={[styles.labelText, {
                          color: colors.grey8,
                          paddingLeft: 15
                        }]}
                        placeholder="Select"
                        selectedValue={this.state.time}
                        onValueChange={(time) => this.setState({time})}
                        items={[{value: 10, label: "10 min"},
                                {value: 15, label: "15 min"},
                                {value: 20, label: "20 min"},
                                {value: 25, label: "25 min"},
                                {value: 30, label: "30 min"},
                                {value: 35, label: "35 min"},
                                {value: 40, label: "40 min"},
                                {value: 45, label: "45 min"},
                                {value: 50, label: "50 min"},
                                {value: 55, label: "55 min"},
                                {value: 60, label: "60 min"},
                              ]}
                        >
                      </PickerView>
                    )
                }
                </Col>
              </Row>
          </Grid>
      </View>
       <View style={[styles.singleLineBox,{paddingHorizontal : 10, marginVertical:1,paddingVertical : 10}]}>
          <Grid>
              <Row>
                <Col style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingVertical:5}}>
                  <Text style={[styles.labelText,{color:colors.grey8}]}>Comments</Text>
                </Col>
              </Row>
              <Row>
                <Col style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingVertical:5}}>
                    <Row style={{backgroundColor: "#FFF"}}>
                       <Col size={1.3} style={{backgroundColor: "#FFF",paddingVertical:5}}>
                            <Icon name="message-reply-text" type='material-community' color={colors.grey8} size={26}></Icon>
                       </Col>
                       <Col size={9} style={{backgroundColor: "#FFF"}}>
                          <TextInput
                            inputStyle={[styles.grey8]}
                            multiline={true}
                            style={{backgroundColor: "#FFF", flex: 1}}
                            numberOfLines={2} placeholder="comments"
                            onChangeText={(text) => this.setState({ comments: text })}
                            />
                        </Col>
                    </Row>
                </Col>
              </Row>
          </Grid>
      </View>

      <View style={[styles.singleLineBox,{paddingHorizontal : 0, minHeight:70, marginVertical:2,paddingVertical : 10}]}>
              <Grid>
                  <Row>
                      <Col>
                          <Button borderRadius={5} buttonStyle={{paddingHorizontal : 25,paddingVertical : 9}} title="CANCEL" onPress={() => Actions.pop({refresh : {}})}></Button>
                      </Col>
                      <Col>
                       <Button borderRadius={5} buttonStyle={{paddingHorizontal : 25,paddingVertical : 9}} backgroundColor={colors.stumbleupon} title="SUBMIT" onPress={() => this._gotobreak()}></Button>
                      </Col>
                  </Row>
              </Grid>
        </View>
 </View>
        </ScrollView>
      )
    }
  }
}

module.exports = Break;
