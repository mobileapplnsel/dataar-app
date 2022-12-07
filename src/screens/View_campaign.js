/* eslint-disable react/jsx-no-undef */
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
  Dimensions,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import SelfDonation from '../components/SelfDonation';
import RiseEnquery from '../components/RiseEnquery';
import AppPreLoader from '../components/AppPreLoader';
const deviceWidth = Dimensions.get('window').width;
class View_campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: true,
      cmpData: [],
      statusBGColor: 'green',
      tableHead: [
        'No.',
        'Title',
        'Start Date',
        'Expriy Date',
        'Type',
        'Amount',
        'View',
      ],
      tableData: [
        ['1', '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456\n789'],
        ['a', 'b', 'c', 'd'],
      ],
      widthArr: [40, 180, 80, 80, 40, 120, 60],
    };
  }

  campaign = async () => {

    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
    };
    console.log('log for track campaign:', user_id);
    var response = await API.post('campaign_details_by_user', logs);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      // console.log(response.data)
      var arr = new Array();
      console.log('campaign_details_by_user: ', response.data);
      for (var i = 0; i < response.data.length; i++) {
        arr.push([
          response.data[i]['campaign_id'],
          response.data[i]['campaign_name'],
          response.data[i]['campaign_start_date'],
          response.data[i]['campaign_end_date'],
          response.data[i]['donation_mode'],
          response.data[i]['campaign_target_amount'],
          response.data[i]['campaign_id'],
          response.data[i]['campaign_details'],
          response.data[i]['campaign_image'],
        ]);
        console.log(arr);
      }
      this.setState({
        cmpData: response.data,
        isloading: false,
      });
    } else {
      this.setState({
        isloading: false,
      })
      Alert.alert(response.status, response.message);
    }
  };

  componentDidMount() {
    this.campaign();
  }
  element = (data, index) => {
    console.log(data);
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Campaing_details', {
            camp_id: data,
          })
        }>
        <View
          style={{
            width: 58,
            height: 18,
            backgroundColor: '#78B7BB',
            borderRadius: 2,
          }}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>View</Text>
        </View>
      </TouchableOpacity>
    );
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
  renderlog = ({ item, index }) => {

    console.log('item: ', item)
    var base64String = item.campaign_image
    var base64Icon = 'data:image/png;base64,' + base64String
    console.log('base64Icon: ', base64Icon)
    var donation_type = ''
    if (item.donation_mode == '1') {
      donation_type = 'Money'
    }
    else {
      donation_type = 'In Kind'
    }

    const wish = item.like_status == 1 ? true : false;
    console.log(wish);
    return (
      <View style={{ flex: 1 }} key={item.campaign_id}>
        <Card style={{ overflow: 'hidden' }}>
          <CardItem>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#ffff',
                  width: '90%'
                }}>
                <TouchableOpacity style={{
                  width: item.donation_mode == '1' ? deviceWidth - 210 : deviceWidth - 120
                }}>
                  <Text style={{
                    fontSize: 19,
                    color: '#000',
                    fontWeight: '700',
                  }}>{item.campaign_name}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: item.donation_mode == '1' ? 180 : 85
                  }}>
                  <SelfDonation
                    camp_type={item.donation_mode}
                    camp_id={item.campaign_id}
                  />
                  <RiseEnquery
                  />
                </View>
              </View>

              {/* <View style={{ marginLeft: 0, marginRight: 0, borderRadius:4, backgroundColor: 'null', flex: 1, marginTop: -6}}>
<Image style={{
  
    resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 4, width: '100%', 
}}

source={{uri: base64Icon}}>

</Image> 
</View> */}



              {/* <View style={{flexDirection: 'row', marginTop: 0}}>
              <Text style={Styles.doner_title_font_Modified}>
                 Details:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.campaign_details}
                </Text>
              </View>
              
              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Start Date:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.campaign_start_date}
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Expriy Date:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.campaign_end_date}
                </Text>
              </View> */}

              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Type:
                </Text>
                <Text style={Styles.doner_title_font}>
                  {donation_type}
                </Text>
              </View>

              {item.donation_mode == '1' && <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Target Amount:
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.campaign_target_amount}
                </Text>
              </View>}

              {item.donation_mode == '2' && <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Target Quantity:
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.campaign_target_qty}
                </Text>
              </View>}


              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Status:
                </Text>
                {item.status == '0' && <View
                  style={{
                    width: '80%',
                    height: 33,
                    // backgroundColor: 'yellow',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}>
                  <Text style={{
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    color: '#ffff',
                    fontWeight: '500',
                    color: 'black',
                    paddingTop: 5
                  }}>Pending for approval</Text>
                </View>}

                {item.status == '1' && <View
                  style={{
                    width: '80%',
                    height: 33,
                    // backgroundColor: 'green',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}>
                  <Text style={{
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    color: '#ffff',
                    fontWeight: '500',
                    color: 'black',
                    paddingTop: 5
                  }}>Approved</Text>
                </View>}

                {item.status == '2' && <View
                  style={{
                    width: '80%',
                    height: 33,
                    // backgroundColor: 'green',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}>
                  <Text style={{
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    color: '#ffff',
                    fontWeight: '500',
                    color: 'black',
                    paddingTop: 5
                  }}>Rejected</Text>
                </View>}
              </View>

              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={Styles.doner_title_font_Modified}>
                  Validity Status:
                </Text>
                <View
                  style={{
                    width: 135,
                    height: 33,
                    backgroundColor: 'null',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}>
                  <Text style={{
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    // color: '#ffff',
                    color: 'black',
                    fontWeight: '500',
                    paddingTop: 4
                  }}>{item.validity}</Text>
                </View>


              </View>

              <TouchableOpacity
                style={{
                  width: '96%',
                  height: 46,
                  backgroundColor: '#f55656',
                  marginTop: 15,
                  color: '#f55656',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 6,
                }}
                onPress={() => this.props.navigation.navigate('Campaing_details', {
                  camp_id: item.campaign_id,
                  camp_type: item.donation_mode
                })}>
                <Text style={Styles.donate_btn_text}>View</Text>
              </TouchableOpacity>
              {item.status == '1' &&
                <TouchableOpacity
                  style={{
                    width: '96%',
                    height: 46,
                    backgroundColor: '#f55656',
                    marginTop: 15,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}
                  onPress={() => this.props.navigation.navigate('EditCampaign', {
                    camp_id: item.campaign_id,
                  })}>
                  <Text style={Styles.donate_btn_text}>Edit</Text>
                </TouchableOpacity>
              }
            </View>
          </CardItem>
        </Card>
      </View>
    );
  };
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

              <Text style={{ marginLeft: 14, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center' }}>
                My Campaign
              </Text>
            </View>
            <View style={Styles.dashboard_main_headers}>
              {/* <TouchableOpacity>
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
          {/* <ScrollView horizontal={true}> */}
          {/* <ScrollView> */}
          {/* <View style={Styles.dashboard_main_contain}> */}
          {/* <FlatList
                data={this.state.cmpData}
                renderItem={this.renderlog}
                keyExtractor={(item, campaign_id) => campaign_id.toString()}
              /> */}
          {/* <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}> */}
          {/* <ScrollView style={{marginTop: -1}}> */}




          {/* <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row
                  data={this.state.tableHead}
                  style={{height: 50, backgroundColor: '#537791'}}
                  textStyle={{textAlign: 'center', fontWeight: '100'}}
                />
                {this.state.cmpData.map((rowData, index) => (
                  <TableWrapper
                    key={index}
                    style={{flexDirection: 'row'}}
                    widthArr={this.state.widthArr}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex === 6
                            ? this.element(cellData, index)
                            : cellData
                        }
                        textStyle={{margin: 6}}
                        widthArr={this.state.widthArr}
                      />
                    ))}
                  </TableWrapper>
                ))}
              </Table> */}


          <FlatList
            data={this.state.cmpData}
            renderItem={this.renderlog}
            keyExtractor={(item, id) => id.toString()}
          />

          {/* <Text style={{color: '#f55656', fontWeight: '800', alignSelf: 'center', fontSize: 26, marginTop: '60%', marginBottom: 10}}>
          
             </Text> */}

          {/* </ScrollView> */}
          {/* </View> */}
          {/* </ScrollView> */}
          {/* </ScrollView> */}
        </ImageBackground>
      </Container>

    );
  }
}

export default View_campaign;
