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
  TouchableHighlight,
  Dimensions,
  Button, NativeModules, NativeEventEmitter,
  PermissionsAndroid,
  ActivityIndicator,
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
import RazorpayCheckout from 'react-native-razorpay';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardManager from 'react-native-keyboard-manager';
const selectOneFile = async () => {
  //Opening Document Picker for selection of one file
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
      //There can me more options as well
      // DocumentPicker.types.allFiles
      // DocumentPicker.types.images
      // DocumentPicker.types.plainText
      // DocumentPicker.types.audio
      // DocumentPicker.types.pdf
    });
    //Printing the log realted to the file
    console.log('res : ' + JSON.stringify(res));
    console.log('URI : ' + res.uri);
    console.log('Type : ' + res.type);
    console.log('File Name : ' + res.name);
    console.log('File Size : ' + res.size);
    pdfpath = res.uri
    
    //Setting the state to show single file attributes
   
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      alert('Canceled from single doc picker');
    } else {
      //For Unknown Error
      alert('Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }
};
var pdfpath
class DonationAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Amount: 
      '',
      donateAmt: props.route.params.donate_amt,
      donation_mode: props.route.params.donation_mode,
      campaign_id: props.route.params.campaign_id,
      kind_id: props.route.params.kind_id,
      btnbgcolor: '#D0CFCE',
      btnbgcolor1: 'rgba(246, 244, 243, 1)',
      btnbgcolor2: 'rgba(246, 244, 243, 1)',
      kyc: false,

      fname: '',
      lname: '',
      email: '',
      mobile: '',
      image: '',
      planvalue: 1,
      targetAmount: 0,
      amountError: '',
      plantype: 'daily',
      transaction_idd: '',
      progressActivityIndicator: false
    };
  }
  componentDidMount() {
  //  this.campaign();
  if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
  }
    if (AsyncStorage.getItem('token')['_X'] == null) {
      //   this.props.navigation.navigate('LogIn');
    } else {
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
    console.log('amount: ', value)

  
    this.setState({
      Amount: value,
      targetAmount: value * this.state.planvalue,
      amountError: '',
    });
  };
  donate = () => {
    if (this.state.donation_mode == '1') {
      // this.props.navigation.navigate('DonationPayment');
      this.startInkind();
    } else {
      this.startInkind();
    }
  };
  donateDuration = (duration) => {
    if (duration == 'daily')
    {
      this.setState({ plantype: 'daily', amountError: '',btnbgcolor: '#D0CFCE', btnbgcolor1: 'rgba(246, 244, 243, 1)', btnbgcolor2: 'rgba(246, 244, 243, 1)', planvalue: 1, targetAmount: this.state.Amount * 1});
    }
    else if (duration == 'weekly')
    {
      this.setState({ plantype: 'weekly', amountError: '',btnbgcolor1: '#D0CFCE', btnbgcolor: 'rgba(246, 244, 243, 1)', btnbgcolor2: 'rgba(246, 244, 243, 1)', planvalue: 7, targetAmount: this.state.Amount * 7 });
    }
    else
    {
      this.setState({ plantype: 'monthly', amountError: '',btnbgcolor2: '#D0CFCE', btnbgcolor: 'rgba(246, 244, 243, 1)', btnbgcolor1: 'rgba(246, 244, 243, 1)', planvalue: 30, targetAmount: this.state.Amount * 30 });
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
    var response = await API.post('add_donation', logs);
    if (response.status == 'success') {
      this.props.navigation.navigate('Dashboard_donation_forDonor');
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
  actualDownload = () => {
    const { dirs } = RNFetchBlob.fs;
   RNFetchBlob.config({
     fileCache: true,
     addAndroidDownloads: {
     useDownloadManager: true,
     notification: true,
     mediaScannable: true,
     title: `test.pdf`,
     path: `${dirs.DownloadDir}/test.pdf`,
     },
   })
     .fetch('GET', 'http://www.africau.edu/images/default/sample.pdf', {})
     .then((res) => {
       console.log('The file saved to ', res.path());
     })
     .catch((e) => {
       console.log(e)
     });
 }
  _onPressButton = async () => {
console.log('target amount')
    if (this.state.targetAmount == 0)
    {
      
     // alert('Please enter amount');

    //  try {
    //   const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     this.actualDownload();
    //   } else {
    //     Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
    //   }
    // } catch (err) {
    //   console.warn(err);
    // } 
     
      this.setState({amountError: 'Please enter a valid amount'})

    //  console.log('pdf path', pdfpath)

    
     
    }
   else
   {
    var options = {
      description: 'Credits towards One Rupee Campaign',
      // image: 'https://i.imgur.com/3g7nmJC.png',
      image: 'https://dataar.org/uploads/images/heart.png',
      currency: 'INR',
      key: 'rzp_live_6JxkAJpOaUUuG4', // rzp_test_Aabh2L4rXsWHju 'rzp_live_6JxkAJpOaUUuG4'
      amount: this.state.targetAmount * 100,
      name: this.state.fname + ' ' + this.state.lname,
      prefill: {
        email: this.state.email,
        contact: this.state.mobile,
        name: 'Dataar'
      },
      theme: {color: '#f55656'}
    }
      RazorpayCheckout.open(options).then((data) => {
      // handle success
     // alert(`Success: ${data.razorpay_payment_id}`);
     
     this.setState({transaction_idd: data.razorpay_payment_id, progressActivityIndicator: true})
     // alert(`Success: ${data}`);
      console.log('Success: ', data.razorpay_payment_id)
      this.submitDonation()
    }).catch((error) => {
      // handle failure
      // alert(`Error: ${error.code} | ${error.description}`);
    });
   }
    
      }
    
  render() {
    return (
      
        <Container>
          <ImageBackground
            source={require('../../src/assets/images/bg.jpg')}
            style={Styles.donation_main}>
            <SafeAreaView style={Styles.dashboard_main_header}>
              <View style={Styles.dashboard_main_headers}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Dashboard_donation_forDonor')}>
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
            { this.state.progressActivityIndicator && <ActivityIndicator size="large" color="#f55656" style={{opacity:1,
             position: 'absolute',
             left: 0,
             right: 0,
             top: 0,
             bottom: 0,
             alignItems: 'center',
             justifyContent: 'center'}}  /> }

            <ScrollView>

            <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, height: 80,}}>
            <View style={{width: '50%'}}>

            <Text style={{fontSize: 20, fontWeight: '900', textAlignVertical: 'center', color: 'black', marginLeft: 20}}>
                    Associated with
                  </Text>
            </View>
            <View style={{width: '50%',}}>
            <Image style={{ marginRight: 20,
    resizeMode: 'contain', alignSelf: 'center', height: 80, alignSelf: 'flex-end', borderRadius: 4, width: 80
}}
source={require('../../src/assets/images/logo1.jpg')}>
</Image> 

</View>
            </View>
            <View style={{marginLeft: 0, marginRight: 0, borderRadius:2, backgroundColor: 'null', flex: 1, marginTop: -15}}>
<Image style={{
    resizeMode: 'contain', alignSelf: 'center', height: 240, alignSelf: 'center', borderRadius: 4, width: Dimensions.get('window').width - 40
}}
source={require('../../src/assets/images/daatar_banner.jpg')}>
</Image> 
</View>

<Text style={{fontSize: 25,
    marginLeft: 10,
    textAlign:"center",
    marginTop: 0}}>
             
            </Text>

            {this.state.donation_mode == '1' ? (
                  <Text style={Styles.amount_text_font1}>
                    Target Donation: {this.state.targetAmount} INR 
                  </Text>
                ) : (
                  <Text style={Styles.amount_text_font1}>
                    Target Donation: {this.state.targetAmount} INR
                  </Text>
                )}

            <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', margin: 20, marginTop: -10}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
            <TouchableOpacity
               // style={Styles1.donate_btn}
                style={[
                  Styles1.donate_btn,
                  { backgroundColor: this.state.btnbgcolor },
              ]}
                onPress={() => this.donateDuration('daily')}>
                <Text style={Styles1.login_text}>Daily</Text>
              </TouchableOpacity>

              <TouchableOpacity
                // style={Styles1.donate_btn1}
                style={[
                  Styles1.donate_btn1,
                  { backgroundColor: this.state.btnbgcolor1 },
              ]}
                onPress={() => this.donateDuration('weekly')}>
                <Text style={Styles1.login_text}>Weekly</Text>
              </TouchableOpacity>

              <TouchableOpacity
                // style={Styles1.donate_btn2}
                style={[
                  Styles1.donate_btn2,
                  { backgroundColor: this.state.btnbgcolor2 },
              ]}
                onPress={() => this.donateDuration('monthly')}>
                <Text style={Styles1.login_text}>Monthly</Text>
              </TouchableOpacity>
              </View>
            </View>

            

            <View style={Styles.donation_sub}>
              <View style={Styles.amount_main_contain}>
                
                <TextInput
                  placeholder="Enter Donation Amount"
                  placeholderTextColor='grey'
                  onChangeText={text => this.setAmount(text)}
                  style={Styles1.amount_text_input}
                  keyboardType="decimal-pad"
                />
                <Text style={Styles1.errorHint}>{this.state.amountError}</Text>
              </View>
              <TouchableOpacity
                style={Styles.donate_btn}
                onPress={() => this._onPressButton()}>
                <Text style={Styles.login_text}>Donate</Text>
              </TouchableOpacity>
              
             
             
            </View>
            
            </ScrollView>

           

          </ImageBackground>

          
        </Container>
      
    );
  }
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
   getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  submitDonation = async () => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    console.log(token);
    console.log('user_id', user_id);
    var logs = {
      user_id: user_id,
      campaign_id: '1',
      amountpaid: String(this.state.targetAmount),
      plan_type: this.state.plantype,
      transaction_id: this.state.transaction_idd,
    };
    console.log(logs);
    if (token != null) {
      var response = await API.post('add_1rupee_donation', logs);
      console.log(response);
      if (response.status == 'success') {
        // navigation.navigate('OtpVerify', {mobile: Mobile});
        this.setState({progressActivityIndicator: false})
        this.props.navigation.navigate('ThankYou', {
          donation_id: response.donation_id,
        });

        // Alert.alert(
        //   'Success',
        //   response.message, // <- this part is optional, you can pass an empty string
        //   [
        //     {text: 'OK', onPress: () => this.props.navigation.goBack()},
        //   ],
        //   {cancelable: false},
        // );
        
      } else {
        Alert.alert(response.status, response.message);
      }
    } else {
    }
  };
}
const Styles1 = StyleSheet.create({
  donate_btn: {
    width: 100,
    height: 50,
    // backgroundColor: 'rgba(246, 244, 243, 1)',
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 6
  },
  amount_text_input: {
    marginLeft: 10,
    marginRight: 10,
    // backgroundColor: '#dcdedc',
    height: 45,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingTop: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black'
  },
  buttonContainer: {
    margin: 20
  },
  donate_btn1: {
    width: 100,
    height: 50,
    // backgroundColor: 'rgba(246, 244, 243, 1)',
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 6
  },
  donate_btn2: {
    width: 100,
    height: 50,
    // backgroundColor: 'rgba(246, 244, 243, 1)',
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 6
  },
  login_text: {
    fontSize: 18,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 12,
    color: '#f55656',
    fontWeight: '700',
  },
  errorHint: {
    marginTop: 3,
    color: 'red',
    fontSize: 11,
    marginBottom: -5,
    marginLeft: 10,
},
buttonStyle: {
  alignItems: 'center',
  flexDirection: 'row',
  backgroundColor: '#DDDDDD',
  padding: 5,
},
imageIconStyle: {
  height: 20,
  width: 20,
  resizeMode: 'stretch',
},
})
export default DonationAmount;


{/* <TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle}
          onPress={selectOneFile}>
          <Text style={{marginRight: 10, fontSize: 19}}>
            {'Click here to pick one file'}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
        </TouchableOpacity> */}