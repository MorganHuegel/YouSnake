import React from 'react';

import { Image } from 'react-native';

export function ChickenWing(props){
  const chickenWingStyles = {
    image: {
      width: props.itemDimensions.itemWidth,
      height: props.itemDimensions.itemHeight,
      position: 'absolute',
      left: props.chickenPosition.left,
      top: props.chickenPosition.top
    }
  }

  return <Image source={props.character.itemToEat} style={chickenWingStyles.image}/> 
}