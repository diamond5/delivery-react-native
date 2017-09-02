import { Image, StyleSheet, View, Text, TouchableOpacity,TouchableHighlight,
ScrollView } from 'react-native'
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel,Icon
} from 'react-native-elements'
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import * as Storage from '../../lib/localstorage';
import colors from 'HSColors'
import Api from '../../lib/api'
import styles from '../../styles/styles'
import Datehelpers from '../../lib/datehelpers'
import Communications from 'react-native-communications';
import { Actions } from 'react-native-router-flux'

class CompletedJob extends React.Component {
  constructor(props) {
    super(props);

    this._loadJob = this._loadJob.bind(this);
    this._openPhonecall = this._openPhonecall.bind(this);

    Storage.get('userId').then((value) => {
            this.setState({
                userId: value,
                jobId : this.props.docketId,
                jobDetails: null
            });
        });
  }

 componentWillMount() {
        let that = this;
        Storage.get('userId').then((value) => {
            that.setState({userId: value});
            that._loadJob();
        });
    }

    componentWillReceiveProps() {
        this._loadJob();
    }

    _openPhonecall(phoneNumber){
      if(phoneNumber != '' && phoneNumber != null){
            Communications.phonecall(phoneNumber, true);
      }
    }

 _loadJob() {
        let userId = this.state.userId;
            let jobId = this.props.docketId;
            let that = this;

            Api.get('completedjob?userId=' + userId + '&jobId=' + jobId).then(function (response) {
                console.log(response.data);
                that.setState({ jobDetails: response.data, userId : userId });

                // save in Storage
                Storage.set('completedjob-' + jobId, JSON.stringify(response.data)).then(() => {
                    console.log('saved completedjob-' + jobId + ' in localstorage');
                })

            }).catch((err) => {
                console.log(err)

                if (err.message == "Network request failed") {

                    // save in Storage
                    Storage.get('completedjob-' + jobId).then((data) => {
                        that.setState({ jobDetails: JSON.parse(data) });
                    });

                }

            });

    }

  


  render() {
      if (this.state == null) {
            return null;
        };
        console.log(this.state)
       const jobDetails = this.state.jobDetails;
       if (!jobDetails || !jobDetails.Address) {
         return null;
       }
    return (
            <ScrollView style={{ marginTop : 20 }}>
               <View style={[styles.detailBox]}> 
                   <View style={styles.singleLineBox}>
                       <Grid>
                          <Row>
                            <Col>
                              <Text style={styles.label}>Docket no.</Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}>
                              <Text style={styles.labelText}>{jobDetails.Address[0].DocketId}</Text>
                            </Col>          
                          </Row>
                       </Grid>
                  </View>  
              
                  <View style={styles.dashedLineHorizontal}></View> 
                  <View>

                    {
                    jobDetails.Address.map((item, i) => (
                      <View style={{paddingVertical : 0,backgroundColor: '#ffffff',}}>
                       <Grid>
                                  <Row>
                                    <Col style={{width: 50,paddingVertical : 20,paddingHorizontal : 10, minHeight:50}}>
                                        <Row size={1} style={{alignItems : 'flex-start'}}>
                                          <Col>
                                              <Icon name={item.Status == "Collection" ? "checkbox-blank-circle-outline":"map-marker"} type='material-community' color={item.Status == "Collection" ? colors.stumbleupon:'#4d4d4d'} size={28}></Icon>
                                          </Col>         
                                        </Row>
                                        <Row size={5} style={{ minHeight:100}}>
                                              <Col style={{ left:14 , width : 1, borderStyle:'dashed', borderColor : '#969696', borderWidth : 1, minHeight:100}}></Col>      
                                        </Row>

                                    </Col>
                                    <Col style={{paddingVertical : 20}}>
                                        <Row size={1} style={{alignItems : 'flex-start',paddingVertical : 5}}>
                                          <Col size={3}>
                                            <Text style={styles.label}>{item.Status == "Collection" ? "From":"To"}</Text>
                                          </Col>         
                                        </Row>
                                         <Row size={1} style={{paddingVertical : 3}}>
                                             <Col size={1} style={{alignItems : 'flex-start'}}>
                                               <Icon name="account" type='material-community' color='#4d4d4d' size={17}></Icon>
                                             </Col> 
                                             <Col size={9}>
                                               <Text style={styles.labelText}>{item.SignBy}</Text>
                                             </Col>         
                                        </Row>
                                        <Row size={3} style={{paddingVertical : 3}}>
                                             <Col size={1} style={{alignItems : 'flex-start'}}>
                                               <Icon name="map-marker" type='material-community' color='#4d4d4d' size={17}></Icon>
                                             </Col> 
                                             <Col size={9}>
                                               <Text style={[styles.labelText,{color: '#969696'}]}>{item.Companyname}</Text>
                                               <Text style={[styles.labelText,{color: '#969696'}]}>{item.Address}</Text>
                                             </Col>         
                                        </Row>
                                        <Row size={1} style={{paddingVertical : 3}}>
                                             <Col size={1} style={{alignItems : 'flex-start'}}>
                                               <Icon name="phone" type='material-community' color='#4d4d4d' size={17}></Icon>
                                             </Col> 
                                             <Col size={9}>
                                                <TouchableHighlight onPress={() => this._openPhonecall(item.ContactDetails != null ? item.ContactDetails.ContactNo : "")}>
                                                       <Text style={[styles.label,{fontSize:16}]}>{item.ContactDetails != null ? item.ContactDetails.ContactNo : ""}</Text>
                                                </TouchableHighlight>
                                             </Col>         
                                        </Row>
                                        <Row size={1} style={{paddingVertical : 3}}>
                                             <Col size={1} style={{alignItems : 'flex-start'}}>
                                               <Icon name="slack" type='material-community' color='#4d4d4d' size={17}></Icon>
                                             </Col> 
                                             <Col size={9}>
                                                  <Row>
                                                    <Col size={2.4} ><Text style={[styles.label,{fontSize: 15,}]}>{item.Status == "Collection" ? "Collected":"Delivered"}</Text></Col>
                                                    <Col size={6} ><Text style={styles.labelText}>{
                                                      item.Status == "Collection" ? 
                                                              Datehelpers.GetFormattedTime(item.POBTime)+', '+Datehelpers.GetFormattedDate(item.POBDate) :
                                                              Datehelpers.GetFormattedTime(item.PODTime)+', '+Datehelpers.GetFormattedDate(item.PODDate)}</Text></Col>
                                                  </Row>
                                             </Col>         
                                        </Row>
                                    </Col>
                                  </Row>
                              </Grid>
                               </View>))
                  }

                   </View>  
               </View>
            </ScrollView>
 
    )
  }
}

module.exports = CompletedJob
