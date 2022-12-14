import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Share
} from 'react-native';
import {
  Container,
  Card,
  CardItem,
  // TextInput,
} from 'native-base';
import API from '../services/api';
var Styles = require('../assets/files/Styles');
import AsyncStorage from '@react-native-community/async-storage';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import AppPreLoader from '../components/AppPreLoader';
import Icon_3 from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : Dimensions.get('window').height;
class Donationdetailsfordonor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmpData: [],
      capmain_details: [],
      campaign_owner_data: {},
      tableHead: ['Donor Name', 'Date', 'Amount', 'Status'],
      donation_id: props.route.params.donation_id,
    };
  }
  campaign = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      donation_number: this.state.donation_id
    };
    var response = await API.post('view_kind_donation_details', logs);
    if (response.status == 'success') {
      
      console.log("Response=====",response.data);
      var arr = new Array();
      var amountVal = 0;
      
     
    //   var base64String = response.data.capmain_details[0]['campaign_image']
    //   var base64Icon = 'data:image/png;base64,'+base64String
    //   this.setState({campaignImageURI: base64String, sharableURL: response.data.campaign_details_url})


      this.setState({
        cmpData: response.data.donation_details,
      //  capmain_details: [...response.data.capmain_details],
        
      });
      console.log("Data====",this.state.cmpData);
    } else {
      //Alert.alert(response.status, response.message);
    }
  };

  componentDidMount() {
    this.campaign();
    console.log('donation id', this.props.route.params.donation_id);
    console.log('campaign name', this.props.route.params.campaign_name)
  }
//   ContactDonee = async item => {

//     console.log("ContactDonee selected item: ",item);

//     this.props.navigation.navigate('DonationInKind', {
//       campaign_id: this.state.capmain_details[0]['campaign_id'],
//               kind_id: this.state.capmain_details[0]['kind_id'],
//     });
    
//   }
//   Donate = async item => {
//     var token = await AsyncStorage.getItem('token');
//     var kyc_verified = await AsyncStorage.getItem('kyc_verified');
//     var pan_number = await AsyncStorage.getItem('pan_number');
//     console.log("pan_number",pan_number);

//     console.log(token);


//     if (token != null && token !== '') {


//       var user_id = await AsyncStorage.getItem('user_id');
//     var logs = {
//       user_id: user_id,
//     };
//     console.log(logs);
//     var response = await API.post('kyc_status', logs);
//     if (response.status == 'success') {
//       console.log(response.userdata.pan_number);
//       if(response.userdata.kyc_verified!=0 && response.userdata.kyc_verified!='')
//         {
//           if(response.userdata.pan_number!='')
//           {
//             this.props.navigation.navigate('DonationAmount', {
//               donate_amt: this.state.capmain_details[0]['campaign_target_amount'],
//               donation_mode: this.state.capmain_details[0]['donation_mode'],
//               campaign_id: this.state.capmain_details[0]['campaign_id'],
//               kind_id: this.state.capmain_details[0]['kind_id'],
//             })
//           }
//         }
//         else
//           {
//             if(response.userdata.pan_number!='' && response.userdata.pan_number!=null)
//             {
//               Alert.alert("Alert", "Your Kyc is currently under review. We will let you know once your KYC gets approved.");
//             }
//             else{
//               Alert.alert("Alert", "Please submit your KYC for approval, click Ok to go to KYC page",  [
//                 {text: 'OK', onPress: () => this.props.navigation.navigate('KYCUpdateForDonor')},
//               ],
//               {cancelable: false},);
//             }
    
          
//           }
        
        
        
//       // this.setState({
//       //   pan_number:response.,
//       // });
//       // setcmpData(response.data);
//     } else {
//       Alert.alert(response.status, response.message);
//     }

//   }

//     //   if(kyc_verified!=0 && kyc_verified!='')
//     //   {
//     //     if(pan_number!='')
//     //     {
//     //       this.props.navigation.navigate('DonationAmount', {
//     //         donate_amt: item.campaign_target_amount,
//     //         donation_mode: item.donation_mode,
//     //         campaign_id: item.campaign_id,
//     //         kind_id: item.kind_id,
//     //       });
//     //     }
//     //   }
//     //   else
//     //   {
//     //     if(pan_number!='' && pan_number!=null)
//     //     {
//     //       Alert.alert("Alert", "Kyc under the processing");
//     //     }
//     //     else{
//     //       Alert.alert("Alert", "Please submit your KYC for approval, click Ok to go to KYC page",  [
//     //         {text: 'OK', onPress: () => this.props.navigation.navigate('KYCUpdateForDonor')},
//     //       ],
//     //       {cancelable: false},);
//     //     }

      
//     //   }
    
//      else {
//       this.props.navigation.navigate('LogIn');
//     }
//   };


