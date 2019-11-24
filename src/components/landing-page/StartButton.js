import React from 'react';

import { View, TouchableOpacity, Text } from 'react-native';

export function StartButton (props) {
  const startButtonStyles = {
    container: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      backgroundColor: 'rgb(220, 230, 235)',
      borderRadius: 10,
      borderColor: 'rgb(192,194,201)',
      borderWidth: 5,
      padding: 30,
      minWidth: 200,
      alignItems: 'center',
    },
    text: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'rgb(82,152,193)'
    }
  }

  return (
    <View style={startButtonStyles.container}>
      <TouchableOpacity onPress={props.setToPlaying} style={startButtonStyles.button} activeOpacity={0.8}>
        <Text style={startButtonStyles.text}>Play</Text>
      </TouchableOpacity>
    </View>
  )
}