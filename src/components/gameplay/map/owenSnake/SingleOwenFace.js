import React from 'react';

import { Animated } from 'react-native';

export function SingleOwenFace(props){
  owenFaceStyles = {
    singleFace: {
      width: props.characterDimensions.characterWidth,
      height: props.characterDimensions.characterHeight,
      position: 'absolute',
      left: props.face.left,
      top: props.face.top
    }
  }

  return <Animated.Image source={props.character.gameplayImage} style={owenFaceStyles.singleFace}/>
}
