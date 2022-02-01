import React, { Component } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import {
  Container,
  Card,
  CardItem,
  // TextInput,
} from 'native-base';
var Styles = require('../assets/files/Styles');
class Search_screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ScrollView>
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.donation_main}>
          

          <Text style={{color: '#f55656', fontWeight: '800', alignSelf: 'center', fontSize: 27, marginTop: '60%', marginBottom: 40}}>
             Thank you for Donate!
             </Text>

          <TouchableOpacity
                style={Styles.donate_btn}
                onPress={() => this.props.navigation.navigate('Dashboard_donation_forDonor')}>
                <Text style={Styles.login_text}>Back</Text>
              </TouchableOpacity>
         
        </ImageBackground>
      </Container>
    </ScrollView>
    );
  }
}

export default Search_screen;
