import { Image, StyleSheet, View, Text, NetInfo } from 'react-native'
import React, { Component } from 'react';
import { List, ListItem, Grid, Col, Row, FormLabel } from 'react-native-elements'
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import AddressList from './addresses'
import Details from './jobdetail'
import * as Storage from '../../lib/localstorage';
import colors from 'HSColors'
import Api from '../../lib/api'
import styles from './job.styles'
import { Actions } from 'react-native-router-flux'

class JobDetails extends Component {
    state = {
        index: 0,
        routes: [
            {
                key: '1',
                title: 'Details'
            }, {
                key: '2',
                title: 'Addresses'
            }
        ],
        jobDetails: null
    };

    _loadJob() {
        let userId = 0;
        var user = Storage.get('userId').then((value) => {
            userId = value

            let jobId = this.props.docketId;
            let that = this;

            Api.get('job?userId=' + userId + '&jobId=' + jobId).then(function (response) {
                console.log(response.data);
                that.setState({ jobDetails: response.data, userId : userId });

                // save in Storage
                Storage.set('job-' + jobId, JSON.stringify(response.data)).then(() => {
                    console.log('saved job-' + jobId + ' in localstorage');
                })

            }).catch((err) => {
                console.log(err)

                if (err.message == "Network request failed") {

                    // save in Storage
                    Storage.get('job-' + jobId).then((data) => {
                        that.setState({ jobDetails: JSON.parse(data) });
                    });

                }

            });

        });
    }

    componentWillMount() {
        this._loadJob()
    }

    _handleChangeTab = (index) => {
        this.setState({ index });
    };

     _handleTabHeader = (props) => {
        
    };

    _renderHeader = (props) => {
        return <TabBar style={styles.tabBar} indicatorStyle={{
            backgroundColor:  colors.stumbleupon
        }} labelStyle={{color:  colors.stumbleupon}} onTabPress={this._handleTabHeader} {...props} />;
    };

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                return <Details jobDetails={this.state.jobDetails} userId={this.state.userId} />;
            case '2':
                return <AddressList jobDetails={this.state.jobDetails} userId={this.state.userId} />;
            default:
                return null;
        }
    };

    render() {
        return (<TabViewAnimated style={styles.tabContainer} navigationState={this.state} renderScene={this._renderScene} renderHeader={this._renderHeader} onRequestChangeTab={this._handleChangeTab} />);
    }
}

module.exports = JobDetails;
