import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from 'HSColors';
// import Icon from 'react-native-vector-icons/Ionicons'

export default class TabIcon extends React.Component {

  render() {

    let page = this.props.title;
    let tab = null;
    let icon = '';
    let iconType = '';

    if (page === 'Jobs List') {
      icon = 'clipboard-text';
      iconType='material-community';
    }
    else if (page === 'Messages') {
      icon = 'md-text';
      iconType='ionicon';
    }
    else if (page === 'Break') {
      icon = 'coffee';
      iconType='material-community';
    }
this.props.selected
    return (<View style={{
      alignItems: 'center'
    }}>
      <Icon name={icon} type={iconType} color={this.props.selected ? colors.stumbleupon :'#969696'} size={29} ></Icon>
    </View>)

  }
}
