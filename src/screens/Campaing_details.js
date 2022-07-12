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
import { SafeAreaView } from 'react-native-safe-area-context';
class Campaing_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmpData: [],
      capmain_details: [],
      tableHead: ['Donor Name', 'Date', 'Amount', 'Status'],
      camp_id: props.route.params.camp_id,
      isloading: true,
      amount: 0,
      modalComment: false,
      isVisible: false,
      shareHeight: 360,
      campaignImageURI: '',
      raiseQueryString: '',
      maxLengthh1: 5000,
      descriptionString: ''
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
      console.log('response.data: ',response.data.capmain_details);
      var arr = new Array();
      var amountVal = 0;
      for (var i = 0; i < response.data.donations.length; i++) {
        // arr.push([
        //   response.data.donations[i]['donor_name'],
        //   response.data.donations[i]['updated_at'],
        //   response.data.donations[i]['amountpaid'],
        //   response.data.donations[i]['status'],
        // ]);
        // console.log(arr);
        amountVal =
          amountVal + parseInt(response.data.donations[i]['amountpaid']);
        this.setState({
          amount: amountVal,
        });
      }
      var base64String = response.data.capmain_details[0]['campaign_image']
      var base64Icon = 'data:image/png;base64,'+base64String
      this.setState({
        cmpData: [...response.data.donations],
        capmain_details: [...response.data.capmain_details],
        campaignImageURI: base64String,
        isloading: false,
      });

      console.log(this.state.cmpData);
    } else {
      this.setState({
        isloading: false,
      });
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
  renderlog1 = ({item, index}) => {
    return (
      <Card style={{overflow: 'hidden'}}>
      <CardItem>
      <View style={{flexDirection: 'column'}}>
        {/* <View
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
        </View> */}

<View style={{flexDirection: 'row', marginTop: -23}}>
              <Text style={Styles.doner_title_font_Modified}>
              Donor Name:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.donor_name}
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Date:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.updated_at}
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Amount:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.amountpaid}
                </Text>
              </View>

              {/* <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Status:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.status}
                </Text>
              </View> */}
      </View>
      </CardItem>
        </Card>
    );
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
   remarksTyping = async (text) => {
    this.setState({raiseQueryString: text, maxLengthh1: 5000 - text.length})
   
  }
  setDescription = value => {
    this.setState({
      descriptionString: value,
    });
  };
  descriptionEdit = async () => {
    this.inputText1.focus()
  };
   submitQuery = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    if (this.state.raiseQueryString.trim() == '')
    {
      Alert.alert('Alert', 'Please enter your query');
    }
else
{
    var logs = {
      user_id: user_id,
      remarks: this.state.raiseQueryString
    };
    console.log(logs);
    var response = await API.post('raise_a_query', logs);
    if (response.status == 'success') {
      // logout()
      
      Alert.alert(
        response.status,
        response.message, // <- this part is optional, you can pass an empty string
        [
          //  {text: 'NO', onPress: () => console.log('No')}, //logout()
          {text: 'OK', onPress: () => this.setState({raiseQueryString: ''})}, 
          
        ],
        {cancelable: false},
      )
        
        
     
    } else {
      Alert.alert(response.status, response.message);
    }

  }
  
  };
  submitSelfDonation = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    if (this.state.descriptionString.trim() == '')
    {
      Alert.alert('Alert', 'Please enter amount');
    }
