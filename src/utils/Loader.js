import React from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import LottieView from 'lottie-react-native';


//import normalize from './normalize';

export default function Loader(props) {
  return props.visible ? (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={"white"} />
      {/* <LottieView 
          source={{uri:'https://assets4.lottiefiles.com/packages/lf20_g7dnFTvMeQ.json'}}
         autoPlay 
         
          style={{
            height: normalize(150),
            width: normalize(150)
          }}
         
           /> */}

           
    </SafeAreaView>
  ) : null;
}

Loader.propTypes = {
  visible: PropTypes.bool,
};

Loader.defaultProps = {
  visible: true,
};