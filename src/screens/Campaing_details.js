import React, { Component } from 'react';
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
      ListData: [],
      d_status:'',
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
      console.log('response.data: ', response.data);
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
      var base64Icon = 'data:image/png;base64,' + base64String
      this.setState({
        cmpData: [...response.data.kind_list],
        ListData:[...response.data.donations],
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
  renderlog1 = ({ item, index }) => {
    return (
      <Card style={{ overflow: 'hidden' }}>
        <CardItem>
          <View style={{ flexDirection: 'column' }}>
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

            <View style={{ flexDirection: 'row', marginTop: -23 }}>
              <Text style={Styles.doner_title_font_Modified}>
                Donor Name:
              </Text>
              <Text style={Styles.doner_title_font}>
                {item.donor_name}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <Text style={Styles.doner_title_font_Modified}>
                Date:
              </Text>

              <View style ={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>

              <Text style={Styles.doner_title_font}>
                {(item.updated_at).substring(0 , 11).split("-").reverse().join("-") + " " +((item.updated_at).substring(11 , 13) > 12 ? ((item.updated_at).substring(11 , 13))%12 : (item.updated_at).substring(11 , 13)) + ":" +(item.updated_at).substring(14 , 16) }
              </Text>

             {(item.updated_at).substring(11 , 13) > 12 ? (<Text style={Styles.doner_title_font}>
              PM
              </Text>) : (AM)
  }

             

              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <Text style={Styles.doner_title_font_Modified}>
                Amount:
              </Text>

<View style={{
  flexDirection: 'row'
}}>
<Image
                    style={{
                      width: 15,
                      height: 15,
                     // marginStart: 10,
                      //marginEnd: 10,
                      // marginTop: 20,
                      marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                    }}
                    source={require('../../src/assets/images/rupee.png')}
                    // resizeMode="contain"dashboard_main_btn
                  />

              <Text style={Styles.doner_title_font}>
                {item.amountpaid}
              </Text>

              </View>
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


  renderItem = ({ item, index }) => (

    <View style={{ padding: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 0 }}>
        <View style={{ flexDirection: 'column', width: '40%', marginRight: '2%' }}>
          <Text style={{ marginBottom: 5, color: 'black' }}>Item Name</Text>
          <TextInput
            key={index}
            style={{ borderWidth: .5, color: 'black', borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4 }}
            value={item.item_name}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'column', width: '28%', marginRight: '2%' }}>
          <Text style={{ marginBottom: 5, color: 'black', color: 'black' }}>Quantity</Text>
          <TextInput
            key={index}
            style={{ borderWidth: .5, borderColor: '#f55656', color: 'black', height: 40, paddingLeft: 4, borderRadius: 4 }}
            value={item.qty}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'column', width: '28%', marginRight: '2%' }}>
          <Text style={{ marginBottom: 5, fontSize: 12, marginTop: 2, color: 'black' }}>Unit</Text>
          <TextInput
            key={index}
            keyboardType='decimal-pad'
            style={{ borderWidth: .5, borderColor: '#f55656', height: 40, color: 'black', paddingLeft: 4, borderRadius: 4 }}
            value={item.unit}
            editable={false}
          />
        </View>
      </View>
    </View>

  );

  renderlog = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.navigation.navigate('Campaing_kind_donor_details', { item })}>
        <Card style={{ overflow: 'hidden' }} >
          <CardItem >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', marginTop: -23 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Donor Name:
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.donor_name}
                </Text>
                {item.donation_status =="1" ? <View style={{ borderRadius:10,borderColor:'black',borderWidth:1, marginTop: 15,marginLeft:15,justifyContent: 'flex-end',backgroundColor: 'green', width: 70, height: 32,alignContent:'center' }}>
                <Text style={{fontSize:12,color: 'white',textAlign:'center',textAlignVertical:'center',marginBottom:6}}>
                  Completed
                </Text>
                </View> :
                <View style={{ borderRadius:10, borderColor:'black',borderWidth:1,marginTop: 15,marginLeft:12,justifyContent: 'flex-end',backgroundColor: 'yellow', width: 70, height: 22,alignContent:'center' }}>
                <Text style={{fontSize:12,color: 'black',textAlign:'center',textAlignVertical:'center',marginBottom:6}}>
                  Pending
                </Text>
                </View>}
                

              </View>

              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Date:
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.created_at}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Donation Number:
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.donation_number}
                </Text>
              </View>
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  };
  renderItemComment = ({ item, index }) => {
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

        <View style={[{ flexDirection: 'row', marginTop: -10, marginLeft: 12 }]}>
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
        <View style={[{ marginStart: 28, width: '60%' }]}>

          <Text style={[{ marginTop: 3, color: '#000' }]}>
            {item.user_TagComment}
          </Text>
        </View>
      </View>
    );
  };
  
  render() {
    var loaded = this.state.isloading;
    if (loaded) {
      return <AppPreLoader />;
    }

    var donation_type = ''
    if (this.state.capmain_details[0]['donation_mode'] == '1') {
      donation_type = 'Money'
    }
    else {
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

              <View style={{ marginLeft: 0, marginRight: 0, borderRadius: 4, backgroundColor: 'null', marginTop: -16 }}>
                <Image style={{

                  resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 4, width: '100%',
                }}
                  source={{ uri: this.state.campaignImageURI }}
                // source={require('../../src/assets/images/daatar_banner.jpg')}
                >
                </Image>
              </View>

              <View style={{alignItems:'flex-start', marginTop: 3 }}>
                <Text style={{fontSize: 18,
                  fontWeight: '500',
                  numberOfLines:1,
                   ellipsizeMode:'tail',
                  marginStart: 7,
                  fontWeight: 'bold',
                  marginEnd: 5,
                 }}>
                  {this.state.capmain_details[0]['campaign_details']}
                </Text>
              </View>

              <View style={Styles.campaign_details_date_contain}>
                <Text style={Styles.sub_text_font1}>
                  Start Date: {(this.state.capmain_details[0]['campaign_start_date']).split("-").reverse().join("-")}
                </Text>
                <Text style={Styles.sub_text_font1}>
                  {'   '}
                  Expiry Date: {(this.state.capmain_details[0]['campaign_end_date']).split("-").reverse().join("-")}
                </Text>
                <Text style={Styles.sub_text_font1}>
                  Donation Type:{' '}
                  {donation_type}
                </Text>
              </View>
              <View style={Styles.campaign_details_text_contain}>
               
                </View>
                <View >
                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',

                  marginStart: 7,
                  fontWeight: 'bold',
                  marginEnd: 5,
                  marginBottom:20
                }}>

                  Item List
                  
                </Text>

                <FlatList
                  data={this.state.cmpData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item, index) => this.renderItem(item, index)}
                />
                
                {/* {this.state.capmain_details[0]['donation_mode'] == '1' && <Text style={Styles.sub_text_font1}>
                  {'   '}
                  Amount Recived: {this.state.amount}
                </Text>} */}
              </View>
              <View style={Styles.campaign_details_text_contain}>
                {/* {this.state.capmain_details[0]['donation_mode'] == '1' && <Text style={Styles.sub_text_font1}>
                  Target Amount:{' '}
                  {this.state.capmain_details[0]['campaign_target_amount']}
                </Text>}

                {this.state.capmain_details[0]['donation_mode'] == '2' && <Text style={Styles.sub_text_font1}>
                  Target Quantity:{' '}
                  {this.state.capmain_details[0]['campaign_target_qty']}
                </Text>} */}
                
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
               <Text  style={{
                  fontSize: 18,
                  fontWeight: '500',

                  marginStart: 7,
                  fontWeight: 'bold',
                  marginEnd: 5,
                }}>
                  Donation List
                </Text>
              {this.state.capmain_details[0]['donation_mode'] == '1' &&
                <FlatList
                  data={this.state.ListData}
                  renderItem={this.renderlog1}
                  keyExtractor={(item, id) => id.toString()}
                />}
              {this.state.capmain_details[0]['donation_mode'] == '2' &&
                <FlatList
                  data={this.state.ListData}
                  renderItem={this.renderlog}
                  keyExtractor={(item, id) => id.toString()}
                />}
              <Text style={Styles.sub_text_font1}>

              </Text>

            </View>
          </ScrollView>
        </ImageBackground>


      </Container>
    );
  }
}

export default Campaing_details;
