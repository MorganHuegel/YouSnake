import React from 'react'
import { View, Picker, Button, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { changeAvatar } from '../../fetchFunctions/changeAvatar';
import players from '../playerData';
import { AvatarContext } from '../App';

export function SelectAvatar(props){
  const selectAvatarStyles = {
    container: {
      flexDirection: 'column',
      position: 'relative',
      flex: 1,
      alignContent: 'center',
      justifyContent: 'center'
    },
    selectButton: {
      alignSelf: 'center'
    },
    selectButtonText: {
      color: 'rgb(0, 0, 0)',
      textDecorationLine: 'underline' // <------ update this when you have internet
    },
    picker: {
    },
    items: {
      color: 'white'
    }
  }

  let pickerItems = []
  for (let character in players) {
    pickerItems.push(<Picker.Item label={players[character].displayName} value={character} key={character}/>)
  }

  return (
    <AvatarContext.Consumer>
      { ({avatar, setAvatar}) => {
        return (
          <View style={selectAvatarStyles.container}>
            <TouchableOpacity onPress={() => props.toggleSelectAvatar()} style={selectAvatarStyles.selectButton}>
              <Text style={selectAvatarStyles.selectButtonText}>Select</Text>
            </TouchableOpacity>

            <Picker 
              selectedValue={avatar}
              style={selectAvatarStyles.picker}
              onValueChange={newAvatar => {
                let oldAvatar = avatar
                setAvatar(newAvatar)

                return AsyncStorage.getItem('@webToken')
                  .then(webToken => changeAvatar(webToken, newAvatar))
                  .then(updatedUser => setAvatar(updatedUser.avatar))
                  .catch(e => {
                    setAvatar(oldAvatar)
                    console.log('Probably should error handle here in SelectAvatar component: ' + e)
                  })
              }}
              itemStyle={selectAvatarStyles.items}
            >
              {pickerItems}
            </Picker>
          </View>
        )
      }
      }
    </AvatarContext.Consumer>
  )
}