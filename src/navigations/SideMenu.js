import PropTypes from 'prop-types';
import React, {Component, useEffect, useState} from 'react';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
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
  Linking,
  Clipboard,
  Modal,
  TextInput
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
import messaging from '@react-native-firebase/messaging';
import { useIsFocused } from "@react-navigation/native";
// import Strings from '../utils/Strings';
const CustomSidebarMenu = props => {
  const BASE_PATH =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
  const proileImage = 'react_logo.png';
  const [user_id, setUser_id] = useState('');
  const [user_Type, setUser_Type] = useState('');
  const [token, setToken] = useState('');
  const [profile_img, setprofile_img] = useState('');
  const [profile_name, setprofile_name] = useState('');
  const isFocused = useIsFocused();
  const [modalVisibleForZip, setmodalVisibleForZip] = useState(false);
  const [DescriptionString, setDescriptionString] = useState('');
  const [maxLengthh1, setmaxLengthh1] = useState(5000);

  useEffect(async () => {
   
    if(isFocused){ 
      doStuff();
  }

  
    
       
  }, [isFocused, props] );

  const doStuff = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var user_Type = await AsyncStorage.getItem('user_type');
    var token = await AsyncStorage.getItem('token');
    var profile_img = await AsyncStorage.getItem('profile_image');
    var profile_name = await AsyncStorage.getItem('profile_name');
    setprofile_img(profile_img);
    setUser_id(user_id);
    setUser_Type(user_Type);
    setprofile_name(profile_name);
    setToken(token);
  console.log('user_id1:::', user_id);
  console.log('user_Type1:::', user_Type);
  };

  const logout = async () => {
    
   AsyncStorage.clear();
  var unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert( JSON.stringify(remoteMessage.notification.title), JSON.stringify(remoteMessage.notification.body));
  });
  var token = await messaging().getToken();
  console.log('FCM token11222: ', token)
  AsyncStorage.setItem('FCMtoken', token);
   Clipboard.setString(token)

    signOut()
    props.navigation.replace('LogIn');
     
    
  };
  
  const signOut = async () => {
    try {
     // await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
      //  LoginManager.logOut()
     
      //  FBLogout(AccessToken.getCurrentAccessToken())
     // props.navigation.navigate('LogIn');
   // Remember to remove the user from your app's state as well
    } catch (error) {

      console.error(error);
    }
  };
  const FBLogout = (accessToken) => {

    console.log('accessToken: ', accessToken)

    let logout =
        new GraphRequest(
            "me/permissions/",
            {
                accessToken: accessToken,
                httpMethod: 'DELETE'
            },
            (error, result) => {
                if (error) {
                    console.log('Error fetching data: ' + error.toString());
                } else {
                  console.log('success fetching data: ');
                    LoginManager.logOut();
                }
            });
    new GraphRequestManager().addRequest(logout).start();
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
      this.props.navigation.replace('LogIn');
    }
  
  };
  const deleteRequestSend = async () => {
    var token = await AsyncStorage.getItem('token');
  
    console.log(token);
    if (token != null && token !== '') {

      

      var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
      remarks: DescriptionString
    };
    console.log(logs);
    var response = await API.post('account_delete', logs);
    if (response.status == 'success') {
      // logout()
      
      Alert.alert(
        response.status,
        response.message, // <- this part is optional, you can pass an empty string
        [
          //  {text: 'NO', onPress: () => console.log('No')}, //logout()
          {text: 'OK', onPress: () => logout()}, 
          
        ],
        {cancelable: false},
      )
        
        
     
    } else {
      Alert.alert(response.status, response.message);
    }

  }

 
    
     else {
      this.props.navigation.replace('LogIn');
    }
  
  };
  const remarksTyping = async (text) => {
    setDescriptionString(text)
    setmaxLengthh1(5000 - text.length)
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      
      {/*Top Large Image */}
      

{profile_img != null ? ( <Image
         source={{uri: profile_img}}
        // source={require('../../src/assets/images/heart1.png')}
        style={{
          // resizeMode: 'center',
          width: 100,
          height: 100,
           borderRadius: 100 / 2,
          alignSelf: 'center',
          marginTop: 10,
          marginBottom: 7
          //  backgroundColor: 'transparent',
          //  tintColor: '#f55656',
          //  resizeMode: 'contain'
           
        }}
      /> ) : <Image
      // source={{uri: BASE_PATH + proileImage}}
       source={require('../../src/assets/images/heart1.png')}
       style={styles.sideMenuProfileIcon}
     />}

{ profile_img != null ? ( <Text style={{
    fontSize: 17,
    alignSelf: 'center', color: '#f55656', marginBottom: 2
  }}>{'Hi '+profile_name}</Text>) : null}

      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}


        {user_id == null ? (
          <DrawerItem label="User Profile" onPress={() =>  logout()} />
        ) : null}

{user_Type == 1 ? (


          <DrawerItem 
          label="Dashboard" 
          onPress={() => props.navigation.navigate('Dashboard')} />

          
        ) : null}
{user_Type == 0 ? (
          <DrawerItem label="Dashboard" 
          
          onPress={() => props.navigation.navigate('Dashboard_donation')} />
        ) : null}
        

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

       
{/* {user_Type == 0 ? (
          <DrawerItem label="Set Preference" onPress={() => props.navigation.navigate('Preference')} />
        ) : null} */}




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
          label="Change Password"
          onPress={() => props.navigation.navigate('Manage_Account')}
        />  
        ) : null}

