import React from 'react'

import { Text, Animated } from 'react-native';
import { convertTsToLocal } from './GameOverHighScores'

export class GameOverHighScoreAnimated extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      bgColor: new Animated.Value(0)
    }
  }

  componentDidMount(){
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.bgColor, {
          toValue: 1,
          duration: 1000
        }),
        Animated.timing(this.state.bgColor, {
          toValue: 0,
          duration: 1000
        })
      ])
    ).start()
  }

  render(){
    return (
      <Animated.View 
        style={[this.props.styles.row, {backgroundColor: this.state.bgColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgb(220, 220, 220)', 'rgb(255, 215, 0)']
          })
        }]} key={this.props.game.id}>
        <Text style={[this.props.styles.scoreSpan]}>{this.props.game.score}</Text>
        <Text style={[this.props.styles.usernameSpan]} ellipsizeMode='tail' numberOfLines={1}>{this.props.game.username}</Text>
        <Text style={[this.props.styles.numTouchesSpan]}>{this.props.game.num_of_touches}</Text>
        <Text style={[this.props.styles.dateSpan]} adjustsFontSizeToFit>{convertTsToLocal(this.props.game.played_on_ts)}</Text>
      </Animated.View>
    )
  }
}