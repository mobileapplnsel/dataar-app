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

      if (Platform.OS === 'ios')
      {
        this.actualDownload()
      }
      else
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

      
    }
    actualDownload = () => {
      const { dirs } = RNFetchBlob.fs;
      // if (Platform.OS === 'ios')
      // {
      //   RNFetchBlob.config({
      //     fileCache: true,
      //     addAndroidDownloads: {
      //     useDownloadManager: true,
      //     notification: true,
      //     mediaScannable: true,
      //     title: `Recipt_And_Thank_You_Letter.pdf`,
      //     path: `${dirs.DocumentDir}/test.pdf`,
      //     },
      //   })
      //     .fetch('GET', this.state.pdfurl, {})
      //     .then((res) => {
      //      Toast.show('The file saved to'+res.path(), Toast.LONG)
      //       console.log('The file saved to ', res.path());
      //     })
      //     .catch((e) => {
      //       console.log(e)
      //     });
      // }
      if (Platform.OS === 'ios')
    {
      const { dirs } = RNFetchBlob.fs;
      const dirToSave = dirs.DocumentDir

      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `Recipt_And_Thank_You_Letter.pdf`,
        path: `${dirToSave}/${`Recipt_And_Thank_You_Letter.pdf`}`,
    }
    const configOptions = Platform.select({
      ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: 'pdf',
      },
      android: configfb,
  });

  console.log('The file saved to 23233', configfb, dirs);

  RNFetchBlob.config(configOptions)
            .fetch('GET', this.state.pdfurl, {})
            .then((res) => {
                if (Platform.OS === "ios") {
this.setState({
        progress: false,
      })
                    RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                    // RNFetchBlob.ios.previewDocument(configfb.path);
   RNFetchBlob.ios.openDocument(res.data)
         Toast.show('The file saved to '+res.path(),  Toast.LONG)
          console.log('The file saved to ', res.path());
                }
                
                console.log('The file saved to ', res);
            })
            .catch((e) => {
              this.setState({
                progress: false,
              })
                console.log('The file saved to ERROR', e.message)
            });
    


      // RNFetchBlob.config({
      //   fileCache: true,
      //   addAndroidDownloads: {
      //   useDownloadManager: true,
      //   notification: true,
      //   mediaScannable: true,
      //   title: `Recipt_And_Thank_You_Letter.pdf`,
      //   path: `${dirs.DocumentDir}/test.pdf`,
      //   },
      // })
      //   .fetch('GET', pdfurl, {})
      //   .then((res) => {
      //    this.setState({
      //      progress: false,
      //    })
      //    RNFetchBlob.ios.openDocument(res.data)
      //    Toast.show('The file saved to '+res.path(),  Toast.LONG)
      //     console.log('The file saved to ', res.path());
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //   });
    }
      else
      {
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
           Toast.show('The file saved to'+res.path(), Toast.LONG)
            console.log('The file saved to ', res.path());
          })
          .catch((e) => {
            console.log(e)
          });
      }

     
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
