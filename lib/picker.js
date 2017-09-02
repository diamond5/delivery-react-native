'use strict'

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Picker,
  Modal,
  TouchableOpacity,
  Text,
  Button,
  PixelRatio
} from 'react-native';
import _ from 'lodash';

export default class PickerView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pickerVisible: false,
      selectedValue: this.props.selectedValue
    }
  }

  showPicker = () => {
    this.setState({
      pickerVisible: true,
      selectedValue: this.props.selectedValue ? this.props.selectedValue : (this.props.items[0].value)
    })
  }

  _hidePicker = () => {
    this.setState({
      pickerVisible: false,
    })
  }

  _confirm = () => {
    this.props.onValueChange(this.state.selectedValue)
    this.setState({
      pickerVisible: false
    })

    if (this.props.onClosePicker)
      this.props.onClosePicker()
  }

  _renderItems() {
    var itemsData = this.props.items

    return _.map(itemsData, (item, index) => {
      return <Picker.Item key={index} label={item.label} value={item.value} />
    });
  }

  render() {
    var items = this._renderItems()
    var selectedItem = _.find(this.props.items, (item) => item.value === this.props.selectedValue)
    var selectedValue = selectedItem ? selectedItem.label : (this.props.placeholder ? this.props.placeholder : '')

    return (
      <TouchableOpacity style={this.props.style} onPress={this.showPicker}>
        <Text style={this.props.textStyle}>{selectedValue}</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.pickerVisible}
          onRequestClose={this._hidePicker}
          >
          <TouchableOpacity onPress={this._hidePicker} style={styles.spaceContainer}></TouchableOpacity>
          <View style={styles.buttonBar}>
            <Button title="Cancel" color={'grey'} onPress={this._hidePicker}/>
            <View style={styles.buttonBarSpace}></View>
            <Button title={this.props.confirmBtnText ? this.props.confirmBtnText : "Confirm"} onPress={this._confirm}/>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={this.state.selectedValue}
              onValueChange={(selectedValue) => this.setState({selectedValue: selectedValue})}
              >
              {items}
            </Picker>
          </View>
        </Modal>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  spaceContainer: {
    flex: 1
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  buttonBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: 'grey'
  },
  buttonBarSpace: {
    flex: 1
  }
});
