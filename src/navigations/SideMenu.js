import PropTypes from 'prop-types';
import React, {Component, useEffect, useState} from 'react';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import { LoginManager } from 'react-native-fbsdk'
// var styles = require('../../src/assets/files/Styles');
import {NavigationActions, NavigationEvents} from 'react-navigation';
//android:roundIcon="@mipmap/ic_launcher_round"
import {
  Dimensions,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Linking
} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Thumbnail,
  Icon,
  Body,
  Right,
  Switch,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import Strings from '../utils/Strings';
const CustomSidebarMenu = props => {
  const BASE_PATH =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
  const proileImage = 'react_logo.png';
  const [user_id, setUser_id] = useState('');
  const [user_Type, setUser_Type] = useState('');
  const [token, setToken] = useState('');
  useEffect(async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var user_Type = await AsyncStorage.getItem('user_type');
    var token = await AsyncStorage.getItem('token');
    setUser_id(user_id);
    setUser_Type(user_Type);
    setToken(token);
    console.log('user_id:::', user_id);
    console.log('user_Type:::', user_Type);
  }, []);
  const logout = () => {
    AsyncStorage.clear();
    signOut()
    props.navigation.navigate('LogIn');
     
    
  };
  
  const signOut = async () => {
    try {
     // await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
      LoginManager.logOut()
     // props.navigation.navigate('LogIn');
   // Remember to remove the user from your app's state as well
    } catch (error) {

      console.error(error);
    }
  };
  const callToSetCatSubcatValue = () => {
    console.log('callToSetCatSubcatValue called:::');
  };


  const StartCampg = async () => {
    var token = await AsyncStorage.getItem('token');
  
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
            props.navigation.navigate('StartCampaign')
            // navigation.navigate('StartCampaign');
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
                {text: 'OK', onPress: () => props.navigation.navigate('KYCUpdateForDonee')},
              ],
              {cancelable: false},);
            }
    
          
          }
        
        
        
     
    } else {
      Alert.alert(response.status, response.message);
    }

  }

 
    
     else {
      this.props.navigation.navigate('LogIn');
    }
  
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      
      {/*Top Large Image */}
      <Image
       // source={{uri: BASE_PATH + proileImage}}
        source={require('../../src/assets/images/heart1.png')}
        style={styles.sideMenuProfileIcon}
      />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />


        {user_id == null ? (
          <DrawerItem label="User Profile" onPress={() =>  logout()} />
        ) : null}

{/* {user_Type == 0 ? (
          <DrawerItem label="Donation Campaign" onPress={() => props.navigation.navigate('Dashboard_donation')} />
        ) : null} */}
        

        {user_Type == 0 ? (
          <DrawerItem label="My Profile" onPress={() => props.navigation.navigate('User profile')} />
        ) : null}


{user_Type == 1 ? (
          <DrawerItem label="My Profile" onPress={() => props.navigation.navigate('User_profile_forDonee')} />
        ) : null}

{user_Type == 1 ? (
          <DrawerItem label="Update KYC" onPress={() => props.navigation.navigate('KYCUpdateForDonee')} />
        ) : null}

       
{user_Type == 0 ? (
          <DrawerItem label="Update KYC" onPress={() => props.navigation.navigate('KYCUpdateForDonor')} />
        ) : null}

       
{user_Type == 0 ? (
          <DrawerItem label="Set Preference" onPress={() => props.navigation.navigate('Preference')} />
        ) : null}




{user_Type == 0 ? (
         <DrawerItem
          label="My Donation"
          onPress={() => props.navigation.navigate('MyDonation')}
        />
        ) : null}

{user_Type == 0 ? (
        <DrawerItem
          label="My Favourite"
          onPress={() => props.navigation.navigate('My_Favourite')}
        />
        ) : null}

{user_Type == 0 ? (
        <DrawerItem
          label="Manage Account"
          onPress={() => props.navigation.navigate('Manage_Account')}
        />  
        ) : null}

{user_Type == 1 ? (
        <DrawerItem
          label="Manage Account"
          onPress={() => props.navigation.navigate('Manage_AccountforDonee')}
        />  
        ) : null}

{user_Type == 1 ? (
        <DrawerItem
          label="Create Campaign"
          onPress={() => StartCampg()}
        />  
        ) : null}

        {/* {user_Type === 1 ? (
          <DrawerItem
            label="Dashboard"
            onPress={() => props.navigation.navigate('Dashboard')}
          />
        ) : (
          <DrawerItem
            label="Donation"
            onPress={() => props.navigation.navigate('Donation')}
          />
        )} */}
<DrawerItem label="About Us" onPress={ ()=> Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/about-us')} />

          

          <DrawerItem label="Teams" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/team')} />

          <DrawerItem label="Contact Us" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/contact-us')} />

          <DrawerItem label="Terms & Conditions" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/terms-and-condition')} />
        
          <DrawerItem label="Privacy Policy" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/privacy-policy')} />

        {user_id !== null ? (
          <DrawerItem label="Logout" onPress={() => logout()} />
        ) : null}
        {/* <View style={styles.customItem}>
          <Text
            onPress={() => {
              Linking.openURL('https://aboutreact.com/');
            }}>
            Rate Us
          </Text>
          <Image
            source={{ uri: BASE_PATH + 'star_filled.png' }}
            style={styles.iconStyle}
          />
        </View> */}
      </DrawerContentScrollView>
      {/* <Text style={{ fontSize: 16, textAlign: 'center', color: 'grey' }}>
        www.aboutreact.com
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
     backgroundColor: 'transparent',
     tintColor: '#f55656',
     resizeMode: 'contain'
     
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomSidebarMenu;
