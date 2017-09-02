import { Image, StyleSheet, View, Text } from 'react-native'
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel
} from 'react-native-elements'
import * as Storage from '../../lib/localstorage';
import colors from 'HSColors'
import styles from '../../styles/styles'

import { Actions } from 'react-native-router-flux'

class JobDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const jobDetails = this.props.jobDetails;
    if (!jobDetails) {
      return null
    }
    //let jobDetails = this.state.jobDetails;

    return (
      <View style={styles.detailBox}>  
       <View style={styles.singleLineBox}>
         <Grid>
            <Row>
              <Col>
                <Text style={styles.label}>Docket no.</Text>
              </Col>
              <Col style={{alignItems: 'flex-end'}}>
                <Text style={styles.labelText}>{jobDetails.DocketId}</Text>
              </Col>          
            </Row>
        </Grid>
       </View>  
       <View style={styles.dashedLineHorizontal}></View> 
        <View style={styles.twoLineBox}>
            <Grid>
                <Row>
                  <Col>
                    <Text style={styles.label}>Customer name</Text>
                    <Text style={styles.labelText}>{jobDetails.CustomerName}</Text>
                  </Col>          
                </Row>
            </Grid>
        </View>      
        <View style={styles.twoLineBox}>
         <Grid>
            <Row>
              <Col>
                 <Text style={styles.label}>Contact name</Text>
                  <Text style={styles.labelText}>{jobDetails.ContactName}</Text>
              </Col>          
            </Row>
         </Grid>
        </View>   
        <View style={[styles.twoLineBox,{ height:70}]}>
         <Grid>
            <Row>
               <Col>
                  <View>
                        <Text style={styles.label}>Tariff</Text>    
                 </View>
                  <View>
                        <Text style={styles.labelText}>{jobDetails.Tariff}</Text>    
                 </View>
              </Col>
              <Col>
               <View>
                         <Text style={styles.label}>Items</Text>    
                 </View>
                  <View>
                      <Text style={styles.labelText}>{jobDetails.Item}</Text>     
                 </View>
              </Col>      
            </Row>
         </Grid>
        </View>   
        <View style={styles.dashedLineHorizontal}></View> 
        <View style={[styles.twoLineBox,{paddingVertical : 20, height:70}]}>
         <Grid>
            <Row>
              <Col>
                <Text style={styles.label}>Account number</Text>
                 <Text style={styles.labelText}>{jobDetails.AccountCode}</Text>
              </Col>          
            </Row>
         </Grid>
        </View>  
      </View>
    )
  }
}

module.exports = JobDetail;
