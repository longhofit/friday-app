import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { logo } from './assets/images';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';
import { pxPhone } from '../core/utils/utils';
import { signIn } from '@okta/okta-react-native';
import { useDispatch } from 'react-redux';
import { onSetToken } from '../core/store/reducer/session/actions';
import { onSetRole } from '../core/store/reducer/user/actions';
import jwt_decode from "jwt-decode";
import SettingService from './services/setting.service';
import EmployeesService from './services/employees.service';
import { onGetEmployees } from '../core/store/reducer/employee/actions';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import FirebaseService from './services/firebase.service';
import { theme } from './theme/appTheme';
import * as Keychain from 'react-native-keychain';
import { onRequestRecognizeAuthentication } from '../core/utils/recognizeHelper';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default LoginScreen = (props) => {
  const [state, setState] = useState({
    username: '',
    password: '',
    progress: false,
    error: '',
  });
  const [isUserNameFocus, setIsUserNameFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false)
  const supportedURL = "https://dev-7931343.okta.com/signin/forgot-password";
  const dispatch = useDispatch();

  const showToastWithGravityAndOffset = (text) => {
    ToastAndroid.showWithGravityAndOffset(
      text,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };;
  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      console.log('null ');
      const response = messaging().getToken();
      response
        .then(async (result) => {
          console.log('FcmToken1 = ', result);
          await AsyncStorage.setItem('fcmToken', result);
        })
        .catch((error) => {
          console.log('error = ', error);
        });
    } else {
      console.log('FcmToken2 = ', fcmToken);
    }
  }
  useEffect(() => {
    getToken();
  }, [])

  const { navigation } = props;

  const login = () => {
    onLogin(state.username, state.password)
  }

  const onLogin = (username, password) => {
    setState({ ...state, progress: true });

    signIn({ username, password })
      .then(async (token) => {
        dispatch(onSetToken(token.access_token));

        onSetGenericPassword(username, password);

        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
          const response = messaging().getToken();
          response
            .then(async (result) => {
              var fireBaseService = new FirebaseService();
              const res = fireBaseService.pushNotification(JSON.stringify({
                topicName: "string",
                tokens: [
                  result,
                ]
              }))
              res.then((result) => {
                console.log("result = ", result);
              }).catch((e) => {
                console.log("error = ", error);
              })
              fcmToken = result;
              await AsyncStorage.setItem('fcmToken', fcmToken);
            })
            .catch((error) => {
              console.log("error = ", error);
            })
        } else {
          console.log("FcmToken = ", fcmToken);
          var fireBaseService = new FirebaseService();
          const res = fireBaseService.pushNotification(JSON.stringify({
            topicName: "string",
            tokens: [
              fcmToken
            ]
          }))
          res.then((result) => {
            console.log("success");
            console.log("result = ", result);
          }).catch((error) => {
            console.log("fail");
            console.log("error = ", error);
          })
        }

        const employeesService = new EmployeesService();
        employeesService.getAllEmployee().then(data => {
          dispatch(onGetEmployees(data));
        })
        const decoded = jwt_decode(token.access_token);
        console.log("decoded:", decoded.groups);
        let role;
        if (decoded.groups.length == 3) {
          role = 'hr';
        } else if (decoded.groups.length == 2) {
          role = 'manager';
        } else {
          role = 'Everyone';
        }
        dispatch(onSetRole(role));
        if (role === 'hr' || role === 'manager') {
          const settingService = new SettingService();
          const response = settingService.getPolicy();
          response
            .then((res) => {
              setState({
                progress: false,
                username: '',
                password: '',
                error: ''
              });
              navigation.navigate('Timelog');
            })
            .catch((e) => {
              console.log('error:', e);
              setState({
                ...state,
                progress: false,
              });
              if (e.status === 404) {
                navigation.navigate('Policy');
              }
            });
        } else {
          setState({
            progress: false,
            username: '',
            password: '',
            error: ''
          });
          navigation.navigate('Timelog');
        }
      })
      .catch(e => {
        setState({ ...state, progress: false, error: e.message });
        showToastWithGravityAndOffset(e.message);
      });
  }

  const onPressForgotPassword = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(supportedURL);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(supportedURL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
    }
  }, [supportedURL]);

  const onSignInWithRecognizePress = () => {
    onSignInWithRecognize();
  };

  const onGetGenericPassword = async () => {
    const credentials = await Keychain.getGenericPassword();

    if (credentials) {
      const { username, password } = credentials;
      console.log(`Credentials successfully loaded for username: ${username}, password: ${password}`);
      onLogin(username, password);
    } else {
      console.log('No credentials stored');
    }
  };

  const onSignInWithRecognize = () => {
    onRequestRecognizeAuthentication(() => {
      onGetGenericPassword();
    }, (errorCode) => {
      if (errorCode === 'UNKNOWN_ERROR') {
        console.log('Fingerprint / Face ID setting have been changed, please customize in the system settings.')
        // dispatch(onUpdateFaceIDEnabled(false));
        // dispatch(onUpdateFingerprintEnabled(false));
        // dispatch(onUpdateRecognizeSupported(undefined));
      }
    });
  };

  const onSetGenericPassword = async (username, password) => {
    await Keychain.setGenericPassword(username, password);
  };


  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
          }}>
          <Spinner
            visible={state.progress}
            textStyle={styles.spinnerTextStyle}
            color={theme["color-app"]}
          />
          <View style={{ padding: pxPhone(30), paddingTop: pxPhone(60) }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{
                  width: pxPhone(90) * (446 / 160),
                  height: pxPhone(90),
                }}
                source={logo.imageSource}
              />
            </View>
            <View
              style={{
                borderColor: isUserNameFocus ? theme["color-app"] : 'gray',
                marginTop: pxPhone(150),
                borderWidth: isUserNameFocus ? pxPhone(2) : pxPhone(1),
                borderRadius: pxPhone(5),
                padding: pxPhone(1),
              }}>
              <Hideo
                placeholder={'Username'}
                value={state.username}
                iconClass={FontAwesomeIcon}
                iconName={'user-circle-o'}
                iconColor={isUserNameFocus ? theme["color-app"] : 'gray'}
                inputPadding={pxPhone(20)}
                labelHeight={pxPhone(24)}
                borderHeight={pxPhone(2)}
                inputStyle={{ color: 'black' }}
                autoCapitalize={'none'}
                autoCorrect={false}
                onFocus={() => setIsUserNameFocus(true)}
                onEndEditing={() => setIsUserNameFocus(false)}
                onChangeText={username => setState({ ...state, username })}
                iconBackgroundColor={'stranpate'}
                inputStyle={{ color: '#464949' }}
              />
            </View>
            <View style={
              {
                borderColor: isPasswordFocus ? theme["color-app"] : 'gray',
                borderWidth: isPasswordFocus ? pxPhone(2) : pxPhone(1),
                marginTop: pxPhone(20),
                borderRadius: pxPhone(5),
                padding: pxPhone(1),
              }}>
              <Hideo
                placeholder={'Password'}
                value={state.password}
                secureTextEntry
                label={'Password'}
                iconClass={FontAwesomeIcon}
                iconName={'lock'}
                iconColor={isPasswordFocus ? theme["color-app"] : 'gray'}
                inputPadding={pxPhone(20)}
                labelHeight={pxPhone(24)}
                borderHeight={pxPhone(2)}
                inputStyle={{ color: 'black' }}
                autoCapitalize={'none'}
                autoCorrect={false}
                onFocus={() => setIsPasswordFocus(true)}
                onEndEditing={() => setIsPasswordFocus(false)}
                iconBackgroundColor={'stranpate'}
                onChangeText={password => setState({ ...state, password })}
              />
            </View>
            <TouchableOpacity
              onPress={login}
              activeOpacity={0.75}
              style={{ marginTop: pxPhone(40), padding: pxPhone(12), backgroundColor: theme["color-app"], alignItems: 'center', borderRadius: pxPhone(5) }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: pxPhone(20) }}>
                {'Sign in'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: pxPhone(30) }}
              onPress={onSignInWithRecognizePress}
              activeOpacity={0.75}>
              <Ionicons
                size={pxPhone(50)}
                name={'ios-finger-print'}
                color={theme["color-app"]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressForgotPassword}>
              <Text style={{ textAlign: 'center', color: theme["color-app"], fontSize: pxPhone(15), marginTop: pxPhone(18) }}>
                {'Forgot Password?'}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  textInput: {
    marginTop: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 40,
    textAlign: 'center',
  },
});