{user_Type == 1 ? (
        <DrawerItem
          label="Change Password"
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
{/* <DrawerItem label="About Us" onPress={ ()=> Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/about-us')} />

          

          <DrawerItem label="Teams" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/team')} />

          <DrawerItem label="Contact Us" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/contact-us')} />

          <DrawerItem label="Terms & Conditions" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/terms-and-condition')} />
        
          <DrawerItem label="Privacy Policy" onPress={() => Linking.openURL('https://dev.solutionsfinder.co.uk/dataar/privacy-policy')} /> */}


<DrawerItem label="About Us" onPress={ ()=> Linking.openURL('https://dataar.org//about-us')} />

          

          <DrawerItem label="Teams" onPress={() => Linking.openURL('https://dataar.org/team')} />

          <DrawerItem label="Contact Us" onPress={() => Linking.openURL('https://dataar.org/contact-us')} />

          <DrawerItem label="Terms & Conditions" onPress={() => Linking.openURL('https://dataar.org/terms-and-condition')} />
        
          <DrawerItem label="Privacy Policy" onPress={() => Linking.openURL('https://dataar.org/privacy-policy')} />

          {user_id !== null ? (
          <DrawerItem label="Delete Account" onPress={() => setmodalVisibleForZip(true)} />
        ) : null}

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

      <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalVisibleForZip}
                        >
                          
                            <View style={{ height: 300, marginTop: 105, backgroundColor: 'white',  width: 340,
        alignSelf: 'center', }}>
                            
                                <View style={{
        height: 240,
        width: 340,
        alignSelf: 'center',
        marginTop: 0,
        backgroundColor: 'white',//'#0da2c3',
        borderRadius: 6,
        borderColor:'black',
        borderWidth:1,
    }}>
<Text style={{ fontSize: 13, alignSelf: 'flex-start', marginTop: 10, color: 'black', marginLeft: 17, marginBottom: 7, fontWeight: 'bold' }}>Reason For Deleting Your Account ?</Text>
<TextInput style={{
    
    width: null,
    marginLeft: 17,
    borderRadius: 0,
    marginRight: 17,
    backgroundColor: 'white',
    fontSize: 12,
    height: 80,
    color: 'gray',
   borderColor: 'black',
   borderWidth: 1,
      padding: 5,
      paddingTop: 5,
      
    
    }}
                placeholder={'Enter remarks here...'}
                multiline={true}
     numberOfLines={5}
     textAlignVertical={'top'}
                placeholderTextColor={'grey'}
                value = {DescriptionString}
                maxLength={5000}
                onChangeText={(text) => remarksTyping(text)}
                ></TextInput>
<Text style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: 5, color: '#f55656', marginLeft: 17, marginBottom: 7, fontWeight: '400' }}>{maxLengthh1+' Character remaining'}</Text>


<View style={{
  flexDirection: 'row',
  justifyContent: 'center'
}}>
<TouchableOpacity style={{  height: 40, alignSelf: 'center',borderRadius:2, marginLeft: 17, marginRight: 17,
 backgroundColor: '#f55656', marginTop: 20, borderRadius: 5}} onPress ={() => deleteRequestSend()}>



              <Text style={{  fontSize:16,fontWeight: "bold",color:'white',
 textAlign: 'center', textAlignVertical: 'center',
color: 'white', padding: 6}}>
   Request Delete
</Text> 
</TouchableOpacity>

<TouchableOpacity 

style={{  height: 40, width: 120, alignSelf: 'center',borderRadius:2, marginLeft: 17, marginRight: 17,
 backgroundColor: '#f55656', marginTop: 20, borderRadius: 5}} onPress={() => { setmodalVisibleForZip(false) }}
 >



              <Text style={{  fontSize:16,fontWeight: "bold",color:'white',
 textAlign: 'center', textAlignVertical: 'center',
color: 'white', padding: 6}}>
   Cancel
</Text> 
</TouchableOpacity>
</View>

                                </View>

                                {/* <TouchableOpacity onPress={() => { setmodalVisibleForZip(false) }}>
                                    <View style={{
        height: 45,
        marginTop: 7,
        backgroundColor: 'white',//'#0da2c3',
        width: 340,
        alignSelf: 'center',
        borderRadius: 6,
        borderColor:'black',
        borderWidth:1,
    }}>
                                        <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: 10, color: 'black' }}>Cancel</Text>
                                    </View>
                                </TouchableOpacity> */}

{/* <TouchableOpacity 

style={{  height: 40, width: 120, alignSelf: 'center',borderRadius:2, marginLeft: 17, marginRight: 17,
 backgroundColor: '#f55656', marginTop: 20, borderRadius: 5}} onPress={() => { setmodalVisibleForZip(false) }}
 >



              <Text style={{  fontSize:16,fontWeight: "bold",color:'white',
 textAlign: 'center', textAlignVertical: 'center',
color: 'white', padding: 6}}>
   Cancel
</Text> 
</TouchableOpacity> */}



                                </View>
                            
                        </Modal>
                       
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
