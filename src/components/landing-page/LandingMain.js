import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { LogoMain } from './logo/LogoMain';
import { StartButton } from './StartButton';
import { SelectAvatar } from './SelectAvatar';


export class LandingMain extends React.Component {
  state = {
    selectingAvatar: false
  }


  landingMainStyles = {
    main: {
      display: 'flex',
      flex: 1
    },
    buttons: {
      alignSelf: 'center'
    },
    buttonText: {
      color: 'white'
    }
  }

  toggleSelectAvatar = () => {
    this.setState({selectingAvatar: !this.state.selectingAvatar})
  }

  render(){
    return this.state.selectingAvatar ? 
      <SelectAvatar toggleSelectAvatar={this.toggleSelectAvatar}/> :
      (<View style={this.landingMainStyles.main}>
          <LogoMain />
          <StartButton setToPlaying={this.props.setToPlaying}/>

          <TouchableOpacity onPress={() => this.props.setLoggedIn(false)} style={this.landingMainStyles.buttons}>
            <Text style={this.landingMainStyles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.toggleSelectAvatar()} style={this.landingMainStyles.buttons}>
            <Text style={[this.landingMainStyles.buttonText, {marginTop: 10}]}>Change Character</Text>
          </TouchableOpacity>

          {this.state.selectingAvatar ? <SelectAvatar toggleSelectAvatar={this.toggleSelectAvatar}/> : null}
        </View>
      )
  }
}