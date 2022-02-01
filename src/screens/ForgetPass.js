import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  Container,
  // TextInput,
} from 'native-base';
var Styles = require('../assets/files/Styles');
import {AuthContext} from '../context';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-simple-toast';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

import {Picker} from '@react-native-picker/picker';
import AppPreLoader from '../components/AppPreLoader';
const ForgetPass = ({navigation}) => {
  const [Email, setemail] = useState('');
  const [Mobile, setmobile] = useState('');
  const [password, setpassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [googToken, setgoogleToken] = useState('');
  const [selectedValue, setselectedValue] = useState('');
  const [isloading, setisloading] = useState(false);
  const [fbToken, setfbToken] = useState('');
  const setTaskti = text => {
    setemail(text);
  };
  const setTasktipass = text => {
    setpassword(text);
  };
  // const contextType = AuthContext;
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '104839958051-nlpuvn6mk2bnh1aujqi58o0nqvqul2ll.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });
  }, []);

  const fblogin = async (dataval, accessToken) => {
    var logs = {
      firstName: dataval.first_name,
      lastName: dataval.last_name,
      facebookToken: accessToken,
      device_id: '',
      device_type: 'A',
      usertype: selectedValue,
      facebook_id: dataval.id,
      email: '',
    };
    var response = await API.post('login_with_facebook', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log(response);
      if (response.userdata[0].user_type == 0) {
        console.log(response.token);
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.userdata[0].user_id);
        await AsyncStorage.setItem('fb_token', response.userdata[0].fb_token);
        await AsyncStorage.setItem('user_type', response.userdata[0].user_type);
        var token = await AsyncStorage.getItem('token');
        console.log('token', token);
        setisloading(true);
        setTimeout(() => {
          navigation.navigate('Dashboard_donation_forDonor');
          setisloading(false);
          setselectedValue('');
        }, 3000);
      } else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user_id', response.userdata[0].user_id);
        await AsyncStorage.setItem('fb_token', response.userdata[0].fb_token);
        await AsyncStorage.setItem('user_type', response.userdata[0].user_type);

        setisloading(true);
        setTimeout(() => {
          navigation.navigate('Dashboard');
          setisloading(false);
          setselectedValue('');
        }, 3000);
      }
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  const Login = async () => {
    var logs = {
      username: Email,
      password: password,
    };
    var response = await API.post('login', logs);
    console.log(response.token);
    if (response.status === '1') {
      // await React.useContext.signIn(response.token);
      if (response.user_type == 0) {
        console.log(response.token);
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('google_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        var token = await AsyncStorage.getItem('token');
        console.log('token', token);
        setisloading(true);
        setTimeout(() => {
          navigation.navigate('Dashboard');
          setisloading(false);
          setemail('');
          setpassword('');
        }, 3000);
      } else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('google_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        setisloading(true);
        setTimeout(() => {
          navigation.navigate('Dashboard_donation_forDonor');
          setisloading(false);
          setemail('');
          setpassword('');
        }, 3000);
      }
    } else {
      Alert.alert(response.status, response.message);
    }
  };

  if (isloading) {
    return <AppPreLoader />;
  }
  return (
    <Container>
      <ImageBackground
        source={require('../../src/assets/images/bg.jpg')}
        style={Styles.login_main}>
        <View style={Styles.login_main_header}></View>
        <View style={Styles.login_text_main}>
          <Image
            style={{width: 90, height: 80, marginStart: 40, marginTop: 20}}
            source={require('../../src/assets/images/heart.png')}
          />
          <Text style={Styles.login_text_font}>Forget Password</Text>
        </View>
        <View style={Styles.login_text_input_contain}>
          <TextInput
            placeholder="Mobile / Email Address"
            onChangeText={text => setTaskti(text)}
            style={Styles.login_text_input}
          />
          <TouchableOpacity
            style={Styles.login_btn_forget}
            onPress={() => Login()}>
            <Text style={Styles.login_text}>Forget</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default ForgetPass;
