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
  const signIngoo = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo.user.email);
      if (userInfo.user.email !== '') {
        var logs = {
          firstName: userInfo.user.givenName,
          lastName: userInfo.user.familyName,
          email: userInfo.user.email,
          googleToken: userInfo.idToken,
          device_id: '',
          device_type: 'A',
          usertype: selectedValue,
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
              setisloading(true);
              if (isLoggedInForOneRupee == 'yes')
        {
          AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
          setTimeout(() => {
            navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
            
          }, 3000);
        }
else
{
              setTimeout(() => {
                navigation.navigate('Dashboard_donation');
                setisloading(false);
                setselectedValue('');
              }, 3000);
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
            navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
            
          }, 3000);
        }
else
{
              setTimeout(() => {
                navigation.navigate('Dashboard');
                setisloading(false);
              }, 3000);
            }
            }
          } else {
            navigation.navigate('logintype', {
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
          setisloading(true);
          if (isLoggedInForOneRupee == 'yes')
        {
          AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
          setTimeout(() => {
            navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
            
          }, 3000);
        }
else
{
          setTimeout(() => {
            navigation.navigate('Dashboard_donation');
            setisloading(false);
            setselectedValue('');
          }, 3000);
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
            navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
            
          }, 3000);
        }
else
{
          setTimeout(() => {
            navigation.navigate('Dashboard');
            setisloading(false);
            setselectedValue('');
          }, 3000);
        }
        }
      } else {
        navigation.navigate('logintype', {
          user_id: response.userdata[0].user_id,
        });
      }
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  const googlelog = async () => {};
  const Login = async () => {
    var logs = {
      username: Email,
      password: password,
    };
    var response = await API.post('login', logs);
    
    var isLoggedInForOneRupee =await AsyncStorage.getItem('isLoggedInForOneRupee');

    console.log('isLoggedInForOneRupee: ', isLoggedInForOneRupee);
    if (response.status === '1') {
      // await React.useContext.signIn(response.token);
      if (response.user_type === 0) {
        console.log(response.token);
        await AsyncStorage.setItem('token', String(response.token));
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('google_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        var token = await AsyncStorage.getItem('token');
        console.log('token', token);
        setisloading(true);

        
        if (isLoggedInForOneRupee == 'yes')
        {
          AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
          setTimeout(() => {
            navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
            
          }, 3000);
        }
else
{
  setTimeout(() => {
    navigation.navigate('Dashboard_donation');
    setisloading(false);
    setemail('');
    setpassword('');
  }, 3000);
}
        
      } else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user_id', response.user_id);
        await AsyncStorage.setItem('google_token', '');
        await AsyncStorage.setItem('user_type', response.user_type);
        setisloading(true);
        if (isLoggedInForOneRupee == 'yes')
        {
          AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
          setTimeout(() => {
            navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
            
          }, 3000);
        }
else
{
        setTimeout(() => {
          navigation.navigate('Dashboard');
          setisloading(false);
          setemail('');
          setpassword('');
        }, 3000);
      }
      }
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  const signInlind = () => {};
  const register = () => {
    navigation.navigate('SignUp');
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
          />
          <TextInput
            placeholder="Password"
            onChangeText={text => setTasktipass(text)}
            style={Styles.login_text_input}
            secureTextEntry={true}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPassScreen')}>
            <Text style={Styles.login_text_forget}>Forget Password?</Text>
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
            <TouchableOpacity onPress={() => signInlind()}>
              <Image
                style={{width: 40, height: 40, marginStart: 10, marginTop: 20}}
                source={require('../../src/assets/images/in.png')}
                // resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default Login;
