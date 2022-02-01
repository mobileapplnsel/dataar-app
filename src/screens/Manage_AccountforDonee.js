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
} from 'react-native';
import {Container, Card, CardItem, Body, ListItem, List} from 'native-base';
import API from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
var Styles = require('../assets/files/Styles');
import Feather from 'react-native-vector-icons/Feather';
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
      isPasswordHidden: false,
      isConfirmPasswordHidden: false,
      passwordString: '',
      confirmPasswordString: '',

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
    // if (AsyncStorage.getItem('token')['_X'] == null) {
    //   //   this.props.navigation.navigate('LogIn');
    // } else {
    // }
    // this.getuser();
  }
  
  getuser = async () => {
    var token = await AsyncStorage.getItem('token');
    var user_id = await AsyncStorage.getItem('user_id');
    console.log(token);
    console.log('user_id', user_id);
    var logs = {
      user_id: user_id,
    };
    if (token != null) {
      var response = await API.post('fetch_profile_data', logs);
      console.log(response);
      if (response.status == 'success') {
        // navigation.navigate('OtpVerify', {mobile: Mobile});
        this.setState({
          fname: response.data.first_name,
          lname: response.data.last_name,
          email: response.data.email,
          mobile: response.data.phone,
          image: response.data.kyc_file,
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
   updateSecureText = () => {
    this.setState({ isPasswordHidden: !this.state.isPasswordHidden });
  };
  updateSecureText1 = () => {
    this.setState({ isConfirmPasswordHidden: !this.state.isConfirmPasswordHidden });
  };
  submitPasswordChange = async () => {
    if (this.state.passwordString.trim() == '')
    {
      Alert.alert('Warning','Password can not be blank!');
    }
    else if (this.state.confirmPasswordString.trim() == '')
    {
      Alert.alert('Warning','Confirm Password can not be blank!');
    }
    else if (this.state.passwordString != this.state.confirmPasswordString)
    {
      Alert.alert('Warning','Confirm password did not match!');
    }
    else
    {
    var user_id = await AsyncStorage.getItem('user_id');
    console.log('user_id', user_id);
    var logs = {
      user_id: user_id,
      new_password: this.state.passwordString,
    };
    console.log(logs);
    
      var response = await API.post('change_password', logs);
      console.log(response);
      if (response.status == 'success') {
        // navigation.navigate('OtpVerify', {mobile: Mobile});

       // this.props.navigation.navigate('ThankYou');

        Alert.alert(
          'Success',
          response.message, // <- this part is optional, you can pass an empty string
          [
            {text: 'OK', onPress: () => this.props.navigation.goBack()},
          ],
          {cancelable: false},
        );
        
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
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                    }}
                    source={require('../../src/assets/images/back.png')}
                    // resizeMode="contain"dashboard_main_btn
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity>
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
                </TouchableOpacity> */}
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
            </View>
            {/* <View style={Styles.profile_main_contain}> */}
            <View>
              <Image
                style={{
                  width: 84,
                  height: 80,
                  marginStart: 30,
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
                    marginLeft: 30,
                    marginTop: 20,
                  },
                ]}>
                Change Password
              </Text>
            </View>
            <List style={Styles.profile_main_contain}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 14,
                borderBottomWidth: 1,
                paddingRight: 10,
                marginStart: 30,
                marginEnd: 30,
              }}>
              <TextInput
                placeholder="Password"
                onChangeText={(text) => this.setState({ passwordString: text })}
                value={this.state.passwordString}
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
                secureTextEntry={!this.state.isPasswordHidden}
              />
              <TouchableOpacity onPress={()=> this.updateSecureText()}>
                {!this.state.isPasswordHidden ? (
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
                marginStart: 30,
                marginEnd: 30,
              }}>
              <TextInput
                placeholder="Confirm Password"
                onChangeText={(text) => this.setState({ confirmPasswordString: text })}
                value={this.state.confirmPasswordString}
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
                secureTextEntry={!this.state.isConfirmPasswordHidden}
              />
              <TouchableOpacity onPress={()=> this.updateSecureText1()}>
                {!this.state.isConfirmPasswordHidden ? (
                  <Feather name="eye-off" color="gray" size={20} />
                ) : (
                  <Feather name="eye" color="green" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => this.submitPasswordChange()}>
            <View
              style={{
                marginTop: 40,
                paddingRight: 10,
                marginStart: 30,
                marginEnd: 30,
                backgroundColor: '#f55656',
                height: 60
              }}>
                <Text
                style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    textAlignVertical: 'center',
                    padding: 16,
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                Change Password
              </Text>
</View>
</TouchableOpacity>
            </List>
            
            {/* </View> */}
          </ImageBackground>
        </ScrollView>
      </Container>
    );
  }
}

export default User_profile;
