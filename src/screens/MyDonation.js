/* eslint-disable react/jsx-no-undef */
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
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Modal,
  Button
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
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import { SafeAreaView } from 'react-native-safe-area-context';
import normalize from '../components/normalize';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : Dimensions.get('window').height;
class View_campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmpData: [],
      cmpData2: [], 
      modalVisible: false,
      modalComment: false,
      moneybutton: true,
      kindbutton: false,
      comment: '',
      tableHead: [
        'No.',
        'Title',
        'Start Date',
        'Expriy Date',
        'Type',
        'Amount',
        'View',
      ],
      tableData: [
        ['1', '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456\n789'],
        ['a', 'b', 'c', 'd'],
      ],
      widthArr: [40, 180, 80, 80, 40, 120, 60],
      progress: false,
      progressName: 'Loading...',
      btnbgcolor: '#D0CFCE',
      btnbgcolor1: 'rgba(246, 244, 243, 1)',
      btnbgcolor2: 'rgba(246, 244, 243, 1)',
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  
  campaign = async () => {
    console.log(user_id);
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
    };
    var response = await API.post('donations_by_donor', logs);
    if (response.status == 'success') {
      this.setState({
        progress: false,
      })
      console.log('campaign_details_by_user: ', response.data);

      this.setState({
        cmpData: response.data.donations,
      });
    } else {
      this.setState({
        progress: true,
      })
      Alert.alert(response.status, response.message);
    }
  };

  campaign2 = async () => {
    console.log(user_id);
    var user_id = await AsyncStorage.getItem('user_id');
    var logs = {
      user_id: user_id,
    };
    var response = await API.post('kind_donations_by_donor', logs);
    if (response.status == 'success') {
      this.setState({
        progress: false,
      })
      console.log('campaign_details_by_user: ', response.data);

      this.setState({
        cmpData2: response.data.donations,
      });
      console.log("Data======", cmpData2)
    } else {
      this.setState({
        progress: true,
      })
      Alert.alert(response.status, response.message);
    }
  };

  actualDownload = (pdfurl) => {
    const { dirs } = RNFetchBlob.fs;

    if (Platform.OS === 'ios')
    {
      const { dirs } = RNFetchBlob.fs;
      const dirToSave = dirs.DocumentDir

      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `Recipt_And_Thank_You_Letter.pdf`,
        path: `${dirToSave}/${`Recipt_And_Thank_You_Letter.pdf`}`,
    }
    const configOptions = Platform.select({
      ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: 'pdf',
      },
      android: configfb,
  });

  console.log('The file saved to 23233', configfb, dirs);

  RNFetchBlob.config(configOptions)
            .fetch('GET', pdfurl, {})
            .then((res) => {
                if (Platform.OS === "ios") {
this.setState({
        progress: false,
      })
                    RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                    // RNFetchBlob.ios.previewDocument(configfb.path);
   RNFetchBlob.ios.openDocument(res.data)
         Toast.show('The file saved to '+res.path(),  Toast.LONG)
          console.log('The file saved to ', res.path());
                }
                
                console.log('The file saved to ', res);
            })
            .catch((e) => {
              this.setState({
                progress: false,
              })
                console.log('The file saved to ERROR', e.message)
            });
    


      // RNFetchBlob.config({
      //   fileCache: true,
      //   addAndroidDownloads: {
      //   useDownloadManager: true,
      //   notification: true,
      //   mediaScannable: true,
      //   title: `Recipt_And_Thank_You_Letter.pdf`,
      //   path: `${dirs.DocumentDir}/test.pdf`,
      //   },
      // })
      //   .fetch('GET', pdfurl, {})
      //   .then((res) => {
      //    this.setState({
      //      progress: false,
      //    })
      //    RNFetchBlob.ios.openDocument(res.data)
      //    Toast.show('The file saved to '+res.path(),  Toast.LONG)
      //     console.log('The file saved to ', res.path());
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //   });
    }
    else
    {
   RNFetchBlob.config({
     fileCache: true,
     addAndroidDownloads: {
     useDownloadManager: true,
     notification: true,
     mediaScannable: true,
     title: `Recipt_And_Thank_You_Letter.pdf`,
     path: `${dirs.DownloadDir}/test.pdf`,
     },
   })
     .fetch('GET', pdfurl, {})
     .then((res) => {
      this.setState({
        progress: false,
      })
      Toast.show('The file saved to '+res.path(),  Toast.LONG)
       console.log('The file saved to ', res.path());
     })
     .catch((e) => {
       console.log(e)
     });
    }
 }
  _onPressButton = async (donation_id) => 
  {
    if (Platform.OS === 'ios')
      {
        this.setState({
          progress: true,
          progressName: 'Downloading your reciept'
        })
        this.getReciptPDFUrl(donation_id);
      }
      else
      {
         try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.setState({
              progress: true,
              progressName: 'Downloading your reciept'
            })
            this.getReciptPDFUrl(donation_id);
            
          } else {
            Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
          }
        } catch (err) {
          console.warn(err);
        }  
      }
  }
  getReciptPDFUrl = async (donation_id) => {
   
    var logs = {
      donation_id: donation_id,
    };
      console.log(logs);
      var response = await API.post('my_donation_pdf_new', logs);
      console.log(response);
      if (response.status == 'success') 
      {
        this.actualDownload(response.filepath)
      } 
      else 
      {
        this.setState({
          progress: false,
        })
        Alert.alert(response.status, response.message);
      }
    
  };
  componentDidMount() {
    this.setState({
      progress: true,
    })
    this.campaign();
  }
  element = (data, index) => {
    console.log(data);
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Campaing_details', {
            camp_id: data,
          })
        }>
        <View
          style={{
            width: 58,
            height: 18,
            backgroundColor: '#78B7BB',
            borderRadius: 2,
          }}>
          <Text style={{textAlign: 'center', color: '#fff'}}>View</Text>
        </View>
      </TouchableOpacity>
    );
  };
  user = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token != null && token !== '') {
      this.props.navigation.navigate('User profile');
    } else {
      this.props.navigation.navigate('LogIn');
    }
  };

 


  renderlog = ({item, index}) => {
    
  
var donation_type = ''
     if (item.donation_mode == '1')
     {
      donation_type = 'Money'
     }
     else
     {
      donation_type = 'In Kind'
     }

    const wish = item.like_status == 1 ? true : false;
    console.log(wish);
    return (
      
      <View style={{flex: 1, marginLeft: 10, marginRight: 10}} key={item.campaign_id}>
        <Card style={{overflow: 'hidden',}}>
          <CardItem>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffff',
                }}> 
                  
                
              </View>

              <View style={{flexDirection:'row', marginTop: 0, height: 40,}}>
            <View style={{width: '80%'}}>

            <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Campaing_details_ForDonor', {
                    camp_id: item.campaign_id,
                  })}>
                <Text style={{fontSize: 16,
    alignSelf: 'flex-start',
    color: '#000',
    fontWeight: '700',}}>{item.campaign_name}</Text>
              </TouchableOpacity> 

            </View>



  {item.kind_id == '0' && <View style={{width: '20%',}}>
            <TouchableOpacity onPress={() => this._onPressButton(item.donation_id)}>
            <Image style={{ marginRight: 20,
    resizeMode: 'contain', height: 40, alignSelf: 'flex-end', borderRadius: 4, width: 40
}}
source={require('../../src/assets/images/outline_file_download_black_48.png')}>
</Image> 
</TouchableOpacity>
</View> }
            </View> 
              
            {item.kind_id == '0' && <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
               Amount Paid:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {'₹' + item.amountpaid}
                </Text>
              
              </View> }

              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
               Date:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.updated_at}
                </Text>
              </View>
             
             
              {item.kind_id == '0' && <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Receipt Number:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.receipt_no}
                </Text>
              </View> }
                
                {/* <TouchableOpacity
                  style={{width: '96%',
                    height: 40,
                    backgroundColor: '#f55656',
                    marginTop: 10,
                    color: '#f55656',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 6,}}
                  onPress={() => this.props.navigation.navigate('Campaing_details', {
                    camp_id: item.campaign_id,
                  })}>
                  <Text style={Styles.donate_btn_text}>View</Text>
                </TouchableOpacity> */}
            </View>
          </CardItem>
        </Card>
      </View>
      
    );
  };

  renderlog1 = ({item, index}) => {
    
    
    var donation_type = ''
         if (item.donation_mode == '1')
         {
          donation_type = 'Money'
         }
         else
         {
          donation_type = 'In Kind'
         }
    
        const wish = item.like_status == 1 ? true : false;
        console.log(wish)
        return (
          
          <TouchableOpacity
          // onPress={() => this.setState({
          //   modalVisible: this.setModalVisible
          // }
          //   )}
          style=
          {{flex: 1, marginLeft: 10, marginRight: 10}} key={item.campaign_id}>
            <Card style={{overflow: 'hidden',}}>
              <CardItem>
                <View style={{flexDirection: 'column', flex: 1}}>
                 
                      
                      {/* <Image
                    style={{
                      width: 30,
                      height: 30,
                      
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                      
                    }}
                    source={require('../../src/assets/images/view.png')}
                    // resizeMode="contain"dashboard_main_btn
                  /> */}
                 
    
                  <View style={{flexDirection:'row', marginTop: 0, height: 40,}}>
                <View style={{width: '80%', 
                flexDirection: 'row', 
                justifyContent: 'space-between'}}>
    
                <TouchableOpacity
                      // onPress={() => this.props.navigation.navigate('Campaing_details_ForDonor2', {
                      //   camp_id: item.campaign_id,
                      // })}
                      
                      >
                    <Text style={{fontSize: 16,
        alignSelf: 'flex-start',
        color: '#000',
        fontWeight: '700',}}>{item.campaign_name}</Text>
                  </TouchableOpacity> 


<TouchableOpacity>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      //marginStart: 10,
                      // marginTop: 20,
                      backgroundColor: 'transparent',
                     
                    }}
                    source={require('../../src/assets/images/view.png')}
                    // resizeMode="contain"dashboard_main_btn
                  />
    </TouchableOpacity>
                </View>
    
    
    
      {item.kind_id == '0' && <View style={{width: '20%',}}>
                
    </View> }
                </View> 
                  
               
    
                  <View style={{flexDirection: 'row', marginTop: 3}}>



                  <Text style={Styles.doner_title_font_Modified}>
                  Donation date:   
                    </Text>
                    {/* <Text style={Styles.doner_title_font}>
                      {item.created_at}
                    </Text> */}
                      <View style ={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>

              <Text style={Styles.doner_title_font}>
                {(item.created_at).substring(0 , 10).split("-").reverse().join("-") + " " +((item.created_at).substring(11 , 13) > 12 ? ((item.created_at).substring(11 , 13))%12 : (item.created_at).substring(11 , 13)) + ":" +(item.created_at).substring(14 , 16) }
              </Text>

             {(item.created_at).substring(11 , 13) > 12 ? (<Text style={Styles.doner_title_font}>
              PM
              </Text>) : (<Text style={Styles.doner_title_font}>
              AM
              </Text>)
  }

             

              </View>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 3}}>
                  <Text style={Styles.doner_title_font_Modified}>
                  Donation number:
                    </Text>
                    <Text style={Styles.doner_title_font}>
                      {item.donation_number}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 3}}>
                  <Text style={Styles.doner_title_font_Modified}>
                  Donation status:
                    </Text>
                    <Text style={Styles.doner_title_font}>
                      {item.donation_status}
                    </Text>
                  </View>
                 
                
                    
                    {/* <TouchableOpacity
                      style={{width: '96%',
                        height: 40,
                        backgroundColor: '#f55656',
                        marginTop: 10,
                        color: '#f55656',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 6,}}
                      onPress={() => this.props.navigation.navigate('Campaing_details', {
                        camp_id: item.campaign_id,
                      })}>
                      <Text style={Styles.donate_btn_text}>View</Text>
                    </TouchableOpacity> */}
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
          
        );
      };

  render() {
  const { modalVisible } = this.state;
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

                <Text style={{marginLeft: 14, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    My Donation
                  </Text>
              </View>
         
            </SafeAreaView>
  

 
<View style={{
  //flex:1, 
  //maxWidth: 414, 
  backgroundColor: null, 
  flexDirection:'row', 
  justifyContent:'flex-end',
  alignItems: 'flex-end',
  marginRight: 10
  }}>
            <TouchableOpacity
              
                style={[
                  Styles2.donate_btn,
               //   { backgroundColor: this.state.btnbgcolor },
                  { backgroundColor: this.state.moneybutton == true? '#D0CFCE' : 'white' },
              ]}
                onPress={() => {
                
                this.setState({
                  moneybutton: true,
                  kindbutton: false,
                })
               this.campaign()
              }
                }>
                <Text style={Styles2.login_text}>Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
               
                style={[
                  Styles2.donate_btn1,
                 // { backgroundColor: this.state.btnbgcolor1 },
                 { backgroundColor: this.state.kindbutton == true? '#D0CFCE' : 'white' },
              ]}
                onPress={() => {
                  this.setState({
                    moneybutton: false,
                    kindbutton: true,
                  })
                 this.campaign2()
                }
                }>
                <Text style={Styles2.login_text}>Kind</Text>
              </TouchableOpacity>

             
              </View>



{this.state.moneybutton == true? (<FlatList

              style={{
                marginTop: 20
              }}
              data={this.state.cmpData}
              renderItem={this.renderlog}
              keyExtractor={(item, id) => id.toString()}
            />) : (

<FlatList

style={{
  marginTop: 20
}}
data={this.state.cmpData2}
renderItem={this.renderlog1}
keyExtractor={(item, id) => id.toString()}
/>) }



{/* <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.progress}
            onRequestClose={() => {console.log('close modal')}}>
            <View style={Styles1.modalBackground}>
                <View style={Styles1.activityIndicatorWrapper}>
                    <ActivityIndicator color={'white'} size="large"
                        animating={this.state.progress} />
                        <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white', alignSelf: 'center'}}>
                    {this.state.progressName}
                  </Text>
                </View>
            </View>
        </Modal> */}
              {/* <Text style={{color: '#f55656', fontWeight: '800', alignSelf: 'center', fontSize: 26, marginTop: '60%', marginBottom: 10}}>
          
             </Text> */}
             
              {/* </ScrollView> */}
            {/* </View> */}
            {/* </ScrollView> */}
            {/* </ScrollView> */}


          </ImageBackground>


          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        />

        
        </Container>
     
    );
  }
}
const Styles1 = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
},
activityIndicatorWrapper: {
     backgroundColor: '#f55656',
    height: 150,
    width: 300,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
},
  spinnerTextStyle: {
    color: 'green',
  },
});


const Styles2 = StyleSheet.create({
  donate_btn: {
    width: 100,
    height: 50,
    // backgroundColor: 'rgba(246, 244, 243, 1)',
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 6
  },
  amount_text_input: {
    marginLeft: 10,
    marginRight: 10,
    // backgroundColor: '#dcdedc',
    height: 45,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingTop: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black'
  },
  buttonContainer: {
    margin: 20
  },
  donate_btn1: {
    width: 100,
    height: 50,
    // backgroundColor: 'rgba(246, 244, 243, 1)',
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 6
  },
  donate_btn2: {
    width: 100,
    height: 50,
    // backgroundColor: 'rgba(246, 244, 243, 1)',
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 6
  },
  login_text: {
    fontSize: 18,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 12,
    color: '#f55656',
    fontWeight: '700',
  },
  errorHint: {
    marginTop: 3,
    color: 'red',
    fontSize: 11,
    marginBottom: -5,
    marginLeft: 10,
},
buttonStyle: {
  alignItems: 'center',
  flexDirection: 'row',
  backgroundColor: '#DDDDDD',
  padding: 5,
},
imageIconStyle: {
  height: 20,
  width: 20,
  resizeMode: 'stretch',
},
})
export default View_campaign;
