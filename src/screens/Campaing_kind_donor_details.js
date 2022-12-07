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


class Campaing_kind_donor_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmpData: [],
      capmain_details: {},
      tableHead: ['Donor Name', 'Date', 'Amount', 'Status'],
      camp_id: props.route.params?.item,
      isloading: false,
      amount: 0,
      modalComment: false,
      isVisible: false,
      shareHeight: 360,
      donor_details: {},
      raiseQueryString: '',
      maxLengthh1: 5000,
      descriptionString: '',
      donation_status:''
    };
  }
  campaign = async () => {

    var formdata = new FormData();
    formdata.append('donation_number', this.props.route.params?.item?.donation_number);

    var response = await API.postWithFormData('view_kind_donation_details', formdata);
    if (response.status == 'success') {
      // navigation.navigate('OtpVerify', {mobile: Mobile});
      console.log('response.===data: ', response.data);
      console.log('donation_status ', response.data.donation_details[0].donation_status);
      // var base64String = response.data.capmain_details[0]['campaign_image']
      // var base64Icon = 'data:image/png;base64,' + base64String
      this.setState({
        donation_status:response?.data?.donation_details?.donation_status,
        cmpData: response?.data?.donation_details,
        capmain_details: response?.data?.campaign_details,
        donor_details: response?.data?.donor_details,
        isloading: false,
      });

    } else {
      this.setState({
        isloading: false,
      });
      Alert.alert(response.status, response.message);
    }
  };
  componentDidMount() {
    this.campaign();
    console.log('campaign', this.props.route.params?.item);
  }


  renderItem = ({ item, index }) => (

    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 0 }}>
        <View style={{ flexDirection: 'column', width: '40%', marginRight: '2%' }}>
          <Text style={{ marginBottom: 5, color: 'black' }}>Item Name</Text>
          <TextInput
            key={index}
            style={{ borderWidth: .5, color: 'black', borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4 }}
            value={item?.item_name}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'column', width: '28%', marginRight: '2%' }}>
          <Text style={{ marginBottom: 5, color: 'black', color: 'black' }}>Quantity</Text>
          <TextInput
            key={index}
            style={{ borderWidth: .5, borderColor: '#f55656', color: 'black', height: 40, paddingLeft: 4, borderRadius: 4 }}
            value={item?.item_quantity}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'column', width: '28%', marginRight: '2%' }}>
          <Text style={{ marginBottom: 5, fontSize: 12, marginTop: 2, color: 'black' }}>Donate Qty </Text>
          <TextInput
            key={index}
            keyboardType='decimal-pad'
            style={{ borderWidth: 1.5, borderColor: '#f55656', height: 40, color: 'black', paddingLeft: 4, borderRadius: 4 }}
            value={item?.donated_quantity}
            editable={false}
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
          </SafeAreaView>

          <ScrollView style={Styles.dashboard_main_contain}>
            <View style={Styles.campaign_details_contain}>

              {/* <View style={{ marginLeft: 0, marginRight: 0, borderRadius: 4, backgroundColor: 'null', marginTop: -16 }}>
                <Image style={{

                  resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 4, width: '100%',
                }}
                  source={{ uri: this.state }}
                // source={require('../../src/assets/images/daatar_banner.jpg')}
                >
                </Image>
              </View> */}

              <View style={{ alignSelf: 'center', marginTop: 3 }}>
                <Text style={Styles.campaign_text_font1}>
                  Compaign:{' '} {this.state.capmain_details?.campaign_name}
                </Text>
                <Text style={Styles.campaign_text_font1}>
                  Item:{' '} {this.state.capmain_details?.item}
                </Text>
              </View>

              <View>
                <Text style={Styles.sub_text_font1}>
                  Donor Name:{' '}
                  {this.state.donor_details?.donor_name}
                </Text>
                <Text style={Styles.sub_text_font1}>
                  Donor Email:{' '}
                  {this.state.donor_details?.donor_email}
                </Text>
                <Text style={Styles.sub_text_font1}>
                  Donor Phone:{' '}
                  {this.state.donor_details?.donor_phone}
                </Text>

              </View>
              <View style={{ flexDirection: 'column' }}>
              
              <View style={{ flexDirection: 'row',marginTop: 15 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',

                  marginStart: 20,
                  fontWeight: 'bold',
                  marginEnd: 20,
                }}>
                  Unit List
                </Text>
                {this.state.cmpData[0]?.donation_status =="1" ? <View style={{ borderRadius:10,borderColor:'black',borderWidth:1, marginLeft:92,justifyContent: 'flex-end',backgroundColor: 'green', width: 100, height: 32,alignContent:'center' }}>
                <Text style={{ fontSize: 18,color: 'white',textAlign:'center',textAlignVertical:'center',marginBottom:6}}>
                  Completed
                </Text>
                </View> :
                <View style={{ borderRadius:10,borderColor:'black',borderWidth:1,marginLeft:92,justifyContent: 'flex-end',backgroundColor: 'yellow', width: 100, height: 32,alignContent:'center' }}>
                <Text style={{ fontSize: 18,color: 'black',textAlign:'center',textAlignVertical:'center',marginBottom:6}}>
                  Pending
                </Text>
                </View>}
                </View>

                <FlatList
                  data={this.state.cmpData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item, index) => this.renderItem(item, index)}
                />
               


              </View>
            </View>

          </ScrollView>
        </ImageBackground>


      </Container>
    );
  }
}

export default Campaing_kind_donor_details;