//   user = async () => {
//     var token = await AsyncStorage.getItem('token');
//     console.log(token);
//     if (token != null && token !== '') {
//       this.props.navigation.navigate('User profile');
//     } else {
//       this.props.navigation.navigate('LogIn');
//     }
//   };
//   approve = async item => {
//     var user_id = await AsyncStorage.getItem('user_id');
//     var logs = {
//       donation_id: this.state.donation_id,
//       donee_approved: '1',
//       approved_donee_id: item.approved_donee_id,
//     };
//     var response = await API.post('donee_approval', logs);
//     if (response.status == 'success') {
//       Alert.alert(response.status, response.message);
//     }
//   };
  renderlog = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            width: '100%',
            height: 40,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
        <View style={{alignItems: 'center', marginStart: 6}}>
            <Text style={Styles.sub_text_font1}>{item.item_name}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={Styles.sub_text_font1}>{item.item_quantity} {item.item_unit}</Text>
          </View>
          <View style={{alignItems: 'center', marginRight: 10}}>
            <Text style={Styles.sub_text_font1}>{item.donated_quantity}</Text>
          </View>
          
          
        </View>
      </View>
    );
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

                <Text style={{marginLeft: 24, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    Donation Details
                  </Text>

              </View>
             
            </SafeAreaView>
            <ScrollView style={Styles.dashboard_main_contain}>
              <View style={Styles.campaign_details_contain}>

              <View style={{ marginLeft: 0, marginRight: 0, borderRadius:10, backgroundColor: 'null', flex: 1, marginTop: 6}}>

</View>

<View
                style={{
                  
                  alignItems: 'center',
                  //marginBottom: 20,
                   backgroundColor: '#5ca7f2',
                }}>
              
                
               
         
  


  


              </View>

             
                  
                  
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    marginLeft: 5

                  }}>
                   {this.props.route.params.campaign_name}
                  </Text>
                
                  
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: 5,
                    marginTop: 10

                  }}>
                  Donation number: {this.props.route.params.donation_number}
                  </Text>

                  <View style ={{
                flexDirection: 'row',
                //justifyContent: 'space-between'
              }}>
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: 5,
                    //marginTop: 10

                  }}>
                  Donation date:
                  </Text>

                
<Text style={{marginLeft: 5, marginTop: 1}}>
{ (this.props.route.params.donation_date).substring(0 , 10).split("-").reverse().join("-") + " " +((this.props.route.params.donation_date).substring(11 , 13) > 12 ? ((this.props.route.params.donation_date).substring(11 , 13))%12 : (this.props.route.params.donation_date).substring(11 , 13)) + ":" +(this.props.route.params.donation_date).substring(14 , 16) }
</Text>


{(this.props.route.params.donation_date).substring(11 , 13) > 12 ? (<Text style={{marginLeft: 5, marginTop: 1}}>
              PM
              </Text>) : (<Text style={{marginLeft: 5, marginTop: 1}}>
              AM
              </Text>)
  }

                </View>




                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    marginTop: 50,
                    marginLeft: 5
                  }}>
                   Items
                  </Text>
                
                  <FlatList

style={{
  marginTop: 20
}}
data={this.state.cmpData}
renderItem={this.renderlog}
keyExtractor={(item, id) => id.toString()}
/>
        
                
                  
              </View>

              

              
             




            </ScrollView>

            

          </ImageBackground>

          <Modal
          style={{
            width: deviceWidth,
            margin: 0,
            backdropOpacity: 10.7,
            backgroundColor: '#f2f1ed',
            marginTop: deviceHeight - 600,
          }}
          animationIn={'slideInUp'}
          backdropOpacity={0.7}
          backdropColor={'black'}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={400}
          hasBackdrop={true}
          useNativeDriver={true}
          isVisible={this.state.modalComment}
          onBackButtonPress={() =>
            this.setState({
              modalComment: false,
              shareHeight: 360,
            })
          }
          onBackdropPress={() =>
            this.setState({
              modalComment: false,
              shareHeight: 360,
              isVisible: false,
            })
          }>
          <View
            style={[
              {
                backgroundColor: '#f2f1ed',
                flexDirection: 'column',
                alignItems: 'center',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
                height: 40,
                width: '100%',
                backgroundColor: '#ffff',
                justifyContent: 'center',
                borderBottomColor: '#d6d6d6',
              }}>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginStart: 10,
                  fontSize: 20,
                }}>
                Review
              </Text>
              {/* <Text
                style={{
                  color: '#000',
                  alignSelf: 'flex-end',
                  fontWeight: 'bold',
                  marginRight: 10,
                  fontSize: 20,
                }}>
                CLOSE
              </Text> */}
            </View>
            <View
              style={{
                backgroundColor: '#ffff',
                justifyContent: 'center',
                height: '100%',
              }}>
                 <View
              style={{
                justifyContent: 'center',
                margin: 20,
              }}>
                 <StarRating       
        disabled={false}
        maxStars={5}
        rating={this.state.starCount}
        selectedStar={(rating) => this.onStarRatingPress(rating)}
        fullStarColor={'#ff5c5c'}
      />
      </View>
              <FlatList
                // style={{backgroundColor: 'red'}}
                keyExtractor={item => item.id.toString()}
                data={this.state.commentArr}
                onEndReachedThreshold={0.5}
                renderItem={this.renderItemComment}
              />

              <KeyboardAvoidingView
                style={[{marginBottom: 75, backgroundColor: 'transparent'}]}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      marginBottom: 4,
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <View
                    style={{
                      backgroundColor: '#e8e3e3',
                      height: 50,
                      flexDirection: 'row',
                      width: '100%',
                      borderRadius: 10,
                      alignItems: 'center'
                    }}>
                    <TextInput
                      style={{
                        flex: 1,
                        backgroundColor: '#e8e3e3',
                        
                        padding: 10,
                        borderRadius: 40,
                        fontSize: 16,
                        color: '#000',
                        paddingLeft: 15,
                        alignSelf: 'center',
                        marginTop: 5
                      }}
                      placeholder={'Type your comment here...'}
                      multiline={true}
                      onChangeText={textEntry => {
                        this.commentText(textEntry);
                      }}></TextInput>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        paddingVertical: 0,
                        width: 50,
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        this.commentSend();
                      }}>
                      <Icon_3 name="ios-send" color="#ff5c5c" size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
        </Container>
      
    );
  }
}

export default Donationdetailsfordonor;
