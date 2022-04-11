// weight screw 4 nut bolt rober checkval weight
import React, {useState, useEffect, Component} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import AsyncStorage from '@react-native-community/async-storage';
import Icon_3 from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Selector from '../components/Selector';
import Picker from '../components/Picker';
import StarRating from 'react-native-star-rating';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
 //import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : Dimensions.get('window').height;
class Dashboard_donation_forDonor extends Component {
  constructor(props) {
    super(props);

    this.state = {

      setcmpData: [],
      isWish: '',
      modalComment: false,
      isVisible: false,
      shareHeight: 360,
      modalCommentVal: '',
      commentArr: [],
      comment: '',
      campaign_id: '',
      genderValue: '',
      genderValue1: '',
      pan_number: '',
      kyc_verified: '',
      gender: 'Preference',
      gender1: 'Filter by type',
      ArrPref: [
        {
          pref_name: 'By Preference',
          id: 'by preference',
        },
        {
          pref_name: 'All',
          id: 'all',
        },
        
      ],
      ArrPref1: [],
      showPicker: false,
      showPicker1: false,
      hasLocationPermission: null,
      starCount: 5,
      progress: false,
    };
  }

  TrackCampaign = () => {};
  StartCampaign = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      this.props.navigation.navigate('StartCampaign');
    } else {
      this.props.navigation.replace('LogIn');
    }
  };
  getuser = async () => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    console.log(token);
    console.log('user_id', user_id);
    var logs = {
      user_id: user_id,
    };
    var response = await API.post('donation_list_by_preference', logs);
    console.log(response);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      this.setState({
        ArrPref: [...response.data],
      });
      console.log(this.state.ArrPref);
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  getPreferences = async () => {
    var response = await API.post('filter_by_type_list');
    console.log('filter_by_type_list', response);
    if (response.status == 'success') {
      
      this.setState({
        
        ArrPref1: [...response.data],
      });
      this.state.ArrPref1.push({name: 'All', id: 'all',})
      console.log(this.state.ArrPref1);
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  
  componentDidMount = async () => {
    this.dashboard_donate();
    this.getPreferences()
    // this.getuser();

    this.focusListener = this.props.navigation.addListener('focus', () => {

      console.log('focusListener has calle1d!!!!')
      this.props.navigation.closeDrawer();
       this.dashboard_donate();
    // this.getPreferences()
      //Put your Data loading function here instead of my this.loadData()
    });

    this.state.hasLocationPermission = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

      {
        title: 'Dataar App Camera Permission',
        message:
          'Dataar App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log(this.state.hasLocationPermission);
    if (
      this.state.hasLocationPermissio === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  }
  
  goToCampaignDetails = async (item, index) => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    if (token != null && token !== '') {
      this.props.navigation.navigate('Campaing_details_ForDonor', {
        camp_id: item.campaign_id,
      })
      
    } else {
      this.props.navigation.replace('LogIn');
    }
  };
  like = async (item, index) => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    if (token != null && token !== '') {
      // navigation.navigate('StartCampaign');
      var logs = {
        user_id: user_id,
        campaign_id: item.campaign_id,
        // comment: '',
      };
      console.log(logs);
      var response = await API.post('add_to_favourite', logs);
      if (response.status == 'success') {
        Toast.show(response.message, Toast.LONG)
        let arr = [...this.state.setcmpData];
        arr[index].like_status = item.like_status == 1 ? 2 : 1;
        this.setState({
          setcmpData: arr,
        });
      } else {
        let arr = [...this.state.setcmpData];
        arr[index].like_status = item.like_status == 1 ? 2 : 1;
        this.setState({
          setcmpData: arr,
        });
      }
    } else {
      this.props.navigation.replace('LogIn');
    }
  };
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  dashboard_donate = async () => {

    this.setState({
      progress:true
  })

    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
      // search:"Omicron",
      // campaign_name: Title,
    };
    console.log(logs);
    var response = await API.post('donation_list', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log('donation_list response: ',response.data.campaign_data);
      this.setState({
        progress:false
    })
      if ([...response.data.campaign_data] == 0)
      {
        Toast.show('No Campaign found', Toast.LONG)
      }

      this.setState({
        setcmpData: [...response.data.campaign_data],
      });
      // setcmpData(response.data);
    } else {
      this.setState({
        progress:false
    })
      Alert.alert(response.status, response.message);
    }
  };
  dashboard_donate_by_filter = async (id) => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
      filter_by_type: id
      // search:"Omicron",
      // campaign_name: Title,
    };
    console.log(logs);
    var response = await API.post('donation_list', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log('donation_list response: ',response.data.campaign_data);

      if ([...response.data.campaign_data] == 0)
      {
        Toast.show('No Campaign found', Toast.LONG)
      }

      this.setState({
        setcmpData: [...response.data.campaign_data],
      });
      // setcmpData(response.data);
    } else {
      Alert.alert(response.status, response.message);
    }
  };

  preference_dashboard_donate = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
    };
    console.log(logs);
    var response = await API.post('donation_list_by_preference', logs);
    if (response.status == 'success') {
      console.log(response);
      if ([...response.data.campaign_data] == 0)
      {
        Toast.show('No Campaign found', Toast.LONG)
      }

      this.setState({
        setcmpData: [...response.data.campaign_data],
      });
      // setcmpData(response.data);
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  user_preference = prefer_name => {

    console.log('user_preference: ', prefer_name)
    if (prefer_name === 'All') {
      this.setState({
        setcmpData: [],
      });
      this.dashboard_donate();
    } else {
      this.setState({
        setcmpData: [],
      });
      this.preference_dashboard_donate();
    }
  };

  user_filter = (name, id) => {

    console.log('user_preference: ', name, id)
    if (name === 'All') {
      this.setState({
        setcmpData: [],
      });
      this.dashboard_donate();
    } else {
      this.setState({
        setcmpData: [],
      });
      this.dashboard_donate_by_filter(id);
    }
  };
  
  location = () => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };
  dots = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      // navigation.navigate('StartCampaign');
    } else {
      this.props.navigation.replace('LogIn');
    }
  };
  ContactDonee = async item => {

    console.log("ContactDonee selected item: ",item);

    this.props.navigation.navigate('DonationInKind', {
      campaign_id: item.campaign_id,
      kind_id: item.kind_id,
    });
    
    // Alert.alert(
    //   'Alert',
    //   'An email has been sent to your email address, please check and contact the Donee directly.', // <- this part is optional, you can pass an empty string
    //   [
    //     {text: 'OK', onPress: () => console.log('cancelled')},
    //   ],
    //   {cancelable: false},
    // )


  }
  Donate = async item => {
    var token = await AsyncStorage.getItem('token');
    var kyc_verified = await AsyncStorage.getItem('kyc_verified');
    var pan_number = await AsyncStorage.getItem('pan_number');
    console.log("pan_number",pan_number);

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
            this.props.navigation.navigate('DonationAmount', {
                      donate_amt: item.campaign_target_amount,
                      donation_mode: item.donation_mode,
                      campaign_id: item.campaign_id,
                      kind_id: item.kind_id,
                    });
          }
        }
        else
          {
            if(response.userdata.pan_number!='' && response.userdata.pan_number!=null)
            {
              Alert.alert("Alert", "Kyc under the processing");
            }
            else{
              Alert.alert("Alert", "Please submit your KYC for approval, click Ok to go to KYC page",  [
                {text: 'OK', onPress: () => this.props.navigation.navigate('KYCUpdateForDonor')},
              ],
              {cancelable: false},);
            }
    
          
          }
        
        
        
      // this.setState({
      //   pan_number:response.,
      // });
      // setcmpData(response.data);
    } else {
      Alert.alert(response.status, response.message);
    }

  }

    //   if(kyc_verified!=0 && kyc_verified!='')
    //   {
    //     if(pan_number!='')
    //     {
    //       this.props.navigation.navigate('DonationAmount', {
    //         donate_amt: item.campaign_target_amount,
    //         donation_mode: item.donation_mode,
    //         campaign_id: item.campaign_id,
    //         kind_id: item.kind_id,
    //       });
    //     }
    //   }
    //   else
    //   {
    //     if(pan_number!='' && pan_number!=null)
    //     {
    //       Alert.alert("Alert", "Kyc under the processing");
    //     }
    //     else{
    //       Alert.alert("Alert", "Please submit your KYC for approval, click Ok to go to KYC page",  [
    //         {text: 'OK', onPress: () => this.props.navigation.navigate('KYCUpdateForDonor')},
    //       ],
    //       {cancelable: false},);
    //     }

      
    //   }
    
     else {
      this.props.navigation.replace('LogIn');
    }
  };

  OneRupeeDonate = async () => {
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
            this.props.navigation.navigate('OneRupeeDonation', {
              donate_amt: '100',
              donation_mode: 'dsadas',
              campaign_id: '',
              kind_id: '',
            });
          }
        }
        else
          {
            if(response.userdata.pan_number!='' && response.userdata.pan_number!=null)
            {
              Alert.alert("Alert", " Your Kyc is currently under review. We will let you know once your KYC gets approved.");
            }
            else{
              Alert.alert("Alert", "Please submit your KYC for approval, click Ok to go to KYC page",  [
                {text: 'OK', onPress: () => this.props.navigation.navigate('KYCUpdateForDonor')},
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
  // const Logout = async () => {
  //   AsyncStorage.clear();
  //   navigation.navigate('LogIn');
  // };
  comment = item => {
    // this.modalizeRefComment.current.open();
    console.log(item);
    this.setState(
      {
        modalComment: true,
        modalCommentVal: item,
        campaign_id: item.campaign_id,
        commentArr: [],
        starCount: 5,
      },
      this.commetFetch,
    );
  };
  commetFetch = async () => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    if (token != null && token !== '') {
      // navigation.navigate('StartCampaign');
      var logs = {
        user_id: user_id,
        campaign_id: this.state.campaign_id,
      };
      var response = await API.post('campaign_comments_list', logs);
      if (response.status == 'success') {
        this.setState({
          commentArr: [...response.comments_data],
        });
        console.log(this.state.commentArr);
      } else {
      }
    } else {
    }
  };
  user = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      this.props.navigation.navigate('User profile');
    } else {
      this.props.navigation.replace('LogIn');
    }
  };
  renderlog = ({item, index}) => {
    var progressStatus = 0;
    var amountpaind;
    if (item.donation_mode == '1') {
      if (item.total_donation_amountpaid == null) {
        // progressStatus =
        //   (parseInt(0) / parseInt(item.campaign_target_amount)) * 100;
        progressStatus = 0.00
        amountpaind = 0 + ' of ' + item.campaign_target_amount;
      } else {
        progressStatus =
          (parseInt(item.total_donation_amountpaid) /
            parseInt(item.campaign_target_amount)) *
          100;
          progressStatus = parseFloat(progressStatus).toFixed(2)
          if (progressStatus > 100)
          {
            progressStatus = 100
          }
        amountpaind =
          item.total_donation_amountpaid + ' of ' + item.campaign_target_amount;
      }
    } else {
      if (item.total_donation_quantity == null) {
        // progressStatus =
        //   (parseInt(0) / parseInt(item.campaign_target_amount)) * 100;
           progressStatus = 0.00
        amountpaind = 0 + ' of ' + item.campaign_target_qty;
      } else {
        progressStatus =
          (parseInt(item.total_donation_quantity) /
            parseInt(item.campaign_target_qty)) *
          100;
          progressStatus = parseFloat(progressStatus).toFixed(2)
          if (progressStatus == 'Infinity')
          {
            progressStatus = 0
          }
          else if (progressStatus > 100.00)
          {
            progressStatus = 100
          }
        amountpaind =
          item.total_donation_quantity + ' of ' + item.campaign_target_qty;
      }
    }

    var base64String = item.campaign_image

    const wish = item.like_status == 1 ? true : false;
    console.log(wish);
    var msDiff = new Date(item.campaign_end_date).getTime() - new Date().getTime();    //Future date - current date
    var daysTill30June2035 = Math.floor(msDiff / (1000 * 60 * 60 * 24));

    return (
      <View style={{flex: 1}} key={item.donation_id}>
        <Card style={{overflow: 'hidden'}}>
          <CardItem>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffff',
                }}> 
                  <TouchableOpacity style={{
                  width: '90%'
                }}
        onPress={() => this.goToCampaignDetails(item, index)}>
           
                <Text style={{
    fontSize: 16,
    alignSelf: 'flex-start',
    alignItems: 'center',
    color: '#000',
    fontWeight: '700',
    
    // paddingTop:40,
  }}>{item.campaign_name}</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => this.like(item, index)}>
                    {wish ? (
                      <Image
                        style={Styles.donation_icon_font}
                        source={require('../../src/assets/images/like.png')}
                        // resizeMode="contain"dashboard_main_btn
                      />
                    ) : (
                      <Image
                        style={Styles.donation_icon_font}
                        source={require('../../src/assets/images/heartic.png')}
                        // resizeMode="contain"dashboard_main_btn
                      />
                    )}
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => this.dots()}>
                    <Image
                      style={Styles.donation_icon_font}
                      source={require('../../src/assets/images/dots.jpg')}
                      // resizeMode="contain"dashboard_main_btn
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
              <View style={{ marginLeft: 0, marginRight: 0, borderRadius:4, backgroundColor: 'null', flex: 1, marginTop: 10}}>
