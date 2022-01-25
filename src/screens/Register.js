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
  StyleSheet
} from 'react-native';
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


var pdfpath
var filename1 = 'Upload your Pan'
var filename2 = 'Upload your address proof'
const Register = ({navigation}) => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setemail] = useState('');
  const [Mobile, setmobile] = useState('');
  const [password, setpassword] = useState('');
  const [Otp, setotp] = useState('');
  const [selectedValue, setselectedValue] = useState('');
  const [selectedPANSource, setselectedPANSource] = useState('');
  const [selectedIDSource, setselectedIDSource] = useState('');
  const [selectedPANName, setselectedPANName] = useState('Upload your Pan');
  const [selectedIDName, setselectedIDName] = useState('Upload your address proof');
  
  const [selectedID, setselectedID] = useState('');
  const [isPasswordHidden, setisPasswordHidden] = useState(false);
  const setTaskti = text => {
    setFirstName(text);
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
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      pdfpath = res.uri
      filename1 = res.name
      setselectedPANName(res.name);
      setselectedPANSource(res.uri);
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
  const selectOneFile1 = async () => {
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
      setselectedIDName(res.name);
      setselectedIDSource(res.uri);
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
  const registration = async () => {
    var formdata = new FormData();
    console.log(password);
    if (FirstName == '') {
      Alert.alert('First Name', 'Please enter first name');
    } else if (LastName == '') {
      Alert.alert('Last Name', 'Please enter last name');
    } else if (Email == '') {
      Alert.alert('Email', 'Please enter Email');
    } else if (Mobile == '') {
      Alert.alert('Mobile', 'Please enter Mobile');
    } else if (password == '') {
      Alert.alert('Password', 'Please enter password');
    }
   else if (selectedPANSource == '') {
    Alert.alert('Pan', 'Please upload your Pan');
  } else if (selectedIDSource == '') {
    Alert.alert('ID', 'Please upload your ID proof');
  }
     else if (
      FirstName != '' &&
      LastName != '' &&
      Email != '' &&
      Mobile != '' &&
      password != ''
    ) {
      var logs = {
        firstname: FirstName,
        lastname: LastName,
        email: Email,
        phone: Mobile,
        password: password,
        usertype: '0',
        device_id: '',
        device_type: 'A',
        usertype: selectedValue,
      };
      // formdata.append('firstname', FirstName);
      // formdata.append('lastname', LastName);
      // formdata.append('email', Email);
      // formdata.append('phone', Mobile);
      // formdata.append('password', password);
      // formdata.append('usertype', Otp);
      var response = await API.post('register', logs);
      if (response.status == 'success') {

        // need to add kyc uploadation function here

        navigation.navigate('OtpVerify', {mobile: Mobile});
      } else {
        Alert.alert(response.status, response.message);
      }
    }
  };
  const updateSecureText = () => {
    setisPasswordHidden(!isPasswordHidden);
  };
  return (
    
      <Container>
        <ImageBackground
          source={require('../../src/assets/images/bg.jpg')}
          style={Styles.login_main}>
            <ScrollView>
          <View style={Styles.login_main_header}></View>
          <View style={Styles.login_text_main}>
            <Image
              style={{width: 90, height: 80, marginStart: 30, marginTop: 20}}
              source={require('../../src/assets/images/heart.png')}
              // resizeMode="contain"
            />
            <Text style={Styles.login_text_font}>Registration</Text>
          </View>
          
          <View style={Styles.login_text_input_contain}>
          
            <TextInput
              placeholder="First Name"
              onChangeText={text => setTaskti(text)}
              style={Styles.login_text_input}
              keyboardType="default"
            />
            <TextInput
              placeholder="Last Name"
              onChangeText={text => setTasktipass(text)}
              style={Styles.login_text_input}
              keyboardType="default"
            />
            <TextInput
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              style={Styles.login_text_input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Mobile"
              onChangeText={text => setMobile(text)}
              style={Styles.login_text_input}
              keyboardType="numeric"
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
                placeholder="password"
                onChangeText={text => setpass(text)}
                style={{
                  flex: 1,
                  paddingTop: 0,
                  fontSize: 16,
                  height: 40,
                  //   borderColor: "#080606",
                  //   paddingLeft: 15,

                  fontWeight: 'bold',
                }}
                keyboardType="default"
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
            {/* <TextInput
              placeholder="Otp"
              onChangeText={text => setOtp(text)}
              style={Styles.login_text_input}
              keyboardType="number-pad"
            /> */}
            {/* <TouchableOpacity>
            <Text style={Styles.login_text_forget}>Forget Password?</Text>
          </TouchableOpacity> */}

<TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle}
          onPress={selectOneFile}>
          <Text style={{marginRight: 10, fontSize: 17}}>
            {selectedPANName}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
        </TouchableOpacity>
        <Text style={Styles1.warningHint}>{'Only PDF or Image format is acceptable'}</Text>

        <Picker
              selectedValue={selectedID}
              style={{
                height: 50,
                width: '100%',
                borderColor: '#000',
                alignSelf: 'center',
                borderWidth: 1,
                marginTop: 7,
              }}
              onValueChange={
                (itemValue, itemIndex) => setselectedID(itemValue)
                // console.log(itemValue)
                // Alert.alert(itemValue)
              }>
              <Picker.Item label="Select ID Type" value="" />
              <Picker.Item label="Adhar" value="0" />
              <Picker.Item label="National ID" value="1" />
              <Picker.Item label="Passport" value="2" />
              <Picker.Item label="Driving License" value="3" />
            </Picker>


        <View style={{marginBottom: 7, marginTop: -15}}></View>
       
        <TouchableOpacity
          activeOpacity={0.5}
          style={Styles1.buttonStyle}
          onPress={selectOneFile1}>
          <Text style={{marginRight: 10, fontSize: 17}}>
            {selectedIDName}
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={Styles1.imageIconStyle}
          />
        </TouchableOpacity> 
        <Text style={Styles1.warningHint}>{'Only image format is acceptable'}</Text>

        
            <Picker
              selectedValue={selectedValue}
              style={{
                height: 50,
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
              <Picker.Item label="Select one" value="" />
              <Picker.Item label="Donor" value="0" />
              <Picker.Item label="Donee" value="1" />
            </Picker>
            <TouchableOpacity
              style={Styles.login_btn_forget}
              onPress={() => registration()}>
              <Text style={Styles.login_text}>SUBMIT</Text>
            </TouchableOpacity>
           
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
})
export default Register;
