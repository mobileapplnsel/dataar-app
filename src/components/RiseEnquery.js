import { View, Text, TouchableOpacity, Dimensions, TextInput, Alert, ActivityIndicator, } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../services/api';
var Styles = require('../assets/files/Styles');


const deviceWidth = Dimensions.get('window').width;

export default function RiseEnquery(props) {
    const [visible, setVisible] = useState(false);
    const [progress, setprogress] = useState(false);
     const [maxLegth, setMaxLegth] = useState(5000);
    const [raiseQueryString, setRaiseQueryString] = useState('')

    const submitQuery = async () => {
       
        var user_id = await AsyncStorage.getItem('user_id');
        if (raiseQueryString.trim() == '') {
            Alert.alert('Alert', 'Please enter your query');
        }
        else {
            var logs = {
                //user_id: user_id,
                campaign_id: props?.camp_id,
                remarks: raiseQueryString
            };
            console.log(logs);
            setprogress(true);
            var response = await Api.post('raise_a_query', logs);
            if (response.status == 'success') {
                setprogress(false);
                Alert.alert(
                    response.status,
                    response.message, // <- this part is optional, you can pass an empty string
                    [
                        //  {text: 'NO', onPress: () => console.log('No')}, //logout()
                        { text: 'OK', onPress: () =>  setVisible(false)},

                    ],
                    { cancelable: false },
                )
            } else {
                Alert.alert(response.status, response.message);
                setprogress(false);
            }

        }

    };
    return (
        <View>
            <TouchableOpacity
                style={{
                    width: 85,
                    height: 30,
                    backgroundColor: '#f55656',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 6,
                }}
                onPress={() => setVisible(true)}
            >
                <Text style={{
                    fontSize: 12,
                    color: 'white'
                }}>Rise Enquiry</Text>
            </TouchableOpacity>
            
            
       


            <Modal
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                }}
                onSwipeComplete={() =>
                    setVisible(false)
                }
                swipeDirection={['up', 'left', 'right', 'down']}
                isVisible={visible}
                onBackButtonPress={() =>
                    setVisible(false)
                }
                onBackdropPress={() =>
                    setVisible(false)
                }>
                <View style={{
                    paddingVertical: 40,
                    justifyContent: 'flex-end',
                    width: deviceWidth,
                    borderRadius: 20,
                    backgroundColor: '#fff',
                }}>
                    <Text style={{
                        fontSize: 17,
                        color: 'grey',
                        fontWeight: '500',
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 20,
                        marginBottom: 10
                    }}>Raise your query:</Text>

                    <TextInput style={{
                        marginLeft: 17,
                        borderRadius: 0,
                        marginRight: 17,
                        backgroundColor: 'white',
                        fontSize: 12,
                        height: 80,
                        color: 'gray',
                        borderColor: 'black',
                        borderWidth: 1,
                        padding: 5,
                        paddingTop: 5,


                    }}
                        placeholder={'Type your query here...'}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical={'top'}
                        placeholderTextColor={'grey'}
                        value={raiseQueryString}
                        maxLength={5000}
                        onChangeText={(text) => {
                            setRaiseQueryString(text);
                            setMaxLegth(5000 - text.length)
                        }}
                    ></TextInput>
                    <Text style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: 5, color: '#f55656', marginLeft: 17, marginBottom: 7, fontWeight: '400' }}>{maxLegth + ' Character remaining'}</Text>


                    <TouchableOpacity
                        style={{
                            width: '94%',
                            height: 46,
                            backgroundColor: '#f55656',
                            marginTop: 15,
                            color: '#f55656',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            borderRadius: 6,
                        }}
                        onPress={submitQuery}
                    >
                        <Text style={Styles.donate_btn_text}>Submit Query</Text>
                    </TouchableOpacity>
                </View>
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
               
               
            </Modal>
        </View>
    )
}