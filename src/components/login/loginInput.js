import React from 'react';

import { Text, TextInput, View, Image, StyleSheet } from 'react-native';

export function LoginInput (props) {
  const loginInputStyles = StyleSheet.create({
    conatiner: {
      width: 250,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'rgb(170, 170, 170)',
      width: 250,
      padding: 10,
      fontSize: 22,
      backgroundColor: 'rgb(165, 165, 165)',
      paddingLeft: 40,
    },
    errorMessage: {
      color: 'rgb(255, 170, 160)',
      fontStyle: 'italic',
      minHeight: 40,
      maxWidth: 250,
      marginTop: 10
    },
    icon: {
      height: 20,
      width: 20,
      top: 36,
      left: 10,
      zIndex: 2
    }
  })

  const errorInputStyles = props.errorMessage ? {
    backgroundColor: 'rgb(185, 165, 165)'
  } : null


  const inputIcon = <Image 
    source={props.isUsername ? require('./username-icon.png') : require('./password-icon.png')}
    style={loginInputStyles.icon}
  />

  return (
    <View style={loginInputStyles.container}>

      {inputIcon}

      <TextInput 
        style={[loginInputStyles.textInput, errorInputStyles]}
        onChangeText={props.onChange}
        autoCapitalize='none'
        autoCompleteType={props.isUsername ? 'username' : 'password'}
        autoCorrect={false}
        editable={!props.isFetching} // false if fetching
        onBlur={props.onBlur}
        placeholder={props.isUsername ? 'username' : 'password'}
        secureTextEntry={props.isUsername ? false : true}
      />

      <Text style={loginInputStyles.errorMessage}>
        {props.errorMessage}
      </Text>
    </View>
  )
}