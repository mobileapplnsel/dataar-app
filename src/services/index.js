import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
export default class API {
  // static contextType = AuthContext;
  constructor(options) {
    this.baseUrl = options.baseUrl;
  }
  get(endpoint, params) {
    return this.httpRequestget('GET', this.baseUrl + endpoint, params);
  }
  post(endpoint, params) {
    return this.httpRequest('POST', this.baseUrl + endpoint, params);
  }

  httpRequest(method, url, params) {
    console.log(params);
    // return new Promise(async (resolve, reject) => {
    // var token = await AsyncStorage.getItem('token');
    //   axios
    //     .post(
    //       url,
    //       {
    //         params,
    //       },
    //       {
    //         headers: {
    //           Authorization: 'Bearer ' + token,
    //           Accept: '*/*',
    //           // 'Content-Type': 'application/json',
    //         },
    //         // data: ,
    //       },
    //     )
    //     .then(response => {
    //       console.log(response);
    //       resolve(JSON.stringify(response));
    //     })
    //     .catch(function (error) {
    //       // console.log(error);
    //       reject(error);
    //     });
    // });

    return new Promise(async (resolve, reject) => {
      var token = await AsyncStorage.getItem('token');
      console.log(JSON.stringify(params));
      let options = {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: method,
        body: JSON.stringify(params),
      };
      console.log(url);
      // console.log(options);
      fetch(url, options)
        .then(response => response.json())
        .then(responseJson => {
          resolve(responseJson);
          console.log(responseJson);
        })
        .catch(error => {
          reject(error);
        }); //to catch the errors if any
    });
  }

  httpBlogRequestget(method, url, params) {
    return new Promise(async (resolve, reject) => {
      var token = await AsyncStorage.getItem('token');
      console.log(token);
      let options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Authorization: 'Bearer ' + token,
        },
        method: method,
        body: JSON.stringify(params),
      };
      console.log(url);
      // console.log(options);
      fetch(url, options)
        .then(response => response.json())
        .then(responseJson => {
          resolve(responseJson);
        })
        .catch(error => {
          reject(error);
        }); //to catch the errors if any
    });
  }
}
