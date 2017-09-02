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
import Datehelpers from '../../lib/datehelpers';
import Communications from 'react-native-communications';

var _ = require('lodash');

var styles = require('../../styles/styles');
import { Actions } from 'react-native-router-flux';

class AddressDetail extends React.Component {

  constructor(props) {
    super(props);

    this._loadAddress = this._loadAddress.bind(this);
    this._handleButton = this._handleButton.bind(this);
    this._openPhonecall = this._openPhonecall.bind(this);

    this.state = {
      addressDetails: null,
      arrivedAtDisabled : false

    };
  }

  _loadAddress() {

    let userId = 0;
    let addressId = this.props.addressId;
    let addressType = this.props.addressType.charAt(0);

    var user = Storage.get('userId').then((value) => {
      userId = value;

      this.props.userId = userId;
      let jobId = this.props.docketId;
      let that = this;

      Api.get('bookingaddress?userId=' + userId + '&addressId=' + addressId +
        '&type=' + addressType
      ).then(function (response) {

        console.log(response.data);

        let arrivedAtDisabled = (response.data.ArrivalTime != null) || (response.data.ArrivalDate != null);

        that.setState({ addressDetails: response.data, arrivedAtDisabled });
        Storage.set('routeAddressDetails', JSON.stringify(response.data)).then(() => { });
        Storage.set('address-' + addressId, JSON.stringify(response.data)).then(() => {
          console.log('saved address-' + addressId + ' in localstorage')
        })

      }).catch((err) => {
        console.log(err)

        if (err.Message == 'Network request failed'){
          // load from localstorage
          Storage.get('address-' + addressId).then((data) => {
            that.setState({ addressDetails: JSON.parse(data) });
          });
        }

      });
    });
  }

  componentWillMount() {
     this._loadAddress();
  }

  componentWillReceiveProps(){
     this._loadAddress();
  }

  _openPhonecall(phoneNumber){
      if(phoneNumber != '' && phoneNumber != null){
            Communications.phonecall(phoneNumber, true);
      }
  }

  _handleButton(address, type) {

    if (!address.items){
      address.items = "";
    }

    if (!address.comments){
      address.comments = "";
    }

    if (!address.receivedBy){
      address.receivedBy = "";
    }

    if (!address.signature){
      address.signature = "";
    }

    if (type === 'C') {
      Actions.poc({ address: address });
    }
    else {
      Actions.pod({ address: address });
    }
  }

  _handleArrivedAt() {

    let that = this;
    Api.post('arrived', {
      "userId": this.props.userId,
      "addressId": this.props.addressId,
      "DriverArrival": new Date(),
      "type": this.props.addressType.charAt(0)
    }).then(function (data) {

      that.setState({arrivedAtDisabled : true});

    }).catch((err) => { console.log(err);
    });
  }

