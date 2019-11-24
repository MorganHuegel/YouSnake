import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';

import { GameOverHighScores } from './GameOverHighScores'
import { GameOverButtons } from './GameOverButtons';

export function GameOverMessage(props){
  const gameOverMessageStyles = {
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch'
    }
  }

  return (
    <View style={gameOverMessageStyles.container}>
      
      <GameOverHighScores finalScoreData={props.finalScoreData} isFetchingScores={props.isFetchingScores}/>
      <GameOverButtons restartGame={props.restartGame} backToLanding={props.backToLanding}/>

    </View>
  )
}