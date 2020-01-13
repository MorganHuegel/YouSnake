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
            Animated.timing(animValue.top, {
              delay: animValue.delay,
              toValue: (this.state.containerHeight * -1 * Math.pow(1/2, i+1) + 40),
              duration: 1000,
              useNativeDriver: true
            }),
            Animated.timing(animValue.top, {
              toValue: (this.state.containerHeight * -1 * Math.pow(1/2, i+1) + 80),
              duration: 1000 - (i * 100),
              useNativeDriver: true
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
        top: new Animated.Value(containerHeight * -1 * Math.pow(1/2, i+1) + 80)
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

    if (this.state.containerHeight && this.state.containerWidth) {
      for (let i = 0; i < this.numberOfFaces; i++) {
        const styleProps = {
          flex: 1,
          position: 'absolute',
          height: Math.pow(1/2, i) * this.state.containerHeight,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          width: Math.pow(1/2, i) * this.state.containerHeight * (this.props.character.faceWidth / this.props.character.faceHeight), //width-to-height ratio
          left: Math.pow(1/2, i+2) * this.state.containerWidth + (this.state.containerWidth * 1/12),
          zIndex: this.numberOfFaces - i,
          transform: [{translateY: this.state.faceAnimations[i].top}]
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