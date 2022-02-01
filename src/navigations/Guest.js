/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import ForgetPassScreen from '../screens/ForgetPass';
import SplashScreen from '../screens/splash';
import OtpVerify from '../screens/OtpVerify';
import Dashboard from '../screens/Dashboard';
import Dashboard_donation from '../screens/Dashboard_donation';
import StartCampaign from '../screens/StartCampaign';
import Donation_details from '../screens/Donation_details';
import User_profile from '../screens/User_profile';
import Add_proifle from '../screens/Add_proifle';
import View_campaign from '../screens/View_campaign';
import Campaing_details from '../screens/Campaing_details';
import DonationAmount from '../screens/DonationAmount';
import OneRupeeDonation from '../screens/OneRupeeDonation';
import ThankYou from '../screens/ThankYou';
import DonationPayment from '../screens/DonationPayment';
import DonationDetails from '../screens/DonationDetails';
import Search_screen from '../screens/Search_screen';
import Preference from '../screens/Preference';
import logintype from '../screens/logintype';
import {navigationRef} from './Route';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import SideMenu from '../navigations/SideMenu';
const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerCamp = createDrawerNavigator();
const HomeStack_nav = createStackNavigator();
const HomeStackScreenDoner = ({navigation}) => (
  <HomeStack_nav.Navigator initialRouteName="Dashboard_donation">
    <HomeStack_nav.Screen
      name="Dashboard_donation"
      component={Dashboard_donation}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="splash"
      component={SplashScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="ForgetPassScreen"
      component={ForgetPassScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="SignUp"
      component={RegisterScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="OtpVerify"
      component={OtpVerify}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="StartCampaign"
      component={StartCampaign}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="View_campaign"
      component={View_campaign}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Campaing_details"
      component={Campaing_details}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Donation_details"
      component={Donation_details}
      options={{
        headerShown: false,
      }}
    />
    {/* <HomeStack_nav.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        headerShown: false,
      }}
    /> */}
    <HomeStack_nav.Screen
      name="Add profile"
      component={Add_proifle}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="User profile"
      component={User_profile}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="DonationAmount"
      component={DonationAmount}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="OneRupeeDonation"
      component={OneRupeeDonation}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="ThankYou"
      component={ThankYou}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="DonationPayment"
      component={DonationPayment}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="DonationDetails"
      component={DonationDetails}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack_nav.Navigator>
);
const HomeStackScreenDonee = ({navigation}) => (
  <HomeStack_nav.Navigator initialRouteName="Dashboard">
    <HomeStack_nav.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="splash"
      component={SplashScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="LogIn"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="ForgetPassScreen"
      component={ForgetPassScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="SignUp"
      component={RegisterScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="OtpVerify"
      component={OtpVerify}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="StartCampaign"
      component={StartCampaign}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="View_campaign"
      component={View_campaign}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Campaing_details"
      component={Campaing_details}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Dashboard_donation"
      component={Dashboard_donation}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Donation_details"
      component={Donation_details}
      options={{
        headerShown: false,
      }}
    />

    <HomeStack_nav.Screen
      name="User profile"
      component={User_profile}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="Add profile"
      component={Add_proifle}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack_nav.Navigator>
);
const DrawerScreen = () => (
  <Drawer.Navigator
    // initialRouteName="Home"
    drawerPosition="left"
    drawerContent={props => <SideMenu {...props} />}
    drawerStyle={{width: '90%'}}
    drawerContentOptions={{
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -5,
        color: '#000000',
      },
      activeTintColor: '#4d4d4d',
      itemStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.5,
        height: 40,
      },
    }}>
    {/* <Drawer.Screen name="Home" component={TabsScreen} /> */}
    <Drawer.Screen name="Dashboard" component={HomeStackScreenDoner} />
  </Drawer.Navigator>
);
const DrawerScreencamp = () => (
  <DrawerCamp.Navigator
    // initialRouteName="Home"
    drawerPosition="left"
    drawerContent={props => <SideMenu {...props} />}
    drawerStyle={{width: '90%'}}
    drawerContentOptions={{
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -5,
        color: '#000000',
      },
      activeTintColor: '#4d4d4d',
      itemStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.5,
        height: 40,
      },
    }}>
    {/* <Drawer.Screen name="Home" component={TabsScreen} /> */}
    <DrawerCamp.Screen name="Dashboard" component={HomeStackScreenDonee} />
    {/* <DrawerCamp.Screen name="User profile" component={User_profile} />
    <DrawerCamp.Screen name="Add profile" component={Add_proifle} />
    <AuthStack.Screen name="StartCampaign" component={StartCampaign} /> */}
  </DrawerCamp.Navigator>
);
const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none" initialRouteName="Splash">
    <AuthStack.Screen name="splash" component={SplashScreen} />
    <AuthStack.Screen name="LogIn" component={LoginScreen} />
    <AuthStack.Screen name="ForgetPassScreen" component={ForgetPassScreen} />
    <AuthStack.Screen name="SignUp" component={RegisterScreen} />
    <AuthStack.Screen name="OtpVerify" component={OtpVerify} />
    <AuthStack.Screen name="logintype" component={logintype} />
    <AuthStack.Screen name="Dashboard" component={DrawerScreencamp} />
    <AuthStack.Screen name="Search_screen" component={Search_screen} />
    <AuthStack.Screen name="Preference" component={Preference} />
    <AuthStack.Screen name="Donation_details" component={Donation_details} />
    <AuthStack.Screen name="StartCampaign" component={StartCampaign} />
    <AuthStack.Screen name="Dashboard_donation" component={DrawerScreen} />
    <AuthStack.Screen name="View_campaign" component={View_campaign} />
    <AuthStack.Screen name="Campaing_details" component={Campaing_details} />
    <HomeStack_nav.Screen
      name="DonationAmount"
      component={DonationAmount}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="DonationPayment"
      component={DonationPayment}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack_nav.Screen
      name="DonationDetails"
      component={DonationDetails}
      options={{
        headerShown: false,
      }}
    />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({userToken}) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="App" component={AuthStackScreen} />
  </RootStack.Navigator>
);

export default ({userToken}) => (
  <NavigationContainer ref={navigationRef}>
    <RootStackScreen userToken={userToken} />
  </NavigationContainer>
);
