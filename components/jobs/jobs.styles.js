'use strict'

import { StyleSheet } from 'react-native'
import colors from 'HSColors'

module.exports = StyleSheet.create({
  jobsRow: {
         backgroundColor: '#FFF',
         elevation : 3,
         marginHorizontal :10,
         marginVertical : 5,
         borderRadius : 3,
         shadowColor:'#4d4d4d',
         shadowOpacity:0.2,
         shadowRadius:3
  },
  deliveryBadge : {
         backgroundColor : '#333',
         color : '#FFF',
         paddingLeft : 8,
         paddingRight : 8,
         paddingTop : 3,
         paddingBottom : 3,
         borderRadius : 3,
         fontSize: 12,
  },
  collectionBadge : {
         backgroundColor : colors.stumbleupon,
         color : '#FFF',
         paddingLeft : 8,
         paddingRight : 8,
         paddingTop : 3,
         paddingBottom : 3,
         borderRadius : 3,
         fontSize: 12,
  },
  customerName :{
         fontSize: 15,
         fontWeight :'300',
         color: '#4d4d4d'
  },
  contactName : {
          fontSize: 12,
          color: '#969696'
  },
  dashedLineColumn:{
          width : 1, 
          borderStyle:'dashed',
          borderColor : '#969696', 
          borderWidth : 1
  },
  docketNoColumn:{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
  },
   docketNoText:{
          fontSize: 16,
          fontWeight :'400'
  },
  bottomMarginRow : {
             marginBottom: 8
  },
  timeText : {
           fontSize: 12,
           color: '#4d4d4d',
           fontWeight :'300'
  },
  timeBadgeColumn : {
            alignItems: 'flex-end',
            paddingTop: 10,
            paddingBottom: 10
  },
  outerAllRows: {
        flex : 1,
        padding : 0, 
        margin : 0,
        marginTop : -3
  },
  listBottomLine:{
          height : 2,
          borderStyle : 'solid',
          borderWidth : 2, 
          borderColor : colors.grey6,
          marginTop : -4
  },
  listTopLine:{
          height : 2,
          borderStyle : 'solid',
          borderWidth : 2, 
          borderColor : colors.grey6,
          marginBottom : -4
  }
})
