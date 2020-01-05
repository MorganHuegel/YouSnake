import React from 'react';
import { Animated, Easing } from 'react-native';

import { Header } from './header/Header';
import { MapMain } from './map/MapMain';
import { GameOverMain } from './gameOverScreen/GameOverMain';

import { sendFinalScoreFetch } from '../../fetchFunctions/sendFinalScore';


/// LOAD THE SOUND BYTES //////////////////////////////////////
let Sound = require('react-native-sound');
Sound.setCategory('Playback'); // Enable playback in silence mode
const soundsFolder = '../../../sounds'
let soundBytes = [
  require(`${soundsFolder}/owen-wilson-saying-wow.mp3`),
  require(`${soundsFolder}/owen-wilson-saying-wow-1.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-2.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-3.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-4.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-5.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-6.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-7.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-8.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-9.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-10.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-11.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-12.m4a`),
  require(`${soundsFolder}/owen-wilson-saying-wow-13.m4a`)
]
////////////////////////////////////////////////////////////////


export class GameplayMain extends React.Component {
  state = {
    owenSoundIndex: 0,
    viewOpacity: new Animated.Value(0),
    mapDimensions: {
      width: null, 
      height: null, 
      numOfColumns: null,
      numOfRows: null,
      headerHeight: null
    },
    cellDimensions: {
      width: null,
      height: null
    },
    score: {
      points: 0,
      numTouches: 0
    },
    difficulty: 4, // can be 1-10
    owenIsDead: false,
    isFetchingScores: false,
    finalScoreData: null,
    slidingOutGameOver: false
  }


  soundByte = new Sound(soundBytes[this.state.owenSoundIndex])


  playOwenSound = () => {
    this.soundByte.play()

    const nextSoundByte = 
      (this.state.owenSoundIndex === soundBytes.length - 1)
      ? 0 : this.state.owenSoundIndex + 1

    this.setState({owenSoundIndex: nextSoundByte}, () => {
      this.soundByte = new Sound(soundBytes[this.state.owenSoundIndex], err => {
        if (err) {
          console.log(err)
        }
      })
    })
  }


  incrementNumTouches = () => {
    const updatedScore = Object.assign({}, this.state.score, {
      points: this.state.score.points - 1,
      numTouches: this.state.score.numTouches + 1
    })

    this.setState({
      score: updatedScore
    })
  }


  incrementPoints = () => {
    const updatedScore = Object.assign({}, this.state.score, {
      points: this.state.score.points + (this.state.difficulty * 100)
    })

    this.setState({
      score: updatedScore
    })
  }


  componentDidMount(){
    Animated.timing(this.state.viewOpacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start()
  }


  componentDidUpdate(prevProps){
    // Component is about to unmount
    if(!prevProps.fadingOutGameplay && this.props.fadingOutGameplay) {
      Animated.timing(this.state.viewOpacity, {
        toValue: 0,
        duration: this.props.fadeOutGameplayTime,
        easing: Easing.linear,
        useNativeDriver: true
      }).start()
    }
  }


  restartGame = () => {
    this.setState({slidingOutGameOver: true}, () => {
      setTimeout(() => {
        const freshState = {
          owenSoundIndex: 0,
          score: {
            points: 0,
            numTouches: 0
          },
          owenIsDead: false,
          slidingOutGameOver: false,
          isFetchingScores: false,
          finalScoreData: null
        }
    
        this.setState(freshState)
      }, 1000)
    })
  }


  setMapDimensions(event){
    const gameplayHeight = event.nativeEvent.layout.height - (2 * this.gameplayMainStyles.view.borderWidth)  //<-- 4px border
    const gameplayWidth = event.nativeEvent.layout.width - (2 * this.gameplayMainStyles.view.borderWidth)

    const numOfColumns = Math.floor(gameplayWidth / 30)
    const cellWidth = gameplayWidth / numOfColumns
    const cellHeight = cellWidth

    const numOfRows = Math.floor( (gameplayHeight * 8/9) / cellHeight)
    const spaceLeftAtBottom = (gameplayHeight * 8/9) - (numOfRows * cellHeight)
    const headerHeight = gameplayHeight * 1/9 + spaceLeftAtBottom
    const mapHeight = gameplayHeight - headerHeight

    this.setState({
      mapDimensions: {
        width: gameplayWidth,
        height: mapHeight,
        numOfColumns,
        numOfRows,
        headerHeight
      },
      cellDimensions: {
        width: cellWidth,
        height: cellHeight
      }
    })
  }


  setOwenToDead = () => {
    this.setState({owenIsDead: true, isFetchingScores: true}, () => {
      return sendFinalScoreFetch(this.state.score.points, this.state.score.numTouches)
        .then(scores => this.setState({
          finalScoreData: scores,
          isFetchingScores: false
        }))
        .catch(err => {
          console.log('Probably should error handle here...' + err)
          this.setState({isFetchingScores: false, finalScoreData: null})
        })
    })
  }



  render(){
    let mapMain, header, gameOverScreen
    if (this.state.mapDimensions.height) {
      mapMain = <MapMain 
        screenToMapXOffset={this.gameplayMainStyles.view.borderWidth + this.props.screenPaddingX}
        screenToMapYOffset={this.gameplayMainStyles.view.borderWidth + this.props.screenPaddingY + this.state.mapDimensions.headerHeight}
        mapDimensions={this.state.mapDimensions} 
        cellDimensions={this.state.cellDimensions}
        playOwenSound={this.playOwenSound}
        incrementNumTouches={this.incrementNumTouches}
        incrementPoints={this.incrementPoints}
        score={this.state.score}
        difficulty={this.state.difficulty}
        owenIsDead={this.state.owenIsDead}
        setOwenToDead={this.setOwenToDead}
      />
      header = <Header backToLanding={this.props.backToLanding} mapDimensions={this.state.mapDimensions} score={this.state.score}/>
      gameOverScreen = this.state.owenIsDead ? 
        <GameOverMain 
          mapDimensions={this.state.mapDimensions} 
          backToLanding={this.props.backToLanding} 
          restartGame={this.restartGame} 
          score={this.state.score}
          slidingOutGameOver={this.state.slidingOutGameOver}
          isFetchingScores={this.state.isFetchingScores}
          finalScoreData={this.state.finalScoreData}
        /> : 
        null
    }

    return (
      <Animated.View style={this.gameplayMainStyles.view} onLayout={event => this.setMapDimensions(event)}>
        {header}
        {mapMain}
        {gameOverScreen}
      </Animated.View>
    )
  }


  gameplayMainStyles = {
    view: {
      opacity: this.state.viewOpacity,
      backgroundColor: 'rgb(40, 40, 40)',
      display: 'flex',
      flex: 1,
      borderWidth: 2,
      borderColor: 'rgb(255, 255, 255)'
    }
  }
}