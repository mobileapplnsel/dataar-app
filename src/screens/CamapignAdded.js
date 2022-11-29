import React, { Component } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native';
import {
  Container,
  Card,
  CardItem,
  
  // TextInput,
} from 'native-base';
import API from '../services/api';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
var Styles = require('../assets/files/Styles');
class Search_screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPayload: props.route.params.dataPayload,
      pdfurl: '',
      user_id: props.route.params.user_id,
      campaign_name: props.route.params.campaign_name,
      donation_mode: props.route.params.donation_mode,
      campaign_details: props.route.params.campaign_details,
      campaign_start_date: props.route.params.campaign_start_date,
      campaign_end_date: props.route.params.campaign_end_date,
      campaign_image_source: props.route.params.campaign_image_source,
      campaign_image_name: props.route.params.campaign_image_name,
      campaign_image_type: props.route.params.campaign_image_type,
      campaign_target_amount: props.route.params.campaign_target_amount,
      kind_id: props.route.params.kind_id,
      filter_by_type: props.route.params.filter_by_type,
      zip: props.route.params.zip,
      campaign_target_qty: props.route.params.campaign_target_qty,
      supported_doc_source: props.route.params.supported_doc_source,
      supported_doc_name: props.route.params.supported_doc_name,
      supported_doc_type: props.route.params.supported_doc_type,

    };
  }
  getReciptPDFUrl = async () => {
   
    var logs = {
      donation_id: this.state.donation_id,
    };
      console.log(logs);
      var response = await API.post('my_donation_pdf', logs);
      console.log(response);
      if (response.status == 'success') 
      {
        this.setState({ pdfurl: response.filepath })
      } 
      else 
      {
        Alert.alert(response.status, response.message);
      }
    
  };
  componentDidMount() {
    
    console.log('data payload is: ', this.state.dataPayload) 

      this.Start_CampaignNow()

    }
    Start_CampaignNow = async () => {
      var formdata = new FormData();
      formdata.append('user_id', '110');
      formdata.append('campaign_name', 'Title');
    formdata.append('donation_mode', selCamp);
    formdata.append('campaign_details', Description);
    formdata.append('campaign_start_date', strdate);
    formdata.append('campaign_end_date', endseldate);
    formdata.append('campaign_image', {uri: selectedCampaignImageSource, name: selectedCampaignImage, type: selectedCampaignImageType});
    formdata.append('campaign_target_amount', amount);
    formdata.append('kind_id', selectedValue);
    formdata.append('filter_by_type', selectID);
    formdata.append('zip', pincode);
    formdata.append('campaign_target_qty', quantity);
    formdata.append('supported_doc', {uri: selectedPANSource, name: selectedPANName, type: selectedPANType});
  
      console.log('Start campaign parameters: ', JSON.stringify(formdata))
  
    
    //     })
  
       var response = await API.postWithFormData('add_campaign', formdata);
  
       console.log('Start campaign response: ', response)
  
      if (response.status == 'success') {
      //  navigation.navigate('Dashboard');
        Alert.alert(response.status, response.message);
      } else {
        Alert.alert(response.status, response.message);
      //  navigation.navigate('Dashboard');
      }
    };
    Start_CampaignNow1 = async () => {

      // var formdata = new FormData();
      // formdata.append('user_id', this.state.user_id);
      // formdata.append('campaign_name', this.state.campaign_name);
      // formdata.append('donation_mode', this.state.donation_mode);
      // formdata.append('campaign_details', this.state.campaign_details);
      // formdata.append('campaign_start_date', this.state.campaign_start_date);
      // formdata.append('campaign_end_date', this.state.campaign_end_date);
      // formdata.append('campaign_image', {uri: this.state.campaign_image_source, name: this.state.campaign_image_name, type: this.state.campaign_image_type});
      // formdata.append('campaign_target_amount', '33');
      // formdata.append('kind_id', this.state.kind_id);
      // formdata.append('filter_by_type', this.state.filter_by_type);
      // formdata.append('zip', this.state.zip);
      // formdata.append('campaign_target_qty', this.state.campaign_target_qty);
      // formdata.append('supported_doc', {uri: this.state.campaign_image_source, name: this.state.campaign_image_name, type: this.state.campaign_image_type});
      


      var formdata1 = new FormData();
    formdata1.append('user_id', '110');
    formdata1.append('campaign_name', 'Title');
    formdata1.append('donation_mode', '1');
    formdata1.append('campaign_details', 'Description');
    formdata1.append('campaign_start_date', '2022-02-28T04:56:57.212Z');
    formdata1.append('campaign_end_date', '2023-02-28T04:56:00.000Z');
    formdata1.append('campaign_image', {uri: 'content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2FScreenshot%202021-12-29%20at%2010.02.03%20AM.png', name: 'Screenshot 2021-12-29 at 10.02.03 AM.png', type: 'image/png'});
    formdata1.append('campaign_target_amount', '');
    formdata1.append('kind_id', '2');
    formdata1.append('filter_by_type', '2');
    formdata1.append('zip', '32423423');
    formdata1.append('campaign_target_qty', '321');
    formdata1.append('supported_doc', {uri: 'content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2FScreenshot%202021-12-29%20at%2010.02.03%20AM.png', name: 'Screenshot 2021-12-29 at 10.02.03 AM.png', type: 'image/png'});

      console.log('Start campaign parameters11122: ', JSON.stringify(formdata1))

      var response = await API.postWithFormData('add_campaign', formdata);

      console.log('Start campaign response: ', response)
  
      if (response.status == 'success') {
      //  navigation.navigate('Dashboard');
        Alert.alert(response.status, response.message);
      } else {
        Alert.alert(response.status, response.message);
      //  navigation.navigate('Dashboard');
      }
    };
    
  render() {
    return (
      <ScrollView>
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.donation_main}>
          

          <Text style={{color: '#f55656', fontWeight: '800', alignSelf: 'center', fontSize: 26, marginTop: '60%', marginBottom: 10}}>
          Thank you for your Donation!
             </Text>

             <TouchableOpacity onPress={() => this._onPressButton()}>
             <Text style={{
                    fontSize: 15,
                    fontWeight: '500',
                    marginTop: 0,
                    alignSelf: 'center',
                    fontStyle: 'italic',
                    textDecorationLine: 'underline',
                    marginBottom: 40
                  }}>
                    Click to download your recipt and thank you letter
                  </Text>
                  </TouchableOpacity>

          <TouchableOpacity
                style={Styles.donate_btn}
                onPress={() => this.props.navigation.navigate('Dashboard_donation_forDonor')}>
                <Text style={Styles.login_text}>Back</Text>
              </TouchableOpacity>
         
        </ImageBackground>
      </Container>
    </ScrollView>
    );
  }
}

export default Search_screen;
