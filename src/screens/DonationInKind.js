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
import AppPreLoader from '../components/AppPreLoader';

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
      remarksError: '',
      cmpData: [],
      capmain_details: [],
      campaign_owner_data: {},
      tableHead: ['Donor Name', 'Date', 'Amount', 'Status'],
      camp_id: props.route.params.camp_id,
      isloading: true,
      amount: 0,
      modalComment: false,
      modalCommentVal: '',
      commentArr: [],
      comment: '',
      isVisible: false,
      shareHeight: 360,
      campaignImageURI: '',
      starCount: 5,
      sharableURL: '',
      data: [
        {id: 1, item: "item 1", qty: '100', unit: 'kg'}, {id: 2, item: "item 2", qty: '200', unit: 'L'},
         {id: 1, item: "item 3", qty: '300', unit: 'm'}, {id: 4, item: "item 4", qty: '400', unit: 'pound'}, 
        
    ]
    };
  }
  componentDidMount() {
    
    // this.campaign();
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }
    this.campaign1details()
    this.getuser()

    console.log('dadkjaslkdj componentDidMount')
   
  }
  campaign1details = async () => {
    console.log('campaign1details 111');
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      campaign_id: this.state.campaign_id//this.state.camp_id,
    };
    var response = await API.post('campaign_details', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log('campaign_details response',response.data);
      
      
      var base64String = response.data.capmain_details[0]['campaign_image']
      this.setState({campaignImageURI: base64String, sharableURL: response.data.campaign_details_url})


      this.setState({
        cmpData: [...response.data.donations],
        capmain_details: [...response.data.capmain_details],
        campaign_owner_data: response.data.campaign_owner_data,
        isloading: false,
      });
      console.log(this.state.cmpData);
    } else {
      Alert.alert(response.status, response.message);
    }
  };
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
    console.log('getuser 11111');

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

    // console.log('donate qty index: ', this.state['donateQty'+1])
    
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

    

  

      // return (<TextInput
      // key={props.index}
      //     style={{borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
      //     value={props.data[props.index].item}
      //     onChangeText={val => {
      //         let newArray = [...props.data];
      //         newArray[props.index].item = val
      //         props.setData(newArray);
      //         console.log(props.data); //always rerender when type one character.. please help!!
      //     }}
      // />);
    
    
    
      // return (<TextInput
      // key={props.index}
      // keyboardType = 'decimal-pad'
      //     style={{borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
      //     value={props.data[props.index].qty}
      //     onChangeText={val => {
      //         let newArray = [...props.data];
      //         newArray[props.index].qty = val
      //         props.setData(newArray);
      //         console.log(props.data); //always rerender when type one character.. please help!!
      //     }}
      // />);
    

     renderItem = ({item, index}) => (
      <View style={{padding: 10}}>
        <View style={{flexDirection:'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 0}}>
        <View style={{flexDirection:'column', width: '40%', marginRight: '2%'}}>
          <Text style={{marginBottom: 5}}>Item Name</Text>
          <TextInput
          key={index}
              style={{borderWidth: .5, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
              value={this.state.data[index].item}
              onChangeText={val => {
                  console.log('dsdsd')
              }}
              // editable = {false}
          />
          </View>
          <View style={{flexDirection:'column', width: '28%', marginRight: '2%'}}>
          <Text style={{marginBottom: 5}}>Qty + Unit </Text>
          <TextInput
          key={index}
              style={{borderWidth: .5, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
              value={this.state.data[index].qty + ' ' + this.state.data[index].unit}
              onChangeText={val => {
                console.log('dsdsd')
            }}
              // editable = {false}
          />
          </View>
          <View style={{flexDirection:'column', width: '28%', marginRight: '2%'}}>
          <Text style={{marginBottom: 5, fontSize: 12, marginTop: 2}}>Donate Quantity </Text>
          <TextInput
          key={index}
          keyboardType = 'decimal-pad'
              style={{borderWidth: 1.5, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
              value={this.state['donateQty'+index]}
              onChangeText={val => {
                this.setState({['donateQty'+index]: val})
              }}
          />
          </View>
          </View>
      </View>
  );
  render() {

    var loaded = this.state.isloading;
    if (loaded) {
      return <AppPreLoader />;
    }

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

            <ScrollView style={Styles.dashboard_main_contain}>
              <View style={Styles.campaign_details_contain}>

              <View style={{ marginLeft: 0, marginRight: 0, borderRadius:10, backgroundColor: 'null', flex: 1, marginTop: 6}}>
<Image style={{
  
    resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 10, width: '100%', 
}}
 source={{uri: this.state.campaignImageURI}}
// source={require('../../src/assets/images/daatar_banner.jpg')}
>
</Image> 
</View>



              <Text style={{ marginStart: 5, fontWeight: 'bold', fontSize: 20,marginTop:23 }}>
                    Campaign Details : 
                  </Text>
                  
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Camapign Name: '+this.state.capmain_details[0]['campaign_name']}
                  </Text>
                
                
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Camapign Details: '+this.state.capmain_details[0]['campaign_details']}
                  </Text>
                

                
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Start Date: {this.state.capmain_details[0]['campaign_start_date']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Expiry Date: {this.state.capmain_details[0]['campaign_end_date']}
                  </Text>
                
                
                  { this.state.capmain_details[0]['donation_mode'] == '1' &&  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    
                    {'Donation Type: Money'}
                  </Text> }

                  { this.state.capmain_details[0]['donation_mode'] == '2' &&  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    
                    {'Donation Type: In Kind'}
                  </Text> }

                  { this.state.capmain_details[0]['donation_mode'] == '1' &&  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Amount Recived: {this.state.amount}
                  </Text> }

                  { this.state.capmain_details[0]['donation_mode'] == '1' && <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Target Amount:{' '}
                    {this.state.capmain_details[0]['campaign_target_amount']}
                  </Text> }
                
                
                  { this.state.capmain_details[0]['donation_mode'] == '2' && <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Target Quantity:{' '}
                    {this.state.capmain_details[0]['campaign_target_qty']}
                  </Text> }

            
                

                <Text style={{ marginStart: 5, fontWeight: 'bold', fontSize: 20, marginTop: 14 }}>
                    Campaign Owner Details :
                  </Text>


                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Name: '+this.state.campaign_owner_data['first_name'] + ' ' + this.state.campaign_owner_data['last_name']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Address: '+this.state.campaign_owner_data['address']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Email: '+this.state.campaign_owner_data['email']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Mobile Number: '+this.state.campaign_owner_data['phone']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {''}
                  </Text>

                  <View style={{flex: 1, marginTop: 15}}>
        
        <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item, index) => this.renderItem(item, index)}
        />

    </View>

                  
              </View>

              <View style={{
    // backgroundColor: "#fff",
        height: 173,
        // borderRadius: 25,
        // padding: '5%',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: 0,
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
      padding: 8,
      paddingTop: 5,
      borderColor: 'grey',
      borderWidth: .6,
      paddingTop: 8
    
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
        marginTop: 0,
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
                style={{
                  width: 100,
                  height: 50,
                  backgroundColor: '#f55656',
                  marginTop: 20,
                  color: '#f55656',
                  alignSelf: 'center',
                  borderRadius: 6,
                  marginBottom: 55
                }}
                onPress={() => this.donate()}>
                <Text style={Styles.login_text}>Submit</Text>
              </TouchableOpacity>

              {/* <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                <Row
                  data={this.state.tableHead}
                  style={{height: 40, backgroundColor: '#f1f8ff'}}
                  textStyle={{margin: 6, textAlign: 'center'}}
                />
              </Table>
              <FlatList
                data={this.state.cmpData}
                renderItem={this.renderlog}
                keyExtractor={(item, id) => id.toString()}
              /> */}




            </ScrollView>


           

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
