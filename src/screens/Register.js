import React, {useState, useEffect} from 'react';
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
  ActionSheetIOS,
  Button,
  Platform,
  PermissionsAndroid

} from 'react-native';
import ActionSheet from 'react-native-actionsheet'
import {
  Container,
  // TextInput,
} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardManager from 'react-native-keyboard-manager';
import Selector from '../components/Selector';
import cameraIcon from '../../src/assets/images/outline_photo_camera_black_48.png';
import GalleryIcon from '../../src/assets/images/outline_collections_black_48.png';
import PickerDob from '../components/Picker';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
var pdfpath
var pdffile
var filename1 = 'Upload your Pan'
var filename2 = 'Upload your address proof'
const Register = ({navigation}) => {
  const [ArrImagePicker, setArrImagePicker] = useState([{"name": "Take Photo", 'image': cameraIcon}, { "name": "Choose Photo", 'image': GalleryIcon}]);
  const [FirstName, setFirstName] = useState('');
  const [showComponent, setshowComponent] = useState(true);
   const [websiteLink, setwebsiteLink] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setemail] = useState('');
  const [Mobile, setmobile] = useState('');
  const [Pincode, setPincode] = useState('');
  const [password, setpassword] = useState('');
  const [address, setaddress] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [Otp, setotp] = useState('');
  const [selectedValue, setselectedValue] = useState('Select One');
  const [selectedValue1, setselectedValue1] = useState('Select One');
  const [selectedsecondValue, setselectedsecondValue] = useState('');
  const [selectedPANSource, setselectedPANSource] = useState('');
  const [selectedPANNumber, setselectedPANNumber] = useState('');
  const [selectedKYCNumber, setselectedKYCNumber] = useState('');
  const [selectedTrustFileSource, setselectedTrustFileSource] = useState('');
  const [selectedIDSource, setselectedIDSource] = useState('');
  const [selectedPANName, setselectedPANName] = useState('Upload your Pan');
   const [selectedTrustFileName, setselectedTrustFileName] = useState('Upload 80G/Trust Certificate');
  const [selectedIDName, setselectedIDName] = useState('Upload your address proof');
  const [filebaseString, setfilebaseString] = useState('');
  const [imagebaseString, setimagebaseString] = useState('');
  const [selectedID, setselectedID] = useState('');
  const [isPasswordHidden, setisPasswordHidden] = useState(false);
  const [isConfirmPasswordHidden, setisConfirmPPasswordHidden] = useState(false);
  const [ItemmodalVisible, setisItemmodalVisible] = useState(true);
  const [selectedProfileImage, setselectedProfileImage] = useState('Upload Your Profile Image');
  const [showProfileImagePicker, setshowProfileImagePicker] = useState(false);
  const [selectedProfileImageSource, setselectedProfileImageSource] = useState('');
  const [selectedProfileImageType, setselectedProfileImageType] = useState('');
  
  const setTaskti = text => {
    setFirstName(text);
  };

  const setPanNum = text => {
    setPanNum(text);
  };

  const setKYCNum = text => {
    setKYCNum(text);
  };


    const setwebsitelink = text => {
    setwebsiteLink(text);
  };

  const setTasktipass = text => {
    setLastName(text);
  };
  const setEmail = text => {
    setemail(text);
  };
  const setMobile = text => {
    setmobile(text);
  };
  // const setOtp = text => {
  //   setotp({text});
  // };
  const setpass = text => {
    setpassword(text);
  };
  const setconfirmpass = text => {
    setConfirmPassword(text);
  };
  useEffect(() => {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }
  }, []);
  const selectOneFile = async () => {
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
      setselectedPANName(res.name);
      setselectedPANSource(res.uri);
     
       RNFetchBlob.fs
          .readFile(res.uri, 'base64')
          .then((data) => {
            setfilebaseString(data)
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
  const ActionSheetIOSonPress = () =>
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Donor", "Donee", "Cancel"],
       destructiveButtonIndex: 2,
       title: 'Select One',
      cancelButtonIndex: 2,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === 0) {

        setselectedValue('0')
        setselectedValue1('Donor')
        
      } else if (buttonIndex === 1) {

        setselectedValue('1')
        setselectedValue1('Donee')

      } else if (buttonIndex === 2) {
        // setResult("🔮");
      }
    }
  );
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
  const captureImage = async (type) => {
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
        setselectedProfileImage(response.assets['0']['fileName']);
        setselectedProfileImageSource(response.assets['0']['uri']);
        setselectedProfileImageType(response.assets['0']['type']);
      });
    }
  };

  const chooseFile = async () => {
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

      setselectedProfileImage(response.assets['0']['fileName']);
      setselectedProfileImageSource(response.assets['0']['uri']);
      setselectedProfileImageType(response.assets['0']['type']);

      // console.log('base64 -> ', response.assets['0']['fileName']);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      //setFilePath(response);
    });
  };

  const selectOneFile1 = async () => {
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
     
      setselectedProfileImage(res.name);
      setselectedProfileImageSource(res.uri);
      setselectedProfileImageType(res.type);
      
     
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











  const registration = async () => {
    var formdata = new FormData();
    console.log(password);
   
    console.log(selectedPANName);
    console.log(selectedValue);
    // console.log( filebaseString);
      console.log("s"+imagebaseString);
      var token = await AsyncStorage.getItem('token');
      console.log("token"+token);
   
      var fcm_token = await AsyncStorage.getItem('FCMtoken');
   
    if (FirstName.trim() == '') {
      Alert.alert('First Name', 'Please enter first name');
    } else if (LastName.trim() == '') {
      Alert.alert('Last Name', 'Please enter last name');
    } else if (Email.trim() == '') {
      Alert.alert('Email', 'Please enter Email');
    } else if (Mobile.trim() == '') {
      Alert.alert('Mobile', 'Please enter Mobile');
    }
    else if (Pincode.trim() == '') {
      Alert.alert('PIN code', 'Please enter PIN code');
    } 
    else if (password.trim() == '') {
      Alert.alert('Password', 'Please enter password');
    }else if(selectedValue ==''){ Alert.alert('select ', 'Please select type');}
    else if (password != confirm_password) {
      Alert.alert('Confirm Password', 'Confirm password did not match');
    }
    else if (selectedValue == 'Select One') {
      Alert.alert('Select One', 'Please select a type which you want to be');
    }
    // else if (selectedProfileImageSource == '') {
    //   Alert.alert('Profile Picture', 'Please uplaod your profile picture');
    // }
    else if (address.trim() == '') {
      Alert.alert('Full Address', 'Please enter full address');
    }
     else if (
      FirstName != '' &&
      LastName != '' &&
      Email != '' &&
      Mobile != '' &&
      password != ''
    ) {

      // var logs = {
      //   firstname: FirstName.trim(),
      //   lastname: LastName.trim(),
      //   email: Email.trim(),
      //   phone: Mobile.trim(),
      //   password: password.trim(),
      //   usertype: selectedValue,
      //   device_id: '',
      //   device_type: 'A',
      //   fcm_token:fcm_token,
      //   zipcode: Pincode
        

      // };



    var formdata = new FormData();

    if (selectedProfileImageSource == '') 
    {
      formdata.append('firstname', FirstName.trim());
    formdata.append('lastname', LastName.trim());
    formdata.append('email', Email.trim());
    formdata.append('phone', Mobile.trim());
    formdata.append('password', password.trim());
    formdata.append('usertype', selectedValue);
    formdata.append('profile_image', '');
    formdata.append('device_id', '');
    formdata.append('device_type', 'A');
    formdata.append('fcm_token', fcm_token);
    formdata.append('address', address);
    formdata.append('zipcode', Pincode);
    }
    else
    {
      formdata.append('firstname', FirstName.trim());
      formdata.append('lastname', LastName.trim());
      formdata.append('email', Email.trim());
      formdata.append('phone', Mobile.trim());
      formdata.append('password', password.trim());
      formdata.append('usertype', selectedValue);
      formdata.append('profile_image', {uri: selectedProfileImageSource, name: selectedProfileImage, type: selectedProfileImageType});
      formdata.append('device_id', '');
      formdata.append('device_type', 'A');
      formdata.append('fcm_token', fcm_token);
      formdata.append('address', address);
      formdata.append('zipcode', Pincode);
    } 

    
    

      // var response = await API.post('register', logs);
      var response = await API.postWithFormData('register', formdata);
    
      if (response.status == 'success') {
        // need to add kyc uploadation function here
        Toast.show(response.message, Toast.LONG)
        navigation.navigate('OtpVerify', {mobile: Mobile});
      } else if(response.status == 'warning') {
        Toast.show(response.message, Toast.LONG)
      } else
      {
        Toast.show(response[0]['message'], Toast.LONG)
       // Alert.alert(response.status, response.message);
      }
    }
  };
  const updateSecureText = () => {
    setisPasswordHidden(!isPasswordHidden);
  };

  const updateSecureText1 = () => {
    setisConfirmPPasswordHidden(!isConfirmPasswordHidden);
  };

  const selectedDonationType = ()=> {
    console.log(selectedValue);
  
    
  }


  return (
    
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.login_main}>
            <ScrollView>
            <SafeAreaView style={Styles.dashboard_main_header}>
        <View style={Styles.dashboard_main_headers}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}>
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
          <View style={Styles.login_text_main}>
            {/* <Image
              style={{width: 90, height: 80, marginStart: 30, marginTop: 20}}
              source={require('../../src/assets/images/heart.png')}
              // resizeMode="contain"
            /> */}
            <Text style={{
    fontSize: 45,
    alignSelf: 'center',
  }}>Registration</Text>
          </View>


          
          <View style={Styles.login_text_input_contain}>

          {selectedProfileImageSource != '' ? ( <Image
         source={{uri: selectedProfileImageSource}}
        // source={require('../../src/assets/images/heart1.png')}
        style={{
          // resizeMode: 'center',
          width: 100,
          height: 100,
           borderRadius: 100 / 2,
          alignSelf: 'center',
          //  backgroundColor: 'transparent',
          //  tintColor: '#f55656',
          //  resizeMode: 'contain'
           
        }}
      /> ) : null}
          
          {/* <TouchableOpacity style={{ alignSelf: 'center', borderColor: '#f55656', borderRadius: 50, borderWidth: 1, width: 80, height: 80, alignItems: 'center'}}>
          <Image
       // source={{uri: BASE_PATH + proileImage}}
        source={require('../../src/assets/images/round_person_add_alt_black_48.png')}
        style={{
          resizeMode: 'center',
          width: 50,
          height: 50,
          alignSelf: 'center',
           backgroundColor: 'transparent',
           tintColor: '#f55656',
           resizeMode: 'contain',
           borderWidth: 1,
           marginTop: 11,
           marginStart: 6
          //  borderColor: '#f55656',
           
           
        }}
      />
          </TouchableOpacity> */}