else
{
    var logs = {
      user_id: user_id,
      amount: this.state.descriptionString,
      campaign_id: this.state.camp_id
    };
    console.log(logs);
    var response = await API.post('self_donation', logs);
    if (response.status == 'success') {
      // logout()
      
      Alert.alert(
        response.status,
        response.message, // <- this part is optional, you can pass an empty string
        [
          //  {text: 'NO', onPress: () => console.log('No')}, //logout()
          {text: 'OK', onPress: () => this.setState({descriptionString: ''})}, 
          
        ],
        {cancelable: false},
      )
        
        
     
    } else {
      Alert.alert(response.status, response.message);
    }

  }
  
  };
  render() {
    var loaded = this.state.isloading;
    if (loaded) {
      return <AppPreLoader />;
    }

    var donation_type = ''
     if (this.state.capmain_details[0]['donation_mode'] == '1')
     {
      donation_type = 'Money'
     }
     else
     {
      donation_type = 'In Kind'
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
              </View>
              <View style={Styles.dashboard_main_headers}>
              {/* <TouchableOpacity
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
                </TouchableOpacity> */}
              </View>
            </SafeAreaView>
            <ScrollView style={Styles.dashboard_main_contain}>
              <View style={Styles.campaign_details_contain}>

              <View style={{ marginLeft: 0, marginRight: 0, borderRadius:4, backgroundColor: 'null', marginTop: -16}}>
<Image style={{
  
    resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 4, width: '100%', 
}}
 source={{uri: this.state.campaignImageURI}}
// source={require('../../src/assets/images/daatar_banner.jpg')}
>
</Image> 
</View>

                <View style={{alignSelf: 'center', marginTop: 3}}>
                  <Text style={Styles.campaign_text_font1}>
                    {this.state.capmain_details[0]['campaign_details']}
                  </Text>
                </View>

                <View style={Styles.campaign_details_date_contain}>
                  <Text style={Styles.sub_text_font1}>
                    Start Date: {this.state.capmain_details[0]['campaign_start_date']}
                  </Text>
                  <Text style={Styles.sub_text_font1}>
                    {'   '}
                    Expiry Date: {this.state.capmain_details[0]['campaign_end_date']}
                  </Text>
                </View>
                <View style={Styles.campaign_details_text_contain}>
                  <Text style={Styles.sub_text_font1}>
                    Donation Type:{' '}
                    {donation_type}
                  </Text>
                 { this.state.capmain_details[0]['donation_mode'] == '1' && <Text style={Styles.sub_text_font1}>
                    {'   '}
                    Amount Recived: {this.state.amount}
                  </Text> }
                </View>
                <View style={Styles.campaign_details_text_contain}>
                { this.state.capmain_details[0]['donation_mode'] == '1' && <Text style={Styles.sub_text_font1}>
                    Target Amount:{' '}
                    {this.state.capmain_details[0]['campaign_target_amount']}
                  </Text> }

                  { this.state.capmain_details[0]['donation_mode'] == '2' && <Text style={Styles.sub_text_font1}>
                    Target Quantity:{' '}
                    {this.state.capmain_details[0]['campaign_target_qty']}
                  </Text> }

                </View>
                {/* <View style={Styles.campaign_details_text_contain}>
                  <Text style={Styles.sub_text_font1}>
                    Comments: 
                  </Text>
                  <Text style={Styles.sub_text_font1}>
                    {'   '} Like: 
                  </Text>
                </View> */}
             
              {/* <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                <Row
                  data={this.state.tableHead}
                  style={{height: 40, backgroundColor: '#f1f8ff'}}
                  textStyle={{margin: 6, textAlign: 'center'}}
                />
              </Table> */}
            { this.state.capmain_details[0]['donation_mode'] == '1' &&  <FlatList
                data={this.state.cmpData}
                renderItem={this.renderlog1}
                keyExtractor={(item, id) => id.toString()}
              /> }
               <Text style={Styles.sub_text_font1}>
                    
                  </Text>


                  <Text style={{
    fontSize: 17,
    // alignSelf: 'center',
    color: 'grey',
    fontWeight: '500',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 10
  }}>Raise your query:</Text>

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
                placeholder={'Type your query here...'}
                multiline={true}
     numberOfLines={5}
     textAlignVertical={'top'}
                placeholderTextColor={'grey'}
                value = {this.state.raiseQueryString}
                maxLength={5000}
                onChangeText={(text) => this.remarksTyping(text)}
                ></TextInput>
<Text style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: 5, color: '#f55656', marginLeft: 17, marginBottom: 7, fontWeight: '400' }}>{this.state.maxLengthh1+' Character remaining'}</Text>


<TouchableOpacity
                  style={{width: '94%',
                    height: 46,
                    backgroundColor: '#f55656',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,}}
                  onPress={() => this.submitQuery()}>
                  <Text style={Styles.donate_btn_text}>Submit Query</Text>
                </TouchableOpacity>

              { this.props.route.params.camp_type == '1' &&  <Text style={{
    fontSize: 17,
    // alignSelf: 'center',
    color: 'grey',
    fontWeight: '500',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20
  }}>Self-Donation:</Text> }

  { this.props.route.params.camp_type == '1' &&  <View style={{
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15
  }}> 
                  <TextInput
                    style={{
                      borderBottomColor: '#000',
                      borderBottomWidth: 1,
                      width: '90%',
                      color: 'black',
                      height: 43,
                      backgroundColor: 'white'
                    }}
                    keyboardType='decimal-pad'
                    placeholder="Enter amount"
                    placeholderTextColor='grey'
                    ref ={ref => this.inputText1 = ref}
                    // editable={this.state.iseditablefname}
                    onChangeText={value => this.setDescription(value)}
                    value={this.state.descriptionString}
                    ></TextInput>
                  {/* </ListItem> */}
                  <TouchableOpacity
                    style={Styles.user_edit_profile_lbtext}
                    onPress={() => this.descriptionEdit()}>
                    <Image
                      style={{
                        width: 24,
                        height: 21,
                        marginStart: 12,
                        marginTop: 20,
                        backgroundColor: 'transparent',
                      }}
                      source={require('../../src/assets/images/penicon.png')}
                    />
                  </TouchableOpacity>
                </View> }

                { this.props.route.params.camp_type == '1' &&  <Text style={ {
  marginTop: 5,
  marginLeft: 0,
  marginRight: 15,
  color: 'green',
  fontSize: 11,
  marginBottom: 10,
  // alignSelf: 'center',
  paddingLeft: 13
}}>{'Make a self donation'}</Text> }

{ this.props.route.params.camp_type == '1' && <TouchableOpacity
                  style={{width: '94%',
                    height: 46,
                    backgroundColor: '#f55656',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,
                  marginBottom: 60}}
                  onPress={() => this.submitSelfDonation()}>
                  <Text style={Styles.donate_btn_text}>Submit Donation</Text>
                </TouchableOpacity> }
                </View>
            </ScrollView>
          </ImageBackground>

          
        </Container>
    );
  }
}

export default Campaing_details;
