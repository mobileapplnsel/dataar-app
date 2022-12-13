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
  Linking,
  Button,
  PermissionsAndroid,
  Modal
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardManager from 'react-native-keyboard-manager';
import DeepLinking from 'react-native-deep-linking';
import PickerDob from '../components/Picker';
import cameraIcon from '../../src/assets/images/outline_photo_camera_black_48.png';
import GalleryIcon from '../../src/assets/images/outline_collections_black_48.png';
import DocumentPicker from 'react-native-document-picker';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import AppPreLoader from '../components/AppPreLoader';
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
      response: {},
      profile_img: '',
      showProfileImagePicker: false,
      selectedProfileImageSource: '',
      selectedProfileImageType: '',
      selectedProfileImage: ''

     


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
    console.log('profile_img: ', this.state.profile_img)

    DeepLinking.addScheme('example1://');
    Linking.addEventListener('url', this.handleUrl);

    DeepLinking.addRoute('/test', (response) => {
      // example://test
      console.log('responseee: ', response)
      this.setState({ response });
    });

    DeepLinking.addRoute('/test/:id', (response) => {
      // example://test/23
      console.log('responseee: ', response)
      this.setState({ response });
    });

    DeepLinking.addRoute('/test/:id/details', (response) => {
      // example://test/100/details
      console.log('responseee: ', response)
      this.setState({ response });
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));

    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }

    if (AsyncStorage.getItem('token')['_X'] == null) {
      //   this.props.navigation.navigate('LogIn');
    } else {
    }
    this.getuser();
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleUrl);
  }
  handleUrl = ({ url }) => {
    console.log('handleUrl: ', url)
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }
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
      console.log('fetch_profile_data1: ',response);
      if (response.status == 'success') {
        // navigation.navigate('OtpVerify', {mobile: Mobile});
        
        this.setState({
          fname: response.data.first_name,
          lname: response.data.last_name,
          email: response.data.email,
          mobile: response.data.phone,
          image: response.data.kyc_file,
          addressString: response.data.address,
          progress: false,
          user_id: user_id,
          pinCode: response.data.zipcode
        });
      } else {
        Alert.alert(response.status, response.message);
      }
    } else {
    }
  };
  updateUser = async () => {};
  fnameedit = async () => {
    console.log('hello world');
    this.setState({
      iseditablefname: true,
    });
    this.inputText1.focus()
  };
  lnameedit = () => {
    console.log('hello world');
    this.setState({
      iseditablelname: true,
    });
    this.inputText2.focus()
  };
  Pinedit = () => {
    console.log('hello world');
    this.setState({
      iseditablePin: true,
  }, () => {
    this.inputText.focus()
  });

  };
  AddressEdit = () => {
    console.log('hello world');
    this.setState({
      iseditableAddress: true,
  }, () => {
    this.inputText3.focus()
  });

  };
  setFirstname = value => {
    this.setState({
      fname: value,
    });
  };
  setLastname = value => {
    this.setState({
      lname: value,
    });
  };
   updateProfile = async () => {
    this.setState({
      progress: true,
    })
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
      //   zipcode: this.state.pinCode,
        
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
  formdata.append('address', this.state.addressString);
  formdata.append('zipcode', this.state.pinCode);
}
else
{
  formdata.append('usrId', this.state.user_id);
  formdata.append('firstname', this.state.fname);
  formdata.append('lastname', this.state.lname);
  formdata.append('phone', this.state.mobile);
  formdata.append('email', this.state.email);
  formdata.append('address', this.state.addressString);
  formdata.append('zipcode', this.state.pinCode);
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
        Toast.show("Profile updated successfully")
        this.props.navigation.goBack()
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
                  Styles.user_kyc_font,
                  {
                    marginLeft: 14,
                  },
                ]}>
                User Profile
              </Text>
            </View>
            <ActivityIndicator animating={this.state.progress} size="large" style={{opacity:1}} color="red"
            //Text with the Spinner
            textContent={'Loading...'}
            textStyle={Styles1.spinnerTextStyle}
          /> 
            {/* <List style={Styles.profile_main_contain}> */}
              <View style={Styles.profile_main_text_contain}>

             <TouchableOpacity
                   style={{
                    alignSelf: 'center',   
                  }}
                    onPress={() => this.setState({showProfileImagePicker: true})}><Image
         source={{uri: this.state.profile_img}}
        // source={require('../../src/assets/images/heart1.png')}
        style={{
          width: 100,
          height: 100,
           borderRadius: 100 / 2, 
        }}
      /></TouchableOpacity> 

<TouchableOpacity
                   style={{
                    alignSelf: 'center', marginTop: 8,  
                  }}
                    onPress={() => this.setState({showProfileImagePicker: true})}>
