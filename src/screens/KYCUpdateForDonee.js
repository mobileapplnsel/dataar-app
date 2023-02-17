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
  StyleSheet,
  FlatList,
  Animated,
  ActionSheetIOS,
  Platform,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import API from '../services/api';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-picker/picker';
import RNFetchBlob from 'rn-fetch-blob';
var Styles = require('../assets/files/Styles');
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import Selector from '../components/Selector';
import PickerDob from '../components/Picker';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import cameraIcon from '../../src/assets/images/outline_photo_camera_black_48.png';
import GalleryIcon from '../../src/assets/images/outline_collections_black_48.png';
import DocumentIcon from '../../src/assets/images/outline_description_black_48.png';
import KeyboardManager from 'react-native-keyboard-manager';
var pdfpath
var pdffile
var filename1 = 'Upload your Pan'
var filename2 = 'Upload your address proof'

class User_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kyc: false,
      selectedsecondValue:'Donee Type',
      selectedsecondValue1:'Select Donee Type',
      selectedValue:'',
      selectedPANName:'Upload your Pan *',
      selectedPANNumber: '',
      selectedPANSource:'',
      selectedPANType:'',
      filebaseString:'',
      selectedID:'Address proof',
      selectedKYCNumber:'',
      selectedIDName: 'Upload your address proof *',
      selectedIDSource: '',
      selectedIDType: '',
      imagebaseString:'',
      websiteLink:'',
      selectedTrustFileName:'Upload 80G/Trust Certificate',
      certificateTrustFileName:'',
      selectedTrustFileSource:'',
      selectedTrustFileType:'',
      progress: false,
      showPANCardImagePicker: false,
      showAddCardImagePicker: false,
      show80GCardImagePicker: false,
      showBanksImagePicker: false,
      selectedImagePickerType: '',

      selectedBankSFileName:'Upload your bank statement *',
      selectedBankSFileSource:'',
      selectedBankSFileType:'',
      ArrImagePicker: [{"name": "Take Photo", 'image': cameraIcon}, { "name": "Choose Photo", 'image': GalleryIcon}, { "name": "Select Document", 'image': DocumentIcon}],

      
       };
  }
  
  async componentDidMount() {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }
  }
   requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

   requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

   captureImage = async (type) => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
       quality: 1,
      // videoQuality: 'low',
      // durationLimit: 30, //Video max duration in seconds
      //  saveToPhotos: true,
    };
    let isCameraPermitted = await this.requestCameraPermission();
    let isStoragePermitted = await this.requestExternalWritePermission();
    console.log('isCameraPermitted', isCameraPermitted)
    console.log('isStoragePermitted', isStoragePermitted)
    if (isCameraPermitted && isStoragePermitted) {
      
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          // alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        console.log("this.state.selectedImagePickerType: ", this.state.selectedImagePickerType)

        if (this.state.selectedImagePickerType == 'PAN')
        {
          this.setState({selectedPANName: response.assets['0']['fileName']});
     this.setState({selectedPANSource: response.assets['0']['uri']});
     this.setState({selectedPANType: response.assets['0']['type']});
        }
        else  if (this.state.selectedImagePickerType == 'ID')
        {
          this.setState({selectedIDName: response.assets['0']['fileName']});
          this.setState({selectedIDSource:response.assets['0']['uri']}); 
          this.setState({selectedIDType: response.assets['0']['type']}); 
        }
        else if (this.state.selectedImagePickerType == 'Bank')
        {
          this.setState({selectedBankSFileName: response.assets['0']['fileName']});
          this.setState({selectedBankSFileSource:response.assets['0']['uri']}); 
          this.setState({selectedBankSFileType: response.assets['0']['type']}); 
        }
        else
        {
          this.setState({selectedTrustFileName: response.assets['0']['fileName']});
          this.setState({selectedTrustFileSource: response.assets['0']['uri']}); 
          this.setState({selectedTrustFileType: response.assets['0']['type']}); 
        }


        
      });
    }
  };
  
   chooseFile = async (fileType) => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
