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
  Modal,
  FlatList,
  Platform,
  PermissionsAndroid,
  ActivityIndicator
  // Picker,
} from 'react-native';
import {
  Container,
  // TextInput,
} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import Selector from '../components/Selector';
import PickerDob from '../components/Picker';
import DateTimePicker from '../components/DateTimePicker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import cameraIcon from '../../src/assets/images/outline_photo_camera_black_48.png';
import GalleryIcon from '../../src/assets/images/outline_collections_black_48.png';
import KeyboardManager from 'react-native-keyboard-manager';
const StartCampaign = ({navigation}) => {
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');

  const [date, setdate] = useState(new Date());
  const [image, setImage] = useState('');
  const [imageType, setImagetype] = useState('');
  const [amount, setamount] = useState('');
  const [quantity, setquantity] = useState('');
  const [KindMsg, setKindMsg] = useState('');
  const [isNext, setNext] = useState(0);
  const [pincode, setpincode] = useState(0);
  const [selCamp, setselCamp] = useState('');
  const [mode, setMode] = useState('date');
  const [selectedValue, setselectedValue] = useState('');
  const [selectedKindValue, setselectedKindValue] = useState('Select One');
  const [kind, setkind] = useState([]);
  const [isStartPickerVisible, setisStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setisEndPickerVisible] = useState(false);
  const [strdate, setSdate] = useState(null);
  const [endseldate, setenddate] = useState(null);
  const [selectedPANName, setselectedPANName] = useState('Upload supported doc');
  const [selectedCampaignImage, setselectedCampaignImage] = useState('Upload Campaign Image');
  const [selectedCampaignImageSource, setselectedCampaignImageSource] = useState('');
  const [selectedCampaignImageType, setselectedCampaignImageType] = useState('');
  const [selectedPANSource, setselectedPANSource] = useState('');
  const [selectedPANType, setselectedPANType] = useState('');
  const [filebaseString, setfilebaseString] = useState('');
  const [minEndDate, setminEndDate] = useState('');
  const [seachableModalVisible, setseachableModalVisible] = useState(false);
  const [selectType, setselectType] = useState('Select Type');
  const [selectImageType, setselectImageType] = useState('Upload Image');
  const [selectID, setselectID] = useState('');
  const [showPicker, setshowPicker] = useState(false);
  const [showImagePicker, setshowImagePicker] = useState(false);
  const [ArrPref1, setArrPref1] = useState([]);
  const [ArrImagePicker, setArrImagePicker] = useState([{"name": "Take Photo", 'image': cameraIcon}, { "name": "Choose Photo", 'image': GalleryIcon}]);
  const [filePath, setFilePath] = useState({});
  const [progress, setprogress] = useState(false);
  
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
        setselectedCampaignImage(response.assets['0']['fileName']);
        setselectedCampaignImageSource(response.assets['0']['uri']);
        setselectedCampaignImageType(response.assets['0']['type']);
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

      setselectedCampaignImage(response.assets['0']['fileName']);
      setselectedCampaignImageSource(response.assets['0']['uri']);
      setselectedCampaignImageType(response.assets['0']['type']);

      // console.log('base64 -> ', response.assets['0']['fileName']);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      setFilePath(response);
    });
  };
  
  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
       
      });
      setselectedPANName(res.name);
      setselectedPANSource(res.uri);
      setselectedPANType(res.type)
     
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
  var radio_props = [
    {label: 'Money  ', value: '1'},
    {label: 'In Kind', value: '2'},
  ];
  const Next = () => {
    console.log(
      Title === '' &&
        Description === '' &&
        strdate === '' &&
        endseldate === '' &&
        image === '',
    );
    if (Title == '') {
      Alert.alert('Title', 'Please add Campaign Title');
    } else if (Description == '') {
      Alert.alert('Description', 'Please add Campaign Description');
    } else if (pincode == 0 || pincode.trim() == '') {
      Alert.alert('PIN code', 'Please enter PIN where you wish to run your campaign');
    }
    
     else if (selectedCampaignImageSource == '') {
      Alert.alert('Image', 'Please add a campaign Image');
    } else if (selectID == '') {
      Alert.alert('Campaign type', 'Please select a campaign type');
    }
     else if (strdate == null) {
      Alert.alert('Start Expiry Date', 'Please add a Date from that your campaign will start');
    } else if (endseldate == null) {
      Alert.alert('End Expiry Date', 'Please add End Expiry Date of your campaign');
    }
    
     else {
      setNext(1);
      // if (Description == '') {
      //   Alert.alert('Description', 'Please Add Description');
      // } else if (strdate == '') {
      //   Alert.alert('Start Date', 'Please Add Start Date');
      // } else if (endseldate == '') {
      //   Alert.alert('End Date', 'Please Add End Date');
      // } else if (image == '') {
      //   Alert.alert('Image', 'Please Add Image');
    }
  };
  const Next2 = () => {
    console.log(selCamp);
    if (selCamp === '') {
      Alert.alert('Campaign', 'Please select one');
    } else {
      if (selCamp == '1') {
        if (selectedPANName === 'Upload supported doc') {
          Alert.alert('Supportive Doc', 'Please add Supportive doc');
        }
       else
       {
       setNext(2);
       }
       
      } else {
        
        setNext(3);
      }
    }
  };
  const Back = () => {
    setNext(1);
    setselCamp('');
    setamount('');
  };
  const getPreferences = async () => {
    var response = await API.post('filter_by_type_list');
    console.log('filter_by_type_list', response);
    if (response.status == 'success') {
      
      setArrPref1([...response.data])
      // ArrPref1.push({name: 'All', id: 'all',})
      console.log(ArrPref1);
      
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  const Start_Campaign = () => {

     if (selCamp == '2')
     {
      if (selectedValue == '') {
        Alert.alert('In Kind Object', 'Please select any of the In Kind object');
      }
      else if (quantity.trim() == '') {
        Alert.alert('Quantity', 'Please enter quantity');
      } else if (KindMsg.trim() == '') {
        Alert.alert('Comments', 'Please elaborate your campaign');
      }
       else {
        // setNext(3);
        setprogress(true)
        Start_CampaignNow();
      }
     } else if (selCamp == '1')
     {
      if (amount == '') {
        Alert.alert('Amount', 'Please Add Amount');
      } else {
        // setNext(3);
        setprogress(true)
        Start_CampaignNow();
      }
     }
  };
  const setExpirystart = selectedDate => {
    var date = selectedDate.nativeEvent.timestamp;
    let formatted = moment(date, 'x').format('YYYY-MM-DD');
    console.log('selectedDate', formatted);
    setSdate(formatted);
    // setisStart(false);
  };
  const setExpiryend = selectedDate => {
    var date = selectedDate.nativeEvent.timestamp;
    let formatted = moment(date, 'x').format('YYYY-MM-DD');
    console.log('selectedDate', formatted);
    setenddate(formatted);
    // setisEnd(false);
  };
  const upload = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 0.5,
      cropping: true,
      includeBase64: false,
    }).then(image => {
      imageUpload(image);
       console.log(image);
    });
  };
  const imageUpload = image => {
    let item = {
      // id: Date.now(),
      url: image.data,
      // content: image.data,
    };
    // const fileToUpload = this.state.newDataImg;

    setImage(item.url);
    setImagetype(image.mime);
    // console.log(image.path);
  };
  const Start_CampaignNow1 = () => {
    var formdata = new FormData();
    formdata.append('user_id', '1');
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

    fetch('https://dev.solutionsfinder.co.uk/dataar/api/add_campaign', {
      method: 'POST',
      headers: {
        Accept: '*/*',
         'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTEwIiwiZmlyc3RfbmFtZSI6IkNsaWVudDIiLCJsYXN0X25hbWUiOiJEb25lZTEiLCJlbWFpbCI6ImNsaWVudGRvbmVlQHlvcG1haWwuY29tIiwiQVBJX1RJTUUiOjE2NDU3ODM0Nzl9.JFpGei49NSS8DehLkSgLoC6LuXqV1vLSI6uFwUYzGKk',
      },
      body: formdata

  })
      .then((response) => { 
        console.log('Start campaign response: ', response)
          // loginUserSuccess(dispatch, response)
      })
      .catch((ERROR) => {
        console.log('Start campaign response ERROR: ', ERROR)
          // loginUserFailed(dispatch, response)
      })

    // var response = await API.postWithFormData('add_campaign', formdata);

    // console.log('Start campaign response: ', response)

    // if (response.status == 'success') {
    //   navigation.navigate('Dashboard');
    //   Alert.alert(response.status, response.message);
    // } else {
    //   Alert.alert(response.status, response.message);
    //   navigation.navigate('Dashboard');
    // }
  };
  const Start_CampaignNow = async () => {
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
       formdata.append('supported_doc', {uri: selectedPANSource, name: selectedPANName, type: selectedPANType});
    }
    



    //  formdata.append('campaign_name', 'Title');
    // formdata.append('donation_mode', selCamp);
    // formdata.append('campaign_details', Description);
    // formdata.append('campaign_start_date', strdate);
    // formdata.append('campaign_end_date', endseldate);
    // formdata.append('campaign_image', {uri: selectedCampaignImageSource, name: selectedCampaignImage, type: selectedCampaignImageType});
    // formdata.append('campaign_target_amount', amount);
    // formdata.append('kind_id', selectedValue);
    // formdata.append('filter_by_type', selectID);
    // formdata.append('zip', pincode);
    // formdata.append('campaign_target_qty', quantity);
    // formdata.append('supported_doc', {uri: selectedPANSource, name: selectedPANName, type: selectedPANType});

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
  const startDate = () => {
    // setisStart(true);
  };
  const endDate = () => {
    // setisEnd(true);
  };
  const hideDatePicker = () => {
    // setisStart(false);
  };
  const fetchkind = async () => {
    var response = await API.post('kind_list');
    if (response.status == 'success') {
      console.log(response);
      setkind(response.data);
    } else {
      Alert.alert(response.status, response.message);
    }
  };
  useEffect(() => {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
    }
    fetchkind();
    getPreferences();
  }, []);
  const user = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      navigation.navigate('User profile');
    } else {
      navigation.navigate('LogIn');
    }
  };
  const ExpiryDatebtnPressed = () => {
    if (strdate == null)
    {
      Toast.show('Please select Start Expiry date first', Toast.LONG)
    }
    else
    {
      console.log('startDate: ', strdate)
      setminEndDate(strdate)
      setisEndPickerVisible(true)
      
    }
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'white',
        }}
      />
    );
  };
  const renderSearchableData =  (item)  => {
    console.log('renderSearchableData111 ==> ', item)
    return (
      <View>
        <TouchableOpacity onPress={() => selectItemOnDropDown(item)}>
        <Text style={{ padding: 10, color: 'white' }}>{item.kind_name} </Text>
        </TouchableOpacity>
      </View>
    );
   }
   const selectItemOnDropDown = (item) => 
  {

console.log('selectItemOnDropDown', item)
setselectedKindValue(item.kind_name)
setseachableModalVisible(false)
setselectedValue(item.kind_id)
    // if (selectedComboFlag == 'document')
    // {
    //   this.setState({ seachableModalVisible: false, selectedParcelType: item.name,})
    // }
    
    //  if (selectedComboFlag == 'domestic')
    // {
    //   this.setState({ seachableModalVisible: false, selectedParcelType2: item.name,})
    // }
    

    

    
  }
  return (
   
      <Container>
        
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.login_main}>
          <SafeAreaView style={Styles.dashboard_main_header}>
            <View style={Styles.dashboard_main_headers}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
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
              </TouchableOpacity>
              <TouchableOpacity onPress={() => user()}>
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
         { progress && <ActivityIndicator  color={'#f55656'} size="large" style={{
            position: 'absolute',
             left: 0,
             right: 0,
             top: 0,
             bottom: 0,
             alignItems: 'center',
             justifyContent: 'center'
          }} /> }
          
          {isNext == 0 ? (
            <ScrollView>

<View style={Styles.login_text_main}>
            <Text style={Styles.campaign_name_font}>Start Campaign</Text>
          </View>

            <View style={Styles.login_text_input_contain}>
              <Text style={Styles.campaign_text_font}>Step 1</Text>
              <TextInput
                placeholder="Title"
                onChangeText={text => setTitle(text)}
                style={Styles.login_text_input}
                keyboardType="default"
                placeholderTextColor='grey'
              />
              <TextInput
                placeholder="Description"
                onChangeText={text => setDescription(text)}
                style={Styles.login_text_input}
                keyboardType="default"
                placeholderTextColor='grey'
              />
              <TextInput
                placeholder="Pincode"
                onChangeText={text => setpincode(text)}
                style={Styles.login_text_input}
                keyboardType="number-pad"
                placeholderTextColor='grey'
              />
             









{/* { Platform.OS === 'android' ? <TouchableOpacity
          activeOpacity={0.5}
          onPress={selectOneFile1}>
            <View style={ {
  alignItems: 'center',
  flexDirection: 'row',
  //backgroundColor: '#DDDDDD',
  paddingTop: 20,
  paddingBottom: 10,
  alignSelf: 'center'
}}> 
          <Text style={{marginRight: 10, fontSize: 17}}>
            {selectedCampaignImage}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
          </View>
        </TouchableOpacity>

:

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={chooseFile}>
            <View style={ {
  alignItems: 'center',
  flexDirection: 'row',
  //backgroundColor: '#DDDDDD',
  paddingTop: 20,
  paddingBottom: 10,
  alignSelf: 'center'
}}> 
          <Text style={{marginRight: 10, fontSize: 17}}>
            {selectedCampaignImage}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
          </View>
        </TouchableOpacity> } */}
       

        {/* <TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle1}
          onPress={() => chooseFile('photo')}>
          <Text style={Styles1.textStyle}>Choose Image</Text>
        </TouchableOpacity> */}



<Selector
              text={selectedCampaignImage}
              placeholder="Gender"
              onPress={() => setshowImagePicker(true)}
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
              modalVisible={showImagePicker}
              onBackdropPress={() => setshowImagePicker(false)}
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
                        setshowImagePicker(false)
                        captureImage()

                      }
                      else
                      {
                        setshowImagePicker(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1()
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile()
                           // this.props.navigation.navigate('start')}
                         }, 2000);
                          
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



              <Selector
              text={selectType}
              placeholder="Gender"
              onPress={() => setshowPicker(true)}
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
              dataList={ArrPref1}
              modalVisible={showPicker}
              onBackdropPress={() => setshowPicker(false)}
              renderData={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // this.user_filter(item.name, item.id);
                      // this.setState({gender: item.name});
                      // this.setState({showPicker: false});
                      setshowPicker(false)
                      setselectType(item.name)
                      setselectID(item.id)

                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                    }}>
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 14,
                        },
                        // this.state.genderValue == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />


              <View style={Styles.user_edit_contain}>
                <Selector
                  text={strdate ? moment(strdate).format('DD / MM / YYYY') : ''}
                  placeholder="Start Date"
                  marginTop={normalize(15)}
                  // onPress={() => setShowPicker(true)}
                  icon={require('../../src/assets/images/calendar.jpg')}
                  onPress={() => setisStartPickerVisible(true)}
                />
              </View>
              <View style={Styles.user_edit_contain}>
                <Selector
                  text={
                    endseldate
                      ? moment(endseldate).format('DD / MM / YYYY')
                      : ''
                  }
                  placeholder="Expiry Date"
                  marginTop={normalize(15)}
                  // onPress={() => setShowPicker(true)}
                  icon={require('../../src/assets/images/calendar.jpg')}
                  onPress={() => ExpiryDatebtnPressed()}
                />
              </View>
              <TouchableOpacity style={Styles.campaign_btn_next}>
                <Text
                  style={Styles.campaign_text_upload}
                  onPress={() => Next()}>
                  Next
                </Text>
              </TouchableOpacity>
              <View style={{marginBottom: 20}}></View>
            </View>
           </ScrollView>
           
          ) : null}
 
          {isNext == 1 ? (
            <View style={Styles.login_text_input_contain}>
              <Text style={Styles.campaign_text_font}>Step 2</Text>
              <Text style={Styles.campaign_name_font}>
                Select Type of Campaign
              </Text>
              <View style={Styles.campaign_radio_contain}>
                <RadioForm
                  radio_props={radio_props}
                  initial={-1}
                  formHorizontal={true}
                  onPress={value => {
                    setselCamp(value);
                  }}
                />
              </View>

              {selCamp =="1" ?  ( <View> 
                <TouchableOpacity
          activeOpacity={0.5}
          onPress={selectOneFile}>
            <View style={Styles1.buttonStyle}> 
          <Text style={{marginRight: 10, fontSize: 17}}>
            {selectedPANName}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
          </View>
        </TouchableOpacity>
       

        <Text style={Styles1.warningHint}>{'Only PDF or Image format is acceptable'}</Text> 
        </View>) : null}

              <TouchableOpacity
                style={Styles.campaign_btn_next2}
                onPress={() => Next2()}>
                <Text style={Styles.campaign_text_upload}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {isNext == 2 ? (
            <View style={Styles.login_text_input_contain}>
              <Text style={Styles.campaign_text_font}>Step 3</Text>
              <Text style={Styles.campaign_name_font}>
                Enter Donation Amount Target
              </Text>
              <TextInput
                placeholder="Enter Donation Amount"
                onChangeText={text => setamount(text)}
                style={Styles.campaign_text_input}
                keyboardType="number-pad"
                placeholderTextColor='grey'
              />
              <View style={Styles.campaign_name_contain}>
                <TouchableOpacity
                  style={Styles.campaign_btn_back}
                  onPress={() => Back()}>
                  <Text style={Styles.campaign_text_upload}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={Styles.campaign_btn_start}
                  onPress={() => Start_Campaign()}>
                  <Text style={Styles.campaign_text_upload}>
                    Start Campaign
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {isNext == 3 ? (
            
            <View style={Styles.login_text_input_contain}>
              <ScrollView>
              <Text style={Styles.campaign_text_font}>Step 3</Text>
              <Text style={Styles.campaign_name_font}>
                Enter the kind of Donation
              </Text>
              <View style={{justifyContent: 'center', marginTop: 10}}>


              { Platform.OS === 'ios' ? 
<TouchableOpacity onPress={() => setseachableModalVisible(true)}>
<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', height: 40,
      margin: 0,
      marginTop: 11}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:13,color: 'gray', fontSize: 16,}}>{selectedKindValue}</Text>
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
                    height: 50,
                    width: '80%',
                    borderColor: '#000',
                    alignSelf: 'center',
                    borderWidth: 1,
                  }}
                  onValueChange={
                    (itemValue, itemIndex) => setselectedValue(itemValue)
                    // console.log(itemValue)
                    // Alert.alert(itemValue)
                  }>
                  <Picker.Item label="Select one" value="" />
                  {kind.map((item, index) => (
                    <Picker.Item label={item.kind_name} value={item.kind_id} />
                  ))}
                </Picker>

                  }


<TextInput
                  placeholder="Please enter quantity"
                  onChangeText={text => setquantity(text)}
                  style={{
                    height: 45,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: '#dcdedc',
                    height: 45,
                    // borderBottomColor: '#000',
                    // borderBottomWidth: 1,
                    // paddingTop:20,
                    marginTop: 20,
                    color: 'black',
                    borderRadius: 4,
                    padding: 7
                  }}
                  textAlignVertical={'top'}
                  keyboardType="number-pad"
                  placeholderTextColor='grey'
                
                  
                />

                <TextInput
                  placeholder="Please elaborate about your campaign"
                  onChangeText={text => setKindMsg(text)}
                  style={{
                    height: 45,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: '#dcdedc',
                    height: 110,
                    // borderBottomColor: '#000',
                    // borderBottomWidth: 1,
                    // paddingTop:20,
                    marginTop: 20,
                    color: 'black',
                    borderRadius: 4,
                    padding: 7
                  }}
                  textAlignVertical={'top'}
                  // keyboardType = 'name-phone-pad'
                  placeholderTextColor='grey'
                  multiline={true}
     numberOfLines={5}
                  
                />
              </View>
              <View style={Styles.campaign_name_contain}>
                <TouchableOpacity
                  style={Styles.campaign_btn_back}
                  onPress={() => Back()}>
                  <Text style={Styles.campaign_text_upload}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.campaign_btn_start}
                  onPress={() => Start_Campaign()}>
                  <Text style={Styles.campaign_text_upload}>
                    Start Campaign
                  </Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
            </View>
          ) : null}


          
    

        </ImageBackground>
        
        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={seachableModalVisible}
                        >
                            <View style={{ height: 500, marginTop: 112 }}>
                                <View style={{
          height: 232,
          width: '80%',
          alignSelf: 'center',
          marginTop: 100,
          backgroundColor: '#f55656',
          borderRadius: 6
        }}>
        <FlatList
          data={kind}
          renderItem={({ item }) => (
          <View>
        <TouchableOpacity onPress={() => selectItemOnDropDown(item)}>
        <Text style={{ padding: 10, color: 'white' }}>{item.kind_name} </Text>
        </TouchableOpacity>
      </View>
      )} 
           keyExtractor={item => item.kind_id}
          ItemSeparatorComponent={renderSeparator}
        />
     
                                </View>

                                {/* <TouchableOpacity onPress={() => { this.setState({ seachableModalVisible: false }) }}>
                                    <View style={styles.cancelStyle}>
                                        <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: 16, color: 'white' }}>Cancel</Text>
                                    </View>
                                </TouchableOpacity> */}

                            </View>
                        </Modal>




      <DateTimePicker
        value={strdate == null ? new Date(moment().toISOString()) : strdate}
          maxDate={new Date("2040-12-31")}
        minDate={new Date("2010-12-31")}
        dateTimePickerVisible={isStartPickerVisible}
        onDateChange={val => setSdate(val)}
        onBackdropPress={() => setisStartPickerVisible(false)}
        onPressDone={() => setisStartPickerVisible(false)}
      />
      <DateTimePicker
        value={
          endseldate == null ? new Date(String(strdate)) : endseldate
        }
         maxDate={new Date("2050-12-31")}
        minDate={new Date(String(minEndDate))}
        dateTimePickerVisible={isEndPickerVisible}
        onDateChange={val => setenddate(val)}
        onBackdropPress={() => setisEndPickerVisible(false)}
        onPressDone={() => setisEndPickerVisible(false)}
      />
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
  marginBottom: 10,
  alignSelf: 'center',
  paddingLeft: -80
},
buttonStyle: {
  alignItems: 'center',
  flexDirection: 'row',
  //backgroundColor: '#DDDDDD',
  paddingTop: 10,
  paddingBottom: 10,
  alignSelf: 'center'
},
imageIconStyle: {
  height: 20,
  width: 20,
  resizeMode: 'stretch',
},
buttonStyle1: {
  alignItems: 'center',
  backgroundColor: '#DDDDDD',
  padding: 5,
  marginVertical: 10,
  width: 250,
},
textStyle: {
  padding: 10,
  color: 'black',
  textAlign: 'center',
},
})
export default StartCampaign;
