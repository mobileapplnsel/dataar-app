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
const StartCampaign = ({navigation}) => {
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');

  const [date, setdate] = useState(new Date());
  const [image, setImage] = useState('');
  const [imageType, setImagetype] = useState('');
  const [amount, setamount] = useState('');
  const [quantity, setquantity] = useState('');
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
  const [selectedPANSource, setselectedPANSource] = useState('');
  const [filebaseString, setfilebaseString] = useState('');
  const [minEndDate, setminEndDate] = useState('');
  const [seachableModalVisible, setseachableModalVisible] = useState(false);
  const [selectType, setselectType] = useState('Select Type');
  const [selectID, setselectID] = useState('');
  const [showPicker, setshowPicker] = useState(false);
  const [ArrPref1, setArrPref1] = useState([]);
  
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
      // pdfpath = res.uri
      // filename1 = res.name
      setselectedPANName(res.name);
      setselectedPANSource(res.uri);
     
      //  RNFetchBlob.fs
      //     .readFile(res.uri, 'base64')
      //     .then((data) => {
      //       setfilebaseString(data)
      //       console.log('base : ' +data);
      //      })
      //     .catch((err) => { console.log('err : ' +err);});
       
       
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
      Alert.alert('Title', 'Please add Title');
    } else if (Description == '') {
      Alert.alert('Description', 'Please add Description');
    } else if (image == '') {
      Alert.alert('Image', 'Please add Image');
    } else if (strdate == null) {
      Alert.alert('Start Date', 'Please add Start Date');
    } else if (endseldate == null) {
      Alert.alert('End Date', 'Please add End Date');
    } else {
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
      if (quantity == '') {
        Alert.alert('Quantity', 'Please Add Quantity');
      } else {
        // setNext(3);
        Start_CampaignNow();
      }
     } else if (selCamp == '1')
     {
      if (amount == '') {
        Alert.alert('Amount', 'Please Add Amount');
      } else {
        // setNext(3);
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
      includeBase64: true,
    }).then(image => {
      imageUpload(image);
      // console.log(image);
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
  const Start_CampaignNow = async () => {
    // var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');

    // if (amount == '') {
    //   Alert.alert('Medical Detail', 'Medical Detail Successfully');
    // }
    console.log('selectedValue', selectedValue);
    var logs = {
      user_id: user_id,
      campaign_name: Title,
      donation_mode: selCamp,
      campaign_details: Description,
      campaign_start_date: strdate,
      campaign_end_date: endseldate,
      campaign_image: image,
      campaign_target_amount: amount,
      kind_id: selectedValue,
      filter_by_type: selectID,
      zip: pincode,
      campaign_target_qty: quantity,
      supported_doc: selectedPANSource
    };
    console.log(logs);
    var response = await API.post('add_campaign', logs);
    if (response.status == 'success') {
      navigation.navigate('Dashboard');
      Alert.alert(response.status, response.message);
    } else {
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
         <ScrollView>
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
          
          <View style={Styles.login_text_main}>
            <Text style={Styles.campaign_name_font}>Start Campaign</Text>
          </View>
          {isNext == 0 ? (
            <ScrollView>
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
              <TouchableOpacity
                style={Styles.campaign_btn_upload_image}
                onPress={() => upload()}>
                <Text style={Styles.campaign_text_upload}>Upload image</Text>
              </TouchableOpacity>

              <Selector
              text={selectType}
              placeholder="Gender"
              marginTop={0}
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
                  placeholder="Start Expiry"
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
                  placeholder="End Expiry"
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
              <Text style={Styles.campaign_text_font}>Step 3</Text>
              <Text style={Styles.campaign_name_font}>
                Enter the kind of Donation
              </Text>
              <View style={{justifyContent: 'center'}}>


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
                  placeholder="Enter Target Quantity"
                  onChangeText={text => setquantity(text)}
                  style={Styles.campaign_text_input}
                  keyboardType="number-pad"
                  placeholderTextColor='grey'
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
            </View>
          ) : null}
        </ImageBackground>
        </ScrollView>
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
})
export default StartCampaign;
