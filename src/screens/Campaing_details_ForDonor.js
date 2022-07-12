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
  Dimensions,
  KeyboardAvoidingView,
  Share
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
import AppPreLoader from '../components/AppPreLoader';
import Icon_3 from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : Dimensions.get('window').height;
class Campaing_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      sharableURL: ''
    };
  }
  campaign = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      campaign_id: this.state.camp_id,
    };
    var response = await API.post('campaign_details', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log(response.data);
      var arr = new Array();
      var amountVal = 0;
      // for (var i = 0; i < response.data.donations.length; i++) {
      //   arr.push([
      //     response.data.donations[i]['donor_name'],
      //     response.data.donations[i]['updated_at'],
      //     response.data.donations[i]['amountpaid'],
      //     response.data.donations[i]['status'],
      //   ]);
      //   console.log(arr);
      //   amountVal =
      //     amountVal + parseInt(response.data.donations[i]['amountpaid']);
      //   this.setState({
      //     amount: amountVal,
      //   });
      // }
      var base64String = response.data.capmain_details[0]['campaign_image']
      var base64Icon = 'data:image/png;base64,'+base64String
      this.setState({campaignImageURI: base64String, sharableURL: response.data.campaign_details_url})


      this.setState({
        cmpData: [...response.data.donations],
        capmain_details: [...response.data.capmain_details],
        campaign_owner_data: response.data.campaign_owner_data,
        isloading: false,
        amount: [...response.data.total_donation_amountpaid]
      });
      console.log(this.state.cmpData);
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  componentDidMount() {
    this.campaign();
    console.log('campaign', this.props.route.params.camp_id);
  }
  ContactDonee = async item => {

    console.log("ContactDonee selected item: ",item);

    this.props.navigation.navigate('DonationInKind', {
      campaign_id: this.state.capmain_details[0]['campaign_id'],
              kind_id: this.state.capmain_details[0]['kind_id'],
    });
    
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
              donate_amt: this.state.capmain_details[0]['campaign_target_amount'],
              donation_mode: this.state.capmain_details[0]['donation_mode'],
              campaign_id: this.state.capmain_details[0]['campaign_id'],
              kind_id: this.state.capmain_details[0]['kind_id'],
            })
          }
        }
        else
          {
            if(response.userdata.pan_number!='' && response.userdata.pan_number!=null)
            {
              Alert.alert("Alert", "Your Kyc is currently under review. We will let you know once your KYC gets approved.");
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
      this.props.navigation.navigate('LogIn');
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
  approve = async item => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      donation_id: this.state.camp_id,
      donee_approved: '1',
      approved_donee_id: item.approved_donee_id,
    };
    var response = await API.post('donee_approval', logs);
    if (response.status == 'success') {
      Alert.alert(response.status, response.message);
    }
  };
  renderlog = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            width: '100%',
            height: 40,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{alignItems: 'center', marginStart: 6}}>
            <Text style={Styles.sub_text_font1}>{item.donor_name}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={Styles.sub_text_font1}>{item.updated_at}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={Styles.sub_text_font1}>{item.amountpaid}</Text>
          </View>
          <View style={{alignItems: 'center', marginEnd: 6}}>
            {item.donee_approved === '0' ? (
              <Text style={Styles.sub_text_font1}>{item.status}</Text>
            ) : (
              <TouchableOpacity
                style={{height: 25, width: 80, backgroundColor: '#64d182'}}
                onPress={() => this.approve(item)}>
                <Text style={Styles.sub_text_font1}>Approve</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };
  shareCampaign = async () => {
    // this.modalizeRefComment.current.open();    campaign_details_url
    console.log('item.campaign_details_url'+ this.state.sharableURL);
    try {
      const result = await Share.share({
       title: 'Campaign Link',
  message: 'Here is the Campaign link of Dataar App: ' + this.state.sharableURL, 
  url: item.campaign_details_url
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
    
  };
  comment = () => {
    // this.modalizeRefComment.current.open();
    // console.log(item);
console.log('comment button clicked!!!!')

    this.setState(
      {
        modalComment: true,
        campaign_id: this.state.camp_id,
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
        campaign_id: this.state.camp_id,
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
        campaign_id: this.state.camp_id,
        comment: this.state.comment,
        rating: String(this.state.starCount)
      };
      var response = await API.post('campaign_comment', logs);
      if (response.status == 'success') {
        console.log(response.status);
        // Toast.show(response.message, Toast.LONG)
        this.setState({
          comment: '',
          modalComment: false,
          campaign_id: '',
          rating: 0,
          starCount: 5,
        });
      }
    } else {
      this.props.navigation.navigate('LogIn');
    }
  };
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
 
  render() {
    var loaded = this.state.isloading;
    if (loaded) {
      return <AppPreLoader />;
    }
    return (
      
        <Container>
          <ImageBackground
            source={require('../../src/assets/images/bg.jpg')}
            style={Styles.login_main}>
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

                <Text style={{marginLeft: 24, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    Campaign Details
                  </Text>

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

<View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20
                  // backgroundColor: '#5ca7f2',
                }}>
                <TouchableOpacity
                    style={[
                      {
                        marginTop: 20,
                        alignSelf: 'center',
    alignItems: 'center',
                      },
                    ]}
                    onPress={() => this.shareCampaign()}>
                <Text style={{
    fontSize: 14,
    color: '#757373',
    fontWeight: '500',
  }}>
                 Share
                </Text>
                </TouchableOpacity>
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

{/* onPress={() => this.comment()} */}
                  
                </View>
                {/* <TouchableOpacity
                  style={Styles.donate_btn_now}
                  onPress={() => this.Donate()}>
                  <Text style={Styles.donate_btn_text}>Donate Now</Text>
                </TouchableOpacity> */}

                { this.state.capmain_details[0]['donation_mode'] == '1' && <TouchableOpacity
                  style={Styles.donate_btn_now}
                  onPress={() => this.Donate()}>
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

{ this.state.capmain_details[0]['donation_mode'] == '2' && <TouchableOpacity
                  style={Styles.donate_btn_now}
                  onPress={() => this.ContactDonee()}>
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

              <Text style={{ marginStart: 5, fontWeight: 'bold', fontSize: 20, }}>
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

                  <TouchableOpacity
                    style={[
                      {
                        marginTop: 13,
                        marginStart: 20, 
                        marginEnd: 20,
                        justifyContent: 'center',
                        width: 170,
                      },
                    ]}
                    onPress={() => this.comment()}>
                  <Text style={{
                    fontSize: 19,
                    fontWeight: '500',
                    fontStyle: 'italic',
                    textDecorationLine: 'underline'
                  }}>
                    Review & Ratings
                  </Text>
                  </TouchableOpacity>
                

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

                  {/* <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    {'Address: '+this.state.campaign_owner_data['address']}
                  </Text> */}

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

                  
              </View>

              

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
                      alignItems: 'center'
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
        </Container>
      
    );
  }
}

export default Campaing_details;
