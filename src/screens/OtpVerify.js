import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Container,
} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
const OtpVerify = ({route, navigation}) => {
  const [Mobile, setMobile] = useState('');
  const [LastName, setLastName] = useState();
  const [Otp, setotp] = useState('');
  const setTaskti = text => {
    setotp(text);
  };
  React.useEffect(() => {
    const {mobile} = route.params;
    console.log(mobile);
    setMobile(mobile);
  }, []);
  const Otpverify = async () => {

    if (Otp == '')
    {
      Toast.show('Please provide the OTP')
    }
else
{
    console.log(Mobile);
    var logs = {
      phone: Mobile,
      otp: Otp,
    };
    var response = await API.post('user_otp_verification', logs);

    if (response.status == 'error')
    {
      Toast.show(response.message, Toast.LONG)
    }
   else if (response.token != '') {
      Toast.show('The OTP has been sent to the registered email, please check and provide the same', Toast.LONG)
      if (response.user_type == 0) {
        console.log(response.token);
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('fb_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        var token = await AsyncStorage.getItem('token');
        console.log('token', token);
        navigation.navigate('Dashboard_donation_forDonor');
      } else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('fb_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        navigation.navigate('Dashboard');
      }
    } else {
      // Alert.alert(response.status, response.message);
    }
  }
  };

  const resendOtp = async () => {
  
    
    var logs = {
      phone: Mobile//Mobile, '9876541473'
    };
    var response = await API.postWithoutHeader('resend_user_otp', logs);
    console.log('response: ', response)
    if (response.status == 'error')
    {
      Toast.show(response.message, Toast.LONG)
    }
    else
    {
      Toast.show(response.message, Toast.LONG)
    }
      
   
  
  };

  return (
    <ScrollView>
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
            <Text style={Styles.login_text_font}>Otp Verify</Text>
          </View>
          <View style={Styles.login_text_input_contain}>
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor='grey'
              onChangeText={text => setTaskti(text)}
              style={Styles.login_text_input}
              keyboardType="phone-pad"/>
<TouchableOpacity  onPress={() => resendOtp()}>
<Text style={{
                    //  marginLeft: 10,
                    alignSelf: 'flex-end',
                     marginRight: 10,
                      color:'black',
                     paddingTop: 14,
                     fontWeight: 'bold',
                     fontSize: 17
                     
                  }}>
                    Resend OTP
                  </Text>
                  </TouchableOpacity>

            <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => Otpverify()}>
              <Text style={Styles.login_text}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Container>
    </ScrollView>
  );
};

export default OtpVerify;
