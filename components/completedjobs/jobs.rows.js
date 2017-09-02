var _ = require('lodash')
import {
  StyleSheet,
  View,
  Modal,
  TouchableHighlight,
  ListView,
  Text
} from 'react-native'
import React, { Component } from 'react';
import { Grid, Col, Row,Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'

import colors from 'HSColors'
import styles from './jobs.styles'
import Datehelpers from '../../lib/datehelpers'

function _openDetails(docketId) {
  Actions.completedjob({ docketId: docketId });
}

export function RenderJobsItem(job) {
    console.log(job);
  return (

    <TouchableHighlight onPress={() => {
      _openDetails(job.JobId)
    } } style={{backgroundColor : colors.grey6}}>
     <View style={[styles.jobsRow,{minHeight: 65}]}>
        <Grid>
          <Row style={{ paddingRight : 10}}>
            <Col size={1} backgroundColor={colors.stumbleupon} style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[{color: '#FFF'},styles.docketNoText]}>{job.DocketId}</Text>
            </Col>
          <Col style={{  width : 1, borderStyle:'dashed', borderColor : '#969696', borderWidth : 1}}></Col>
          
          <Col size={2} style={{paddingHorizontal : 7,paddingVertical : 6}}>
            <Row>
              <Col> 
                  <Text style={[styles.customerName,{fontSize:11}]}>From:</Text>
                  <Text style={[styles.contactName,{fontSize:11}]}>{
                    job.Address[0].Status == "Collection" ? job.Address[0].Address:
                   (job.Address.length > 1 && job.Address[1].Status == "Collection")? job.Address[1].Address:""}</Text>
              </Col>
            </Row>
          </Col>
          <Col size={2} style={{paddingHorizontal : 7,paddingVertical : 8}}>
            <Row>
              <Col> 
                  <Text style={[styles.customerName,{fontSize:11}]}>To:</Text>
                  <Text style={[styles.contactName,{fontSize:11}]}>{
                    job.Address[0].Status == "Delivery" ? job.Address[0].Address:
                   (job.Address.length > 1 && job.Address[1].Status == "Delivery")? job.Address[1].Address:""}</Text>
              </Col>
            </Row>
          </Col>
          <Col size={0.1} style={{ alignItems: 'flex-end'}}>
              <View style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                <View>
                    <Icon type='ionicon' name='ios-arrow-forward-outline' color='#969696'  size={18}></Icon>
                </View>
            </View>
          </Col>
          </Row>
        </Grid>
      </View>
    </TouchableHighlight>

  )
}