<Image style={{
  
    resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 4, width: '100%', 
}}

source={{uri: item.campaign_image}}>
{/* source={require('../../src/assets/images/daatar_banner.jpg')}> */}

</Image> 
</View>



              <View style={{flexDirection: 'row', marginTop: 1}}>
                <Text style={Styles.doner_title_font}>
                  {item.campaign_details}
                </Text>
              </View>
              { item.donation_mode == '1' && <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={Styles.doner_title_font}>{amountpaind}</Text>
                <Text style={Styles.doner_title_font}>{progressStatus}%</Text>
              </View> }
              {/* <View> */}
              { item.donation_mode == '1' &&  <View style={Styles.inner_barpro}>
                <Animated.View
                  style={[
                    Styles.inner_bar,
                    {width: parseInt(progressStatus) + '%'},
                  ]}
                />
              </View> }
              {/* </View> */}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {/* <Image
                    style={Styles.location_icon_font}
                    source={require('../../src/assets/images/location.jpg')}
                    // resizeMode="contain"dashboard_main_btn
                  /> */}
                  {/* <Text style={Styles.doner_title_font}> {item.location}</Text> */}
                  <Text style={Styles.doner_title_font}> {''}</Text>
                </View>



                {/* <Text style={Styles.doner_title_font}>
                  {item.days} days to go
                </Text> */}
                 <Text style={Styles.doner_title_font}>
                  {daysTill30June2035} days left
                </Text>
              </View>
             
                <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // backgroundColor: '#5ca7f2',
                }}>
                <Text style={Styles.doner_title_font}>
                  {item.quantity} Share
                </Text>
                <View
                  style={{
                    width: 90,
                    height: 40,
                    marginRight: 10,
                    marginTop: 19,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  // onStartShouldSetResponder={() => this.comment(item)}
                >
                  <TouchableOpacity
                    style={[
                      {
                        width: 90,
                        height: 40,
                        justifyContent: 'center',
                      },
                    ]}
                    onPress={() => this.comment(item)}>
                    <Text style={Styles.doner_comment_font}>
                       Review
                    </Text>
                  </TouchableOpacity>
                </View>
               { item.donation_mode == '1' && <TouchableOpacity
                  style={Styles.donate_btn_now}
                  onPress={() => this.Donate(item)}>
                  <Text style={{
    fontSize: 21,
    alignSelf: 'center',
    color: '#ffff',
    fontWeight: '500',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: -4
  }}>Donate Now</Text>
                </TouchableOpacity>
  }

{ item.donation_mode == '2' && <TouchableOpacity
                  style={Styles.donate_btn_now}
                  onPress={() => this.ContactDonee(item)}>
                  <Text style={{
    fontSize: 17,
    alignSelf: 'center',
    color: '#ffff',
    fontWeight: '500',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: -4
  }}>Contact Donee</Text>
                </TouchableOpacity>
  }
              </View>
            </View>
          </CardItem>
        </Card>
      </View>
    );
  };
  renderItemComment = ({item, index}) => {
    console.log(item.usr_pos_imgComment);
    return (
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: 10,
          marginStart: 20,
          borderRadius: 10,
          marginBottom: 10,
          // width: '30%',
        }}>
        <View style={[{flexDirection: 'row', marginTop: -10, marginLeft: 12}]}>
          <Text
            style={[
              {
                marginTop: 3,
                color: '#000',
                marginStart: 14,
                fontWeight: 'bold',
              },
            ]}>
            {item.User_Name1}
          </Text>

          

          {/* <Text
            style={[
              {
                marginTop: 3,
                color: '#000',
                marginStart: 14,
                fontWeight: 'bold',
              },
            ]}>
            {'@'}
            {item.User_Name}
          </Text> */}
        </View>
        <View
          style={[
            {
              flex: 1,
              height: 2,
              marginStart: 18,
            },
          ]}></View>
        <View style={[{marginStart: 13, width: '60%'}]}>
          
          <Text style={[{marginTop: 3, color: '#000', fontWeight: 'bold'}]}>{item.comment_user_name}</Text>
          <Text style={[{marginTop: 3, color: '#000'}]}>{item.comment}</Text>
          <View
              style={{
                marginTop: 10,
                width: 120,
              }}>
                 <StarRating       
        disabled={false}
        maxStars={5}
        rating={parseInt(item.rating)}
        starSize = {20}
        // selectedStar={(rating) => this.onStarRatingPress(rating)}
        fullStarColor={'#ff5c5c'}
      />
      </View>
        </View>
      </View>
    );
  };
  commentText = val => {
    console.log(val);
    this.setState({
      comment: val,
    });
  };
  commentSend = async () => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    if (token != null && token !== '') {
      // navigation.navigate('StartCampaign');
      var logs = {
        user_id: user_id,
        campaign_id: this.state.campaign_id,
        comment: this.state.comment,
        rating: String(this.state.starCount)
      };
      var response = await API.post('campaign_comment', logs);
      if (response.status == 'success') {
        console.log(response.status);
        this.setState({
          comment: '',
          modalComment: false,
          campaign_id: '',
          rating: 0,
          starCount: 5,
        });
      }
    } else {
      this.props.navigation.replace('LogIn');
    }
  };
  render() {
    return (
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.login_main}>
            
          <SafeAreaView style={Styles.dashboard_main_header}>
            
            <View style={Styles.dashboard_main_headers}>
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}>
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



              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Search_screen')}>
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
              <TouchableOpacity onPress={() => this.user()}>
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

          

          <View style={Styles.dashboard_main_contain}>