if (fileType == 'Pan')
{
  this.setState({selectedPANName: response.assets['0']['fileName']});
  this.setState({selectedPANSource: response.assets['0']['uri']});
  this.setState({selectedPANType: response.assets['0']['type']});
}
else if (fileType == 'Address')
{
  this.setState({selectedIDName: response.assets['0']['fileName']});
  this.setState({selectedIDSource: response.assets['0']['uri']});
  this.setState({selectedIDType: response.assets['0']['type']});
}
else if (fileType == 'Bank')
{
  this.setState({selectedBankSFileName: response.assets['0']['fileName']});
  this.setState({selectedBankSFileSource: response.assets['0']['uri']});
  this.setState({selectedBankSFileType: response.assets['0']['type']});
}
else
{
  this.setState({selectedTrustFileName: response.assets['0']['fileName']});
  this.setState({selectedTrustFileSource: response.assets['0']['uri']});
  this.setState({selectedTrustFileType: response.assets['0']['type']});
}


      // setselectedCampaignImage(response.assets['0']['fileName']);
      // setselectedCampaignImageSource(response.assets['0']['uri']);
      // setselectedCampaignImageType(response.assets['0']['type']);


      
    });
  };
  
  
   selectOneFileForAndroid = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

  
     
      setselectedCampaignImage(res.name);
      setselectedCampaignImageSource(res.uri);
      setselectedCampaignImageType(res.type);
      
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };


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
      
      console.log('res1 : ' + JSON.stringify(res));
      console.log('URi1 : ' + res.uri);
      console.log('Type1 : ' + res.type);
      console.log('File Name1 : ' + res.name);
      console.log('File Size1 : ' + res.size);
      pdfpath = res.uri
      filename1 = res.name
     this.setState({selectedPANName:res.name});
     this.setState({selectedPANSource:res.uri});
     this.setState({selectedPANType:res.type});
     this.setState({showPANCardImagePicker:false});
      
      //  RNFetchBlob.fs
      //     .readFile(res.uri, 'base64')
      //     .then((data) => {
      //       this.setState({filebaseString:data})
      //       console.log('base : ' +data);
      //      })
      //     .catch((err) => { console.log('err : ' +err);});
       
       
      //Setting the state to show single file attributes
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  selectOneFileForBankS = async () => {
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
      
      console.log('res1 : ' + JSON.stringify(res));
      console.log('URi1 : ' + res.uri);
      console.log('Type1 : ' + res.type);
      console.log('File Name1 : ' + res.name);
      console.log('File Size1 : ' + res.size);
      pdfpath = res.uri
      filename1 = res.name
     this.setState({selectedBankSFileName:res.name});
     this.setState({selectedBankSFileSource:res.uri});
     this.setState({selectedBankSFileType:res.type});
     this.setState({showBanksImagePicker:false});
      
      //  RNFetchBlob.fs
      //     .readFile(res.uri, 'base64')
      //     .then((data) => {
      //       this.setState({filebaseString:data})
      //       console.log('base : ' +data);
      //      })
      //     .catch((err) => { console.log('err : ' +err);});
       
       
      //Setting the state to show single file attributes
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
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
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      pdfpath = res.uri
      filename1 = res.name
      this.setState({selectedIDName:res.name});
      this.setState({selectedIDSource:res.uri}); 
      this.setState({selectedIDType: res.type}); 
      this.setState({showAddCardImagePicker: false}); 

      
     
      //  RNFetchBlob.fs
      //     .readFile(res.uri, 'base64')
      //     .then((data) => {
      //       this.setState({imagebaseString:data})
      //       console.log('base1 : ' +data);
      //      })
      //     .catch((err) => { console.log('err : ' +err);});
       
      //Setting the state to show single file attributes
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  
    
  };



  selectTrustCertiFile = async () => {
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
     this.setState({selectedTrustFileName:res.name});
      this.setState({selectedTrustFileSource:res.uri});
      this.setState({selectedTrustFileType:res.type});
      this.setState({show80GCardImagePicker: false});
     
      //  RNFetchBlob.fs
      //     .readFile(res.uri, 'base64')
      //     .then((data) => {
      //      this.setState({certificateTrustFileName:data}) 
      //       console.log('base : ' +data);
      //      })
      //     .catch((err) => { console.log('err : ' +err);});
       
       
      //Setting the state to show single file attributes
     
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
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
     console.log( this.state.selectedsecondValue);
     console.log(this.state.websiteLink)


     if (this.state.selectedsecondValue == "Donee Type")
      {
        Alert.alert('What personality type do you belong to ?', 'Please select a type');
      }
      else
      {
      if (this.state.selectedsecondValue == "1")
      {
        if (this.state.selectedPANSource == '') {
          Alert.alert('Pan card file', 'Please upload your Pan');
        } 
        else if (this.state.selectedPANNumber== '') {
          Alert.alert('Pan Number', 'Please enter your pan number');
        }
        else if (this.state.selectedIDSource == '') {
          Alert.alert('ID card file', 'Please upload your address proof ');
        }
       
        else if (this.state.selectedID== 'Address proof' || this.state.selectedID == 'Select Address Proof *') {
          Alert.alert('Address proof Type', 'Please select address proof type');
        }
        else if(this.state.selectedBankSFileName == 'Upload your bank statement *')
        {
          Alert.alert('Bank Statement', 'Please upload your Bank Statement');
        }
        // else if (this.state.selectedTrustFileSource== '') {
        //   Alert.alert('kyc', 'Please upload your TrustCertificate');
        // }
        // else if (this.state.websiteLink== '') {
        //   Alert.alert('kyc', 'Please upload your websiteLink');
        // } 
      
         else {
          // var logs = {
          //   user_id: user_id,
          //   kycfile_type: 'base64',
          //   kyc_file: this.state.selectedPANSource,
          //   pan_number: this.state.selectedPANNumber,
          //   address_proof_type: this.state.selectedID,
          //   address_proof_number: this.state.selectedKYCNumber,
          //   kyc_address_file: this.state.selectedIDSource,
          //   donee_type: this.state.selectedsecondValue,
          //   trust_certificate_file: this.state.selectedTrustFileSource,
          //   website_link: this.state.websiteLink,
          //   };
    this.setState({progress: true})
            formdata.append('user_id', user_id);
            formdata.append('kycfile_type', 'base64');
            formdata.append('kyc_file', {uri: this.state.selectedPANSource, name: this.state.selectedPANName, type: this.state.selectedPANType});
            formdata.append('pan_number', this.state.selectedPANNumber);
            formdata.append('address_proof_type', this.state.selectedID);
            formdata.append('address_proof_number', this.state.selectedKYCNumber);
            formdata.append('kyc_address_file', {uri: this.state.selectedIDSource, name: this.state.selectedIDName, type: this.state.selectedIDType});
            formdata.append('back_details_file', {uri: this.state.selectedBankSFileSource, name: this.state.selectedBankSFileName, type: this.state.selectedBankSFileType});
            formdata.append('donee_type', this.state.selectedsecondValue);
            

            if (this.state.selectedTrustFileSource == '')
            {
              formdata.append('trust_certificate_file', '');
            }
            else
            {
              formdata.append('trust_certificate_file', {uri: this.state.selectedTrustFileSource, name: this.state.selectedTrustFileName, type: this.state.selectedTrustFileType});
            }
            
            formdata.append('website_link', this.state.websiteLink);

            console.log('formdata: ', formdata)
        
    
    
          var response = await API.postWithFormData('update_kyc', formdata);
          if (response.status == 'success') {
            this.setState({progress: false})
            // need to add kyc uploadation function here
            Alert.alert('Thank you for submitting your KYC. It is currently under review. We will let you know once your KYC gets approved.', [
              {text: 'OK', onPress: () => this.props.navigation.navigate('Dashboard')},
            ],
            {cancelable: false},);
           
          } else {
            this.setState({progress: false})
            Alert.alert("KYC not submitted");
          }
        }
      }
      else
      {
        if (this.state.selectedPANSource == '') {
          Alert.alert('Pan card file', 'Please upload your Pan');
        } 
        else if (this.state.selectedPANNumber== '') {
          Alert.alert('Pan Number', 'Please enter your pan number');
        }
        else if (this.state.selectedIDSource == '') {
          Alert.alert('ID card file', 'Please upload your address proof ');
        }
       
        else if (this.state.selectedID== 'Address proof' || this.state.selectedID == 'Select Address Proof *') {
          Alert.alert('Address type', 'Please select address proof type');
        }
        else if(this.state.selectedBankSFileName == 'Upload your bank statement *')
        {
          Alert.alert('Bank Statement', 'Please upload your Bank Statement');
        }      
         else {
          // var logs = {
          //   user_id: user_id,
          //   kycfile_type: 'base64',
          //   kyc_file: this.state.selectedPANSource,
          //   pan_number: this.state.selectedPANNumber,
          //   address_proof_type: this.state.selectedID,
          //   address_proof_number: this.state.selectedKYCNumber,
          //   kyc_address_file: this.state.selectedIDSource,
          //   donee_type: this.state.selectedsecondValue,
          //   trust_certificate_file: this.state.selectedTrustFileSource,
          //   website_link: this.state.websiteLink,
          //   };
          this.setState({progress: true})
            formdata.append('user_id', user_id);
            formdata.append('kycfile_type', 'base64');
            formdata.append('kyc_file', {uri: this.state.selectedPANSource, name: this.state.selectedPANName, type: this.state.selectedPANType});
            formdata.append('pan_number', this.state.selectedPANNumber);
            formdata.append('address_proof_type', this.state.selectedID);
            formdata.append('address_proof_number', this.state.selectedKYCNumber);
            formdata.append('kyc_address_file', {uri: this.state.selectedIDSource, name: this.state.selectedIDName, type: this.state.selectedIDType});
            formdata.append('back_details_file', {uri: this.state.selectedBankSFileSource, name: this.state.selectedBankSFileName, type: this.state.selectedBankSFileType});
            formdata.append('donee_type', this.state.selectedsecondValue);
            formdata.append('trust_certificate_file', '');
            formdata.append('website_link', '');
        
    
    
          var response = await API.postWithFormData('update_kyc', formdata);
          if (response.status == 'success') {
            this.setState({progress: false})
            // need to add kyc uploadation function here
            Alert.alert('Thank you for submitting your KYC. It is currently under review. We will let you know once your KYC gets approved.', [
              {text: 'OK', onPress: () => this.props.navigation.navigate('Dashboard')},
            ],
            {cancelable: false},);
           
          } else {
            this.setState({progress: false})
            Alert.alert("KYC not submitted");
          }
        }
      }
   

    }
     
  };

  ActionSheetIOSonPressToSelectDoneeType = () =>
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Individual", "Organization", "Cancel"],
       destructiveButtonIndex: 2,
       title: 'Select One',
      cancelButtonIndex: 2,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === 0) {

        this.setState({selectedsecondValue: '0', selectedsecondValue1: 'Individual'})
        
      } else if (buttonIndex === 1) {

        this.setState({selectedsecondValue: '1', selectedsecondValue1: 'Organization'})

      } 
       else {
        // setResult("🔮");
      }
    }
  );

  ActionSheetIOSonPress = () =>
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Aadhaar Card", "Voter Card", "Passport", "Driving License", "Others", "Cancel"],
       destructiveButtonIndex: 5,
       title: 'Select Address Proof',
      cancelButtonIndex: 5,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === 0) {

        this.setState({selectedID: 'Aadhaar Card'})
        
      } else if (buttonIndex === 1) {

        this.setState({selectedID: 'Voter Card'})

      } else if (buttonIndex === 2) {

        this.setState({selectedID: 'Passport'})
      }
      else if (buttonIndex === 3) {

        this.setState({selectedID: 'Driving License'})

      } else if (buttonIndex === 4) {

       this.setState({selectedID: 'Others'})
      }
       else {
        // setResult("🔮");
      }
    }
  );
  ActionSheetIOSonPress1 = () =>
  ActionSheetIOS.showActionSheetWithOptions(
    {  
      options: ["Bank Statement ", "ITR Acknowlegement ", "Utility Bill ", "Cancel"],
       destructiveButtonIndex: 3,
       title: 'Select Address Proof',
      cancelButtonIndex: 3,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === 0) {

        this.setState({selectedID: 'Bank Statement'})
        
      } else if (buttonIndex === 1) {

        this.setState({selectedID: 'ITR Acknowlegement'})

      } else if (buttonIndex === 2) {

        this.setState({selectedID: 'Utility Bill'})
      }
       else {
        // setResult("🔮");
      }
    }
  );

  render() {
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
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                    }}
                    source={require('../../src/assets/images/back.png')}
                  />
                </TouchableOpacity>

                <Text style={{marginLeft: 24, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    KYC Update
                  </Text>
                </View>
                


             </SafeAreaView>
             <ScrollView>
             <View style ={{marginTop: 25, marginBottom:20,marginLeft:20,marginRight:20}}>
               <Text>Please Select donee Type *</Text>

               { Platform.OS === 'ios' ? 
<TouchableOpacity onPress={() => this.ActionSheetIOSonPressToSelectDoneeType()}>
<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', height: 40,
      margin: 0,
      marginTop: 15}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:13,color: 'black', fontSize: 16,}}>{this.state.selectedsecondValue1}</Text>
                <View style={{width:15, height:15, justifyContent: 'flex-end', marginRight: 20, marginTop: 0}}>
                  <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24,}} />
                </View>
                
              </View>
              </View>
              </TouchableOpacity> 
