import React from 'react';

import { Text, View } from 'react-native';

export function PointsDisplay (props) {
  const pointsDisplayStyles = {
    view: {
      flex: 1,
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingLeft: 20
    },
    text: {
      color: 'white'
    }
  }

  return (
    <View style={pointsDisplayStyles.view}>
      <Text style={{...pointsDisplayStyles.text, fontSize: 24}}>Points: {props.score.points}</Text>
      <Text style={{...pointsDisplayStyles.text}}>Touches: {props.score.numTouches}</Text>
    </View>
  )
}