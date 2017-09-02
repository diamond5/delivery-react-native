import {
    View,
    ListView,
    Text, RefreshControl, ScrollView
} from 'react-native';
import React, { Component } from 'react';
import { List } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Api from '../../lib/api';
import Spinner from '../../lib/spinner';
import * as Storage from '../../lib/localstorage';
import * as Render from './jobs.rows';
import styles from './jobs.styles'

class Jobs extends React.Component {
  constructor(props) {
    super(props);

    this.loadJobs = this.loadJobs.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.state = {
        jobsDS: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        loading: true,
        isRefreshing : false
    };
  }

    componentWillMount() {
        let that = this;
        Storage.get('userId').then((value) => {
            that.setState({userId: value});
            that.loadJobs();
        });
    }

    componentWillReceiveProps() {
        this.loadJobs();
    }

    loadJobs() {

        let userId = this.props.userId == null? this.state.userId : this.props.userId;
        let that = this;

        Api.get('jobs?userId=' + userId).then(function (response) {

            //console.log(response.data);

            that.setState({
                jobsDS: that.state.jobsDS.cloneWithRows(response.data),
                loading: false,
                isRefreshing : false
            });

            // add jobs to local Storage
            Storage.set('jobsList', JSON.stringify(response.data)).then(() => {
                console.log('added jobs to storage');
            });

        }).catch((err) => {
            if (err.message == 'Network request failed') {
                Storage.get('jobsList').then((data) => {
                    that.setState({
                        jobsDS: that.state.jobsDS.cloneWithRows(JSON.parse(data))
                    });
                });
            }
            that.setState({
                        loading: false,
                        isRefreshing : false
             });
            console.log(err);
        });
    }

    _onRefresh = () => {
        this.setState({ isRefreshing: true });
        this.loadJobs();
    }

render() {

    return (
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="#ff0000"
                title="Loading..."
                titleColor="#00ff00"
                colors={['#4285f4', '#ea4335', '#fbbc05', '#34a853']}
            />
        }>
            <Spinner visible={this.state.loading} />
            <View style={styles.outerAllRows}>
                <View style={styles.listTopLine}></View>
                <List>
                    <ListView enableEmptySections={true} dataSource={this.state.jobsDS} renderRow={Render.RenderJobsItem} />
                </List>
                 <View style={styles.listBottomLine}></View>
            </View>
        </ScrollView>
    );
}
}

module.exports = Jobs;
