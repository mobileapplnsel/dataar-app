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
  ActionSheetIOS
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
import { SafeAreaView } from 'react-native-safe-area-context';
const logintype = ({route, navigation}) => {
  const [Email, setemail] = useState('');
  const [googToken, setgoogleToken] = useState('');
  const [selectedValue, setselectedValue] = useState('Select One');
  const [fbToken, setfbToken] = useState('');
  const [isSelect, setisSelect] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [userId, setuserId] = useState('');
  const [selecttypeerror, setselecttypeerror] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  
  // const contextType = AuthContext;
  useEffect(() => {
  const {user_id} = route.params;
    setuserId(user_id);
  }, []);
  const setselectValueMethod = async (dataval) => {
    setselectedValue(dataval)
    setselecttypeerror('')
  }
  const setTaskti = text => {
    setFirstName(text);
  };
  const setTasktipass = text => {
    setLastName(text);
  };
  const Login = async (dataval, accessToken) => {

    if (FirstName == '' && LastName == '')
    {
      Alert.alert('First Name & Last Name', 'Please enter both First name and Last name');
    }
    else if (FirstName == '')
    {
      Alert.alert('First Name', 'Please enter First name');
    }
    else if (LastName == '')
    {
      Alert.alert('Last Name', 'Please enter Last name');
    }
else
{



  setisloading(true);

  var fcm_token = await AsyncStorage.getItem('FCMtoken');

  var logs = {
    firstName: FirstName,
    lastName: LastName,
    apple_id: userId,
    fcm_token: fcm_token
  };

  var response = await API.post('login_with_apple', logs);
  console.log ('login_with_apple response: ', response)

  if (response.status == 'success') {
    console.log(response.userdata[0].user_type);
    var isLoggedInForOneRupee =await AsyncStorage.getItem('isLoggedInForOneRupee');
    if (response.userdata[0].user_type !== null) {
      if (response.userdata[0].user_type == 0) {
        console.log(response.token);
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.userdata[0].user_id);
        await AsyncStorage.setItem('apple_id', response.userdata[0].apple_id);
        await AsyncStorage.setItem(
          'user_type',
          response.userdata[0].user_type,
        );
        var token = await AsyncStorage.getItem('token');
        console.log('token', token);
        // setisloading(true);
        if (isLoggedInForOneRupee == 'yes')
      {
        AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
        setTimeout(() => {
          navigation.replace('OneRupeeDonation', {
            donate_amt: '100',
            donation_mode: 'dsadas',
            campaign_id: '',
            kind_id: '',
          });
          
        }, 1000);
      }
else
{
        setTimeout(() => {
          navigation.replace('Dashboard_donation_forDonor');
          // setisloading(false);
          setselectedValue('');
        }, 1000);
      }
      } else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user_id', response.userdata[0].user_id);
        await AsyncStorage.setItem('apple_id', response.userdata[0].apple_id);
        await AsyncStorage.setItem(
          'user_type',
          response.userdata[0].user_type,
        );

        setisloading(true);
        if (isLoggedInForOneRupee == 'yes')
      {
        AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
        setTimeout(() => {
          navigation.replace('OneRupeeDonation', {
            donate_amt: '100',
            donation_mode: 'dsadas',
            campaign_id: '',
            kind_id: '',
          });
          
        }, 1000);
      }
else
{
        setTimeout(() => {
          navigation.replace('Dashboard');
          // setisloading(false);
          setselectedValue('');
        }, 1000);
      }
      }
    } else {
      navigation.replace('logintype', {
        user_id: response.userdata[0].user_id,
      });
    }
  } else {
    Alert.alert(response.status, response.message);
  }


  }
  };
  const ActionSheetIOSonPress = () =>
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Donor", "Donee", "Cancel"],
       destructiveButtonIndex: 2,
       title: 'Select One',
      cancelButtonIndex: 2,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === 0) {

        setselectValueMethod('0')
        setselectedValue('Donor')
        
      } else if (buttonIndex === 1) {

        setselectValueMethod('1')
        setselectedValue('Donee')

      } else if (buttonIndex === 2) {
        // setResult("🔮");
      }
    }
  );
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
          <Text style={Styles.login_text_font}>Verify</Text>
          <Text style={Styles.login_text_font1}>Sign in to continue</Text>
        </View>
        <View style={Styles.login_text_input_contain}>
       

<TextInput
              placeholder="First Name"
              onChangeText={text => setTaskti(text)}
              style={Styles.login_text_input}
              keyboardType="default"
              placeholderTextColor='grey'
            />
            <TextInput
              placeholder="Last Name"
              onChangeText={text => setTasktipass(text)}
              style={Styles.login_text_input}
              keyboardType="default"
              placeholderTextColor='grey'
            />

          <TouchableOpacity
            style={{
              // fontSize: 18,
              // marginLeft: 50,
              // marginRight: 50,
              width: '94%',
              height: 50,
              backgroundColor: '#f55656',
              marginTop: 55,
              color: '#f55656',
              alignSelf:"center",
              marginBottom: 14
            }}
            onPress={() => Login()}>
            <Text style={Styles.login_text}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default logintype;