<ScrollView>
         
        <Card style={{overflow: 'hidden'}}>
          <CardItem>
            <View style={{flexDirection: 'column', flex: 1}}>

            <View style={{borderRadius:4, backgroundColor: 'null', flex: 1, marginTop: -20, alignSelf: 'center'}}>
<Image style={{
    resizeMode: 'contain', alignSelf: 'center', height: 200, borderRadius: 4, width: 350
}}
source={require('../../src/assets/images/daatar_banner.jpg')}>
</Image> 
</View>

<Text style={{fontSize:22,
        color:'black',
        alignSelf:'center',
        marginTop:-10, fontWeight: '500', marginBottom: 10}}>One coin creates divine</Text>

<TouchableOpacity
                  style={Styles.donate_btn_now1}
                  onPress={() => this.OneRupeeDonate()}>
                  <Text style={Styles.donate_btn_text}>Donate Now</Text>
                </TouchableOpacity>

            </View>
          </CardItem>
        </Card>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',}}>
        <View style={{width: '49%'}}>
            <Selector
              text={this.state.gender}
              placeholder="Gender"
              marginTop={0}
              onPress={() => this.setState({showPicker: true})}
              width={'100%'}
              height={42}
              imageheight={10}
              imagewidth={11}
              backcolor={'#ffff'}
              borderRadius={10}
              borderWidth={1}
              margright={10}
              fontcolor={'#A1A1A1'}
            />

            <Picker
              backgroundColor={'#ffff'}
              dataList={this.state.ArrPref}
              modalVisible={this.state.showPicker}
              onBackdropPress={() => this.setState({showPicker: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.user_preference(item.pref_name);
                      this.setState({gender: item.pref_name});
                      this.setState({showPicker: false});

                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                    }}>
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 14,
                        },
                        this.state.genderValue == item.pref_name,
                      ]}>
                      {item.pref_name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
 </View>

 <View style={{width: '49%', }}>
 <Selector
                text={this.state.gender1}
                placeholder="Preference"
                
                onPress={() => this.setState({showPicker1: true})}
                width={'100%'}
                height={42}
                imageheight={10}
                imagewidth={11}
                backcolor={'#ffff'}
                borderRadius={10}
                borderWidth={1}
                margright={10}
                fontcolor={'#A1A1A1'}
              />

<Picker
              backgroundColor={'#ffff'}
              dataList={this.state.ArrPref1}
              modalVisible={this.state.showPicker1}
              onBackdropPress={() => this.setState({showPicker1: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                     // this.prefArr.push(item.pref_id);
                     this.user_filter(item.name, item.id);
                      this.setState({gender1: item.name});
                      this.setState({showPicker1: false});
                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                    }}>
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 14,
                        },
                        this.state.genderValue1 == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
 </View>
            
             </View>
            <FlatList
              data={this.state.setcmpData}
              renderItem={this.renderlog}
              keyExtractor={(item, id) => id.toString()}
            />
            </ScrollView>
          </View>
        </ImageBackground>

        <Modal
          style={{
            width: deviceWidth,
            margin: 0,
            backdropOpacity: 10.7,
            backgroundColor: '#f2f1ed',
            marginTop: deviceHeight - 600,
          }}
          animationIn={'slideInUp'}
          backdropOpacity={0.7}
          backdropColor={'black'}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={400}
          hasBackdrop={true}
          useNativeDriver={true}
          isVisible={this.state.modalComment}
          onBackButtonPress={() =>
            this.setState({
              modalComment: false,
              shareHeight: 360,
            })
          }
          onBackdropPress={() =>
            this.setState({
              modalComment: false,
              shareHeight: 360,
              isVisible: false,
            })
          }>
          <View
            style={[
              {
                backgroundColor: '#f2f1ed',
                flexDirection: 'column',
                alignItems: 'center',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
                height: 40,
                width: '100%',
                backgroundColor: '#ffff',
                justifyContent: 'center',
                borderBottomColor: '#d6d6d6',
              }}>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginStart: 10,
                  fontSize: 20,
                }}>
                Review
              </Text>
              {/* <Text
                style={{
                  color: '#000',
                  alignSelf: 'flex-end',
                  fontWeight: 'bold',
                  marginRight: 10,
                  fontSize: 20,
                }}>
                CLOSE
              </Text> */}
            </View>
            <View
              style={{
                backgroundColor: '#ffff',
                justifyContent: 'center',
                height: '100%',
              }}>
                 <View
              style={{
                justifyContent: 'center',
                margin: 20,
              }}>
                 <StarRating       
        disabled={false}
        maxStars={5}
        rating={this.state.starCount}
        selectedStar={(rating) => this.onStarRatingPress(rating)}
        fullStarColor={'#ff5c5c'}
      />
      </View>
              <FlatList
                // style={{backgroundColor: 'red'}}
                keyExtractor={item => item.id.toString()}
                data={this.state.commentArr}
                onEndReachedThreshold={0.5}
                renderItem={this.renderItemComment}
              />

              <KeyboardAvoidingView
                style={[{marginBottom: 75, backgroundColor: 'transparent'}]}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      marginBottom: 4,
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <View
                    style={{
                      backgroundColor: '#e8e3e3',
                      height: 50,
                      flexDirection: 'row',
                      width: '100%',
                      borderRadius: 10,
                    }}>
                    <TextInput
                      style={{
                        flex: 1,
                        backgroundColor: '#e8e3e3',
                        padding: 10,
                        borderRadius: 40,
                        fontSize: 16,
                        color: '#000',
                        paddingLeft: 15,
                        alignSelf: 'center',
                        marginTop: 5
                      }}
                      placeholder={'Type your comment here...'}
                      multiline={true}
                      onChangeText={textEntry => {
                        this.commentText(textEntry);
                      }}></TextInput>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        paddingVertical: 0,
                        width: 50,
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        this.commentSend();
                      }}>
                      <Icon_3 name="ios-send" color="#ff5c5c" size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
        <Modal transparent={true} animationType="none" visible={this.state.progress}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: `rgba(0,0,0,${0.6})`,
          width: '100%',
          height: '100%',
          // marginTop: 400
        }}
      >
        <View
          style={{
            padding: 13,
            backgroundColor: 'grey',
            borderRadius: 3,
            marginTop: '90%'
          }}
        >
          <ActivityIndicator animating={this.state.progress} color={'white'} size="large" />
          <Text style={{ color: `${'white'}` }}>{'Wait a moment....'}</Text>
        </View>
      </View>
    </Modal>
      </Container>
    );
  }
}

export default Dashboard_donation_forDonor;