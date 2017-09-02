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
import { Grid, Col, Row } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'

import colors from 'HSColors'
import styles from './jobs.styles'
import generalStyles from '../../styles/styles'
import Datehelpers from '../../lib/datehelpers'

function _openDetails(docketId) {
  Actions.job({ docketId: docketId });
}

export function RenderJobsItem(job) {

  let deliveryAddres = _.filter(job.Address, (s) => s.Status == "Delivery")[0];
  let time = Datehelpers.GetFormattedTime(job.Time)
  let collectionBadge;
  let deliveryBadge;

  let docketBgColor = (job.Status === 'Allocated')
    ? colors.stumbleupon
    : '#FFF'
  let docketColor = (job.Status === 'Allocated')
    ? '#FFF'
    : colors.stumbleupon

  if (job.Status === "POD") {
    deliveryBadge = <Text style={styles.deliveryBadge}>Delivered</Text>
  } else if (job.Status === "POB") {
    collectionBadge = <Text style={styles.collectionBadge}>Collected</Text>
  }

  return (
    <TouchableHighlight onPress={() => {
      _openDetails(job.JobId)
    } } style={{backgroundColor : colors.grey6}}>
      <View style={styles.jobsRow}>
        <Grid>
          <Row style={{ paddingRight : 10}}>
            <Col size={1} backgroundColor={docketBgColor} style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {/*<View style={[generalStyles.bevelCorner, generalStyles.topRight]}></View>
                <View style={[generalStyles.bevelCorner, generalStyles.bottomRight]}></View>*/}
                <Text style={[{color: docketColor},styles.docketNoText]}>{job.DocketId}</Text>
            </Col>
          <Col style={{  width : 1, borderStyle:'dashed', borderColor : '#969696', borderWidth : 1}}></Col>
          <Col size={3} style={{ padding : 10 }}>
          {/*<View style={[generalStyles.obevelCorner, generalStyles.topLeft]}></View>
          <View style={[generalStyles.obevelCorner, generalStyles.bottomLeft]}></View>*/}
            <Row style={{ marginBottom: 8}}>
              <Col>
                  <Text style={styles.customerName}>{job.CustomerName}</Text>
              </Col>
            </Row>
            <Row>
              <Col>
                  <Text style={styles.contactName}>{job.ContactName}</Text>
              </Col>
            </Row>
          </Col>
          <Col size={1.6} style={{ alignItems: 'flex-end',paddingTop: 10,paddingBottom: 10}}>
            <Row style={{ marginBottom: 8}}>
              <Col style={{ alignItems: 'flex-end'}}>
                  <Text style={styles.timeText}>{time}</Text>
              </Col>
            </Row>
            <Row>
                 {deliveryBadge}{collectionBadge}
            </Row>
          </Col>
          </Row>
        </Grid>
      </View>
    </TouchableHighlight>

  )
}