<Selector
              text={selectedProfileImage}
              placeholder="Gender"
              onPress={() => setshowProfileImagePicker(true)}
              width={'100%'}
              height={42}
              imageheight={10}
              imagewidth={11}
              backcolor={'#ffff'}
              borderRadius={10}
              borderWidth={1}
              margright={10}
              marginTop={18}
              fontcolor={'#A1A1A1'}
            />

            <PickerDob
              backgroundColor={'#ffff'}
              dataList={ArrImagePicker}
              modalVisible={showProfileImagePicker}
              onBackdropPress={() => setshowProfileImagePicker(false)}
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
                        setshowProfileImagePicker(false)
                        setTimeout(() => {
                          // this.captureImage()
                          captureImage('photo')
                       }, 1100);

                      }
                      else
                      {
                        setshowProfileImagePicker(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1()
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile()
                           // this.props.navigation.navigate('start')}
                         }, 1100);
                          
                         }
         

        {/* <TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle1}
          onPress={() => chooseFile('photo')}>
          <Text style={Styles1.textStyle}>Choose Image</Text>
        </TouchableOpacity> */}


                      }

                      // setshowPicker(false)
                      // setselectType(item.name)
                      // setselectID(item.id)

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






        <Text style={ {
  marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: 10,
  alignSelf: 'center',
  paddingLeft: -80
}}>{'Only Image format is acceptable'}</Text>

        


          {/* <Text style={{alignSelf: 'center', color: '#f55656', marginBottom: 10, marginTop: 10}}>Add Profile Picture</Text> */}
            <TextInput
              placeholder="First Name"
              onChangeText={text => setTaskti(text)}
              style={Styles.login_text_input}
              keyboardType="default"
              placeholderTextColor='grey'
            />
            <TextInput
              placeholder="Last Name"
              onChangeText={text => setTasktipass(text)}
              style={Styles.login_text_input}
              keyboardType="default"
              placeholderTextColor='grey'
            />
            <TextInput
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              style={Styles.login_text_input}
              keyboardType="email-address"
              autoCapitalize='none'
              placeholderTextColor='grey'
            />
            <TextInput
              placeholder="Mobile"
              onChangeText={text => setMobile(text)}
              style={Styles.login_text_input}
              keyboardType="numeric"
              placeholderTextColor='grey'
            />

