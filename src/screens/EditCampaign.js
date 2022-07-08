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
  ActivityIndicator,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Modal
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardManager from 'react-native-keyboard-manager';
import PickerDob from '../components/Picker';
import cameraIcon from '../../src/assets/images/outline_photo_camera_black_48.png';
import GalleryIcon from '../../src/assets/images/outline_collections_black_48.png';
import DocumentPicker from 'react-native-document-picker';
import Selector from '../components/Selector';
import DateTimePicker from '../components/DateTimePicker';
import moment from 'moment';
import AppPreLoader from '../components/AppPreLoader';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
var Styles = require('../assets/files/Styles');
const requestCameraPermission = async () => {
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

const requestExternalWritePermission = async () => {
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
const ArrImagePicker = [{"name": "Take Photo", 'image': cameraIcon}, { "name": "Choose Photo", 'image': GalleryIcon}]
class User_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kyc: false,
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      iseditablefname: false,
      iseditablelname: false,
      image: '',
      progress: false,
      user_id: '',
      iseditablePin: false,
      iseditableAddress: false,
      pinCode: '',
      addressString: '',
      profile_img: '',
      showProfileImagePicker: false,
      selectedProfileImageSource: '',
      selectedProfileImageType: '',
      selectedProfileImage: '',
      strdate: null,
      isStartPickerVisible: false,
      endDateString: '',

      descriptionString: '',
      selfDonationString: '',
      targetAmountString: '',
      isloading: true,
      capmain_details: [],
      

    };
  }
  captureImage = async (type) => {
    let options = {
      mediaType: 'photo',
      maxWidth: 400,
      maxHeight: 200,
       quality: 1,
      // videoQuality: 'low',
      // durationLimit: 30, //Video max duration in seconds
      //  saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
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

        this.setState({profile_img: response.assets['0']['uri'],selectedProfileImage: response.assets['0']['fileName'],
       selectedProfileImageSource: response.assets['0']['uri'], selectedProfileImageType: response.assets['0']['type']})
        
      });
    }
  };

   chooseFile = async () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 400,
      maxHeight: 200,
      quality: 1,
    };
    console.log('chooseFile called!!!')
    launchImageLibrary(options, async (response) => {
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


      this.setState({profile_img: response.assets['0']['uri'],selectedProfileImage: response.assets['0']['fileName'],
       selectedProfileImageSource: response.assets['0']['uri'], selectedProfileImageType: response.assets['0']['type']})

      // console.log('base64 -> ', response.assets['0']['fileName']);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
     // setFilePath(response);
    });
  };

   selectOneFile1 = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      // console.log('res : ' + JSON.stringify(res));
      // console.log('URi : ' + res.uri);
      // console.log('Type : ' + res.type);
      // console.log('File Name : ' + res.name);
      // console.log('File Size : ' + res.size);
     
      

      this.setState({profile_img: res.uri,selectedProfileImage: res.name,
       selectedProfileImageSource: res.uri, selectedProfileImageType: res.type})
      
     
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
  btnkyc = () => {
    if (!this.state.kyc) {
      this.setState({
        kyc: true,
      });
    } else {
      this.setState({
        kyc: false,
      });
    }
  };
  async componentDidMount() {

    var profile_img = await AsyncStorage.getItem('profile_image');
    this.setState({ profile_img: profile_img });

    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }
  
    this.campaign();
  }

  campaign = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      campaign_id: this.props.route.params.camp_id,
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
        // cmpData: [...response.data.donations],
        capmain_details: [...response.data.capmain_details],
        profile_img: base64String,

        descriptionString: [...response.data.capmain_details][0]['campaign_details'],
        strdate: [...response.data.capmain_details][0]['campaign_end_date'],
        

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
  Start_CampaignNow = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var formdata = new FormData();


    if (selCamp == 2) 
    {
      formdata.append('user_id', user_id);
      formdata.append('campaign_name', Title);
      formdata.append('donation_mode', selCamp);
      formdata.append('campaign_details', Description);
      formdata.append('campaign_start_date', String(strdate));
      formdata.append('campaign_end_date', String(endseldate));
       formdata.append('campaign_image', {uri: selectedCampaignImageSource, name: selectedCampaignImage, type: selectedCampaignImageType});
      formdata.append('campaign_target_amount', amount);
      formdata.append('kind_id', selectedValue);
      formdata.append('filter_by_type', selectID);
      formdata.append('zip', pincode);
      formdata.append('campaign_target_qty', quantity);
      formdata.append('campaign_note', KindMsg);
      formdata.append('items', JSON.stringify(data));


      
    }
    else
    {



      
        formdata.append('user_id', user_id);
        formdata.append('campaign_name', Title);
        formdata.append('donation_mode', selCamp);
        formdata.append('campaign_details', Description);
        formdata.append('campaign_start_date', String(strdate));
        formdata.append('campaign_end_date', String(endseldate));
         formdata.append('campaign_image', {uri: selectedCampaignImageSource, name: selectedCampaignImage, type: selectedCampaignImageType});
        formdata.append('campaign_target_amount', amount);
        formdata.append('kind_id', selectedValue);
        formdata.append('filter_by_type', selectID);
        formdata.append('zip', pincode);
        formdata.append('campaign_target_qty', quantity);
         formdata.append('supported_doc', {uri: selectedselectedSDImageSource, name: selectedSDImage, type: selectedSDImageType});
         
         
     
    }

    console.log('Start campaign parametersForDonee: ', JSON.stringify(formdata))

     var response = await API.postWithFormData('add_campaign', formdata);

     console.log('Start campaign response: ', response)

    if (response.status == 'success') {
      setprogress(false)
      // Alert.alert('Alert', 'Campaign added successfully and waiting for admin approval');
      Alert.alert('success', 'Campaign added successfully and waiting for admin approval.', [
        {text: 'OK', onPress: () => navigation.navigate('Dashboard')},
      ],
      {cancelable: false},);
      
    } else {
      setprogress(false)
      Alert.alert(response.status, response.message);
      navigation.navigate('Dashboard');
    }
  };
  getuser = async () => {
    this.setState({
      progress: true,
    })
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    console.log(token);
    console.log('user_id', user_id);
    
    var logs = {
      user_id: user_id,
    };

    

    if (token != null) {
      var response = await API.post('fetch_profile_data', logs);
      console.log('fetch_profile_data: ',response);
      if (response.status == 'success') {
        // navigation.navigate('OtpVerify', {mobile: Mobile});
        
        this.setState({
          fname: response.data.first_name,
          lname: response.data.last_name,
          email: response.data.email,
          mobile: response.data.phone,
          image: response.data.kyc_file,
          progress: false,
          user_id: user_id,
          pinCode: response.data.zipcode,
          addressString: response.data.address,
        });
      } else {
        Alert.alert(response.status, response.message);
      }
    } else {
    }
  };
  updateUser = async () => {};

  descriptionEdit = async () => {
    this.inputText1.focus()
  };

  targetAmountEdit = () => {
    this.inputText2.focus()
  };

  selfDonationEdit = value => {
    this.inputText3.focus()
  };
  setTargetAmount = value => {
    this.setState({
      targetAmountString: value,
    });
  };
  setSelfDonation = value => {
    this.setState({
      selfDonationString: value,
    });
  };
  setDescription = value => {
    this.setState({
      descriptionString: value,
    });
  };
   updateProfile = async () => {
    if (this.state.fname.trim() == '')
    {
      Alert.alert('Warning', 'Please enter First Name');
    }
    else if (this.state.lname.trim() == '')
    {
      Alert.alert('Warning', 'Please enter Last Name');
    }
    else if (this.state.pinCode.trim() == '')
    {
      Alert.alert('Warning', 'Please enter PIN code');
    }
    else
    {
      // var logs = {
      //   usrId: this.state.user_id,
      //   firstname: this.state.fname,
      //   lastname: this.state.lname,
      //   phone: this.state.mobile,
      //   email: this.state.email,
      //   zipcode: this.state.pinCode
      // };
      // console.log('Update Profile logs: ', logs);
      // var response = await API.postWithoutHeader('update_user_profile_info', logs);
      var formdata = new FormData();
if (this.state.selectedProfileImageType == '')
{
  formdata.append('usrId', this.state.user_id);
  formdata.append('firstname', this.state.fname);
  formdata.append('lastname', this.state.lname);
  formdata.append('phone', this.state.mobile);
  formdata.append('email', this.state.email);
  formdata.append('zipcode', this.state.pinCode);
  formdata.append('address', this.state.addressString);
}
else
{
  formdata.append('usrId', this.state.user_id);
  formdata.append('firstname', this.state.fname);
  formdata.append('lastname', this.state.lname);
  formdata.append('phone', this.state.mobile);
  formdata.append('email', this.state.email);
  formdata.append('zipcode', this.state.pinCode);
  formdata.append('address', this.state.addressString);
  formdata.append('profile_image', {uri: this.state.selectedProfileImageSource, name: this.state.selectedProfileImage, type: this.state.selectedProfileImageType});
}
        // var response = await API.post('register', logs);
        var response = await API.postWithFormData('update_user_profile_info', formdata);
  
        




     // console.log(response);
     console.log('Update Profile response: ', response);
      if (response.status === 'success') {

        await AsyncStorage.setItem('profile_image', response.profile_img);
        await AsyncStorage.setItem('profile_name', response.first_name + ' ' + response.last_name);
        Toast.show(response.message, Toast.LONG)
        this.props.navigation.goBack()
      } else {
        Alert.alert('Failure', response.message);
      }
    }
    
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
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('')}>
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
            {/* <View style={Styles.profile_main_contain}> */}
            <ScrollView>
            <View>
              {/* <Image
                style={{
                  width: 84,
                  height: 80,
                  marginStart: 14,
                  marginTop: 20,
                  backgroundColor: 'transparent',
                }}
                source={require('../../src/assets/images/heart.png')}
                // resizeMode="contain"dashboard_main_btn
              /> */}
              <Text
                style={[
                  // Styles.user_kyc_font,
                  {
                    // marginLeft: 14,
                    fontSize: 26,
                    alignSelf: 'center',
                    marginTop: 15,
                    marginBottom: 15
                  },
                ]}>
                Edit Campaign
              </Text>
            </View>
            {/* <ActivityIndicator animating={this.state.progress} size="large" style={{opacity:1}} color="red"
            //Text with the Spinner
            textContent={'Loading...'}
            textStyle={Styles1.spinnerTextStyle}
          />  */}
              <View style={Styles.profile_main_text_contain}>

              <TouchableOpacity style={{ marginLeft: 0, marginRight: 0, borderRadius:4, backgroundColor: 'null', marginTop: 15}} 
              onPress={() => this.setState({showProfileImagePicker: true})}>
