import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import { AsyncStorage } from 'react-native'

import { LoginPasswordOnlyMain } from './login/loginPasswordOnlyMain';
import { RegisterMain } from './login/registerMain';
import { GameplayMain } from './gameplay/GameplayMain';
import { LandingMain } from './landing-page/LandingMain';
import { fetchLoginJwt } from '../fetchFunctions/loginJwt';
import { checkPhoneId } from '../fetchFunctions/checkPhoneId';


export const AvatarContext = React.createContext()
export default class App extends React.Component {
  state = {
    showRegistration: false,
    showPasswordLogin: false,
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
          showPasswordLogin: false,
          playing: false, 
          fadingOutGameplay: false
        })
      }, this.fadeOutGameplayTime + 150)
    })
  }


  UNSAFE_componentWillMount(){
    // If JWT, just log user in automatically
    // If no JWT, but phoneId is in database, just have uesr enter password
    // If no JWT and phoneId not in database, have uesr register
    this.setState({isFetching: true}, () => {
      return AsyncStorage.getItem('@webToken')
        .then(webToken => {
          if (!webToken) {
            return Promise.reject('No JWT')
          }
          return fetchLoginJwt(webToken)
        })
        .then(userData => {
          this.setState({loggedIn: true, showPasswordLogin: false, isFetching: false, avatar: userData.avatar})
        })
        .catch((err) => {
          if (err === 'No JWT') {
            return checkPhoneId()
              .then(response => {
                if (response.userExists) {
                  this.setState({
                    showRegistration: false,
                    showPasswordLogin: true,
                    loggedIn: false,
                    isFetching: false,
                    avatar: response.avatar
                  })
                } else {
                  this.setState({
                    showRegistration: true,
                    showPasswordLogin: false,
                    loggedIn: false,
                    isFetching: false
                  })
                }
              })
              .catch(err => {
                console.log('Should error handle here in App: ', err.message || err)
              })
          }
          else this.setState({
            loggedIn: false, 
            showPasswordLogin: true, 
            showRegistration: false, 
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
          showPasswordLogin: false,
          loggedIn: bool,
          avatar: avatar
        }))
    } else {
      return AsyncStorage.removeItem('@webToken')
        .then(this.setState({
          loggedIn: bool,
          playing: false,
          showPasswordLogin: true,
          showRegistration: true
        }))
    }
  }


  setToPlaying = () => {
    this.setState({
      playing: true,
      showRegistration: false,
      showPasswordLogin: false
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
    } else if (!this.state.loggedIn && this.state.showPasswordLogin) {
      component = <LoginPasswordOnlyMain setLoggedIn={this.setLoggedIn}/>
    } else if (this.state.playing) {
      component = <GameplayMain 
        backToLanding={this.backToLanding} 
        fadeOutGameplayTime={this.fadeOutGameplayTime} 
        fadingOutGameplay={this.state.fadingOutGameplay}
        screenPaddingX={stylesApp.container.paddingHorizontal}
        screenPaddingY={stylesApp.container.paddingVertical}
      /> 
    } else {
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
