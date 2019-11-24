import React from 'react';

import { View } from 'react-native';
import { SingleCell } from './SingleCell';

export function RowOfCells (props) {
  let singleCellsArray = []
  for (let i = 0; i<props.mapDimensions.numOfColumns; i++) {
    singleCellsArray.push(
      <SingleCell 
        key={'cell' + i}
        singleStylesheet={props.singleStylesheet}
      />
    )
  }
  
  return (
    <View style={props.rowStylesheet}>
      {singleCellsArray}
    </View>
  )
}
