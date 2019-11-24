import React from 'react';

import { View } from 'react-native';
import { BackToLandingButton } from './BackToLandingButton';
import { PointsDisplay } from './PointsDisplay';

export function Header (props) {
  const HeaderStyles = {
    view: {
      flex: props.mapDimensions.headerHeight,
      backgroundColor: 'rgb(70, 80, 120)',
      display: 'flex',
      flexDirection: 'row'
    }
  }

  return (
    <View style={HeaderStyles.view}>
      <PointsDisplay score={props.score}/>
      <BackToLandingButton backToLanding={props.backToLanding}/>
    </View>
  )
}