  render() {

    const addressDetails = this.state.addressDetails;
    if (!addressDetails) {
      return null;
    };
    console.log(addressDetails)
    let btnText = (this.props.addressType.charAt(0)) === 'C' ? 'POB' : 'POD';

    return (
  <ScrollView style={{marginTop : 20}}>
    <View style={styles.detailBox}>
       <View style={[styles.singleLineBox,{paddingHorizontal : 0}]}>
            <Grid >
              <Row >
                <Col >
                  <Button borderRadius={5}  buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} disabled={this.state.arrivedAtDisabled} backgroundColor={colors.stumbleupon}  title="ARRIVED AT" onPress={() => this._handleArrivedAt()}></Button>
                </Col>
                <Col >
                  <Button borderRadius={5}  buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} disabled={!this.state.arrivedAtDisabled} backgroundColor={colors.stumbleupon}  title={btnText} onPress={() => this._handleButton({ addressId: this.props.addressId, receivedBy: addressDetails.SignBy, signature: addressDetails.Signature, items: String(addressDetails.Item), comments:addressDetails.Notes,pODDateTime:addressDetails.PODDateTime ,pOBDateTime:addressDetails.POBDateTime}, this.props.addressType.charAt(0))}></Button>
                </Col>
              </Row>
              <Row style={{ paddingVertical: 3 }}>
                <Col><Text></Text></Col>
              </Row>
              <Row>
                <Col>
                  <Button borderRadius={5}  buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} backgroundColor={colors.stumbleupon}  title="WAIT" onPress={() => Actions.waiting({ addressId: this.props.addressId, addressType: this.props.addressType.charAt(0), time:addressDetails.POBWtTime })}></Button>
                </Col >
                <Col><Button borderRadius={5}  buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} backgroundColor={colors.stumbleupon} disabled={!this.state.arrivedAtDisabled}  title="EXCEPTION" onPress={() => Actions.exception({ addressId: this.props.addressId, addressType: this.props.addressType.charAt(0), userId:this.props.userId  })}></Button></Col>
              </Row>
            </Grid>
      </View>
      <View style={styles.dashedLineHorizontal}></View>
      <View style={styles.singleLineBox}>
            <Grid>
               <Row>
                 <Col>
                   <Text style={styles.label}>Docket no.</Text>
                 </Col>
                 <Col style={{alignItems: 'flex-end'}}>
                   <Text style={styles.labelText}>{addressDetails.DocketId}</Text>
                 </Col>
               </Row>
            </Grid>
      </View>
      <View style={styles.dashedLineHorizontal}></View>
      <View style={styles.twoLineBox}>
            <Grid>
                <Row>
                  <Col>
                    <Text style={styles.label}>Address</Text>
                    <Text style={[styles.labelText]}>{addressDetails.Companyname}</Text>
                    <Text style={[styles.labelText,{fontSize: 13}]}>{addressDetails.Address}</Text>
                  </Col>
                </Row>
            </Grid>
      </View>
      <View style={styles.twoLineBox}>
            <Grid>
               <Row>
                <Col>
                  <Text style={styles.label}>Contact details</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.labelText}>{addressDetails.ContactDetails.ContactName}</Text>
                </Col>
                 <Col>
                 <TouchableHighlight onPress={() => this._openPhonecall(addressDetails.ContactDetails != null ? addressDetails.ContactDetails.ContactNo : "")}>
                           <Text style={[styles.labelText,{alignSelf: 'flex-end',fontSize:16}]}>{addressDetails.ContactDetails != null ? addressDetails.ContactDetails.ContactNo : ""}</Text>
                 </TouchableHighlight>
                </Col>
              </Row>
               <Row>
                  <Col>
                    <Text style={[styles.labelText,{fontSize: 12,color:'#969696'}]}>{addressDetails.ContactDetails.Note}</Text>
                  </Col>
              </Row>
            </Grid>
       </View>
       <View style={styles.dashedLineHorizontal}></View>
       <View style={[styles.twoLineBox,{ height:90}]}>
            <Grid>
               <Row>
                  <Col>
                     <View>
                           <Text style={styles.label}>Ready At</Text>
                    </View>
                     <View>
                           <Text style={[styles.labelText]}>{Datehelpers.GetFormattedTime(addressDetails.ReadyAtTime)}</Text>
                           <Text style={[styles.labelText,{fontSize: 13}]}>{Datehelpers.GetFormattedDate(addressDetails.ReadyAtDate)}</Text>
                    </View>
                 </Col>
                 <Col>
                    <View>
                            <Text style={styles.label}>Deadline</Text>
                    </View>
                     <View>
                         <Text style={[styles.labelText]}>{Datehelpers.GetFormattedTime(addressDetails.DeadlineTime)}</Text>
                         <Text style={[styles.labelText,{fontSize: 13}]}>{Datehelpers.GetFormattedDate(addressDetails.DeadlineDate)}</Text>
                    </View>
                 </Col>
               </Row>
            </Grid>
        </View>
    </View>

      </ScrollView>
    );
  }
}

module.exports = AddressDetail;
