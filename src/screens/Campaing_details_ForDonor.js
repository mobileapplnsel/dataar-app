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
      isVisible: false,
      shareHeight: 360,
      campaignImageURI: ''
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
      this.setState({campaignImageURI: base64Icon})


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
  componentDidMount() {
    this.campaign();
    console.log('campaign', this.props.route.params.camp_id);
  }
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
  renderItemComment = ({item, index}) => {
    console.log(item.usr_pos_imgComment);
    return (
      <View
        style={
          {
            backgroundColor: '#fff',
            marginTop: 10,
            marginStart: 20,
            borderRadius: 10,
            marginBottom: 10,
            // width: '30%',
          }
        }>
        
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
            {item.User_Name}
          </Text>
          <Text
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
          </Text>
        </View>
        <View
          style={[
            {
              flex: 1,
              height: 2,
              marginStart: 18,
            },
          ]}></View>
        <View style={[{marginStart: 28, width: '60%'}]}>
          
            <Text style={[{marginTop: 3, color: '#000'}]}>
              {item.user_TagComment}
            </Text>
        </View>
      </View>
    );
  };
  Donate = async () => {
   
      this.props.navigation.navigate('DonationAmount', {
        donate_amt: this.state.capmain_details[0]['campaign_target_amount'],
        donation_mode: this.state.capmain_details[0]['donation_mode'],
        campaign_id: this.state.capmain_details[0]['campaign_id'],
        kind_id: this.state.capmain_details[0]['kind_id'],
      })
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
            </View>
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
                <Text style={Styles.doner_title_font}>
                  Share
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

{/* onPress={() => this.comment()} */}
                  
                </View>
                <TouchableOpacity
                  style={Styles.donate_btn_now}
                  onPress={() => this.Donate()}>
                  <Text style={Styles.donate_btn_text}>Donate Now</Text>
                </TouchableOpacity>
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
                    Start Date: {this.state.capmain_details[0]['created_at']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Expiry Date: {this.state.capmain_details[0]['updated_at']}
                  </Text>
                
                
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    
                    {'Donation Type: '+this.state.capmain_details[0]['donation_mode']}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Amount Recived: {this.state.amount}
                  </Text>
                
                
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                  }}>
                    Target Quantity:{' '}
                    {this.state.capmain_details[0]['campaign_target_amount']}
                  </Text>

                  <Text style={{
                    fontSize: 19,
                    fontWeight: '500',
                    marginTop: 13,
                    marginStart: 20, 
                    marginEnd: 20,
                    fontStyle: 'italic',
                    textDecorationLine: 'underline'
                  }}>
                    Review & Ratings
                  </Text>
                
                

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

          
        </Container>
      
    );
  }
}

export default Campaing_details;
