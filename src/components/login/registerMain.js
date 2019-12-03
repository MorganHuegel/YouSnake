import React from 'react';

import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LoginInput } from './loginInput';

import { registerUser } from '../../fetchFunctions/registerUser';
import { fetchLogin } from '../../fetchFunctions/login';

import { AvatarContext } from '../App';
import players from '../playerData'

export class RegisterMain extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      usernameText: '',
      usernameErrorMessage: '',
      passwordText: '',
      passwordErrorMessage: '',
      isFetching: false,
      fetchErrorMessage: '',
      registering: false
    }
  }

  registerMainStyles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    logo: {
      width: undefined,
      height: undefined
    },
    toggleRegistering: {
      marginTop: 15,
      alignSelf: 'center'
    },
    toggleRegisteringText: {
      color: 'rgb(200, 200, 255)',
      textDecorationLine: 'underline',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      width: 250,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: 5,
      borderColor: 'rgb(230, 230, 230)',
      marginTop: 12
    },
    buttonText: {
      color: 'white',
      fontSize: 20
    },
    errorMessage: {
      color: 'rgb(255, 170, 160)',
      fontStyle: 'italic',
      minHeight: 40,
      maxWidth: 250,
      marginTop: 12
    }
  }

  

  onChangeUsernameText = (text) => {
    let usernameErrorMessage = ''
    if (!text) {
      usernameErrorMessage = 'Username is needed to show off your high scores!'
    }
    return this.setState({
      usernameText: text, 
      usernameErrorMessage
    })
  }



  onChangePasswordText = (text) => {
    let passwordErrorMessage = ''
    if (!text) {
      passwordErrorMessage = 'Password required.'
    } else if (text.length < 8) {
      passwordErrorMessage = 'Password must be at least 8 characters long.'
    } else if (text.length > 30) {
      passwordErrorMessage = 'Password must be less than 30 characters long'
    }

    return this.setState({
      passwordText: text, 
      passwordErrorMessage
    })
  }



  onBlurUsername = (event) => {
    this.onChangeUsernameText(event.nativeEvent.text)
  }
  


  onBlurPassword = (event) => {
    this.onChangePasswordText(event.nativeEvent.text)
  }



  onSubmit = (event) => {
    if (this.state.usernameErrorMessage || this.state.passwordErrorMessage) {
      return
    }
    if (!this.state.usernameText) {
      return this.setState({usernameErrorMessage: 'Enter a username to show off your high score!'})
    } else if (!this.state.passwordText) {
      return this.setState({passwordErrorMessage: 'Whoa, hold up! Enter a password, first.'})
    }

    this.setState({
      isFetching: true,
      fetchErrorMessage: ''
    }, () => {
      if (this.state.registering) {
        return registerUser(this.state.usernameText, this.state.passwordText)
          .then(response => {
            console.log('response in registerMain: ', response)
            return this.props.setLoggedIn(true, response.webToken, response.userData.avatar)
          })
          .catch(errorMessage => {
            // errorMessage should be a string, but it might be an Error object
            this.setState({
              fetchErrorMessage: errorMessage.message ? errorMessage.message : errorMessage,
              isFetching: false
            })
          })
      } else {
        return fetchLogin(this.state.usernameText, this.state.passwordText)
          .then(response => {
            return this.props.setLoggedIn(true, response.webToken, response.userData.avatar)
          })
          .catch(errorMessage => {
            // errorMessage should be a string, but it might be an Error object
            this.setState({
              fetchErrorMessage: errorMessage.message ? errorMessage.message : errorMessage,
              isFetching: false
            })
          })
      }
    })
  }


  toggleRegisteringState = (bool) => {
    this.setState({
      registering: bool,
      usernameErrorMessage: '',
      passwordErrorMessage: '',
      isFetching: false,
      fetchErrorMessage: '',
    })
  }



  render(){
    let toggleRegistering;
    if (this.state.registering) {
      toggleRegistering = <TouchableOpacity style={this.registerMainStyles.toggleRegistering} onPress={() => this.toggleRegisteringState(false)}>
        <Text style={this.registerMainStyles.toggleRegisteringText}>Already a User?</Text>
      </TouchableOpacity>
    } else {
      toggleRegistering = <TouchableOpacity style={this.registerMainStyles.toggleRegistering} onPress={() => this.toggleRegisteringState(true)}>
        <Text style={this.registerMainStyles.toggleRegisteringText}>Sign-up</Text>
      </TouchableOpacity>
    }

    return (
      <View style={this.registerMainStyles.container}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <AvatarContext.Consumer>
            {
              ({avatar}) => {
                const character = players[avatar];
                const registerPageLogoStyles = {
                  width: 190 * (character.faceWidth / character.faceHeight),
                  height: 190
                }
                return <Image 
                  style={[this.registerMainStyles.logo, registerPageLogoStyles]}
                  source={character.faceImageWithBorder}
                />
              }
            }
          </AvatarContext.Consumer>
        </View>

        <View style={{flex: 1.4}}>
          <LoginInput 
            isUsername={true}
            onChange={this.onChangeUsernameText}
            errorMessage={this.state.usernameErrorMessage}
            isFetching={this.state.isFetching}
            onBlur={this.onBlurUsername}
            inputValue={this.state.usernameText}
          />

          <LoginInput 
            isUsername={false}
            onChange={this.onChangePasswordText}
            errorMessage={this.state.passwordErrorMessage}
            isFetching={this.state.isFetching}
            onBlur={this.onBlurPassword}
            inputValue={this.state.passwordText}
          />

          <TouchableOpacity 
            style={this.registerMainStyles.button} 
            disabled={this.state.isFetching || !!this.state.usernameErrorMessage || !!this.state.passwordErrorMessage} 
            onPress={this.onSubmit}
          >
            <Text style={this.registerMainStyles.buttonText}>{this.state.registering ? 'Make my account' : 'Login & Play'}</Text>
          </TouchableOpacity>

          {toggleRegistering}

          <Text style={this.registerMainStyles.errorMessage}>{this.state.fetchErrorMessage}</Text>

          <ActivityIndicator size='small' color='rgb(255, 255, 255)' animating={this.state.isFetching}/>
        </View>


      </View>
    )
  }
}