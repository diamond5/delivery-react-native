'use strict'
import { StyleSheet } from 'react-native';
import colors from '../config/colors'

module.exports = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    flexDirection: 'row'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  header: {
    backgroundColor: '#FF6600',
    borderBottomWidth: 1,
    borderBottomColor: '#FEFEFE',
  },
  headerText: {
    color: '#FFF'
  },
  headerIcon: {
    color: '#FFF'
  },
  note: {
    color: '#bbb',
    fontSize: 12
  },
  highlight: {
    fontSize: 16
  },
  listItem: {
    padding: 0, marginLeft: 10, paddingLeft: 0, borderWidth: 1, borderLeftWidth: 0, borderRadius: 2, marginRight: 10, marginTop: 10
  },
  docketView: {
    padding: 5, flex: .3, backgroundColor: '#FF6600', justifyContent: 'center',
    borderTopLeftRadius: 3, borderBottomLeftRadius: 3
  },
  docketText: {
    alignSelf: 'center', color: '#fff'
  },
  docketDetailsView: {
    flex: 1, padding: 5
  },
  deliveryBadge: {
    fontSize: 12,
    color: '#FFF',
    backgroundColor: '#4d4d4d',
    paddingLeft: 5,
    paddingRight: 5
  },
  collectionBadge: {
    fontSize: 12,
    color: '#FFF',
    backgroundColor: colors.stumbleupon,
    paddingLeft: 5,
    paddingRight: 5
  },
  navigationBarStyle: {
    backgroundColor: '#ffffff',
    padding: 0,
    elevation : 5,
    shadowColor:'#4d4d4d',
    shadowOpacity:0.2,
    shadowRadius:3,
    borderBottomColor: '#ffffff'
  },
  navBarTitleStyle : {
    color : '#464646'
  },
  tabBarStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  sceneStyle: {
    paddingTop: 35,
    paddingBottom: 50,
    backgroundColor: colors.grey6,
  },
  sceneStyleWithoutBottom :{
    paddingTop : 35,
    backgroundColor: colors.grey6,
  },
  label: {
    color: colors.stumbleupon,
    fontSize: 12,
  },
  labelText: {
    color: '#4d4d4d',
    fontWeight :'300',
    fontSize: 15,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailBox: {
    margin : 10,
    flex : -1,
    elevation : 2,
    borderRadius : 2,
    shadowColor:'#969696',
    shadowOpacity:0.2,
    shadowRadius:3,
    backgroundColor: '#ffffff',
  },
  singleLineBox: {
    paddingVertical : 20,paddingHorizontal : 10, minHeight:50
  },
  dashedLineHorizontal:{
    height : 1, borderStyle : 'dashed', borderWidth : 1, borderColor : '#969696'
  },
  twoLineBox:{
    paddingVertical : 15,paddingHorizontal : 10, minHeight:60
  },
  bevelCorner : {
        borderRadius : 20,
        backgroundColor : 'blue',
        height : 40,
        width : 40,
        position : 'absolute',
        borderColor : '#4d4d4d',
  },
  obevelCorner : {
        borderRadius : 20,
        backgroundColor : 'red',
        height : 40,
        width : 40,
        position : 'absolute',
        borderColor : '#4d4d4d'
  },
  topRight : {
        top : -22,
        right : -25,        
    },
    bottomRight : {        
        bottom : -22,
        right : -25
    },
    topLeft : {
        top : -22,
        left : -20,        
    },
    bottomLeft : {
        bottom : -22,
        left : -20
    },
    controlBottomLine:{
      height : 1,
      borderStyle : 'solid',
      borderWidth : 1,
      borderColor : colors.grey9
    }
});
