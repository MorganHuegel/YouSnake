import React from 'react';

import { View, Text } from 'react-native';

export function SingleCell (props) {
  return (
    <View style={props.singleStylesheet}>
      <View style={{
        width: 3, 
        height: 3, 
        backgroundColor: 'rgb(255, 255, 235)',
        borderRadius: 50
        }}>
      </View>
    </View>
  )
}