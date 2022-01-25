import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Container,
  // TextInput,
} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import AsyncStorage from '@react-native-community/async-storage';
const Dashboard = ({navigation}) => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setemail] = useState('');
  const [Mobile, setmobile] = useState('');
  const [password, setpassword] = useState('');
  const [Otp, setotp] = useState('');
  const TrackCampaign = () => {
    navigation.navigate('View_campaign');
  };
  const StartCampaign = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      navigation.navigate('StartCampaign');
    } else {
      navigation.navigate('LogIn');
    }
  };
  const user = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      this.props.navigation.navigate('User profile');
    } else {
      this.props.navigation.navigate('LogIn');
    }
  };
  return (
    <ScrollView>
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.login_main}>
          <View style={Styles.dashboard_main_header}>
            <View style={Styles.dashboard_main_headers}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 10,
                    // marginTop: 20,
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                    
                  }}
                  source={require('../../src/assets/images/3_line_icon.png')}
                  // resizeMode="contain"dashboard_main_btn
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    marginStart: 10,
                    // marginTop: 20,
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                  }}
                  source={require('../../src/assets/images/heart1.png')}
                  // resizeMode="contain"dashboard_main_btn
                />
              </TouchableOpacity>
            </View>
            <View style={Styles.dashboard_main_headers}>
              <TouchableOpacity>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 40,
                    // marginTop: 20,
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                  }}
                  source={require('../../src/assets/images/search.png')}
                  // resizeMode="contain"dashboard_main_btn
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => user()}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 10,
                    marginEnd: 10,
                    // marginTop: 20,
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                  }}
                  source={require('../../src/assets/images/user.png')}
                  // resizeMode="contain"dashboard_main_btn
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={Styles.campaign_name_font}>Dashboard</Text>
          <View style={Styles.dashboard_main_btn}>
            <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => TrackCampaign()}>
              <Text style={Styles.login_text}>Track My Campaign</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => StartCampaign()}>
              <Text style={Styles.login_text}>Start Campaign</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Container>
    </ScrollView>
  );
};

export default Dashboard;