:

             <Picker
              selectedValue={this.state.selectedsecondValue}
            
              style={{
                height: 50,
                width: '100%',
                borderColor: '#000',
                alignSelf: 'center',
                borderWidth: 1,
               
              }}
              onValueChange={
                (itemValue, itemIndex) => this.setState({selectedsecondValue:itemValue})
                
                // console.log(itemValue)
                // Alert.alert(itemValue)
              }>
               
              <Picker.Item label="Select one" value=""  />
              <Picker.Item label="Individual" value="0" />
              <Picker.Item label="Organisation" value="1" />
            </Picker> }
            </View>

    
             
            <View>
              
            
            {this.state.selectedsecondValue =="0" || this.state.selectedsecondValue =="1" ?    
            <View style ={{ marginBottom:20,marginLeft:20,marginRight:20}}>
              {/* <TouchableOpacity
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
        </TouchableOpacity> */}

<Selector
              text={this.state.selectedPANName}
              placeholder="Gender"
              onPress={() => this.setState({showPANCardImagePicker: true})}
              width={'100%'}
              height={42}
              imageheight={10}
              imagewidth={11}
              backcolor={'#ffff'}
              borderRadius={10}
              borderWidth={1}
              margright={10}
               marginTop={-12}
              fontcolor={'#A1A1A1'}
            />

            <PickerDob
              backgroundColor={'#ffff'}
              dataList={this.state.ArrImagePicker}
              modalVisible={this.state.showPANCardImagePicker}
              onBackdropPress={() => this.setState({showPANCardImagePicker: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // this.user_filter(item.name, item.id);
                      // this.setState({gender: item.name});
                      // this.setState({showPicker: false});

                      console.log('image pciker item: ', item.name)

                      if (item.name == 'Take Photo')
                      {
                        this.setState({showPANCardImagePicker: false, selectedImagePickerType: 'PAN'})
                        setTimeout(() => {
                          this.captureImage()
                       }, 1100);

                      } else if (item.name == 'Select Document')
                      {
                        this.selectOneFile()

                      }
                      else
                      {
                        this.setState({showPANCardImagePicker: false, selectedImagePickerType: 'PAN'})
                        
                         if (Platform.OS === 'android')
                         {
                          this.selectOneFile()
                         }
                         else
                         {
                          setTimeout(() => {
                            this.chooseFile('Pan')
                           // this.props.navigation.navigate('start')}
                         }, 1100);
                         }
         

      


                      }

                     

                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                      flexDirection: 'row',

                    }}>
                      <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 0,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      tintColor: 'black',
                      marginEnd: 10
                    }}
                    source={item.image}
                    // resizeMode="contain"dashboard_main_btn
                  />
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 30,
                         // alignSelf: 'center'
                        },
                        // this.state.genderValue == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
       

        <Text style={{
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Only PDF or Image format is acceptable'}</Text>

        
        <TextInput
              placeholder="Pan Number *"
              placeholderTextColor="#000"
              onChangeText={text => this.setState({selectedPANNumber:text})}
              style={Styles.login_text_input}
              keyboardType="default"

            />
     { this.state.selectedsecondValue == "1" && Platform.OS === 'ios' &&
<TouchableOpacity onPress={() => this.ActionSheetIOSonPress1()}>
<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', height: 40,
      margin: 0,
      marginTop: 15}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:13,color: 'black', fontSize: 16,}}>{this.state.selectedID}</Text>
                <View style={{width:15, height:15, justifyContent: 'flex-end', marginRight: 20, marginTop: 0}}>
                  <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24,}} />
                </View>
                
              </View>
              </View>
              </TouchableOpacity> 
 }

 { this.state.selectedsecondValue == "0" && Platform.OS === 'ios' &&
<TouchableOpacity onPress={() => this.ActionSheetIOSonPress()}>
<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', height: 40,
      margin: 0,
      marginTop: 15}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:13,color: 'black', fontSize: 16,}}>{this.state.selectedID}</Text>
                <View style={{width:15, height:15, justifyContent: 'flex-end', marginRight: 20, marginTop: 0}}>
                  <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24,}} />
                </View>
                
              </View>
              </View>
              </TouchableOpacity> 
 }                       

