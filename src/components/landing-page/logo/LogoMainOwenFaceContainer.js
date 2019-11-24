import React from 'react';

import { View, Animated } from 'react-native';
import { LogoMainOwenFace } from './LogoMainOwenFace';

export class LogoMainOwenFaceContainer extends React.Component {
  constructor(props){
    super(props)
    this.numberOfFaces = 7
    this.state = {
      containerHeight: null,
      containerWidth: null,
      faceAnimations: []
    }
  }


  animateFaces = () => {
    Animated.loop(
      Animated.parallel([
        ...this.state.faceAnimations.map((animValue, i) => {
          return Animated.sequence([
            Animated.timing(animValue.bottom, {
              delay: animValue.delay,
              toValue: this.state.containerHeight * 1/6 + 40,
              duration: 1000
            }),
            Animated.timing(animValue.bottom, {
              toValue: this.state.containerHeight * 1/6,
              duration: 1000 - (i * 100)
            })
          ])
        })
      ])
    ).start()
  }


  onLayout = (event) => {
    const containerHeight = event.nativeEvent.layout.height
    const containerWidth = event.nativeEvent.layout.width

    let faceAnimations = []
    for (let i = 0; i < this.numberOfFaces; i++) {
      faceAnimations.push({
        delay: i * 200,
        bottom: new Animated.Value(containerHeight * 1/6)
      })
    }

    this.setState({
      containerHeight,
      containerWidth,
      faceAnimations
    }, () => this.animateFaces())
  }


  logoMainOwenFaceContainerStyle = {
    container: {
      flex: 3,
      justifyContent: 'center'
    }
  }


  render () {
    let owenFaces = []

    if (this.state.containerHeight && this.state.containerHeight) {
      for (let i = 0; i < this.numberOfFaces; i++) {
        const styleProps = {
          flex: 1,
          position: 'absolute',
          height: Math.pow(1/2, i) * this.state.containerHeight,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          width: Math.pow(1/2, i) * this.state.containerHeight * (this.props.character.faceWidth / this.props.character.faceHeight), //width-to-height ratio
          left: Math.pow(1/2, i+2) * this.state.containerWidth,
          zIndex: this.numberOfFaces - i,
          bottom: this.state.faceAnimations[i].bottom
        }

        owenFaces.push(
          <LogoMainOwenFace 
            key={'owenFace' + i} 
            styleProps={styleProps}
          />
        )
      }
    }


    return (
      <View 
        style={this.logoMainOwenFaceContainerStyle.container} 
        onLayout={event => this.onLayout(event)}>

        {owenFaces}

      </View>
    )
  }
}