<Image style={{
  
    resizeMode: 'contain', alignSelf: 'center', height: 200, alignSelf: 'flex-start', borderRadius: 4, width: '100%', 
}}
 source={{uri: this.state.profile_img}}
// source={require('../../src/assets/images/daatar_banner.jpg')}
>
</Image> 
</TouchableOpacity>

                  {/* <TouchableOpacity
                   style={{
                    alignSelf: 'center',   
                  }}
                    onPress={() => this.setState({showProfileImagePicker: true})}><Image
         source={{uri: this.state.profile_img}}
        style={{
          width: 200,
          height: 100,
          borderRadius: 5
          //  borderRadius: 100 / 2, 
        }}
      /></TouchableOpacity> */}


<TouchableOpacity
                   style={{
                    alignSelf: 'center', marginTop: 8,  
                  }}
                    onPress={() => this.setState({showProfileImagePicker: true})}>
<Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5}}>Edit Campaign Image</Text>
<Text style={{fontSize: 11, color: 'red', alignSelf: 'center'}}>Image size should not be more than 1MB</Text>
</TouchableOpacity>

      

<PickerDob
              backgroundColor={'#ffff'}
              dataList={ArrImagePicker}
              modalVisible={this.state.showProfileImagePicker}
              onBackdropPress={() => this.setState({showProfileImagePicker: false})}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
              

                      console.log('image pciker item: ', item.name)

                      if (item.name == 'Take Photo')
                      {
                        this.setState({showProfileImagePicker: false})
                        setTimeout(() => {
                          this.captureImage('photo')
                       }, 1100);

                      }
                      else
                      {
                        this.setState({showProfileImagePicker: false})
                        
                         if (Platform.OS === 'android')
                         {
                          this.selectOneFile1()
                         }
                         else
                         {
                          setTimeout(() => {
                            this.chooseFile()
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
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      tintColor: 'black',
                      marginEnd: 10
                    }}
                    source={item.image}
                  />
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 30,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

                <Text style={{
    fontSize: 17,
    // alignSelf: 'center',
    color: 'grey',
    fontWeight: '500',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20
  }}>Campaign Description:</Text>
                <View style={{
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
                      height: 43
                    }}
                    placeholder="Enter Campaign Description"
                    ref ={ref => this.inputText1 = ref}
                    // editable={this.state.iseditablefname}
                    onChangeText={value => this.setDescription(value)}
                    value={this.state.descriptionString}
                    keyboardType="default"></TextInput>
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
                </View>

                <Text style={ {
  marginTop: 5,
  marginLeft: 0,
  marginRight: 15,
  color: 'red',
  fontSize: 11,
  marginBottom: 10,
  // alignSelf: 'center',
  paddingLeft: 13
}}>{'Description text must be minimum 50 characters'}</Text>
              
              <Text style={{
    fontSize: 17,
    // alignSelf: 'center',
    color: 'grey',
    fontWeight: '500',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20
  }}>Campaign End Date:</Text>

              <View style={ {
    justifyContent: 'space-between',
    flexDirection: 'row',
    // backgroundColor: '#f55656',
    marginLeft: 15,
    marginRight: 15,
    marginTop: -5
  }}>
                <Selector
                  text={this.state.strdate ? moment(this.state.strdate).format('DD / MM / YYYY') : ''}
                  placeholder="End Date"
                  marginTop={normalize(15)}
                  // onPress={() => setShowPicker(true)}
                  icon={require('../../src/assets/images/calendar.jpg')}
                  onPress={() => this.setState({isStartPickerVisible: true})}
                />
              </View>

              </View>
              
              
              
              
              </ScrollView>

              <TouchableOpacity
            style={{width: '94%',
            position: 'absolute',
            height: 50,
            backgroundColor: '#f55656',
            bottom: 20,
            color: '#f55656',
            alignSelf:"center",
            marginBottom: 34}}
            onPress={() => this.updateProfile()}>
            <Text style={Styles.login_text}>Update</Text>
          </TouchableOpacity>

              <DateTimePicker
        value={new Date(this.state.strdate) == null ? new Date(moment().toISOString()) : new Date(this.state.strdate)}
          maxDate={new Date("2040-12-31")}
        minDate={new Date(this.state.strdate)}
        dateTimePickerVisible={this.state.isStartPickerVisible}
        onDateChange={val => this.setState({strdate: val})}
        onBackdropPress={() => this.setState({isStartPickerVisible: false})}
        onPressDone={() => this.setState({isStartPickerVisible: false})}
      />

              {/* </ListItem> */}
              {/* <View>
                <TouchableOpacity
                  style={Styles.view_btn_kyc}
                  onPress={() => this.btnkyc()}>
                  <Text style={Styles.donate_btn_text}>View KYC</Text>
                </TouchableOpacity>
              </View> */}
            {/* </List> */}
            {/* {this.state.kyc == true ? (
              <View style={Styles.user_kyc_contain}>
                <ListItem>
                  <Image
                    style={{
                      width: '90%',
                      height: 160,
                      marginStart: 20,
                      marginTop: 20,
                      backgroundColor: 'transparent',
                    }}
                    resizeMode="cover"
                    source={{uri: `data:image/jpeg;base64,${this.state.image}`}}
                  />
                </ListItem>
              </View>
            ) : null} */}
            {/* </View> */}
          </ImageBackground>
          <Modal transparent={true} animationType="none" visible={this.state.progress}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: `rgba(0,0,0,${0.6})`,
          width: '100%',
          height: '100%',
          // marginTop: 400
        }}
      >
        <View
          style={{
            padding: 13,
            backgroundColor: 'grey',
            borderRadius: 3,
            marginTop: '40%'
          }}
        >
          <ActivityIndicator animating={this.state.progress} color={'white'} size="large" />
          <Text style={{ color: `${'white'}` }}>{'Wait a moment....'}</Text>
        </View>
      </View>
    </Modal>
      </Container>
    );
  }
  
}
const Styles1 = StyleSheet.create({
  spinnerTextStyle: {
    color: 'green',
  },
});
export default User_profile;
