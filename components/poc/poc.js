import {
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    AsyncStorage,TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import {
    List,
    ListItem,
    Grid,
    Col,
    Row,
    FormLabel,
    Button,
    FormInput,
    Icon
} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/Ionicons';
var SignaturePad = require('react-native-signature-pad');
import Spinner from 'react-native-loading-spinner-overlay';

import * as Storage from '../../lib/localstorage';
import colors from 'HSColors';
import Api from '../../lib/api';
import SyncHelper from '../../lib/synchelper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Datehelpers from '../../lib/datehelpers';
var _ = require('lodash');

var styles = require('../../styles/styles');;
import { Actions } from 'react-native-router-flux';

class Poc extends React.Component {

    constructor(props) {
        super(props);

        this._savePOC = this._savePOC.bind(this);
        this._save = this._save.bind(this);
        this._clearSign = this._clearSign.bind(this);

        Storage.get('userId').then((value) => {
            this.setState({
                userId: value,
                loading: false,
                signature: this.props.address.signature,
                items: this.props.address.items,
                receivedBy: this.props.address.receivedBy,
                comments: this.props.address.comments,
                isDateTimePickerVisible: false,
                pocDisabled:(this.props.address.pOBDateTime!=null),
                pobDateTimeStr:(new Date()).toISOString(),
                pobDateTime:(this.props.address.pOBDateTime!=null && this.props.address.pOBDateTime!='')
                            ? new Date(this.props.address.pOBDateTime):new Date(),
                time:(this.props.address.pOBDateTime!=null && this.props.address.pOBDateTime!='')
                ?Datehelpers.GetFormattedTimeFromDateTime(this.props.address.pOBDateTime):Datehelpers.GetFormattedTimeFromDateTime(new Date())
            });
        });
    }

    componentWillMount() {

    }

    _signaturePadError = (error) => {
        console.error(error);
    };

    _signaturePadChange = ({base64DataUrl}) => {
        this.setState({ signature: base64DataUrl })
    };

    _save(pocModel) {
        this.setState({ loading: true });
        let that = this;

        Api.post('pob', pocModel).then(function () {

            that.setState({ loading: false });
            Actions.pop({refresh : {} });

        }).catch((err) => {
            that.setState({ loading: false });
            if (err.message == 'Network request failed') {

                SyncHelper.addItemsToQueue('pocQueue', pocModel);
                Actions.pop({refresh : {}});
            }
        });
    }

    _savePOC() {

        if (!this.state.items){
            alert('Please enter items');
            return;
        }

        // if (!this.state.receivedBy){
        //     alert('Please enter received by');
        //     return;
        // }

        // if (!this.state.signature){
        //     alert('Please take signature');
        //     return;
        // }

        if (!this.state.pobDateTime){
            alert('Please select Time');
            return;
        }

        let pocModel = {
            "userId": this.state.userId,
            "addressId": this.props.address.addressId,
            "description": this.state.comments,
            "noOfItems": this.state.items,
            "recievedBy": this.state.receivedBy,
            "signature": this.state.signature,
            "pobDateTime":this.state.pobDateTimeStr
        };
        this._save(pocModel);
    }

    _clearSign(){
        this.setState({ signature : '-'});
        setTimeout( () => {
            this.setState({ signature : null });
        }, 10);
    }

    _showDateTimePicker = () =>{
        if(!this.state.pocDisabled){
            this.setState({ isDateTimePickerVisible: true })
        }
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

    _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date)

    if(date >= new Date()){
        this.setState({
           pobDateTime: date,
           time:Datehelpers.GetFormattedTimeFromDateTime(date),
           pobDateTimeStr:date.toISOString(),
        })

    }
    else{
        alert("Please select more then currnt time");
    }
    this._hideDateTimePicker()
  }

    render() {

        if (this.state == null) {
            return null;
        };

        let signature = this.state.signature;


        const pocDisabled = this.state.pocDisabled;
        let signatureBox = null;
        let clearButton = null;

        if ((signature && pocDisabled)|| this.state.signature == '-') {
            signatureBox = <Image style={{
                flex: 1,
                // height: 100,
                resizeMode: 'contain'
            }} source={{
                uri: signature
            }} />;
        } else {
            signatureBox = <SignaturePad onError={this._signaturePadError} onChange={this._signaturePadChange} value={this.state.signature} style={{
                flex: 1,
                backgroundColor: '#FFF',
                // height: 100
            }} />;
         }

         if (!pocDisabled) {
             clearButton = <TouchableHighlight onPress={() => this._clearSign() }>
              <View>
          <Text style={{ color: colors.stumbleupon, alignSelf: 'center' }}>
            clear sign
            </Text>
            </View>
            </TouchableHighlight>;
         }

        return (
            <ScrollView style={{ paddingTop: 10, flex: 1, backgroundColor: colors.grey6 }}>
                <Spinner visible={this.state.loading}  />
                <View style={{ paddingTop: 5 }}>
                    <View style={[styles.singleLineBox,{paddingHorizontal : 0, minHeight:50, backgroundColor: colors.grey6, paddingVertical : 13}]}>
                      <Grid>
                          <Row>
                              <Col>
                                  <Button borderRadius={5} buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} title="CANCEL" onPress={() => Actions.pop({refresh : {}})}></Button>
                              </Col>
                              <Col>
                                  <Button borderRadius={5} buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} disabled={pocDisabled} backgroundColor={colors.stumbleupon}  title="DONE" onPress={() => this._savePOC()}></Button>
                              </Col>
                          </Row>
                      </Grid>
                    </View>

                 <View style={[styles.singleLineBox,{paddingHorizontal :0,marginHorizontal :8, backgroundColor: '#FFF', marginBottom :0,paddingBottom : 0}]}>
                  <Grid>
                  <Row size={1}>
                      <Col size={5}>
                            <Row size={1}>
                                <Col size={4.5}>
                                    <Icon name="package" type='material-community' color='#4d4d4d' size={26}></Icon>
                                </Col>
                                <Col size={4}>
                                    <Text style={[ styles.labelText ]}>Items</Text>
                                </Col>
                                <Col size={5}>
                                    <FormInput keyboardType='numeric' editable={!pocDisabled} containerStyle={{ marginTop: -5}} inputStyle={{color: colors.stumbleupon}} value={this.state.items} placeholder={pocDisabled ? '' :'0'} onChangeText={text => this.setState({ items: text })} />
                                </Col>
                            </Row>
                      </Col>
                      <Col size={5}>
                            <Row size={1}>
                                <Col size={3}>
                                    <Icon name="clock" type='material-community' color='#4d4d4d' size={26}></Icon>
                                </Col>
                                <Col size={4}>
                                    <Text style={[ styles.labelText ]}>Time</Text>
                                </Col>
                                <Col size={4}>
                                 <DateTimePicker
                                                isVisible={this.state.isDateTimePickerVisible}
                                                onConfirm={this._handleDatePicked}
                                                onCancel={this._hideDateTimePicker}
                                                mode="time"
                                                titleIOS="Pick a time"
                                                is24Hour={true}
                                                date={this.state.pobDateTime}
                                            />
                                     <TouchableOpacity
                                            onPress={this._showDateTimePicker}>

                                             <Text style={{
                                                    width:40,
                                                    color: colors.stumbleupon,
                                                    marginTop: 3,
                                                    alignSelf: 'center',
                                                    borderBottomWidth: pocDisabled ? 1 :2,
                                                    borderBottomColor: pocDisabled ? colors.grey6:colors.grey4
                                                }}>{this.state.time}</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                      </Col>
                    </Row>
                  <View style={styles.controlBottomLine}></View>
                  <Row size={2} style={{paddingTop : 10, height: 75}}>
                      <Col size={1.8}>
                          <Icon name="account" type='material-community' color='#4d4d4d' size={26}></Icon>
                      </Col>
                      <Col size={9}>
                          <Text style={[styles.labelText,{color:'#969696'}]}>Received by</Text>
                          <TextInput
                            underlineColorAndroid={"transparent"}
                            style={{flex: 1, paddingLeft: 0}}
                            value={this.state.receivedBy}
                            editable={!pocDisabled}
                            containerStyle={{ marginLeft: 0 }}
                            inputStyle={[styles.labelText]}
                            placeholder={pocDisabled ? '' :'Please enter name'}
                            onChangeText={text => this.setState({ receivedBy: text })} />
                      </Col>
                  </Row>
                  <View style={styles.controlBottomLine}></View>
                  <Row size={1} style={{paddingTop : 10, height: 75}}>
                      <Col size={1.8}>
                          <Icon  name="message-reply-text" type='material-community' color='#969696' size={26}></Icon>
                      </Col>
                      <Col size={9}>
                          <Text style={[styles.labelText,{color:'#969696'}]}>Comments</Text>
                          <TextInput
                            underlineColorAndroid={"transparent"}
                            style={{flex: 1, paddingLeft: 0}}
                            value={this.state.comments}
                            editable={!pocDisabled}
                            containerStyle={{ marginLeft: 0 }}
                            multiline={true}
                            numberOfLines={1}
                            inputStyle={[styles.labelText]}
                            placeholder={pocDisabled ? "" :"Please enter comments here"}
                            onChangeText={text => this.setState({ comments: text })} />
                      </Col>
                  </Row>
                  <View style={styles.controlBottomLine}></View>
                  <Row size={1} style={{paddingTop : 10,paddingHorizontal :10}}>
                      <Col size={3}><Text style={styles.labelText}>Signature</Text></Col>
                      <Col size={7} style={{alignItems : 'flex-end'}}>
                          {clearButton}
                      </Col>
                  </Row>
                  <Row size={3} style={{height: 200, borderColor : colors.grey4, borderWidth : 1,borderRadius:4,marginHorizontal :10}}>
                      {signatureBox}
                  </Row>
                </Grid>
                <View style={styles.controlBottomLine}></View>
            </View>

        </View>
     </ScrollView>
        )
    }
}

module.exports = Poc;
