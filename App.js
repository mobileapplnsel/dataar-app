/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Fragment} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import AppPreLoader from './src/components/AppPreLoader';
import Guest from './src/navigations/Guest';
import Logged from './src/navigations/Logged';
import {AuthContext} from './src/context';
const App = () => {
  const [loaded, setIsLoading] = React.useState(true);
  // const [isSplash, setIsSplash] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  // const [userDetails, setUserDetails] = React.useState(null);

  React.useEffect(() => {
    // Fcn.init();
    LoginCheck();
  }, []);
  const authContext = React.useMemo(() => {
    return {
      isLoading: data => {
        setIsLoading(data);
      },
      signIn: token => {
        setUserToken(token);
      },
      signOut: () => {
        setUserToken(null);
        AsyncStorage.clear();
      },
      getToken: userToken,
    };
  }, [userToken]);
  const LoginCheck = async () => {
    console.log('login check');
    var token = await AsyncStorage.getItem('token');
    if (token != null && token !== '') {
      //   var apiResponse = await Api.post(EP.TOKENVERIFY, {});
      console.log(loaded);

      //   if (apiResponse.status === 'Active') {
      // setUserToken(token);
      //     var userData = JSON.parse(await AsyncStorage.getItem('userData'));
      //     setUserDetails(userData);
      //   }
    }
    setIsLoading(false);
    console.log(loaded);
  };

  if (loaded) {
    return <AppPreLoader />;
  }

  if (userToken) {
    return (
      <Fragment>
        <AuthContext.Provider value={authContext}>
          <Logged />
        </AuthContext.Provider>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <AuthContext.Provider value={authContext}>
          <Guest />
        </AuthContext.Provider>
      </Fragment>
    );
  }
};

export default App;
