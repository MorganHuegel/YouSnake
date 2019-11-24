import React from 'react';

import { View } from 'react-native';
import { RowOfCells } from './RowOfCells';

export function CellsMain (props) {
  cellStyles = {
    main: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      height: props.cellDimensions.height,
    },
    single: {
      flex: 1,
      width: props.cellDimensions.width,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  let rowsOfCells = []
  for (let i = 0; i < props.mapDimensions.numOfRows; i++) {
    rowsOfCells.push(
      <RowOfCells 
        mapDimensions={props.mapDimensions} 
        rowStylesheet={cellStyles.row}
        singleStylesheet={cellStyles.single}
        key={'row' + i}/>
    )
  }

  return (
    <View style={cellStyles.main}>
      {rowsOfCells}
    </View>
  )
}
