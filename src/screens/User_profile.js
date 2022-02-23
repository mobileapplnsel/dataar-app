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
  StyleSheet
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
var Styles = require('../assets/files/Styles');
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
      user_id: ''

    };
  }
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
    if (AsyncStorage.getItem('token')['_X'] == null) {
      //   this.props.navigation.navigate('LogIn');
    } else {
    }
    this.getuser();
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
          user_id: user_id
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
  };
  lnameedit = () => {
    console.log('hello world');
    this.setState({
      iseditablelname: true,
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
    if (this.state.fname.trim() == '')
    {
      Alert.alert('Warning', 'Please enter First Name');
    }
    else if (this.state.lname.trim() == '')
    {
      Alert.alert('Warning', 'Please enter Last Name');
    }
    else
    {
      var logs = {
        usrId: this.state.user_id,
        firstname: this.state.fname,
        lastname: this.state.lname,
        phone: this.state.mobile,
        email: this.state.email
      };
      console.log('Update Profile logs: ', logs);
      var response = await API.postWithoutHeader('update_user_profile_info', logs);
     // console.log(response);
     console.log('Update Profile response: ', response);
      if (response.status === 'success') {
        Toast.show(response.message, Toast.LONG)
        this.props.navigation.goBack()
      } else {
        Alert.alert('Failure', response.message);
      }
    }
    
  };
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
                <TouchableOpacity>
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
              <Image
                style={{
                  width: 84,
                  height: 80,
                  marginStart: 14,
                  marginTop: 20,
                  backgroundColor: 'transparent',
                }}
                source={require('../../src/assets/images/heart.png')}
                // resizeMode="contain"dashboard_main_btn
              />
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
                {/* <ListItem style={Styles.profile_main_text_contain}> */}
                <Text style={Styles.user_profile_lbtext}>First Name:</Text>
                <View style={Styles.user_edit_contain}>
                  <TextInput
                    style={Styles.user_text_input}
                    placeholder="First Name"
                    editable={this.state.iseditablefname}
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
                    editable={this.state.iseditablelname}
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
