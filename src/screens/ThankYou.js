import React, { Component } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, PermissionsAndroid } from 'react-native';
import {
  Container,
  Card,
  CardItem,
  // TextInput,
} from 'native-base';
import API from '../services/api';
import RNFetchBlob from 'rn-fetch-blob';
var Styles = require('../assets/files/Styles');
class Search_screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donation_id: props.route.params.donation_id,
      pdfurl: ''
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
    
     
      this.getReciptPDFUrl();

    }
    _onPressButton = async () => 
    {
           try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.actualDownload();
            } else {
              Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
            }
          } catch (err) {
            console.warn(err);
          }  
    }
    actualDownload = () => {
      const { dirs } = RNFetchBlob.fs;
     RNFetchBlob.config({
       fileCache: true,
       addAndroidDownloads: {
       useDownloadManager: true,
       notification: true,
       mediaScannable: true,
       title: `Recipt_And_Thank_You_Letter.pdf`,
       path: `${dirs.DownloadDir}/test.pdf`,
       },
     })
       .fetch('GET', this.state.pdfurl, {})
       .then((res) => {
         console.log('The file saved to ', res.path());
       })
       .catch((e) => {
         console.log(e)
       });
   }
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
                    Please download your recipt and thank you letter
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
