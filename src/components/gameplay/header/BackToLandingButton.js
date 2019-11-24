import React from 'react';

import { Text, TouchableOpacity } from 'react-native';

export function BackToLandingButton (props) {
  const backToLandingButtonStyles = {
    touchable: {
      flex: 1,
      paddingTop: 20,
      alignItems: 'center'
    },
    text: {
      borderWidth: 2,
      borderRadius: 10,
      borderColor: 'white',
      padding: 10,
      color: 'white'
    }
  }

  return (
    <TouchableOpacity onPress={event => props.backToLanding()} style={backToLandingButtonStyles.touchable} activeOpacity={0.8}>
      <Text style={backToLandingButtonStyles.text}>Back to Landing</Text>
    </TouchableOpacity>
  )
}