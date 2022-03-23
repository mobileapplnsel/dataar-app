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
import { SafeAreaView } from 'react-native-safe-area-context';
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
    var kyc_verified = await AsyncStorage.getItem('kyc_verified');
    var pan_number = await AsyncStorage.getItem('pan_number');
    console.log(token);
    if (token != null && token !== '') {


      var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
    };
    console.log(logs);
    var response = await API.post('kyc_status', logs);
    if (response.status == 'success') {
      console.log(response.userdata.pan_number);
      if(response.userdata.kyc_verified!=0 && response.userdata.kyc_verified!='')
        {
          if(response.userdata.pan_number!='')
          {
            navigation.navigate('StartCampaign');
          }
        }
        else
          {
            if(response.userdata.pan_number!='' && response.userdata.pan_number!=null)
            {
              Alert.alert("Alert", " It is currently under review. We will let you know once your KYC gets approved.");
            }
            else{
              Alert.alert("Alert", "Please submit your KYC for approval, click Ok to go to KYC page",  [
                {text: 'OK', onPress: () => navigation.navigate('KYCUpdateForDonee')},
              ],
              {cancelable: false},);
            }
    
          
          }
        
        
        
     
    } else {
      Alert.alert(response.status, response.message);
    }

  }

 
    
     else {
      navigation.navigate('LogIn');
    }
  
  };
  useEffect(() => {
    const isFocused = navigation.isFocused();

    const willFocusSubscription = navigation.addListener('focus', () => {
      console.log('focusListener has called!!!!')
      navigation.closeDrawer();

  });

  return willFocusSubscription;

   
    
  }, []);
 
  const user = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      navigation.navigate('User_profile_forDonee');
    } else {
      navigation.navigate('LogIn');
    }
  };
  return (
    <ScrollView>
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.login_main}>
          <SafeAreaView style={Styles.dashboard_main_header}>
            <View style={Styles.dashboard_main_headers}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 10,
                     marginTop: 4,
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
              {/* <TouchableOpacity>
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
              </TouchableOpacity> */}
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
          </SafeAreaView>
          
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
