import React from 'react';

import { TouchableOpacity } from 'react-native';
import { CellsMain } from './CellsMain'
import { OwenSnakeMain } from './owenSnake/OwenSnakeMain';
import { ChickenWing } from './ChickenWing';
import { AvatarContext } from '../../App';
import players from '../../playerData';

export class MapMain extends React.Component {
  state = {
    lastPressed: {
      mapX: null,
      mapY: null
    },
    chickenWing: {
      left: null,
      top: null
    }
  }

  UNSAFE_componentWillMount(){
    this.setChickenWing()
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.owenIsDead && !this.props.owenIsDead) {
      this.setChickenWing()
    }
  }


  setChickenWing = () => {
    const xCoord = Math.floor((Math.random()) * (this.props.mapDimensions.width - this.props.cellDimensions.width))
    const yCoord = Math.floor((Math.random()) * (this.props.mapDimensions.height - this.props.cellDimensions.height))

    this.setState({chickenWing: {
      left: xCoord, top: yCoord
    }})
  }


  onPressMap(event){
    const mapX = event.nativeEvent.pageX - this.props.screenToMapXOffset
    const mapY = event.nativeEvent.pageY - this.props.screenToMapYOffset

    this.setState({
      lastPressed: {
        mapX, 
        mapY
      }
    }, () => this.props.incrementNumTouches())
  }


  mapMainStyles = {
    touchableOpacity: {
      flex: this.props.mapDimensions.height
    }
  }


  calculateItemDimensions = (character) => {
    const itemWidth = character.itemWidth > character.itemHeight ?
      this.props.cellDimensions.width * (character.itemWidth / character.itemHeight) * character.itemScale :
      this.props.cellDimensions.width * character.itemScale

    const itemHeight = character.itemWidth > character.itemHeight ?
      this.props.cellDimensions.width * character.itemScale :
      this.props.cellDimensions.width * (character.itemHeight / character.itemWidth) * character.itemScale

    return { itemWidth, itemHeight }
  }


  calculateFaceDimensions = (character) => {
    const characterWidth = character.faceHeight > character.faceWidth ? 
      this.props.cellDimensions.width :
      this.props.cellDimensions.height * (character.faceWidth / character.faceHeight)

    const characterHeight = character.faceHeight > character.faceWidth ?
      this.props.cellDimensions.width * (character.faceHeight / character.faceWidth) :
      this.props.cellDimensions.height

    return { characterWidth, characterHeight }
  }


  render(){
    const disabledScreenTouch = this.props.owenIsDead

    return (
      <AvatarContext.Consumer>
        {
          ({avatar}) => {
            const character = players[avatar]
            const itemDimensions = this.calculateItemDimensions(character)
            const characterDimensions = this.calculateFaceDimensions(character)

            return (
            <TouchableOpacity 
              style={this.mapMainStyles.touchableOpacity} 
              activeOpacity={0.8}
              onPress={event => this.onPressMap(event)}
              disabled={disabledScreenTouch}>
              <CellsMain 
                mapDimensions={this.props.mapDimensions} 
                cellDimensions={this.props.cellDimensions}/>
              <ChickenWing 
                cellDimensions={this.props.cellDimensions} 
                chickenPosition={this.state.chickenWing}
                itemDimensions={itemDimensions}
                character={character}/>
              <OwenSnakeMain 
                setOwenToDead={this.props.setOwenToDead}
                incrementPoints={this.props.incrementPoints}
                mapDimensions={this.props.mapDimensions} 
                cellDimensions={this.props.cellDimensions} 
                lastPressed={this.state.lastPressed}
                numOfTouches={this.props.score.numTouches}
                playOwenSound={this.props.playOwenSound}
                chickenWing={this.state.chickenWing}
                setChickenWing={this.setChickenWing}
                difficulty={this.props.difficulty}
                owenIsDead={this.props.owenIsDead}
                character={character} 
                itemDimensions={itemDimensions}
                characterDimensions={characterDimensions}/>
            </TouchableOpacity>
            )
          }
        }
        </AvatarContext.Consumer>
    )
  }
}