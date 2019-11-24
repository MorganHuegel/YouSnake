import React from 'react'
import moment from 'moment';

import { View, Text, ActivityIndicator } from 'react-native'

import { GameOverHighScoreAnimated } from './GameOverHighScoreAnimated';

export function GameOverHighScores (props) {
  const gameOverHighScoresStyles = {
    container: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: 20,
    },
    scoreContainer: {
      flexDirection: 'column',
      height: 400,
      borderWidth: 4,
      borderRadius: 5,
      borderColor: 'rgb(255, 255, 255)',
      padding: 20
    },
    headerText: {
      textAlign: 'center',
      fontSize: 25,
      color: 'rgb(220, 220, 220)',
      marginBottom: 10
    },
    row: {
      flexDirection: 'row',
      flex: 1,
      borderColor: 'rgb(220, 220, 220)',
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: 'rgb(220, 220, 220)',
      paddingHorizontal: 10,
      alignItems: 'center',
      paddingVertical: 5,
      marginBottom: 5
    },
    scoreSpan: {
      flex: 2,
      fontSize: 20,
      marginRight: 5
    },
    usernameSpan: {
      flex: 4,
      fontSize: 18,
      marginRight: 5
    },
    numTouchesSpan: {
      flex: 1.5,
      fontSize: 18,
      marginRight: 5
    },
    dateSpan: {

    },
  }

  if (props.isFetchingScores) {
    return (
      <View style={gameOverHighScoresStyles.container}>
        <ActivityIndicator size='large' color='white'/>
      </View>
    )
  }

  const tableRows = props.finalScoreData.topFiveScoresToday.map(game => {
    if (game.id === props.finalScoreData.userScore.id) {
      return <GameOverHighScoreAnimated styles={gameOverHighScoresStyles} game={game} key={game.id}/>
    }

    return <View style={[gameOverHighScoresStyles.row]} key={game.id}>
      <Text style={gameOverHighScoresStyles.scoreSpan}>{game.score}</Text>
      <Text style={gameOverHighScoresStyles.usernameSpan} ellipsizeMode='tail' numberOfLines={1}>{game.username}</Text>
      <Text style={gameOverHighScoresStyles.numTouchesSpan}>{game.num_of_touches}</Text>
      <Text style={gameOverHighScoresStyles.dateSpan} adjustsFontSizeToFit>{convertTsToLocal(game.played_on_ts)}</Text>
    </View>
  })

  return (
    <View style={gameOverHighScoresStyles.container}>
      <View style={gameOverHighScoresStyles.scoreContainer}>

        <Text style={gameOverHighScoresStyles.headerText}>Top Scores Today</Text>
        <View style={[gameOverHighScoresStyles.row, {backgroundColor: 'none'}]}>
          <Text style={{flex: 1.8, fontSize: 12, color: 'rgb(220, 220, 220)'}} adjustsFontSizeToFit>Score</Text>
          <Text style={{flex: 3,fontSize: 12, color: 'rgb(220, 220, 220)'}} adjustsFontSizeToFit>Username</Text>
          <Text style={{fontSize: 12, color: 'rgb(220, 220, 220)'}} adjustsFontSizeToFit>Touch</Text>
          <Text style={{flex: 3, textAlign: 'center', fontSize: 12, color: 'rgb(220, 220, 220)'}} adjustsFontSizeToFit>Time</Text>
        </View>
        {tableRows}

        <Text style={[gameOverHighScoresStyles.headerText, {marginTop: 20}]}>Your Rank: {props.finalScoreData.userIndexRank + 1}</Text>
        <View style={gameOverHighScoresStyles.row}>
          <Text style={gameOverHighScoresStyles.scoreSpan}>{props.finalScoreData.userScore.score}</Text>
          <Text style={gameOverHighScoresStyles.usernameSpan}>{props.finalScoreData.userScore.username}</Text>
          <Text style={gameOverHighScoresStyles.numTouchesSpan}>{props.finalScoreData.userScore.num_of_touches}</Text>
          <Text style={gameOverHighScoresStyles.dateSpan} adjustsFontSizeToFit>{convertTsToLocal(props.finalScoreData.userScore.played_on_ts)}</Text>
        </View>

      </View>
    </View>
  )
}

export function convertTsToLocal (ts){
  ts = ts.replace(/[TZ]/g, " ").trim()
  let a = moment.utc(ts, 'YYYY-MM-DD HH:mm:ss').toDate()
  let b = moment(a).local().format('ddd hh:mm a')
  return b
 }