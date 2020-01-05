/*
 REFACTOR TO-DO:
 1) change naming to replace 'owen' with 'face'
 2) change anming to replace 'chichen' with 'item'
 3) update animations to use character height/width instead of cell height/width where appropriate
*/

import React from 'react';

import { Image, View, Animated, Easing } from 'react-native';
import { SingleOwenFace } from './SingleOwenFace';

import { checkForDeath, checkForItem } from './OwenSnakeMainUtils';

export class OwenSnakeMain extends React.Component {
  // Initialize the snake with one face,
  // which moves by animating style properties TranslateX and TranslateY
  constructor (props) {
    super(props)
    this.state = {
      snakeBody: [
        {
          left: new Animated.Value(1),
          top: new Animated.Value(1),
          moving: 'right'
        }
      ]
    }

    this.checkForDeath = checkForDeath.bind(this)
    this.checkForItem = checkForItem.bind(this)
    this.millisecondsPerPixel = (10 / props.difficulty) * 1000 / props.mapDimensions.width
  }


  // Once component mounts, begin moving right and checking for death after 1 second delay
  // Left and Top Animation must be started in order for __currentValue to be set with addListener()
  // even though Top and Left do not go anywhere immediately
  componentDidMount(){
    this.state.snakeBody[0].left.addListener(({value}) => this.state.snakeBody[0].left.__currentValue = value)
    Animated.timing(this.state.snakeBody[0].left, {
      toValue: 1, 
      duration: 1,
      useNativeDriver: true
    }).start()

    this.state.snakeBody[0].top.addListener(({value}) => this.state.snakeBody[0].top.__currentValue = value)
    Animated.timing(this.state.snakeBody[0].top, {
      toValue: 1, 
      duration: 1,
      useNativeDriver: true
    }).start()

    setTimeout(() => {
      this._goRight(0)
      this.checkForDieInterval = setInterval(() => {
        this.checkForItem()
        this.checkForDeath()
      }, 100)
    }, 1000)
  }


  // When component unmounts, cancel all itervals and animation listeners
  componentWillUnmount(){
    clearInterval(this.checkForDieInterval)
    this.state.snakeBody.forEach(face => {
      face.left.stopAnimation()
      face.left.removeAllListeners()
      face.top.stopAnimation()
      face.top.removeAllListeners()
    })
  }


  // Update Scenario 1 -> when user dies and clicks "Play Again"
  // Update Scenario 2 -> when user touches screen
  // (Needs to be async so it can use 'await' inside for loop, 
  // otherwise all snake heads would change direction at the same time)
  async componentDidUpdate(prevProps, prevState){
    // When user clicks 'Play Again' button after dying, reset Animation values to beginning values
    // Don't need to add any new listeners since they were added in componentDidMount
    if (prevProps.owenIsDead && !this.props.owenIsDead) {
      return this.setState({
        snakeBody: this.state.snakeBody.filter((face, index) => index === 0)
      }, () => {
        this.state.snakeBody[0].left.setValue(1)
        this.state.snakeBody[0].top.setValue(1)
        this._goRight(0)
        this.checkForDieInterval = setInterval(() => {
          this.checkForItem()
          this.checkForDeath()
        }, 100)
      })
    }
    
    // Prevents infinite re-rerendering loop
    if (prevProps.numOfTouches === this.props.numOfTouches){
      return;
    }

    // If below code executes, the update is caused from user touching the screen
    // so calculate how to change direction based on current state and where it was pressed
    const leadOwenCenterX = this.state.snakeBody[0].left.__currentValue + (1 / 2 * this.props.characterDimensions.characterWidth)
    const leadOwenCenterY = this.state.snakeBody[0].top.__currentValue + (1 / 2 * this.props.characterDimensions.characterHeight)

    const currentDirection = this.state.snakeBody[0].moving
    if (currentDirection === 'right' || currentDirection === 'left') {
      if (this.props.lastPressed.mapY < leadOwenCenterY) {
        for (const i of [...Array(1000).keys()]) {
          try {
            this.validateSnakeBodyIndex(i) // breaks out of loop after all faces have changed direction
            this._goUp(i)
            await this.delayDirectionChange('up') // calculates delay based on game-speed
          } catch (e) {
            break;
          }
        }
      } else {
        for (const i of [...Array(1000).keys()]) {
          try {
            this.validateSnakeBodyIndex(i) // breaks out of loop after all faces have changed direction
            this._goDown(i)
            await this.delayDirectionChange('down') // calculates delay based on game-speed
          } catch (e) {
            break;
          }
        }
      }
    } 
    
    else {
      if (this.props.lastPressed.mapX < leadOwenCenterX) {
        for (const i of [...Array(1000).keys()]) {
          try {
            this.validateSnakeBodyIndex(i) // breaks out of loop after all faces have changed direction
            this._goLeft(i)
            await this.delayDirectionChange('left') // calculates delay based on game-speed
          } catch (e) {
            break;
          }
        }
      } else {
        for (const i of [...Array(1000).keys()]) {
          try {
            this.validateSnakeBodyIndex(i) // breaks out of loop after all faces have changed direction
            this._goRight(i)
            await this.delayDirectionChange('right') // calculates delay based on game-speed
          } catch (e) {
            break;
          }
        }
      }
    }
  }


