import { View, Text, TouchableOpacity, Dimensions, TextInput, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../services/api';
var Styles = require('../assets/files/Styles');


const deviceWidth = Dimensions.get('window').width;

export default function SelfDonation(props) {
    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState('')

    const submitSelfDonation = async () => {
        var user_id = await AsyncStorage.getItem('user_id');
        if (amount.trim() == '') {
            Alert.alert('Alert', 'Please enter amount');
        }
        else {
            var logs = {
                user_id: user_id,
                amount: amount,
                campaign_id: props?.camp_id
            };
            console.log(logs);
            var response = await Api.post('self_donation', logs);
            if (response.status == 'success') {
                Alert.alert(
                    response.status,
                    response.message, // <- this part is optional, you can pass an empty string
                    [
                        //  {text: 'NO', onPress: () => console.log('No')}, //logout()
                        { text: 'OK', onPress: () => setAmount('') },

                    ],
                    { cancelable: false },
                )
            } else {
                Alert.alert(response.status, response.message);
            }

        }

    };
    return (
        <View>
            {props.camp_type == '1' &&
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
                    }}>Self Donation</Text>
                </TouchableOpacity>
            }
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
                    }}>Self-Donation:</Text>

                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        marginLeft: 15,
                        marginRight: 15
                    }}>
                        <TextInput
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                width: '90%',
                                color: 'black',
                                height: 43,
                                backgroundColor: 'white'
                            }}
                            keyboardType='decimal-pad'
                            placeholder="Enter amount"
                            placeholderTextColor='grey'
                            onChangeText={value => setAmount(value)}
                            value={amount}
                        ></TextInput>
                        {/* </ListItem> */}
                        <TouchableOpacity
                            style={Styles.user_edit_profile_lbtext}
                        // onPress={() => this.descriptionEdit()}
                        >
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
                    <Text style={{
                        marginTop: 5,
                        marginLeft: 0,
                        marginRight: 15,
                        color: 'green',
                        fontSize: 11,
                        marginBottom: 10,
                        // alignSelf: 'center',
                        paddingLeft: 13
                    }}>{'Make a self donation'}</Text>

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
                        onPress={submitSelfDonation}
                    >
                        <Text style={Styles.donate_btn_text}>Submit Donation</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}