<Text style={{fontSize: 17, fontWeight: 'bold', alignSelf: 'center'}}>Edit Profile Image</Text>
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
                          // this.captureImage()
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

                {/* <ListItem style={Styles.profile_main_text_contain}> */}
                <Text style={Styles.user_profile_lbtext}>First Name:</Text>
                <View style={Styles.user_edit_contain}>
                  <TextInput
                    style={Styles.user_text_input}
                    placeholder="First Name"
                    ref ={ref => this.inputText1 = ref}
                    // editable={this.state.iseditablefname}
                    onChangeText={value => this.setFirstname(value)}
                    value={this.state.fname}
                    keyboardType="default"></TextInput>
                  {/* </ListItem> */}
                  <TouchableOpacity
                    style={Styles.user_edit_profile_lbtext}
                    onPress={() => this.fnameedit()}>
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
              </View>
              <View style={Styles.profile_main_text_contain}>
                <Text style={Styles.user_profile_lbtext}>Last Name:</Text>
                <View style={Styles.user_edit_contain}>
                
                  <TextInput
                    style={Styles.user_text_input}
                    placeholder="Last Name"
                    // editable={this.state.iseditablelname}
                    ref ={ref => this.inputText2 = ref}
                    onChangeText={value => this.setLastname(value)}
                    value={this.state.lname}
                    keyboardType="default"></TextInput>
                  <TouchableOpacity
                    style={Styles.user_edit_profile_lbtext}
                    onPress={() => this.lnameedit()}>
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
              </View>
              <View style={Styles.profile_main_text_contain}>
                <Text style={Styles.user_profile_lbtext}>Email:</Text>
                <TextInput
                  style={Styles.user_text_input}
                  placeholder="Email"
                  editable={false}
                  onChangeText={() => this.setEmailname()}
                  value={this.state.email}
                  keyboardType="email-address"></TextInput>
              </View>
              <View style={Styles.profile_main_text_contain}>
                <Text style={Styles.user_profile_lbtext}>Mobile:</Text>
                <TextInput
                  style={Styles.user_text_input}
                  placeholder="Mobile"
                  editable={false}
                  onChangeText={() => this.setMobile()}
                  value={this.state.mobile}
                  keyboardType="number-pad"></TextInput>
              </View>

              

              <View style={Styles.profile_main_text_contain}>
                <Text style={Styles.user_profile_lbtext}>Full Address:</Text>
                <View style={Styles.user_edit_contain}>
                <TextInput
                  style={Styles.user_text_input}
                  ref ={ref => this.inputText3 = ref}
                  placeholder="Full Address"
                  // editable={this.state.iseditablePin}
                  autoFocus={this.state.iseditableAddress}
                  onChangeText={(text) => this.setState({
                    addressString: text,
                  })}
                  value={this.state.addressString}
                  keyboardType='default'></TextInput>
                  <TouchableOpacity
                    style={Styles.user_edit_profile_lbtext}
                    onPress={() => this.AddressEdit()}>
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
              </View>

              <View style={Styles.profile_main_text_contain}>
                <Text style={Styles.user_profile_lbtext}>PIN code:</Text>
                <View style={Styles.user_edit_contain}>
                <TextInput
                  style={Styles.user_text_input}
                  ref ={ref => this.inputText = ref}
                  placeholder="PIN code"
                  // editable={this.state.iseditablePin}
                  autoFocus={this.state.iseditablePin}
                  onChangeText={(text) => this.setState({
                    pinCode: text,
                  })}
                  value={this.state.pinCode}
                  keyboardType='number-pad'></TextInput>
                  <TouchableOpacity
                    style={Styles.user_edit_profile_lbtext}
                    onPress={() => this.Pinedit()}>
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
              </View>

              <TouchableOpacity
            style={{width: '94%',
            height: 50,
            backgroundColor: '#f55656',
            marginTop: 30,
            color: '#f55656',
            alignSelf:"center",
            marginBottom: 34}}
            onPress={() => this.updateProfile()}>
            <Text style={Styles.login_text}>Update</Text>
          </TouchableOpacity>

          {/* <View style={Styles1.container}>
        <View style={Styles1.container}>
          <Button
            onPress={() => Linking.openURL('example1://test')}
            title="Open example://test"
          />
          <Button
            onPress={() => Linking.openURL('example1://test/23')}
            title="Open example://test/23"
          />
          <Button
            onPress={() => Linking.openURL('example1://test/100/details')}
            title="Open example://test/100/details"
          />
        </View>
        <View style={Styles1.container}>
          <Text style={Styles1.text}>{this.state.response.scheme ? `Url scheme: ${this.state.response.scheme}` : 'a'}</Text>
          <Text style={Styles1.text}>{this.state.response.path ? `Url path: ${this.state.response.path}` : 'b'}</Text>
          <Text style={Styles1.text}>{this.state.response.id ? `Url id: ${this.state.response.id}` : 'c'}</Text>
        </View>
      </View> */}
              
              </ScrollView>
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
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 200
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
});
export default User_profile;
