import React, {Component} from 'react';
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
  StyleSheet,
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
var Styles = require('../assets/files/Styles');
import RNFetchBlob from 'rn-fetch-blob';
import Feather from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';

var pdfpath
var pdffile
var filename1 = 'Upload your Pan'
var filename2 = 'Upload your address proof'


class User_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kyc: false,
      selectedValue:'',
      selectedPANName:'Upload your Pan',
      selectedPANSource:'',
      filebaseString:'',
      selectedID:'',
      selectedKYCNumber:'',
      selectedIDName:'Upload your address proof',
      selectedIDSource:'',
      imagebaseString:'',

    };
  }
  
  async componentDidMount() {
   
  }

selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      
               
      
      //Printing the log realted to the file
      
      console.log('res : ' + JSON.stringify(res));
      console.log('URi : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      pdfpath = res.uri
      filename1 = res.name
     this.setState({selectedPANName:res.name});
     this.setState({selectedPANSource:res.uri});
     
       RNFetchBlob.fs
          .readFile(res.uri, 'base64')
          .then((data) => {
            this.setState({filebaseString:data})
            console.log('base : ' +data);
           })
          .catch((err) => { console.log('err : ' +err);});
       
       
      //Setting the state to show single file attributes
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };


  selectOneFile1 = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

         

      //Printing the log realted to the file
    
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      pdfpath = res.uri
      filename1 = res.name
      this.setState({selectedIDName:res.name});
      this.setState({selectedIDSource:res.uri}); 
       RNFetchBlob.fs
          .readFile(res.uri, 'base64')
          .then((data) => {
            this.setState({imagebaseString:data})
            console.log('base1 : ' +data);
           })
          .catch((err) => { console.log('err : ' +err);});
       
      //Setting the state to show single file attributes
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  
    
  };




  submit = async () => {
    var formdata = new FormData();
    var user_id = await AsyncStorage.getItem('user_id');
    
    console.log(user_id);
     console.log( this.state.selectedID);
   
    
      
   
  
   if (this.state.selectedPANSource == '') {
    Alert.alert('Pan', 'Please upload your Pan');
  } else if (this.state.selectedIDSource == '') {
    Alert.alert('ID', 'Please upload your ID proof');
  }
  else if (this.state.selectedIDSource == '') {
    Alert.alert('ID', 'Please upload your ID proof');
  }
  else if (this.state.selectedPANNumber== '') {
    Alert.alert('pan', 'Please upload your pan number');
  }
  else if (this.state.selectedKYCNumber== '') {
    Alert.alert('kyc', 'Please upload your kyc number');
  }
  
     else {
      var logs = {
        user_id: user_id,
        kycfile_type: 'base64',
        kyc_file: this.state.filebaseString,
        pan_number: this.state.selectedPANNumber,
        address_proof_type: this.state.selectedID,
        address_proof_number: this.state.selectedKYCNumber,
        kyc_address_file: this.state.imagebaseString,
        donee_type: '',
        trust_certificate_file: '',
        website_link: '',
        };
      // formdata.append('firstname', FirstName);
      // formdata.append('lastname', LastName);
      // formdata.append('email', Email);
      // formdata.append('phone', Mobile);
      // formdata.append('password', password);
      // formdata.append('usertype', Otp);
    
  
  
      var response = await API.post('update_kyc', logs);
      if (response.status == 'success') {
  
        // need to add kyc uploadation function here
        Alert.alert('success', 'Successfully Updated');
       
      } else {
        Alert.alert(response.status, response.message);
      }
    }
  };
  

  

  render() {
    return (
      <Container>
        <ScrollView>
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
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                    }}
                    source={require('../../src/assets/images/back.png')}
                  />
                </TouchableOpacity>

                <Text style={{ fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    KYC Update
                  </Text>
                
              </View>
              </View>
             
              <View style ={{marginTop: 25, marginBottom:20,marginLeft:20,marginRight:20}}>
              <TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle}
          onPress={this.selectOneFile}>
          <Text style={{marginRight: 10, fontSize: 17}}>
            {this.state.selectedPANName}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
        </TouchableOpacity>
       

        <Text style={Styles1.warningHint}>{'Only PDF or Image format is acceptable'}</Text>

        
        <TextInput
              placeholder="Pan Number"
              placeholderTextColor="#000"
              onChangeText={text => this.setState({selectedPANNumber:text})}
              style={Styles.login_text_input}
              keyboardType="default"

            />
                             

<Picker

selectedValue={this.state.selectedID}
style={{
  height: 50,
  width: '100%',
  borderColor: '#000',
  alignSelf: 'center',
  borderWidth: 1,
  marginTop: 7,
}}
onValueChange={
  (itemValue, itemIndex) => this.setState({selectedID:itemValue})
  // console.log(itemValue)
  // Alert.alert(itemValue)
}>
<Picker.Item label="Select Address Proof" value="" />
<Picker.Item label="Aadhaar Card" value="0" />
<Picker.Item label="Voter Card" value="1" />
<Picker.Item label="Passport" value="2" />
<Picker.Item label="Driving License" value="3" />
</Picker>

<TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle}
          onPress={this.selectOneFile1}>
          <Text style={{marginRight: 10, fontSize: 17}}>
            {this.state.selectedIDName}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
        </TouchableOpacity> 
        <Text style={Styles1.warningHint}>{'Only image format is acceptable'}</Text>

        <TextInput
              placeholder="Address Proof Number"
              placeholderTextColor="#000"
              onChangeText={text => this.setState({selectedKYCNumber:text})}
              style={Styles.login_text_input}
              keyboardType="default"
            />
  
        </View>


       
           
            
            
            
            {/* </View> */}
        
          <View style={{flex:1,justifyContent: 'space-between',marginTop:'60%'}}>
           <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => this.submit()}>
              <Text style={Styles.login_text}>SUBMIT</Text>
            </TouchableOpacity>
           </View>
           </ImageBackground>
        </ScrollView>
      </Container>
    );
  }
}




const Styles1 = StyleSheet.create({
  errorHint: {
    marginTop: 3,
    color: 'red',
    fontSize: 11,
    marginBottom: -5,
    marginLeft: 10,
},
  warningHint: {
  marginTop: -5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
},
buttonStyle: {
  alignItems: 'center',
  flexDirection: 'row',
  //backgroundColor: '#DDDDDD',
  padding: 10,
},
imageIconStyle: {
  height: 20,
  width: 20,
  resizeMode: 'stretch',
},
 bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
})


export default User_profile;
