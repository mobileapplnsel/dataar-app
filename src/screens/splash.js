import React from 'react';
import {Text, View, ImageBackground, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
const splash = ({navigation}) => {
  React.useEffect( async () => {
    // Fcn.init();
    LoginReg();
    
  }, []);
  const LoginReg = async () => {
    var unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert( JSON.stringify(remoteMessage.notification.title), JSON.stringify(remoteMessage.notification.body));
    });
    var token = await messaging().getToken();
    console.log('FCM token11: ', token)
    AsyncStorage.setItem('FCMtoken', token);

    
    var token = await AsyncStorage.getItem('token');
    var user_type =await AsyncStorage.getItem('user_type');
    setTimeout(() => {
       AsyncStorage.setItem('isLoggedInForOneRupee', 'no');
      if (token == null) {
        // console.log('token', AsyncStorage.getItem('token'));
        navigation.replace('Dashboard_donation'); // Dashboard_donation
       
        // LogIn
      } else {
        // var user_type = AsyncStorage.getItem('user_type');
        console.log(user_type);
        if (user_type === '0') {
          navigation.replace('Dashboard_donation_forDonor'); // OtpVerify
        } else {
          navigation.replace('Dashboard');
        }
        console.log('user_type', user_type);
        // navigation.navigate('Dashboard_donation');
      }
      // this.props.navigation.navigate('start')}
    }, 1000);
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={[
          {
            // width: '100%',
            // height: '100%',
            resizeMode: 'cover',
            // alignItems: 'baseline',
            justifyContent: 'center',
            // position: 'absolute',
            bottom: 0,
            // backgroundColor:'rgba(0,0,0,0)',
            flex: 1,
          },
        ]}
        source={require('../../src/assets/images/splash.jpg')}></ImageBackground>
    </View>
  );
};

export default splash;
