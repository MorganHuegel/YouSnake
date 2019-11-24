import React from 'react';

import { Animated } from 'react-native';

import { AvatarContext } from '../../App';
import players from '../../playerData';

export function LogoMainOwenFace (props) {
  return (
    <AvatarContext.Consumer>
      {
        ({avatar}) => {
          const character = players[avatar];
          return <Animated.Image 
            source={character.faceImageWithBorder} 
            style={props.styleProps}
        />
        }
      }
    </AvatarContext.Consumer>
  )
}