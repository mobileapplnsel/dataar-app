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
  ActivityIndicator,
  Linking
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
import DocumentIcon from '../../src/assets/images/outline_description_black_48.png';
import KeyboardManager from 'react-native-keyboard-manager';
import CheckBox from '@react-native-community/checkbox';
const RenderComponent = (props) => {
  return (<TextInput
  key={props.index}
      style={{ borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4,color:'gray'}}
      value={props.data[props.index].item}
      onChangeText={val => {
          let newArray = [...props.data];
          newArray[props.index].item = val
          props.setData(newArray);
          console.log(props.data); //always rerender when type one character.. please help!!
      }}
  />);
}

const RenderComponent1 = (props) => {
  return (<TextInput
  key={props.index}
  
  keyboardType = 'decimal-pad'
      style={{color:'gray' ,borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
      value={props.data[props.index].qty}
      onChangeText={val => {
          let newArray = [...props.data];
          newArray[props.index].qty = val
          props.setData(newArray);
          console.log(props.data); //always rerender when type one character.. please help!!
      }}
  />);
}



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
  const [selectedPANName, setselectedPANName] = useState('***Upload supported doc');
  const [selectedPANName1, setselectedPANName1] = useState('Upload supported doc 2');
  const [selectedPANName2, setselectedPANName2] = useState('Upload supported doc 3');
  const [selectedPANName3, setselectedPANName3] = useState('Upload supported doc 4');
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
  const [selectID, setselectID] = useState('2');
  const [showPicker, setshowPicker] = useState(false);
  const [showImagePicker, setshowImagePicker] = useState(false);
  const [ArrPref1, setArrPref1] = useState([]);
  const [ArrImagePicker, setArrImagePicker] = useState([{"name": "Take Photo", 'image': cameraIcon}, { "name": "Choose Photo", 'image': GalleryIcon}]);
  const [ArrImagePicker1, setArrImagePicker1] = useState([{"name": "Take Photo", 'image': cameraIcon}, { "name": "Choose Photo", 'image': GalleryIcon}, { "name": "Select Document", 'image': DocumentIcon}]);
  const [filePath, setFilePath] = useState({});
  const [progress, setprogress] = useState(false);

  const [showImagePicker1, setshowImagePicker1] = useState(false);
  const [showImagePicker2, setshowImagePicker2] = useState(false);
  const [showImagePicker3, setshowImagePicker3] = useState(false);
  const [showImagePicker4, setshowImagePicker4] = useState(false);

  const [selectedSDImage, setselectedSDImage] = useState('Upload supported doc (Mandatory)');
  const [selectedselectedSDImageSource, setselectedselectedSDImageSource] = useState('');
  const [selectedSDImageType, setselectedSDImageType] = useState('');

  const [selectedSDImage1, setselectedSDImage1] = useState('Upload supported doc 2 (Optional)');
  const [selectedselectedSDImageSource1, setselectedselectedSDImageSource1] = useState('');
  const [selectedSDImageType1, setselectedSDImageType1] = useState('');

  const [selectedSDImage2, setselectedSDImage2] = useState('Upload supported doc 3 (Optional)');
  const [selectedselectedSDImageSource2, setselectedselectedSDImageSource2] = useState('');
  const [selectedSDImageType2, setselectedSDImageType2] = useState('');

  const [selectedSDImage3, setselectedSDImage3] = useState('Upload supported doc 4 (Optional)');
  const [selectedselectedSDImageSource3, setselectedselectedSDImageSource3] = useState('');
  const [selectedSDImageType3, setselectedSDImageType3] = useState('');
  const [descriptionWarning, setdescriptionWarning] = useState('Description text must be minimum 50 characters');
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const [unitList, setunitList] = useState([])
  const [seachableModalVisible1, setseachableModalVisible1] = useState(false);
  const [unitSelectedIndex, setunitSelectedIndex] = useState(0);


  const [data, setData] = useState([
    {id: 1, item: "", qty: '', unit: ''},
    
]);



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

  const captureImage = async (type, flag) => {
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

        if (flag == 'CI')
        {
          setselectedCampaignImage(response.assets['0']['fileName']);
          setselectedCampaignImageSource(response.assets['0']['uri']);
          setselectedCampaignImageType(response.assets['0']['type']);
        }
        else if (flag == 'SD1')
        {
          setselectedSDImage(response.assets['0']['fileName']);
          setselectedselectedSDImageSource(response.assets['0']['uri']);
          setselectedSDImageType(response.assets['0']['type']);
        }
        else if (flag == 'SD2')
        {
          setselectedSDImage1(response.assets['0']['fileName']);
          setselectedselectedSDImageSource1(response.assets['0']['uri']);
          setselectedSDImageType1(response.assets['0']['type']);
        }
        else if (flag == 'SD3')
        {
          setselectedSDImage2(response.assets['0']['fileName']);
          setselectedselectedSDImageSource2(response.assets['0']['uri']);
          setselectedSDImageType2(response.assets['0']['type']);
        }
        else if (flag == 'SD4')
        {
          setselectedSDImage3(response.assets['0']['fileName']);
          setselectedselectedSDImageSource3(response.assets['0']['uri']);
          setselectedSDImageType3(response.assets['0']['type']);
        }
        

        
      });
    }
  };
  
  const chooseFile = async (flag) => {
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

      // setselectedCampaignImage(response.assets['0']['fileName']);
      // setselectedCampaignImageSource(response.assets['0']['uri']);
      // setselectedCampaignImageType(response.assets['0']['type']);

      if (flag == 'CI')
      {
        setselectedCampaignImage(response.assets['0']['fileName']);
        setselectedCampaignImageSource(response.assets['0']['uri']);
        setselectedCampaignImageType(response.assets['0']['type']);
      }
      else if (flag == 'SD1')
      {
        setselectedSDImage(response.assets['0']['fileName']);
        setselectedselectedSDImageSource(response.assets['0']['uri']);
        setselectedSDImageType(response.assets['0']['type']);
      }
      else if (flag == 'SD2')
      {
        setselectedSDImage1(response.assets['0']['fileName']);
        setselectedselectedSDImageSource1(response.assets['0']['uri']);
        setselectedSDImageType1(response.assets['0']['type']);
      }
      else if (flag == 'SD3')
      {
        setselectedSDImage2(response.assets['0']['fileName']);
        setselectedselectedSDImageSource2(response.assets['0']['uri']);
        setselectedSDImageType2(response.assets['0']['type']);
      }
      else if (flag == 'SD4')
      {
        setselectedSDImage3(response.assets['0']['fileName']);
        setselectedselectedSDImageSource3(response.assets['0']['uri']);
        setselectedSDImageType3(response.assets['0']['type']);
      }

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
  
  const selectOneFile = async (flag) => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
       
      });
      // setselectedPANName(res.name);
      // setselectedPANSource(res.uri);
      // setselectedPANType(res.type)

      if (flag == 'CI')
      {
        setselectedCampaignImage(res.name);
        setselectedCampaignImageSource(res.uri);
        setselectedCampaignImageType(res.type);
        
      }
      else if (flag == 'SD1')
      {
        setselectedSDImage(res.name);
        setselectedselectedSDImageSource(res.uri);
        setselectedSDImageType(res.type);
        setshowImagePicker1(false)
      }
      else if (flag == 'SD2')
      {
        setselectedSDImage1(res.name);
        setselectedselectedSDImageSource1(res.uri);
        setselectedSDImageType1(res.type);
        setshowImagePicker2(false)
      }
      else if (flag == 'SD3')
      {
        setselectedSDImage2(res.name);
        setselectedselectedSDImageSource2(res.uri);
        setselectedSDImageType2(res.type);
        setshowImagePicker3(false)
      }
      else if (flag == 'SD4')
      {
        setselectedSDImage3(res.name);
        setselectedselectedSDImageSource3(res.uri);
        setselectedSDImageType3(res.type);
        setshowImagePicker4(false)

      }

      
     
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
  const selectOneFile1 = async (flag) => {
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
     
      // setselectedCampaignImage(res.name);
      // setselectedCampaignImageSource(res.uri);
      // setselectedCampaignImageType(res.type);

      if (flag == 'CI')
      {
        setselectedCampaignImage(res.name);
        setselectedCampaignImageSource(res.uri);
        setselectedCampaignImageType(res.type);
      }
      else if (flag == 'SD1')
      {
        setselectedSDImage(res.name);
        setselectedselectedSDImageSource(res.uri);
        setselectedSDImageType(res.type);
      }
      else if (flag == 'SD2')
      {
        setselectedSDImage1(res.name);
        setselectedselectedSDImageSource1(res.uri);
        setselectedSDImageType1(res.type);
      }
      else if (flag == 'SD3')
      {
        setselectedSDImage2(res.name);
        setselectedselectedSDImageSource2(res.uri);
        setselectedSDImageType2(res.type);
      }
      else if (flag == 'SD4')
      {
        setselectedSDImage3(res.name);
        setselectedselectedSDImageSource3(res.uri);
        setselectedSDImageType3(res.type);
      }
      
     
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

    //  setNext(1);

    if (Title == '') {
      Alert.alert('Title', 'Please add Campaign Title');
    } else if (Description == '') {
      Alert.alert('Description', 'Please add Campaign Description');
    }
    else if (Description.length < 50) {
      Alert.alert('Description', 'Description text must be minimum 50 characters');
    }
     else if (pincode == 0 || pincode.trim() == '') {
      Alert.alert('PIN code', 'Please enter PIN where you wish to run your campaign');
    }
    
     else if (selectedCampaignImageSource == '') {
      Alert.alert('Image', 'Please add a campaign Image');
    } 
    // else if (selectID == '') {
    //   Alert.alert('Campaign type', 'Please select a campaign type');
    // }
     else if (strdate == null) {
      Alert.alert('Start Date', 'Please add a Date from that your campaign will start');
    } else if (endseldate == null) {
      Alert.alert('End Date', 'Please add End Date of your campaign');
    }
    
     else {
      setNext(1);
      
    }
  };
  const Next2 = () => {
    console.log(selCamp);
    if (selCamp === '') {
      Alert.alert('Campaign', 'Please select one');
    } else {
      if (selCamp == '1') {
        if (selectedSDImage === 'Upload supported doc (Mandatory)') {
          Alert.alert('Supportive Doc', 'Please add the Supportive doc');
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

  const Back1 = () => {
    setNext(0);

      setselCamp('');
    // setamount('');
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


  const getUnitList = async () => {
    var response = await API.post('kind_unit_list');
    console.log('kind_unit_list', response);
    if (response.status == 'success') {
      
      setunitList(response.data)
      // ArrPref1.push({name: 'All', id: 'all',})
      console.log(response.data);
      
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
      // else if (quantity.trim() == '') {
      //   Alert.alert('Quantity', 'Please enter quantity');
      // } 
      else if (KindMsg.trim() == '') {
        Alert.alert('Comments', 'Please elaborate your campaign');
      }
      else if (data[data.length - 1].item == '' || data[data.length - 1].qty == '' || data[data.length - 1].unit == '')
      {
        Alert.alert('Alet', 'Please populate all fields for the last line item or delete the last item if it is not more than 1 line item');
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
      }
     else if (toggleCheckBox == false)
      {
        Alert.alert('Agreement', 'Please accept Terms & Conditions');
      } 
       else {
        //setNext(3);
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
  const Start_CampaignNow1 = () => 
  {
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
    formdata.append('supported_doc', {uri: selectedselectedSDImageSource, name: selectedSDImage, type: selectedSDImageType});

    console.log('Start campaign parameters: ', JSON.stringify(formdata))
//https://dev.solutionsfinder.co.uk/dataar/api/add_campaign
    fetch('https://dataar.org/api/add_campaign', {
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


      var totalQty = 0

    for (var i = 0; i < data.length; i++) { 
      
      var qtyInt = parseInt(data[i]['qty'], 10)

      totalQty = totalQty + qtyInt
          
      
    }

    console.log('quantity====> ', String(totalQty));


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
      formdata.append('campaign_target_qty', String(totalQty));
      formdata.append('campaign_note', KindMsg);
      formdata.append('items', JSON.stringify(data));


      
    }
    else
    {


      var sd1, sd2, sd3
      
      if (selectedselectedSDImageSource1 == '')
      {
        sd1 = ''
      }
      else
      {
        sd1 = {uri: selectedselectedSDImageSource1, name: selectedSDImage1, type: selectedSDImageType1}
      }

      if (selectedselectedSDImageSource2 == '')
      {
        sd2 = ''
      }
      else
      {
        sd2 = {uri: selectedselectedSDImageSource2, name: selectedSDImage2, type: selectedSDImageType2}
      }

      if (selectedselectedSDImageSource3 == '')
      {
        sd3 = ''
      }
      else
      {
        sd3 = {uri: selectedselectedSDImageSource3, name: selectedSDImage3, type: selectedSDImageType3}
      }



      
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
         formdata.append('supported_doc_two', sd1);
         formdata.append('supported_doc_three', sd2);
         formdata.append('supported_doc_four', sd3);
         
     
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
    
      Alert.alert(response.status, response.message, [
        {text: 'OK', onPress: () => navigation.navigate('Dashboard')},
      ],
      {cancelable: false},);
      
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
      console.log('kind_list response: ',response);
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
      Toast.show('Please select Start date first', Toast.LONG)
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

  const selectItemOnDropDown1 = (item) => 
  {

setseachableModalVisible1(false)

    let newArray = [...data];
    newArray[unitSelectedIndex].unit = item.unit
    setData(newArray);
        
  }

  const removeCategoryItem = (index) => 
  {

    if (data.length > 1)
    {
    let newArray = [...data];
    newArray.splice(index, 1);
    setData(newArray);
    }
    else
    {
      Toast.show('Single item can not be deleted. You must have to add single item', Toast.LONG)
    }   
  }

  const setDescriptionString = (text) => 
  {
    setDescription(text)
    if (text.length >= 50)
    {
      setdescriptionWarning('')
    }
    else
    {
      setdescriptionWarning('Description text must be minimum 50 characters')
    }
  }

const SelectUnit = (index) => 
  {

    getUnitList();
   setunitSelectedIndex(index);
    setseachableModalVisible1(true)
  }

  const renderItem = ({item, index}) => (
    <View style={{padding: 5}}>
      <View style={{flexDirection:'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 0}}>
      <View style={{flexDirection:'column', width: '30%', marginRight: '2%'}}>
        <Text style={{marginBottom: 5}}>Item Name</Text>
        <RenderComponent item={item} index={index} data={data} setData={setData} />
        </View>
        <View style={{flexDirection:'column', width: '18%', marginRight: '2%'}}>
        <Text style={{marginBottom: 5}}>Qty </Text>
        <RenderComponent1 item={item} index={index} data={data} setData={setData} />
        </View>
        <View style={{flexDirection:'column', width: '28%', marginRight: '2%'}}>
        <Text style={{marginBottom: 5}}>Unit </Text>
        {/* { Platform.OS === 'android' ?  */}
<TouchableOpacity onPress={() => SelectUnit(index)}>
<View style={{borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}>
            <View style={{flex:1, maxWidth: 414, backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{paddingLeft:4,color: 'gray', fontSize: 16, marginTop: 8}}>{item.unit}</Text>
                <View style={{width:15, height:15, justifyContent: 'flex-end', marginRight: 15, marginTop: 14}}>
                  <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24}} />
                </View>
                
              </View>
              </View>
              </TouchableOpacity> 
{/* :
             


<View style={{borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}>
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
                </Picker></View>

                  } */}
                 

        </View>
       
                  <TouchableOpacity  style={{flexDirection:'column', width: '6%', }} onPress={() => removeCategoryItem(index)}>
            <Image style={{ resizeMode: 'contain', height: 32, width: 32, marginTop: 21, tintColor: '#f55656'
}}
source={require('../../src/assets/images/outline_remove_circle_outline_black_36pt_2x.png')}>
</Image> 
</TouchableOpacity>
       
        </View>
    </View>
);

    
const add_more = (id) => {

  if (data.length == 10)
  {
    Alert.alert("Alert", "You can not add more than 10 items");
  }
  else if (data[data.length - 1].item == '')
  {
    Alert.alert("Item Name", "Please enter Item Name for the last item");
  }
  else if (data[data.length - 1].qty == '')
  {
    Alert.alert("Quantity", "Please enter Quantity for the last item");
  }
  else if (data[data.length - 1].unit == '')
  {
    Alert.alert("Unit", "Please select Unit for the last item");
  }
  else
  {
  let newArray = [...data];
  console.log('newArray: ', newArray)
  newArray.push({id: id, item: '', qty: '', unit: ''})
  setData(newArray);
  console.log('newArray1: ', data)
  }
}

// const RenderComponent2 = (props) => {
//   return (<TextInput
//   key={props.index}
//       style={{borderWidth: 1, borderColor: '#f55656', height: 40, paddingLeft: 4, borderRadius: 4}}
//       value={props.data[props.index].unit}
//       onChangeText={val => {
//           let newArray = [...props.data];
//           newArray[props.index].unit = val
//           props.setData(newArray);
//           console.log(props.data); //always rerender when type one character.. please help!!
//       }}
//   />);
// }
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
                value={Title}
              />
              <TextInput
                placeholder="Description"
                onChangeText={text => setDescriptionString(text)}
                style={Styles.login_text_input}
                keyboardType="default"
                placeholderTextColor='grey'
                value={Description}
              />

<Text style={ {
  marginTop: 5,
  color: 'red',
  fontSize: 11,
  marginBottom: 10,
  // alignSelf: 'center',
  paddingLeft: 13
}}>{descriptionWarning}</Text>

              <TextInput
                placeholder="Pincode"
                onChangeText={text => setpincode(text)}
                style={Styles.login_text_input}
                keyboardType="number-pad"
                placeholderTextColor='grey'
                value={pincode}
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
                        setTimeout(() => {
                          // this.captureImage()
                          captureImage('photo', 'CI')
                       }, 1100);

                      }
                      else
                      {
                        setshowImagePicker(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1('CI')
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile('CI')
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
}}>{'Only Image format is acceptable and Image size should not be more than 1MB'}</Text>



              {/* <Selector
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
                      console.log('item: ', item)
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
                          lineHeight: 40,
                        },
                        // this.state.genderValue == item.name,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            /> */}


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
                  placeholder="End Date"
                  marginTop={normalize(15)}
                  // onPress={() => setShowPicker(true)}
                  icon={require('../../src/assets/images/calendar.jpg')}
                  onPress={() => ExpiryDatebtnPressed()}
                />
              </View>
              <TouchableOpacity onPress={() => Next()} style={Styles.campaign_btn_next}>
                <Text
                  style={Styles.campaign_text_upload}>
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
                <Selector
              text={selectedSDImage}
              placeholder="Gender"
              onPress={() => setshowImagePicker1(true)}
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
              dataList={ArrImagePicker1}
              modalVisible={showImagePicker1}
              onBackdropPress={() => setshowImagePicker1(false)}
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
                        setshowImagePicker1(false)
                        setTimeout(() => {
                          // this.captureImage()
                          captureImage('photo', 'SD1')
                       }, 1100);

                      }
                      else if (item.name == 'Select Document')
                      {
                        
                        
                          
                          selectOneFile('SD1')
                         
                        

                      }
                      else
                      {
                        setshowImagePicker1(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1('SD1')
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile('SD1')
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
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Only PDF or Image format is acceptable'}</Text>
        </View>) : null}

        {selCamp =="1" ?  ( <View> 
          <Selector
              text={selectedSDImage1}
              placeholder="Gender"
              onPress={() => setshowImagePicker2(true)}
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
              dataList={ArrImagePicker1}
              modalVisible={showImagePicker2}
              onBackdropPress={() => setshowImagePicker2(false)}
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
                        setshowImagePicker2(false)
                        setTimeout(() => {
                          // this.captureImage()
                          captureImage('photo', 'SD2')
                       }, 1100);

                      }
                      else if (item.name == 'Select Document')
                      {
                        selectOneFile('SD2')

                      }
                      else
                      {
                        setshowImagePicker2(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1('SD2')
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile('SD2')
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
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Only PDF or Image format is acceptable'}</Text>
        </View>) : null}

        {selCamp =="1" ?  ( <View> 
          <Selector
              text={selectedSDImage2}
              placeholder="Gender"
              onPress={() => setshowImagePicker3(true)}
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
              dataList={ArrImagePicker1}
              modalVisible={showImagePicker3}
              onBackdropPress={() => setshowImagePicker3(false)}
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
                        setshowImagePicker3(false)
                        setTimeout(() => {
                          // this.captureImage()
                          captureImage('photo', 'SD3')
                       }, 1100);

                      }
                      else if (item.name == 'Select Document')
                      {
                        selectOneFile('SD3')

                      }
                      else
                      {
                        setshowImagePicker3(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1('SD3')
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile('SD3')
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
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Only PDF or Image format is acceptable'}</Text> 
        </View>) : null}

        {selCamp =="1" ?  ( <View> 
          <Selector
              text={selectedSDImage3}
              placeholder="Gender"
              onPress={() => setshowImagePicker4(true)}
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
              dataList={ArrImagePicker1}
              modalVisible={showImagePicker4}
              onBackdropPress={() => setshowImagePicker4(false)}
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
                        setshowImagePicker4(false)
                        setTimeout(() => {
                          // this.captureImage()
                          captureImage('photo', 'SD4')
                       }, 1100);

                      }
                      else if (item.name == 'Select Document')
                      {
                        selectOneFile('SD4')

                      }
                      else
                      {
                        setshowImagePicker4(false)
                        
                         if (Platform.OS === 'android')
                         {
                          selectOneFile1('SD4')
                         }
                         else
                         {
                          setTimeout(() => {
                            chooseFile('SD4')
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
   marginTop: 5,
  color: 'green',
  fontSize: 11,
  marginBottom: -5,
  marginLeft: 10,
}}>{'Only PDF or Image format is acceptable'}</Text> 
        </View>) : null}


        <View style={Styles.campaign_name_contain}>
                <TouchableOpacity
                  style={Styles.campaign_btn_back}
                  onPress={() => Back1()}>
                  <Text style={Styles.campaign_text_upload}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={Styles.campaign_btn_next2}
                onPress={() => Next2()}>
                <Text style={Styles.campaign_text_upload}>Next</Text>
              </TouchableOpacity>
              </View>

              
            </View>
          ) : null}

{ progress && <ActivityIndicator  color={'#f55656'} size="large" style={{
            position: 'absolute',
             left: 0,
             right: 0,
             top: 160,
             bottom: 0,
             alignItems: 'center',
             justifyContent: 'center'
          }} /> }

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
              <View style = {{flexDirection: 'row',}}>
              <CheckBox
              style={{ margin: 10}}
              boxType = {'square'}
              onCheckColor = 'white'
              onFillColor = '#f55656'
              onTintColor = '#f55656'
              he
    disabled={false}
    value={toggleCheckBox}
    onValueChange={(newValue) => setToggleCheckBox(newValue)}
  />
  <Text style={{
  color: 'black',
  fontSize: 13,
  marginLeft: 1,
  marginTop: 18,
  fontStyle: 'italic',
}}>{'I have read and agree to the Dataar '}</Text> 

<TouchableOpacity
                    style={[
                      {
                        marginTop: 18,
                        marginStart: 0, 
                        marginEnd: 10,
                        width: '100%',
                      },
                    ]}
                    onPress={() => Linking.openURL('https://dataar.org/terms-and-condition')}>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    // textDecorationLine: 'underline'
                  }}>
                    T&C
                  </Text>
                  </TouchableOpacity>
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
             

            <View style={{ backgroundColor: null, flexDirection:'row', justifyContent:'space-between'}}>
                
                <Picker
                  selectedValue={selectedValue}
                  style={{
                    height: 50,
                    width: '50%',
                    color:'black',
                    backgroundColor:'white',
                    borderColor: '#000',
                    alignSelf: 'center',
                    borderWidth: 1,
                  }}
                  onValueChange={
                    (itemValue, itemIndex) => setselectedValue(itemValue)
                    // console.log(itemValue)
                    // Alert.alert(itemValue)
                  }>
                  <Picker.Item label="Select one" color='gray' value="" />
                  {kind.map((item, index) => (
                    <Picker.Item label={item.kind_name} color='gray' value={item.kind_id} />
                  ))}
                </Picker>
               
                
                <Image source={require("../../src/assets/images/down_arrow.png")} style={{width:24, height:24,marginRight:200,marginTop:15}} />
               
                
              </View>

                  }



<View style={{flex: 1, marginTop: 15}}>
        
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />

    </View>

    <TouchableOpacity
                  style={{
                    width: 160,
                    height: 45,
                    // marginLeft: 12,
                    marginTop: 15,
                    backgroundColor: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => add_more(data.length + 1)}>
                  <Text style={Styles.campaign_text_upload}>
                    Add More
                  </Text>
                </TouchableOpacity>

{/* <TextInput
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
                
                  
                /> */}

                

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
              <View style={{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    paddingStart: 10,
    paddingTop: 10,
    paddingEnd: 10,
    marginBottom: 180
  }}>
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



        <Modal transparent={true} animationType="none" visible={progress}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          //  backgroundColor: `rgba(0,0,0,${0.6})`,
          width: '100%',
          height: '100%'
        }}
      >
        <View
          style={{
            padding: 13,
            backgroundColor: 'grey',
            borderRadius: 3,
            marginTop: '90%'
          }}
        >
          <ActivityIndicator animating={progress} color={'white'} size="large" />
          <Text style={{ color: `${'white'}` }}>{'Wait a moment....'}</Text>
        </View>
      </View>
    </Modal>
        
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

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={seachableModalVisible1}
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
          data={unitList}
          renderItem={({ item }) => (
          <View>
        <TouchableOpacity onPress={() => selectItemOnDropDown1(item)}>
        <Text style={{ padding: 10, color: 'white' }}>{item.unit} </Text>
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
        minDate={new Date()}
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
