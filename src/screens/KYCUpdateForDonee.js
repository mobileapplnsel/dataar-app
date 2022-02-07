import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Animated,
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
var Styles = require('../assets/files/Styles');
import Feather from 'react-native-vector-icons/Feather';
class User_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kyc: false,
      

    };
  }
  
  async componentDidMount() {
   
  }
  

  render() {
    return (
      <Container>
        <ScrollView>
          <ImageBackground
            source={require('../../src/assets/images/bg.jpg')}
            style={Styles.login_main}>
            <View style={Styles.dashboard_main_header}>
              <View style={Styles.dashboard_main_headers}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 10,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                    }}
                    source={require('../../src/assets/images/back.png')}
                  />
                </TouchableOpacity>

                <Text style={{marginLeft: 24, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    KYC Update
                  </Text>
                
              </View>
              <View style={Styles.dashboard_main_headers}>
                




              </View>
            </View>
           
            
            
            {/* </View> */}
          </ImageBackground>
        </ScrollView>
      </Container>
    );
  }
}

export default User_profile;