  // Used to break out of loop once all faces have changed direction
  validateSnakeBodyIndex(index){
    if (index >= this.state.snakeBody.length) {
      throw new Error('Break out of this loop; at the end of the snake')
    }
    // if (!this.state.snakeBody[index].left instanceof Animated.Value) {
    //   throw new Error('break out of this loop; owen has died')
    // }
  }


  // When changing directions, this sets the delay for each face
  delayDirectionChange (direction) {
    const delayTimeMs = (direction === 'up' || direction === 'down') 
      ? this.millisecondsPerPixel * this.props.cellDimensions.height - 27
      : this.millisecondsPerPixel * this.props.cellDimensions.width - 27

    return new Promise(resolve => setTimeout(resolve, delayTimeMs))
  }


  // Updates state between right, left, up, down for each face
  // callback is just Animated.timing().start() for each face
  setNewDirection(direction, snakeIndex, callback){
    const newSnakeBody = [...this.state.snakeBody]
    newSnakeBody[snakeIndex].moving = direction
    this.setState({snakeBody: newSnakeBody}, callback)
  }


  _goRight(snakeBodyIndex){
    // If its not the lead face, set the Left value to the previous snake minus width of a cell
    // and Top value same as previous face, so that it falls in-line with preceeding faces
    if (snakeBodyIndex > 0) {
      this.state.snakeBody[snakeBodyIndex].left.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].left.__currentValue - this.props.cellDimensions.width
      )
      this.state.snakeBody[snakeBodyIndex].top.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].top.__currentValue
      )
    }

    // Calculate how far to go and duration to keep constant speed for each face
    const pxToGo = (this.props.mapDimensions.width - this.props.cellDimensions.width) - this.state.snakeBody[snakeBodyIndex].left.__currentValue
    const timeBeforeWall = this.millisecondsPerPixel * pxToGo

    // if (snakeBodyIndex !== 0) {
    //   this.state.snakeBody[snakeBodyIndex].top.setValue(
    //     this.state.snakeBody[snakeBodyIndex - 1].top.__currentValue
    //   )
    // }
    // Stop the vertical movement if going horizontal
    this.state.snakeBody[snakeBodyIndex].top.stopAnimation()
    
    this.setNewDirection('right', snakeBodyIndex, () => {
      // Add Listener for that face if it's not there already
      if (!this.state.snakeBody[snakeBodyIndex].left.__currentValue) {
        this.state.snakeBody[snakeBodyIndex].left.addListener(
          ({value}) => this.state.snakeBody[snakeBodyIndex].left.__currentValue = value
        )
      }
      Animated.timing(this.state.snakeBody[snakeBodyIndex].left, {
        toValue: this.props.mapDimensions.width - this.props.cellDimensions.width,
        easing: Easing.linear,
        duration: timeBeforeWall,
        useNativeDriver: true
      }).start()
    })
  }


  _goLeft(snakeBodyIndex){
    // If its not the lead face, set the Left value to the previous snake plus width of a cell
    // and Top value same as previous face, so that it falls in-line with preceeding faces
    if (snakeBodyIndex > 0) {
      this.state.snakeBody[snakeBodyIndex].left.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].left.__currentValue + this.props.cellDimensions.width
      )
      this.state.snakeBody[snakeBodyIndex].top.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].top.__currentValue
      )
    }

    // Calculate how far to go and duration to keep constant speed for each face
    const pxToGo = this.state.snakeBody[snakeBodyIndex].left.__currentValue
    const timeBeforeWall = this.millisecondsPerPixel * pxToGo

    // if (snakeBodyIndex !== 0) {
    //   this.state.snakeBody[snakeBodyIndex].top.setValue(
      //     this.state.snakeBody[snakeBodyIndex - 1].top.__currentValue
      //   )
    // }
    // Stop the vertical movement if going horizontal
    this.state.snakeBody[snakeBodyIndex].top.stopAnimation()

    this.setNewDirection('left', snakeBodyIndex, () => {
      // Add Listener for that face if it's not there already
      if (!this.state.snakeBody[snakeBodyIndex].left.__currentValue) {
        this.state.snakeBody[snakeBodyIndex].left.addListener(
          ({value}) => this.state.snakeBody[snakeBodyIndex].left.__currentValue = value
        )
      }
      Animated.timing(this.state.snakeBody[snakeBodyIndex].left, {
        toValue: 0,
        easing: Easing.linear,
        duration: timeBeforeWall,
        useNativeDriver: true
      }).start()
    })
  }


  _goDown(snakeBodyIndex){
    // If its not the lead face, set the Left value to the previous snake
    // and Top value same as previous face minus the height of a cell, so that it falls in-line with preceeding faces
    if (snakeBodyIndex > 0) {
      this.state.snakeBody[snakeBodyIndex].left.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].left.__currentValue
      )
      this.state.snakeBody[snakeBodyIndex].top.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].top.__currentValue - this.props.cellDimensions.height
      )
    }

    // Calculate how far to go and duration to keep constant speed for each face
    const pxToGo = (this.props.mapDimensions.height - this.props.cellDimensions.height) - this.state.snakeBody[snakeBodyIndex].top.__currentValue
    const timeBeforeWall = this.millisecondsPerPixel * pxToGo

    // if (snakeBodyIndex !== 0) {
    //   this.state.snakeBody[snakeBodyIndex].left.setValue(
    //     this.state.snakeBody[snakeBodyIndex - 1].left.__currentValue
    //   )
    // }
    // Stop the horizontal movement if going vertical
    this.state.snakeBody[snakeBodyIndex].left.stopAnimation()

    this.setNewDirection('down', snakeBodyIndex, () => {
      // Add Listener for that face if it's not there already
      if (!this.state.snakeBody[snakeBodyIndex].top.__currentValue) {
        this.state.snakeBody[snakeBodyIndex].top.addListener(
          ({value}) => this.state.snakeBody[snakeBodyIndex].top.__currentValue = value
        )
      }
      Animated.timing(this.state.snakeBody[snakeBodyIndex].top, {
        toValue: this.props.mapDimensions.height - this.props.cellDimensions.height,
        easing: Easing.linear,
        duration: timeBeforeWall,
        useNativeDriver: true
      }).start()
    })
  }


  _goUp(snakeBodyIndex){
    // If its not the lead face, set the Left value to the previous snake
    // and Top value same as previous face plus the height of a cell, so that it falls in-line with preceeding faces
    if (snakeBodyIndex > 0) {
      this.state.snakeBody[snakeBodyIndex].left.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].left.__currentValue
      )
      this.state.snakeBody[snakeBodyIndex].top.setValue(
        this.state.snakeBody[snakeBodyIndex - 1].top.__currentValue + this.props.cellDimensions.height
      )
    }

    // Calculate how far to go and duration to keep constant speed for each face
    const pxToGo = this.state.snakeBody[snakeBodyIndex].top.__currentValue
    const timeBeforeWall = this.millisecondsPerPixel * pxToGo

    // if (snakeBodyIndex !== 0) {
    //   this.state.snakeBody[snakeBodyIndex].left.setValue(
    //     this.state.snakeBody[snakeBodyIndex - 1].left.__currentValue
    //   )
    // }
    // Stop the horizontal movement if going vertical
    this.state.snakeBody[snakeBodyIndex].left.stopAnimation()

    this.setNewDirection('up', snakeBodyIndex, () => {
      // Add Listener for that face if it's not there already
      if (!this.state.snakeBody[snakeBodyIndex].top.__currentValue) {
        this.state.snakeBody[snakeBodyIndex].top.addListener(
          ({value}) => this.state.snakeBody[snakeBodyIndex].top.__currentValue = value
        )
      }
      Animated.timing(this.state.snakeBody[snakeBodyIndex].top, {
        toValue: 0,
        easing: Easing.linear,
        duration: timeBeforeWall,
        useNativeDriver: true
      }).start()
    })
  }


  // When snake dies, pause animations and setToDead, which causes high scores screen
  owenDies = () => {
    clearInterval(this.checkForDieInterval)
    this.state.snakeBody.forEach(face => {
      face.left.stopAnimation()
      face.top.stopAnimation()
    })
    this.props.setOwenToDead()
  }


  // Whenever snake eats an item
  owenEatsChicken(){
    this.addOwenFace()
    this.props.incrementPoints()
    this.props.playOwenSound()
    this.props.setChickenWing()
  }


  // When adding a face, initiate left/top values inline with previous face, moving in same direction
  addOwenFace(){
    const updatedSnakeBody = [...this.state.snakeBody]
    let newLeft = updatedSnakeBody[updatedSnakeBody.length - 1].left.__currentValue
    let newTop = updatedSnakeBody[updatedSnakeBody.length - 1].top.__currentValue
    switch (updatedSnakeBody[updatedSnakeBody.length - 1].moving) {
      case('up'):
        newTop += this.props.cellDimensions.height
        break
      case('down'):
        newTop -= this.props.cellDimensions.height
        break
      case('left'):
        newLeft += this.props.cellDimensions.width
        break
      case('right'):
        newLeft -= this.props.cellDimensions.width
        break
      default:
        console.log('Probably should error handle here in AddOwenFace method')
    }

    updatedSnakeBody.push({
      left: new Animated.Value(newLeft),
      top: new Animated.Value(newTop),
      moving: this.state.snakeBody[this.state.snakeBody.length - 1].moving
    })

    this.setState({snakeBody: updatedSnakeBody}, () => {
      // After adding face to state, make it start moving!
      switch(updatedSnakeBody[updatedSnakeBody.length - 1].moving){
        case('up'):
          this._goUp(updatedSnakeBody.length - 1)
          break
        case('down'):
          this._goDown(updatedSnakeBody.length - 1)
          break
        case('left'):
          this._goLeft(updatedSnakeBody.length - 1)
          break
        case('right'):
          this._goRight(updatedSnakeBody.length - 1)
          break
      }
    })
  }


  render(){
    const snake = this.state.snakeBody.map( (face, index) => {
      return <SingleOwenFace 
        face={face} 
        cellDimensions={this.props.cellDimensions} 
        character={this.props.character}
        key={'face' + index} 
        characterDimensions={this.props.characterDimensions}
      />
    })

    const collisionLogo = this.props.owenIsDead ? 
      <Image source={require('../../../../../images/collision.png')} 
      style={{
        width: 60, 
        height: 42, 
        position: 'absolute', 
        left: this.state.snakeBody[0].left.__currentValue - 10, 
        top: this.state.snakeBody[0].top.__currentValue - 10,
        zIndex: 10
      }}/> : null

    let OwenSnakeMainStyle = {
      position: 'absolute',
      top: 0,
      left: 0
    }

    return (
      <View style={OwenSnakeMainStyle}>
        {collisionLogo}
        {snake}
      </View>
    )
  }
}