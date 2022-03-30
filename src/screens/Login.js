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
  BackHandler
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
import Feather from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import AppPreLoader from '../components/AppPreLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
const Login = ({navigation}) => {
  const [Email, setemail] = useState('');
  const [Mobile, setmobile] = useState('');
  const [password, setpassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [googToken, setgoogleToken] = useState('');
  const [selectedValue, setselectedValue] = useState('');
  const [fbToken, setfbToken] = useState('');
  const [isSelect, setisSelect] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [isPasswordHidden, setisPasswordHidden] = useState(false);
  const setTaskti = text => {
    setemail(text);
  };
  const setTasktipass = text => {
    setpassword(text);
  };
  // const contextType = AuthContext;
  useEffect(() => {
    const isFocused = navigation.isFocused();

    const willFocusSubscription = navigation.addListener('focus', () => {
      console.log('willFocusSubscription called: ')
        setisloading(false);

      GoogleSignin.configure({
        scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
        webClientId:
          '104839958051-nlpuvn6mk2bnh1aujqi58o0nqvqul2ll.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      })
  });

  return willFocusSubscription;

    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '104839958051-nlpuvn6mk2bnh1aujqi58o0nqvqul2ll.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    })

    if (Platform.OS === 'android') {
     BackHandler.addEventListener('hardwareBackPress', backBtnPressed)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
     
    }
    
  }, []);
 
  const onBackPress = () => {
    return true;
  };
   const backBtnPressed = () => {
    
    Alert.alert(
      'Warning',
      'Do you want to close the app?', // <- this part is optional, you can pass an empty string
      [
        {text: 'NO', onPress: () => console.log('No')},
        {text: 'YES', onPress: () => BackHandler.exitApp()},
        
      ],
      {cancelable: false},
    )
    return true;
  };
  const signIngoo = async () => {
    try {
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfooooo', userInfo);
      var fcm_token = await AsyncStorage.getItem('FCMtoken');
      if (userInfo.user.email !== '') {
        setisloading(true);
        var logs = {
          firstName: userInfo.user.givenName,
          lastName: userInfo.user.familyName,
          email: userInfo.user.email,
          googleToken: userInfo.idToken,
          device_id:'firebasetokenid',
          device_type: 'A',
          usertype: selectedValue,
          fcm_token: fcm_token
        };
        console.log(logs);
        var response = await API.post('login_with_google', logs);
        console.log('response', response);
        if (response.status == 'success') {
          // navigation.navigate('OtpVerify', {mobile: Mobile});
          var isLoggedInForOneRupee =await AsyncStorage.getItem('isLoggedInForOneRupee');
          console.log(response.userdata[0].user_type);
          if (response.userdata[0].user_type !== null) {
            if (response.userdata[0].user_type == 0) {
              console.log(response.token);
              await AsyncStorage.setItem('token', String(response.token));
              await AsyncStorage.setItem(
                'user_id',
                response.userdata[0].user_id,
              );
              await AsyncStorage.setItem(
                'google_token',
                response.userdata[0].google_token,
              );
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
              await AsyncStorage.setItem(
                'user_id',
                response.userdata[0].user_id,
              );
              await AsyncStorage.setItem(
                'google_token',
                response.userdata[0].google_token,
              );
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
      } else {
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const signInfb = () => {
    return new Promise((resolve, reject) => {
      LoginManager.logOut();
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('web_only');
      }
      LoginManager.logInWithPermissions(['public_profile', 'email'])
        .then(function (result) {
          console.log(result);
          if (result.isCancelled) {
            reject(result);
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              let accessToken = data.accessToken;
              console.log(accessToken);
              setfbToken(accessToken);

              const responseInfoCallback = (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                  // console.log(result);
                  setisloading(true);
                  fblogin(result, accessToken);
                }
              };

              const infoRequest = new GraphRequest(
                '/me',
                {
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,middle_name,last_name',
                    },
                  },
                },
                responseInfoCallback,
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            });
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  const fblogin = async (dataval, accessToken) => {
   setisloading(true);
    var fcm_token = await AsyncStorage.getItem('FCMtoken');
    var logs = {
      // fullName: dataval.first_name + ' ' + dataval.last_name,
      firstName: dataval.first_name,
      lastName: dataval.last_name,
      facebookToken: accessToken,
      device_id: 'firebasetokenid',
      device_type: 'A',
      // usertype: selectedValue,//'1',//selectedValue,
      facebook_id: dataval.id,
      email: '',
      fcm_token: fcm_token
    };
    var response = await API.post('login_with_facebook', logs);
    console.log ('fb response: ', response)

    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log(response.userdata[0].user_type);
      var isLoggedInForOneRupee =await AsyncStorage.getItem('isLoggedInForOneRupee');
      if (response.userdata[0].user_type !== null) {
        if (response.userdata[0].user_type == 0) {
          console.log(response.token);
          await AsyncStorage.setItem('token', String(response.token));
          await AsyncStorage.setItem('user_id', response.userdata[0].user_id);
          await AsyncStorage.setItem('fb_token', response.userdata[0].fb_token);
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
          await AsyncStorage.setItem('fb_token', response.userdata[0].fb_token);
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
  };
  const googlelog = async () => {};
  const Login = async () => {
    var fcm_token = await AsyncStorage.getItem('FCMtoken');
    if (Email.trim() == '')
    {
      Alert.alert('Warning', 'Please enter Mobile or Email');
    }
    else if (password.trim() == '')
    {
      Alert.alert('Warning', 'Please enter Password');
    }
    else
    {
    var logs = {
      username: Email.trim(),
      password: password,
      fcm_token: fcm_token
    };
    var response = await API.post('login', logs);
    // navigation.closeDrawer();
    var isLoggedInForOneRupee =await AsyncStorage.getItem('isLoggedInForOneRupee');
    // navigation.closeDrawer()
   // console.log('isLoggedInForOneRupee: ', isLoggedInForOneRupee);
    console.log('response: ', response);
    if (response.status === '1') {
      // await React.useContext.signIn(response.token);
      if (response.user_type == 0) {
        if(response.pan_number !="")
        {
          await AsyncStorage.setItem('pan_number', response.pan_number);
        }
        
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('google_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        await AsyncStorage.setItem('kyc_verified', response.kyc_verified);
       
        var token = await AsyncStorage.getItem('token');
        console.log('token', token);
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
            // setisloading(false);
    setemail('');
    setpassword(''); 
          }, 1000);
        }
else
{
  setTimeout(() => {
    navigation.replace('Dashboard_donation_forDonor');
    // setisloading(false);
    setemail('');
    setpassword('');
  }, 1000);
}
        
      } else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('google_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        await AsyncStorage.setItem('kyc_verified', response.kyc_verified);
        if(response.pan_number !="")
        {
          await AsyncStorage.setItem('pan_number', response.pan_number);
        }
        setisloading(true);
//         if (isLoggedInForOneRupee == 'yes')
//         {
//           AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
//           setTimeout(() => {
//             navigation.navigate('OneRupeeDonation', {
//               donate_amt: '100',
//               donation_mode: 'dsadas',
//               campaign_id: '',
//               kind_id: '',
//             });
            
//           }, 1000);
//         }
// else
// {
        setTimeout(() => {
          navigation.replace('Dashboard');
          // setisloading(false);
          setemail('');
          setpassword('');
        }, 1000);
      }
   //   }
    } else {
      Alert.alert(response.status, response.message);
    }
  }
  };
  const signInlind = () => {};
  const register = () => {
    navigation.navigate('SignUp');
  };
  if (isloading) {
    return <AppPreLoader />;
  }
  const updateSecureText = () => {
    setisPasswordHidden(!isPasswordHidden);
  };
  return (
    <Container>
      <ImageBackground
        source={require('../../src/assets/images/bg.jpg')}
        style={Styles.login_main}>
        <SafeAreaView style={Styles.login_main_header}></SafeAreaView>
        <View style={Styles.login_text_main}>
          <Image
            style={{width: 90, height: 80, marginStart: 40, marginTop: 20}}
            source={require('../../src/assets/images/heart.png')}
            // resizeMode="contain"
          />
          <Text style={Styles.login_text_font}>Login</Text>
          <Text style={Styles.login_text_font1}>Sign in to continue</Text>
        </View>
        <View style={Styles.login_text_input_contain}>
          <TextInput
            placeholder="Mobile / Email Address"
            onChangeText={text => setTaskti(text)}
            style={Styles.login_text_input}
            autoCapitalize='none'
            placeholderTextColor='grey'
          />
          {/* <TextInput
            placeholder="Password"
            onChangeText={text => setTasktipass(text)}
            style={Styles.login_text_input}
            secureTextEntry={true}
          /> */}

<View
              style={{
                flexDirection: 'row',
                marginTop: 14,
                borderBottomWidth: 1,
                paddingRight: 10,
                marginStart: 10,
                marginEnd: 10,
              }}>
              <TextInput
                placeholder="Password"
                onChangeText={text => setTasktipass(text)}
                style={{
                  flex: 1,
                  paddingTop: 0,
                  fontSize: 16,
                  height: 40,
                  color: 'black'
                }}
                keyboardType="default"
                placeholderTextColor='grey'
                secureTextEntry={!isPasswordHidden}
              />
              <TouchableOpacity onPress={updateSecureText}>
                {!isPasswordHidden ? (
                  <Feather name="eye-off" color="gray" size={20} />
                ) : (
                  <Feather name="eye" color="green" size={20} />
                )}
              </TouchableOpacity>
            </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPassScreen')}>
            <Text style={Styles.login_text_forget}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Styles.login_btn_forget}
            onPress={() => Login()}>
            <Text style={Styles.login_text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => register()}>
            <Text style={Styles.login_user_register}>
              Don`t have an account?.Create one
            </Text>
          </TouchableOpacity>

          <View style={Styles.login_social_contain}>
            <TouchableOpacity onPress={() => signInfb()}>
              <Image
                style={{width: 40, height: 40, marginStart: 0, marginTop: 20}}
                source={require('../../src/assets/images/fb.png')}
                // resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signIngoo()}>
              <Image
                style={{width: 40, height: 40, marginStart: 10, marginTop: 20}}
                source={require('../../src/assets/images/goo.png')}
                // resizeMode="contain"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => signInlind()}>
              <Image
                style={{width: 40, height: 40, marginStart: 10, marginTop: 20}}
                source={require('../../src/assets/images/in.png')}
                // resizeMode="contain"
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default Login;
