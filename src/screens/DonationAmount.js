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
  StyleSheet
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
    };
  }
  componentDidMount() {
    // this.campaign();
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
  donate = () => {
    console.log('this.state.fname + this.state.lname', this.state.fname + ' ' + this.state.lname,)
    if (this.state.Amount == '')
    {
      this.setState({amountError: 'Please enter a valid amount'})
    }
   else
   {

    console.log()

    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_Aabh2L4rXsWHju',
      amount: this.state.Amount * 100,
      name: this.state.fname + ' ' + this.state.lname,
      prefill: {
        email: this.state.email,
        contact: this.state.mobile,
        name: 'Razorpay Software'
      },
      theme: {color: '#F37254'}
    }
      RazorpayCheckout.open(options).then((data) => {
      // handle success
     // alert(`Success: ${data.razorpay_payment_id}`);
     
     this.setState({transaction_idd: data.razorpay_payment_id})
     // alert(`Success: ${data}`);
      console.log('Success: ', data.razorpay_payment_id)
      // this.submitDonation()
      if (this.state.donation_mode == '1') {
        // this.props.navigation.navigate('DonationPayment');
        this.startInkind();
      } else {
        this.startInkind();
      }
    }).catch((error) => {
      // handle failure
      alert(`Error: ${error.code} | ${error.description}`);
    });
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
  render() {
    return (
      <ScrollView>
        <Container>
          <ImageBackground
            source={require('../../src/assets/images/bg.jpg')}
            style={Styles.donation_main}>
            <View style={Styles.dashboard_main_header}>
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
              <View style={Styles.dashboard_main_headers}>
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
              </View>
            </View>

            <Text style={{
    fontSize: 25,
    marginLeft: 10,
    textAlign:"center",
    marginTop: 20,
    marginBottom: 35
  }}>
              Target Donation
            </Text>

            <View style={Styles.donation_sub}>
              <View style={Styles.amount_main_contain}>
                {this.state.donation_mode == '1' ? (
                  <Text style={Styles.amount_text_font1}>
                    Target Donation: {this.state.donateAmt} INR
                  </Text>
                ) : (
                  <Text style={Styles.amount_text_font1}>
                    Target Donation: {this.state.donateAmt} Quantity
                  </Text>
                )}
                <TextInput
                  placeholder="Enter Donation Amount"
                  onChangeText={text => this.setAmount(text)}
                  style={Styles.amount_text_input}
                  keyboardType="decimal-pad"
                  placeholderTextColor='grey'
                />
                <Text style={Styles1.errorHint}>{this.state.amountError}</Text>
              </View>
              <TouchableOpacity
                style={Styles.donate_btn}
                onPress={() => this.donate()}>
                <Text style={Styles.login_text}>Donate</Text>
              </TouchableOpacity>
            </View>
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