{ this.state.selectedsecondValue == "1" && Platform.OS === 'android' && <Picker

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
<Picker.Item label="Select Address Proof *" value="" />
<Picker.Item label="Bank Statement " value="Bank Statement " />
<Picker.Item label="ITR Acknowlegement " value="ITR Acknowlegement " />
<Picker.Item label="Utility Bill " value="Utility Bill " />
</Picker> }

{ this.state.selectedsecondValue == "0" && Platform.OS === 'android' && <Picker

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
<Picker.Item label="Select Address Proof *" value="" />
<Picker.Item label="Aadhaard Card " value="Aadhaard Card" />
<Picker.Item label="Voter Card " value="Voter Card" />
<Picker.Item label="Passport" value="Passport" />
<Picker.Item label="Driving License" value="Driving License" />
</Picker> }


  
{/* <TouchableOpacity
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
        </TouchableOpacity>  */}

<Selector
              text={this.state.selectedIDName}
              placeholder="Gender"
              onPress={() => this.setState({showAddCardImagePicker: true})}
              width={'100%'}
              height={42}
              imageheight={10}
              imagewidth={11}
              backcolor={'#ffff'}
              borderRadius={10}
              borderWidth={1}
              margright={10}
               marginTop={5}
              fontcolor={'#A1A1A1'}
            />

            <PickerDob
              backgroundColor={'white'}
              dataList={this.state.ArrImagePicker}
              modalVisible={this.state.showAddCardImagePicker}
              onBackdropPress={() => this.setState({showAddCardImagePicker: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {

                      console.log('image pciker itemmmm: ', item.name)

                      if (item.name == 'Take Photo')
                      {
                        this.setState({showAddCardImagePicker: false, selectedImagePickerType: 'ID'})
                        setTimeout(() => {
                          this.captureImage()
                       }, 1100);

                      }
                      else if (item.name == 'Select Document')
                      {
                        this.selectOneFile1()

                      }
                      else
                      {
                        this.setState({showAddCardImagePicker: false, selectedImagePickerType: 'ID'})
                        
                         if (Platform.OS === 'android')
                         {
                          this.selectOneFile1()
                         }
                         else
                         {
                          setTimeout(() => {
                            this.chooseFile('Address')
                           // this.props.navigation.navigate('start')}
                         }, 1100);
                         }
                      }

                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                      flexDirection: 'row',

                    }}>
                      <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 0,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      tintColor: 'black',
                      marginEnd: 10
                    }}
                    source={item.image}
                    // resizeMode="contain"dashboard_main_btn
                  />
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 30,
                         // alignSelf: 'center'
                        },
                        // this.state.genderValue == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