<TextInput
              placeholder="Full Address"
              onChangeText={text => setaddress(text)}
              style={Styles.login_text_input}
              keyboardType="default"
              placeholderTextColor='grey'
            />

<TextInput
              placeholder="PIN code"
              onChangeText={text => setPincode(text)}
              style={Styles.login_text_input}
              keyboardType="numeric"
              placeholderTextColor='grey'
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: 14,
                borderBottomWidth: 1,
                paddingRight: 10,
                marginStart: 10,
                marginEnd: 10,
              }}>
              <TextInput
                placeholder="Password"
                onChangeText={text => setpass(text)}
                style={{
                  flex: 1,
                  paddingTop: 0,
                  fontSize: 16,
                  height: 40,
                  //   borderColor: "#080606",
                  //   paddingLeft: 15,
                  color: 'black',
                }}
                keyboardType="default"
                placeholderTextColor='grey'
                secureTextEntry={!isPasswordHidden}
              />
              <TouchableOpacity onPress={updateSecureText}>
                {!isPasswordHidden ? (
                  <Feather name="eye-off" color="gray" size={20} />
                ) : (
                  <Feather name="eye" color="green" size={20} />
                )}
              </TouchableOpacity>
            </View>


            <View
              style={{
                flexDirection: 'row',
                marginTop: 14,
                borderBottomWidth: 1,
                paddingRight: 10,
                marginStart: 10,
                marginEnd: 10,
              }}>
              <TextInput
                placeholder="Confirm password"
                onChangeText={text => setconfirmpass(text)}
                style={{
                  flex: 1,
                  paddingTop: 0,
                  fontSize: 16,
                  height: 40,
                  //   borderColor: "#080606",
                  //   paddingLeft: 15,
                  color: 'black',
                }}
                keyboardType="default"
                placeholderTextColor='grey'
                secureTextEntry={!isConfirmPasswordHidden}
              />
              <TouchableOpacity onPress={updateSecureText1}>
                {!isConfirmPasswordHidden ? (
                  <Feather name="eye-off" color="gray" size={20} />
                ) : (
                  <Feather name="eye" color="green" size={20} />
                )}
              </TouchableOpacity>
            </View>

            {/* <Text style={{
                height: 30,
                width: '100%',
                alignSelf: 'center',
                marginTop: -20,
              }} onPress={ActionSheetIOSonPress} title="Select One" /> */}



