import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  StyleSheet,
  Platform
} from 'react-native';
import {
  Container,
  Card,
  CardItem,
  // TextInput,
} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import AsyncStorage from '@react-native-community/async-storage';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardManager from 'react-native-keyboard-manager';
class DonationAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Amount: '',
      donateAmt: props.route.params.donate_amt,
      donation_mode: props.route.params.donation_mode,
      campaign_id: props.route.params.campaign_id,
      kind_id: props.route.params.kind_id,
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      image: '',
      remarksString: '',
      remarksError: ''
    };
  }
  componentDidMount() {
    // this.campaign();
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }
    this.getuser();
  }
  campaign = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
    };
    var response = await API.post('campaign_list');
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      // console.log(response.data)
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  setAmount = value => {
    this.setState({
      Amount: value,
    });
  };
  getuser = async () => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    console.log(token);
    console.log('user_id', user_id);
    var logs = {
      user_id: user_id,
    };
    if (token != null) {
      var response = await API.post('fetch_profile_data', logs);
      console.log(response);
      if (response.status == 'success') {
        // navigation.navigate('OtpVerify', {mobile: Mobile});
        this.setState({
          fname: response.data.first_name,
          lname: response.data.last_name,
          email: response.data.email,
          mobile: response.data.phone,
          image: response.data.kyc_file,
        });
      } else {
        Alert.alert(response.status, response.message);
      }
    } else {
    }
  };
  donate = async () => {
    
    if (this.state.remarksString.trim() == '')
    {
      this.setState({remarksError: 'Please enter note'})
    }
    
   else
   {
    
      var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
      campaign_id: this.state.campaign_id,
      message: this.state.remarksString
    };
    console.log(logs);
    var response = await API.post('contact_donee', logs);
    if (response.status == 'success') {
      console.log('contact_donee response', response);
      // Toast.show(response.message, Toast.LONG)
      Alert.alert('success', response.message, [
        {text: 'OK', onPress: () => this.props.navigation.goBack()},
      ],
      {cancelable: false},);
        
    } else {
      Alert.alert(response.status, response.message);
    }
  
   }
    
  };
  startInkind = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
      kind_id: this.state.kind_id,
      quantity: '0',
      amountpaid: this.state.Amount,
      campaign_id: this.state.campaign_id,
      status: 'sucess',
    };
    console.log('logs::::', logs)
    var response = await API.post('add_donation', logs);
    console.log('response::::: ', response)
    if (response.status == 'success') {
      Toast.show(response.message, Toast.LONG)
      // this.props.navigation.navigate('Dashboard_donation_forDonor');

      this.props.navigation.navigate('ThankYou', {
        donation_id: response.donation_id,
      });
      
      // console.log(response.data)
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  user = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      this.props.navigation.navigate('User profile');
    } else {
      this.props.navigation.navigate('LogIn');
    }
  };
  setRemarks = (value) =>
    {

      if (value.trim() != '')
        {
          this.setState({remarksError: '', remarksString: value})
        }
        else
        {
          this.setState({remarksError: 'Please enter notes', remarksString: value})
        }

     
    }
  render() {
    return (
      <ScrollView>
        <Container>
          <ImageBackground
            source={require('../../src/assets/images/bg.jpg')}
            style={Styles.donation_main}>
            <SafeAreaView style={Styles.dashboard_main_header}>
              <View style={Styles.dashboard_main_headers}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 10,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                    }}
                    source={require('../../src/assets/images/back.png')}
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
              {/* <View style={Styles.dashboard_main_headers}>
                <TouchableOpacity>
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
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('User profile')
                  }>
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
              </View> */}
            </SafeAreaView>

            


            <View style={{
    backgroundColor: "#fff",
        height: 213,
        // borderRadius: 25,
        padding: '5%',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: 20,
        // alignContent: 'center',
        // justifyContent: "center",
        // borderWidth: 1,
        // borderRadius: 20,
        // borderColor: '#000',
        // borderBottomWidth: 0,
        // shadowColor: '#000000',
        // shadowOffset: { width: 0, height: 3 },
        // shadowOpacity: 0.9,
        // shadowRadius: 20,
        elevation: 5,
        width: '90%'
  }}>


<Text style={{paddingLeft:13,color: 'black', fontSize: 13, fontWeight: 'bold'}}>Notes</Text>

<TextInput style={{
    
    width: null,
    marginLeft: 13,
    borderRadius: 5,
    marginRight: 13,
    backgroundColor: 'white',
    fontSize: 12,
    height: 130,
    color: 'black',
    marginTop: 10,
    shadowColor: 'grey',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
      padding: 5,
      paddingTop: 5,
      borderColor: 'grey',
      borderWidth: .6
    
    }}
                multiline={true}
     numberOfLines={5}
     textAlignVertical={'top'}
     placeholder = 'Write notes ...'
     onChangeText={text => this.setRemarks(text)}
               value = {this.state.remarksString}
                ></TextInput>

<Text style={{
        marginTop: 3,
        color: 'red',
        fontSize: 11,
        marginBottom: -5,
        alignSelf: 'flex-start',
        marginLeft: 13
    }}>{this.state.remarksError}</Text>

        </View>

        <Text style={{
          paddingLeft: 17,
          paddingRight: 17,
        marginTop: 7,
        color: 'green',
        fontSize: 14,
        marginBottom: 4,
        alignSelf: 'center',
    }}>{'Thank you for showing your interest'}</Text>
              
              <Text style={{
          paddingLeft: 17,
          paddingRight: 17,
        marginTop: 0,
        color: 'green',
        fontSize: 14,
        marginBottom: 15,
        alignSelf: 'center',
        textAlignVertical: 'center',
        textAlign: 'center'
    }}>{'Please type your message here and the Donee will contact you for your kind Donation.'}</Text>
              <TouchableOpacity
                style={Styles.donate_btn}
                onPress={() => this.donate()}>
                <Text style={Styles.login_text}>Submit</Text>
              </TouchableOpacity>

          </ImageBackground>
        </Container>
      </ScrollView>
    );
  }
}
const Styles1 = StyleSheet.create({
  errorHint: {
    marginTop: 3,
    color: 'red',
    fontSize: 11,
    marginBottom: -5,
    marginLeft: 10,
},
})
export default DonationAmount;
