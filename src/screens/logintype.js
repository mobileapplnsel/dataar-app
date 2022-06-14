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
import { ScrollView } from 'react-native-gesture-handler';
const logintype = ({route, navigation}) => {
  const [Email, setemail] = useState('');
  const [googToken, setgoogleToken] = useState('');
  const [selectedValue, setselectedValue] = useState('Select One');
  const [fbToken, setfbToken] = useState('');
  const [isSelect, setisSelect] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [userId, setuserId] = useState('');
  const [loginThrough, setloginThrough] = useState('');
  const [selecttypeerror, setselecttypeerror] = useState('');
  const [emailerror, setemailerror] = useState('');
  const [mobileerror, setmobileerror] = useState('');
  const [addresserror, setaddresserror] = useState('');
  const [pincodeerror, setpincodeerror] = useState('');
  const [Mobile, setmobile] = useState('');
  const [FullAddress, setfulladdress] = useState('');
  const [PinCode, setpincode] = useState('');
  // const contextType = AuthContext;
  useEffect(() => {
  const {user_id} = route.params;
  const {loginThrough} = route.params;
    setuserId(user_id);
    setloginThrough(loginThrough);

  //   setloginThrough('google');
  }, []);
  const setselectValueMethod = async (dataval) => {
    setselectedValue(dataval)
    setselecttypeerror('')
  }

  const Login = async (dataval, accessToken) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (selectedValue == '' || selectedValue == 'Select One')
    {
setselecttypeerror('Please choose a type')
    }
    else  if (Mobile == '')
    {
setmobileerror('Please enter mobile number')
    }
    else  if (FullAddress == '')
    {
setaddresserror('Please enter your full address')
    }
    else  if (PinCode == '')
    {
setpincodeerror('Please enter pincode')
    }
else
{


  if ((loginThrough == 'fb' || loginThrough == 'apple') && (Email == ''))
  {
   
setemailerror('Please enter email')
    
  }
  else if ((loginThrough == 'fb' || loginThrough == 'apple') && (reg.test(Email) === false))
  {
    setemailerror('Please enter valid email')
  }
  else if (Mobile.length < 10)
  {
    setmobileerror('Please enter valid mobile number')
  }
  else
  {

  var logs

  if (Platform.OS === 'ios')
  {
    if (loginThrough == 'google')
    {
      if (selectedValue == 'Donor')
      {
        logs = {
          user_id: userId,
          usertype: '0',
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'google'
        };
      }
      else
      {
        logs = {
          user_id: userId,
          usertype: '1',
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'google'
        };
      }
    }
    else if (loginThrough == 'fb')
    {
      if (selectedValue == 'Donor')
      {
        logs = {
          user_id: userId,
          usertype: '0',
          email: Email,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'facebook'
        };
      }
      else
      {
        logs = {
          user_id: userId,
          usertype: '1',
          email: Email,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'facebook'
        };
      }
    }
    else
    {
      if (selectedValue == 'Donor')
      {
        logs = {
          user_id: userId,
          usertype: '0',
          email: Email,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'apple'
        };
      }
      else
      {
        logs = {
          user_id: userId,
          usertype: '1',
          email: Email,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'apple'
        };
      }
    }
    

  }
  else
  {
    

    if (loginThrough == 'google')
    {
      logs = {
        user_id: userId,
        usertype: selectedValue,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'google'
      };
    }
    else if (loginThrough == 'fb')
    {
      logs = {
        user_id: userId,
        usertype: selectedValue,
        email: Email,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'facebook'
      };
    }
    else
    {
      logs = {
        user_id: userId,
        usertype: selectedValue,
        email: Email,
          mobileno: Mobile,
          fulladdress: FullAddress,
          pincode: PinCode,
          login_source: 'apple'
      };
    }

  }

    
    var response = await API.post('update_usertype', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log(response);
      if (response.userdata[0].user_type == 0) {
        console.log(response.token);
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.userdata[0].user_id);
        // await AsyncStorage.setItem('fb_token', response.userdata[0].fb_token);
        await AsyncStorage.setItem('user_type', response.userdata[0].user_type);
        await AsyncStorage.setItem('profile_image', response.profile_image);
        await AsyncStorage.setItem('profile_name', response.userdata[0].first_name + ' ' + response.userdata[0].last_name);
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
        // await AsyncStorage.setItem('fb_token', response.userdata[0].fb_token);
        await AsyncStorage.setItem('user_type', response.userdata[0].user_type);
        await AsyncStorage.setItem('profile_image', response.profile_image);
        await AsyncStorage.setItem('profile_name', response.userdata[0].first_name + ' ' + response.userdata[0].last_name);

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
  const setMobile = text => {
    if (text == '')
    {
      setmobile(text);
      setmobileerror('Please enter mobile number')
    }
    else
    {
      setmobile(text);
      setmobileerror('')
    }
    
  };
  const setEmail = text => {
    if (text == '')
    {
      setemail(text);
      setemailerror('Please enter email')
    }
    else
    {
      setemail(text);
      setemailerror('')
    }
  };
  const setAddress = text => {
    if (text == '')
    {
      setfulladdress(text);
      setaddresserror('Please enter your full address')
    }
    else
    {
      setfulladdress(text);
      setaddresserror('')
    }
  };
  const setPincode = text => {
    if (text == '')
    {
      setpincode(text);
      setpincodeerror('Please enter pincode')
    }
    else
    {
      setpincode(text);
      setpincodeerror('')
    }
  };
  return (
    <Container>
      <ImageBackground
        source={require('../../src/assets/images/bg.jpg')}
        style={Styles.login_main}>
          <ScrollView>
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
          

{ loginThrough == 'google' || loginThrough == 'fb' || loginThrough == 'apple' ? <TextInput
              placeholder="Enter Mobile No."
              onChangeText={text => setMobile(text)}
              style={Styles.login_text_input}
              keyboardType="numeric"
              placeholderTextColor='grey'
            /> : null}

{ loginThrough == 'google' || loginThrough == 'fb' || loginThrough == 'apple' ? <Text style={{
    marginTop: 5,
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 13,
}}>{mobileerror}</Text> : null}

{ loginThrough == 'fb' || loginThrough == 'apple' ? <TextInput
              placeholder="Enter Email ID"
              onChangeText={text => setEmail(text)}
              style={Styles.login_text_input}
              keyboardType='default'
              autoCapitalize = 'none'
              placeholderTextColor='grey'
            /> : null}

{ loginThrough == 'fb' || loginThrough == 'apple' ? <Text style={{
    marginTop: 5,
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 13,
}}>{emailerror}</Text> : null}

{ loginThrough == 'google' || loginThrough == 'fb' || loginThrough == 'apple' ? <TextInput
              placeholder="Enter Full Address"
              onChangeText={text => setAddress(text)}
              style={Styles.login_text_input}
              keyboardType='default'
              placeholderTextColor='grey'
            /> : null}

{ loginThrough == 'google' || loginThrough == 'fb' || loginThrough == 'apple' ? <Text style={{
    marginTop: 5,
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 13,
}}>{addresserror}</Text>  : null}


{ loginThrough == 'google' || loginThrough == 'fb' || loginThrough == 'apple' ? <TextInput
              placeholder="Enter Pincode"
              onChangeText={text => setPincode(text)}
              style={Styles.login_text_input}
              keyboardType="numeric"
              placeholderTextColor='grey'
            /> : null}

{ loginThrough == 'google' || loginThrough == 'fb' || loginThrough == 'apple' ? <Text style={{
    marginTop: 5,
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 13,
}}>{pincodeerror}</Text>  : null}



        { Platform.OS === 'ios' ? 
<TouchableOpacity onPress={() => ActionSheetIOSonPress()}>
<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', height: 40,
      margin: 0,
      marginTop: 11}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:13,color: 'gray', fontSize: 16,}}>{selectedValue}</Text>
                <View style={{width:15, height:15, justifyContent: 'flex-end', marginRight: 20, marginTop: 3}}>
                  <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24,}} />
                </View>
                
              </View>
              </View>
              </TouchableOpacity> 
:
          <Picker
            selectedValue={selectedValue}
            style={{
              height: 50,
              width: '97%',
              borderColor: '#000',
              alignSelf: 'center',
              borderWidth: 1,
            }}
            onValueChange={(itemValue, itemIndex) =>
              setselectValueMethod(itemValue)
            }>
            <Picker.Item label="Select one" value="" />
            <Picker.Item label="Donor" value="0" />
            <Picker.Item label="Donee" value="1" />
          </Picker> }
          <Text style={{
    marginTop: -5,
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 13,
}}>{selecttypeerror}</Text>
          <TouchableOpacity
            style={Styles.login_btn_forget}
            onPress={() => Login()}>
            <Text style={Styles.login_text}>Login</Text>
          </TouchableOpacity>
          
        </View>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

export default logintype;