{ Platform.OS === 'ios' ? 
<TouchableOpacity onPress={() => ActionSheetIOSonPress()}>
<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', height: 40,
      margin: 0,
      marginTop: 11}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:13,color: 'gray', fontSize: 16,}}>{selectedValue1}</Text>
                <View style={{width:15, height:15, justifyContent: 'flex-end', marginRight: 20, marginTop: 0}}>
                  <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24,}} />
                </View>
                
              </View>
              </View>
              </TouchableOpacity> 
:

             <Picker
            
              selectedValue={selectedValue}
            
              style={{
                height: 20,
                width: '100%',
                borderColor: '#000',
                alignSelf: 'center',
                borderWidth: 1,
                marginTop: 19,
              }}
              onValueChange={
                (itemValue, itemIndex) => setselectedValue(itemValue)
                
                // console.log(itemValue)
                // Alert.alert(itemValue)
              }>
               
              <Picker.Item label="Select one" value=""  />
              <Picker.Item label="Donor" value="0" />
              <Picker.Item label="Donee" value="1" />
            </Picker> }

           
           
<View>
   
    






    
       </View>

           
     <View>



    
           

      


</View>
    
                  

    
   

        

           
            <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => registration()}>
              <Text style={Styles.login_text}>SUBMIT</Text>
            </TouchableOpacity>

            <Text style={Styles.login_text_font}></Text>
           
          </View>
          </ScrollView>
        </ImageBackground>
      </Container>
    
  );
};
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
sideMenuProfileIcon: {
  resizeMode: 'center',
  width: 80,
  height: 80,
  alignSelf: 'center',
   backgroundColor: 'transparent',
   tintColor: '#f55656',
   resizeMode: 'contain',
   borderWidth: 1,
   
  //  borderColor: '#f55656',
   
   
},
})
export default Register;
