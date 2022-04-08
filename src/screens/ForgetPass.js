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
import { SafeAreaView } from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import AppPreLoader from '../components/AppPreLoader';
import KeyboardManager from 'react-native-keyboard-manager';
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

    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }

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
    if (Email.trim() == '')
    {
      Alert.alert('Warning', 'Please enter email');
    }
    else
    {
      var logs = {
        email_id: Email,
      };
      var response = await API.post('forget_password', logs);
     // console.log(response);
      if (response.status === 'success') {
        Toast.show(response.message, Toast.LONG)
        navigation.navigate('LogIn');
      } else {
        Alert.alert('Failure', response.message);
      }
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
        <SafeAreaView style={Styles.dashboard_main_header}>
        <View style={Styles.dashboard_main_headers}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 10,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      marginTop: 4
                    }}
                    source={require('../../src/assets/images/back.png')}
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
        </SafeAreaView>
        <View style={Styles.login_text_main}>
          <Image
            style={{width: 90, height: 80, marginStart: 40, marginTop: 20}}
            source={require('../../src/assets/images/heart.png')}
          />
          <Text style={Styles.login_text_font}>Forgot Password</Text>
        </View>
        <View style={Styles.login_text_input_contain}>
          <TextInput
            placeholder="Enter Email Address"
            onChangeText={text => setTaskti(text)}
            style={Styles.login_text_input}
            autoCapitalize='none'
            placeholderTextColor='grey'
          />
          <TouchableOpacity
            style={Styles.login_btn_forget}
            onPress={() => Login()}>
            <Text style={Styles.login_text}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default ForgetPass;
