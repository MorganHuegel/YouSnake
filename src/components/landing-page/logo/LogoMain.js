import React from 'react';

import { View, Image } from 'react-native';
import { LogoMainOwenFaceContainer } from './LogoMainOwenFaceContainer';

import { AvatarContext } from '../../App';
import players from '../../playerData';

export function LogoMain(props){
  logoMainStyles = {
    container: {
      flex: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      display: 'flex',
      justifyContent: 'center',
      borderRadius: 100,
      borderColor: 'rgb(192,194,201)',
      borderWidth: 3
    },
    logoWords: {
      resizeMode: 'contain',
      width: undefined,
      height: undefined,
      flex: 2,
      zIndex: 10,
      opacity: 0.9
    }
  }

  return (
    <AvatarContext.Consumer>
      {
        ({avatar}) => {
          const character = players[avatar];
          return (    
            <View style={logoMainStyles.container}>
              <Image source={character.landingText} style={logoMainStyles.logoWords}/>
              <LogoMainOwenFaceContainer character={character}/>
            </View>
          )
        }
      }
    </AvatarContext.Consumer>
  )
}