<Text style={{
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
  marginBottom: 34
}}>{'Only PDF or Image format is acceptable'}</Text>

        {/* <TextInput
              placeholder= {this.state.selectedID +"Number"}
              placeholderTextColor="#000"
              onChangeText={text => this.setState({selectedKYCNumber:text})}
              style={Styles.login_text_input}
              keyboardType="default"/> */}


<Selector
              text={this.state.selectedBankSFileName}
              placeholder="Gender"
              onPress={() => this.setState({showBanksImagePicker: true})}
              width={'100%'}
              height={42}
              imageheight={10}
              imagewidth={11}
              backcolor={'#ffff'}
              borderRadius={10}
              borderWidth={1}
              margright={10}
               marginTop={-12}
              fontcolor={'#A1A1A1'}
            />

            <PickerDob
              backgroundColor={'#ffff'}
              dataList={this.state.ArrImagePicker}
              modalVisible={this.state.showBanksImagePicker}
              onBackdropPress={() => this.setState({showBanksImagePicker: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // this.user_filter(item.name, item.id);
                      // this.setState({gender: item.name});
                      // this.setState({showPicker: false});

                      console.log('image pciker item: ', item.name)

                      if (item.name == 'Take Photo')
                      {
                        this.setState({
                          showBanksImagePicker: false, selectedImagePickerType: 'Bank'
                      }, () => {
                        setTimeout(() => {
                          this.captureImage()
                       }, 1100);
                      });
                        

                      } else if (item.name == 'Select Document')
                      {
                        this.selectOneFileForBankS()

                      }
                      else
                      {
                        this.setState({showBanksImagePicker: false, selectedImagePickerType: 'PAN'})
                        
                         if (Platform.OS === 'android')
                         {
                          this.selectOneFileForBankS()
                         }
                         else
                         {
                          setTimeout(() => {
                            this.chooseFile('Bank')
                           // this.props.navigation.navigate('start')}
                         }, 1100);
                         }
         

      


                      }

                     

                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                      flexDirection: 'row',

                    }}>
                      <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 0,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      tintColor: 'black',
                      marginEnd: 10
                    }}
                    source={item.image}
                    // resizeMode="contain"dashboard_main_btn
                  />
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 30,
                         // alignSelf: 'center'
                        },
                        // this.state.genderValue == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
       

        <Text style={{
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Upload image of Cancelled Cheque or Passbook'}</Text>
      
          
  
        </View>

             : null }
         
         
          {this.state.selectedsecondValue =="1" ?  <View>
            
          <View style ={{ marginBottom:20,marginLeft:20,marginRight:20}}>
             
            {/* <TouchableOpacity
                   activeOpacity={0.5}
                   style={Styles1.buttonStyle}
                   onPress={this.selectTrustCertiFile}>
                   <Text style={{marginRight: 10, fontSize: 17}}>
                     {this.state.selectedTrustFileName}
                   </Text>
                   <Image
                     source={{
                       uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                     }}
                     style={Styles1.imageIconStyle}
                   />
                 </TouchableOpacity> */}


<Selector
              text={this.state.selectedTrustFileName}
              placeholder="Gender"
              onPress={() => this.setState({show80GCardImagePicker: true})}
              width={'100%'}
              height={42}
              imageheight={10}
              imagewidth={11}
              backcolor={'#ffff'}
              borderRadius={10}
              borderWidth={1}
              margright={10}
               marginTop={5}
              fontcolor={'#A1A1A1'}
            />

            <PickerDob
              backgroundColor={'white'}
              dataList={this.state.ArrImagePicker}
              modalVisible={this.state.show80GCardImagePicker}
              onBackdropPress={() => this.setState({show80GCardImagePicker: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {

                      console.log('image pciker itemmmm: ', item.name)

                      if (item.name == 'Take Photo')
                      {
                        this.setState({show80GCardImagePicker: false, selectedImagePickerType: '80G'})
                        setTimeout(() => {
                          this.captureImage()
                       }, 1100);

                      }
                      else if (item.name == 'Select Document')
                      {
                        this.selectTrustCertiFile()

                      }
                      else
                      {
                        this.setState({show80GCardImagePicker: false, selectedImagePickerType: '80G'})
                        
                         if (Platform.OS === 'android')
                         {
                          this.selectTrustCertiFile()
                         }
                         else
                         {
                          setTimeout(() => {
                            this.chooseFile('80G')
                           // this.props.navigation.navigate('start')}
                         }, 1100);
                         }
                      }

                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                      flexDirection: 'row',

                    }}>
                      <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 0,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      tintColor: 'black',
                      marginEnd: 10
                    }}
                    source={item.image}
                    // resizeMode="contain"dashboard_main_btn
                  />
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 30,
                         // alignSelf: 'center'
                        },
                        // this.state.genderValue == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

<Text style={{
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Only PDF or Image format is acceptable'}</Text>


                 {/* <View>
                 <Text style={Styles1.warningHint}>{' PDF or Image format is acceptable'}</Text>
                 </View> */}
           
          
                 <TextInput
                       placeholder="Website Link"
                       placeholderTextColor="#000"
                       onChangeText={text => this.setState({websiteLink:text})}
                       style={{
                        marginLeft: 10,
                        marginRight: 10,
                        // backgroundColor: '#dcdedc',
                        borderBottomColor: '#000',
                        borderBottomWidth: 1,
                         color:'black',
                        paddingTop: 20,
                        height: 55,
                        marginBottom:30
                      }}
                       keyboardType="default"
                       autoCapitalize = 'none'
                     />




          </View>
            
        
        
                  
                     </View>  : null}
         
         
                     <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => this.submit()}>
              <Text style={Styles.login_text}>SUBMIT</Text>
            </TouchableOpacity>   


           
            
           
             
            </View>

            </ScrollView>
            { this.state.progress && <ActivityIndicator size="large" color="#f55656" style={{opacity:1,
             position: 'absolute',
             left: 0,
             right: 0,
             top: 0,
             bottom: 0,
             alignItems: 'center',
             justifyContent: 'center'}}  /> }
            {/* </View> */}
          </ImageBackground>
        
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