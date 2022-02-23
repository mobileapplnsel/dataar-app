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
  PermissionsAndroid,
  Modal
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
class View_campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmpData: [],
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
      progressName: 'Loading...'
    };
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
  actualDownload = (pdfurl) => {
    const { dirs } = RNFetchBlob.fs;
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
  _onPressButton = async (donation_id) => 
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
  getReciptPDFUrl = async (donation_id) => {
   
    var logs = {
      donation_id: donation_id,
    };
      console.log(logs);
      var response = await API.post('my_donation_pdf', logs);
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

              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop: 0, height: 40,}}>
            <View style={{width: '50%'}}>

            <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('My_Donation_Details', {
                    camp_id: item.campaign_id,
                  })}>
                <Text style={{fontSize: 19,
    alignSelf: 'flex-start',
    color: '#000',
    fontWeight: '700',}}>{item.campaign_name}</Text>
              </TouchableOpacity> 

            </View>
            <View style={{width: '50%',}}>
            <TouchableOpacity onPress={() => this._onPressButton(item.donation_id)}>
            <Image style={{ marginRight: 20,
    resizeMode: 'contain', height: 40, alignSelf: 'flex-end', borderRadius: 4, width: 40
}}
source={require('../../src/assets/images/outline_file_download_black_48.png')}>
</Image> 
</TouchableOpacity>
</View>
            </View>
              
              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
               Amount Paid:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {'₹' + item.amountpaid}
                </Text>
              
              </View>

              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
               Date:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.updated_at}
                </Text>
              </View>
             
             
              <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={Styles.doner_title_font_Modified}>
              Receipt Number:   
                </Text>
                <Text style={Styles.doner_title_font}>
                  {item.reciept_no}
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
      </View>
      
    );
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

                <Text style={{marginLeft: 14, fontSize: 19, fontWeight: '900', color: 'white', textAlignVertical: 'center'}}>
                    My Donation
                  </Text>
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
                <TouchableOpacity onPress={() => this.user()}>
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
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            {/* <ScrollView horizontal={true}> */}
            {/* <ScrollView> */}
            {/* <View style={Styles.dashboard_main_contain}> */}
              {/* <FlatList
                data={this.state.cmpData}
                renderItem={this.renderlog}
                keyExtractor={(item, campaign_id) => campaign_id.toString()}
              /> */}
              {/* <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}> */}
              {/* <ScrollView style={{marginTop: -1}}> */}




              {/* <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row
                  data={this.state.tableHead}
                  style={{height: 50, backgroundColor: '#537791'}}
                  textStyle={{textAlign: 'center', fontWeight: '100'}}
                />
                {this.state.cmpData.map((rowData, index) => (
                  <TableWrapper
                    key={index}
                    style={{flexDirection: 'row'}}
                    widthArr={this.state.widthArr}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex === 6
                            ? this.element(cellData, index)
                            : cellData
                        }
                        textStyle={{margin: 6}}
                        widthArr={this.state.widthArr}
                      />
                    ))}
                  </TableWrapper>
                ))}
              </Table> */}

 

<FlatList
              data={this.state.cmpData}
              renderItem={this.renderlog}
              keyExtractor={(item, id) => id.toString()}
            />
<Modal
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
        </Modal>
              {/* <Text style={{color: '#f55656', fontWeight: '800', alignSelf: 'center', fontSize: 26, marginTop: '60%', marginBottom: 10}}>
          
             </Text> */}
             
              {/* </ScrollView> */}
            {/* </View> */}
            {/* </ScrollView> */}
            {/* </ScrollView> */}
          </ImageBackground>
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
export default View_campaign;
