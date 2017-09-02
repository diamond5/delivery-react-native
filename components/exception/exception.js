import {
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,TouchableHighlight,
    TouchableOpacity,
    Picker,
    Platform
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
import Spinner from 'react-native-loading-spinner-overlay';
import PickerView from '../../lib/picker';

import * as Storage from '../../lib/localstorage';
import colors from 'HSColors';
import Api from '../../lib/api';

var _ = require('lodash');

var styles = require('../../styles/styles');
import { Actions } from 'react-native-router-flux';
var ImagePicker = require('react-native-image-picker');
const Item = Picker.Item;
class Exception extends React.Component {

    constructor(props) {
        super(props);

        this._saveException = this._saveException.bind(this);
        this._clearImg = this._clearImg.bind(this);
        this._captureImage = this._captureImage.bind(this);

        this.state ={
            exceptionImg : '-',
            exceptionImgStr : '-',
            exceptionTypeId:0,
            comments:"",
            exceptionTypes: null,
            loading: true,
            exceptionDisabled:false
         };

        Storage.get('userId').then((value) => {
            this.setState({
                userId: value
            });
        });
    }

    componentWillMount() {
        this.loadExceptionTypes();
    }

    loadExceptionTypes() {

        let userId = this.props.userId == null? this.state.userId : this.props.userId;
        let addressId = this.props.addressId;
        let addressType = this.props.addressType;
        let that = this;

        //console.log({ "userId" : userId,"type":addressType, "addressId":addressId})
         Api.post('bookingexception',{ "userId" : userId,"type":addressType, "addressId":addressId}).then(function (response) {
            //console.log(response)
            if(response.data.bookingException){
                let imgStr = (response.data.bookingException.ExceptionImage)?('data:image/jpeg;base64,' + response.data.bookingException.ExceptionImage):'-';
                    that.setState({
                        exceptionTypes: response.data.exceptionTypes,
                        loading: false,
                        exceptionImg : imgStr,
                        exceptionTypeId:response.data.bookingException.DriverExceptionID,
                        comments:response.data.bookingException.Description,
                        exceptionDisabled:true
                    });
            }
            else{
                    that.setState({
                        exceptionTypes: response.data.exceptionTypes,
                        loading: false
                    });
            }

            Storage.set('exceptionlist', JSON.stringify(response.data.exceptionTypes)).then(() => {
                console.log('added exceptionlist to storage');
            });

        }).catch((err) => {
            if (err.message == 'Network request failed') {
                Storage.get('exceptionlist').then((data) => {
                    that.setState({
                         exceptionTypes: JSON.parse(data),
                         loading: false
                    });
                });
            }
            that.setState({
                    loading: false,
             });
        });
    }

    _saveException() {

         if (this.state.exceptionTypeId == 0){
            alert('Please setect exception type');
            return;
        }

        if (!this.state.comments){
            alert('Please add comments');
            return;
        }

        if (!this.state.exceptionImg || this.state.exceptionImg == '-'){
            alert('Please take image of exception');
            return;
        }

        let exceptionModel = {
            "userId": this.state.userId,
            "addressId": this.props.addressId,
            "type": this.props.addressType,
            "exceptionTypeId": this.state.exceptionTypeId,
            "description": this.state.comments,
            "addPhoto": this.state.exceptionImgStr
        };

        this.setState({ loading: true });
        let that = this;

        Api.post('exception', exceptionModel).then(function () {

            that.setState({ loading: false });
            Actions.pop({refresh : {} });

        }).catch((err) => {
            that.setState({ loading: false });
            Actions.pop({refresh : {}});
        });
    }

    _captureImage() {
         var options = {
              title: 'Capture Exception Image',
              cameraType:'back',
              mediaType:'photo',
              rotation:0,
              storageOptions: {
                skipBackup: true,
                cameraRoll:true
              }
            };

            /**
             * The first arg is the options object for customization (it can also be null or omitted for default options),
             * The second arg is the callback which sends object: response (more info below in README)
             */
            ImagePicker.launchCamera(options, (response) => {
              //console.log('Response = ', response);

              if (response.didCancel) {
                console.log('User cancelled image picker');
              }
              else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              }
              else {

                let source = 'data:image/jpeg;base64,' + response.data;
                this.setState({
                  exceptionImg: source,
                  exceptionImgStr:response.data
                });
              }
            });
    }

    _clearImg(){
        this.setState({
            exceptionImg : '-',
            exceptionImgStr:'-'
        });
        setTimeout( () => {
            this.setState({
                exceptionImg : null,
                exceptionImgStr : null
             });
        }, 10);
    }


    render() {
        if (this.state == null) {
            return null;
        };

        let imgBox = null;
        let clearButton = null;
        let exceptionListItem = [];
        exceptionListItem.push(<Item label="Select Exception"  color={colors.grey8} value={0} />);
        if (this.state.exceptionImg != null && this.state.exceptionImg  != '-') {
            imgBox = <Image style={{
                flex: 1,
                height: 200,
                resizeMode: 'contain'
            }} source={{
                uri: this.state.exceptionImg
            }} />;
        } else {
            imgBox = <View style={{flex: 1,alignItems : 'center',justifyContent:'center', height: 200}}>
                                <TouchableHighlight onPress={() => this._captureImage() }>
                                    <View style={{flex: 1,alignItems : 'center',justifyContent:'center', height: 100}}>
                                        <Text style={{ color: colors.stumbleupon, alignSelf: 'center' }}>
                                            capture image
                                        </Text>
                                    </View>
                                </TouchableHighlight></View>;
         }

        if (!this.state.exceptionDisabled) {
            clearButton =  <TouchableHighlight onPress={() => this._clearImg() }>
              <View>
                    <Text style={{ color: colors.stumbleupon, alignSelf: 'center' }}>
                             clear image
                    </Text>
             </View>
            </TouchableHighlight>;
        }

        if (this.state.exceptionTypes != null && this.state.exceptionTypes.length > 0 ) {
          this.state.exceptionTypes.map((item, i) => (
            exceptionListItem.push( <Item key={i} label={item.DriverExceptionName}  color={colors.grey8} value={item.DriverExceptionID} />)
          ));
        }

        return (
            <ScrollView style={{ paddingTop: 10, flex: 1, backgroundColor: colors.grey6 }}>
                <Spinner visible={this.state.loading}  />
                <View style={{ paddingTop: 10, flex: 1}}>
                <View style={[styles.singleLineBox,{paddingHorizontal : 0, minHeight:50, backgroundColor: colors.grey6, paddingVertical : 13}]}>
                  <Grid>
                      <Row>
                          <Col>
                              <Button borderRadius={5} buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} title="CANCEL" onPress={() => Actions.pop({refresh : {}})}></Button>
                          </Col>
                          <Col>
                           <Button borderRadius={5} buttonStyle={{paddingHorizontal : 22,paddingVertical : 7}} disabled={this.state.exceptionDisabled} backgroundColor={colors.stumbleupon} title="SUBMIT" onPress={() => this._saveException()}></Button>
                          </Col>
                      </Row>
                  </Grid>
                </View>

                 <View style={[styles.singleLineBox,{paddingHorizontal :0,marginHorizontal :8, backgroundColor: '#FFF', marginBottom :0,paddingBottom : 0}]}>
                  <Grid>
                    <Row size={1} style={{height: 50}}>
                        <Col size={1.8}>
                            <Icon name="alert-box" type='material-community' color='#4d4d4d' size={26}></Icon>
                        </Col>
                        <Col size={9}>
                            {
                              Platform.OS == 'android' ? (<Picker
                                    selectedValue={this.state.exceptionTypeId}
                                    style={{backgroundColor:'#FFF'}}
                                    enabled = {!this.state.exceptionDisabled}
                                    onValueChange={(text) => {
                                        this.setState({ exceptionTypeId: text })
                                        }}
                                    mode="dropdown">
                                    {exceptionListItem}
                                </Picker>) : (
                                <PickerView
                                  style={{
                                    height: 30,
                                    justifyContent: 'center'
                                  }}
                                  textStyle={[styles.labelText, {
                                    color: colors.grey8
                                  }]}
                                  placeholder="Select Exception"
                                  selectedValue={this.state.exceptionTypeId}
                                  onValueChange={(exceptionTypeId) => this.setState({exceptionTypeId})}
                                  items={_.map(this.state.exceptionTypes, (exceptionType) => ({value: exceptionType.DriverExceptionID, label: exceptionType.DriverExceptionName}))}
                                  >
                                </PickerView>
                                )
                            }
                        </Col>
                    </Row>
                   <View style={styles.controlBottomLine}></View>
                  <Row size={1} style={{paddingTop : 10, height: 75}}>
                    <Col size={1.8}>
                      <Icon  name="message-reply-text" type='material-community' color='#969696' size={26}></Icon>
                    </Col>
                    <Col size={9} style={{marginRight :10}}>
                      <Text style={[styles.labelText,{color:'#969696'}]}>Comments</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={{flex: 1, marginTop: 5, paddingLeft: 0}}
                        value={this.state.comments} editable={!this.state.exceptionDisabled}
                        containerStyle={{ marginLeft: 0 }}
                        multiline={true} numberOfLines={1}
                        inputStyle={[styles.labelText]}
                        placeholder={this.state.exceptionDisabled ? '' :"Please enter comments here"}
                        onChangeText={text => this.setState({ comments: text })} />
                    </Col>
                  </Row>
                  <View style={styles.controlBottomLine}></View>
                  <Row size={1} style={{paddingTop : 10,marginRight :10}}>
                      <Col size={1.8}>
                          <Icon  name="camera" type='material-community' color='#4d4d4d' size={26}></Icon>
                      </Col>
                      <Col size={4}><Text style={styles.labelText}>Add Photo</Text></Col>
                      <Col size={5} style={{alignItems : 'flex-end'}}>
                          {clearButton}
                      </Col>
                  </Row>
                  <Row size={3} style={{marginTop : 10,borderColor : colors.grey4, borderWidth : 1,borderRadius:4,marginHorizontal :10}}>
                      {imgBox}
                  </Row>

                   {/*<Row size={1} style={{paddingTop : 10,paddingHorizontal :10}}>
                      <Col>
                          <Button borderRadius={5} buttonStyle={{paddingHorizontal : 25,paddingVertical : 9}} title="CANCEL" onPress={() => Actions.pop({refresh : {}})}></Button>
                      </Col>
                      <Col>
                       <Button borderRadius={5} buttonStyle={{paddingHorizontal : 25,paddingVertical : 9}} disabled={this.state.exceptionDisabled} backgroundColor={colors.stumbleupon} title="SUBMIT" onPress={() => this._saveException()}></Button>
                      </Col>
                  </Row>*/}
                </Grid>
                  <View style={styles.controlBottomLine}></View>
            </View>

        </View>
     </ScrollView>
        )
    }
}

module.exports = Exception;
