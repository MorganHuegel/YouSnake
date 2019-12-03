import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import { AsyncStorage } from 'react-native'

import { RegisterMain } from './login/registerMain';
import { GameplayMain } from './gameplay/GameplayMain';
import { LandingMain } from './landing-page/LandingMain';
import { fetchLoginJwt } from '../fetchFunctions/loginJwt';
// import { checkPhoneId } from '../fetchFunctions/checkPhoneId';


export const AvatarContext = React.createContext()
export default class App extends React.Component {
  state = {
    showRegistration: false,
    loggedIn: false,
    playing: false,
    fadingOutGameplay: false,
    isFetching: false,
    avatar: 'charkie'
  }


  fadeOutGameplayTime = 600

  backToLanding = () => {
    this.setState({fadingOutGameplay: true}, () => {
      setTimeout(() => {
        this.setState({
          showRegistration: false,
          playing: false, 
          fadingOutGameplay: false
        })
      }, this.fadeOutGameplayTime + 150)
    })
  }


  UNSAFE_componentWillMount(){
    // If JWT, just log user in automatically
    // If no JWT, but phoneId is in database, have user login
    // If no JWT and phoneId not in database, have user register
    this.setState({isFetching: true}, () => {
      return AsyncStorage.getItem('@webToken')
        .then(webToken => {
          if (!webToken) {
            return Promise.reject('No JWT')
          }
          return fetchLoginJwt(webToken)
        })
        .then(userData => {
          this.setState({loggedIn: true, isFetching: false, avatar: userData.avatar})
        })
        .catch((err) => {
          if (err === 'No JWT') {
            return this.setState({
              showRegistration: true,
              loggedIn: false,
              isFetching: false
            })
          }

          else return this.setState({
            loggedIn: false, 
            showRegistration: true, 
            isFetching: false
          })
        })
    })
  }


  setLoggedIn = (bool, webToken=null, avatar=null) => {
    if (bool) {
      return AsyncStorage.setItem('@webToken', webToken)
        .then(this.setState({
          showRegistration: false,
          loggedIn: bool,
          avatar: avatar
        }))
        .catch(err => {
          this.setState({
            showRegistration: false,
            loggedIn: false,
            playing: false,
            avatar: 'charkie'
          })
        })
    } else {
      return AsyncStorage.removeItem('@webToken')
        .then(this.setState({
          loggedIn: bool,
          playing: false,
          showRegistration: true
        }))
    }
  }


  setToPlaying = () => {
    this.setState({
      playing: true,
      showRegistration: false,
    })
  }


  setAvatar = (avatar) => {
    if (!avatar) avatar = 'charkie'
    this.setState({ avatar })
  }
  
  render() {
    let component;
    if (this.state.isFetching) {
      component = <ActivityIndicator 
        size='large' 
        color='rgb(255, 255, 255)' 
        animating={this.state.isFetching} 
        style={{marginTop: 100}}
      />
    } else if (!this.state.loggedIn && this.state.showRegistration) {
      component = <RegisterMain setLoggedIn={this.setLoggedIn} setAvatar={this.setAvatar}/>
    } else if (this.state.playing) {
      component = <GameplayMain 
        backToLanding={this.backToLanding} 
        fadeOutGameplayTime={this.fadeOutGameplayTime} 
        fadingOutGameplay={this.state.fadingOutGameplay}
        screenPaddingX={stylesApp.container.paddingHorizontal}
        screenPaddingY={stylesApp.container.paddingVertical}
      /> 
    } else {
      console.log('rendering Landing Page: ', this.state)
      component = <LandingMain setToPlaying={this.setToPlaying} setLoggedIn={this.setLoggedIn}/>
    }
    
    return (
      <AvatarContext.Provider value={{avatar: this.state.avatar, setAvatar: this.setAvatar}}>
        <View style={stylesApp.container}>
          {component}
        </View>
      </AvatarContext.Provider>
    )
  }
}

const stylesApp = StyleSheet.create({
  container: { 
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingVertical: 40,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(99,116,122)'
  }
})
