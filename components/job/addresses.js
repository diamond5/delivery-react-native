import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { Component } from 'react';
import {
  List,
  ListItem,
  Grid,
  Col,
  Row,
  FormLabel
} from 'react-native-elements'
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import * as Storage from '../../lib/localstorage';
import colors from 'HSColors'
import Api from '../../lib/api'
import styles from '../../styles/styles'
import jobStyles from '../jobs/jobs.styles'

import { Actions } from 'react-native-router-flux'

class Addresses extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const jobDetails = this.props.jobDetails;
    if (!jobDetails || !jobDetails.Address) {
      return null
    }
    return (
      <View style={{
    flex : 1,
    padding : 0,
    margin : 0,
    marginTop : -22,
    marginBottom : 10
  }}>
      <View style={jobStyles.listTopLine}></View>
      <List style={{padding : 0,backgroundColor: colors.grey6}}>
        {
          jobDetails.Address.map((item, i) => (
            <TouchableOpacity key={i} style={{elevation : 3, margin : 10, borderRadius : 3,backgroundColor: '#FFF', marginTop: 5, marginBottom: 0}}
             onPress={() => Actions.addressdetail({ title: item.Status , addressId: item.AddressId, addressType: item.Status, userId : this.props.userId })}>
              <ListItem
                title={
                  <Text style={styles.label}>Ready at - {item.Status} address</Text>
                }
                style={{backgroundColor: colors.grey6}}
                subtitle={
                  <View style={styles.subtitleView}>
                    {/*<Text>{item.Companyname}</Text>*/}
                    <Text style={styles.labelText}>{item.Address}</Text>
                  </View>
                }

                />
            </TouchableOpacity>))
        }
      </List>
       <View style={jobStyles.listBottomLine}></View>
      </View>
    )
  }
}

module.exports = Addresses
