import React, { useState } from 'react';
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';
import { imageBackground2, logo } from './assets/images';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import { pxPhone } from '../core/utils/utils';
import { clearTokens, signIn } from '@okta/okta-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { onSetToken } from '../core/store/reducer/session/actions';
import { onSetUser, onSetRole } from '../core/store/reducer/user/actions';
import jwt_decode from "jwt-decode";


export default LoginScreen = (props) => {
  const [state, setState] = useState({
    username: '',
    password: '',
    progress: false,
    error: '',
  });
  const [isUserNameFocus, setIsUserNameFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false)

  const dispatch = useDispatch();

  const login = () => {
    setState({ ...state, progress: true });

    const { navigation } = props;

    signIn({ username: state.username, password: state.password })
      .then(token => {
        dispatch(onSetToken(token.access_token));

        const decoded = jwt_decode(token.access_token);
        console.log(decoded);
        const role = decoded.groups.length > 1 ? 'HR' : 'Everyone';
        dispatch(onSetRole(role));

        setState({
          progress: false,
          username: '',
          password: '',
          error: ''
        });
        navigation.navigate('Main');
      })
      .catch(e => {
        setState({ ...state, progress: false, error: e.message });
      });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
          }}>
          <Spinner
            visible={state.progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={{ padding: pxPhone(30) }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{
                  width: pxPhone(180) * (1346 / 1769),
                  height: pxPhone(180),
                }}
                source={logo.imageSource}
              />
              <Text style={{
                marginTop: pxPhone(5),
                fontWeight: 'normal',
                // color:'#0052CC',
                color: '#9AC4F8',
                fontSize: pxPhone(20)
              }}>
                {'Time tracking for better work'}
              </Text>
              <Text style={{
                fontWeight: 'bold',
                fontSize: pxPhone(40),
                color: '#0052CC',
                marginTop: pxPhone(10)
              }}>
                {'Login'}
              </Text>
            </View>
            <View
              style={state.username === '' && !isUserNameFocus && {
                borderBottomWidth: pxPhone(1),
                borderColor: 'gray',
                paddingBottom: pxPhone(10),
                marginTop: pxPhone(20),
              }}>
              <Sae
                value={state.username}
                label={'Username'}
                iconClass={FontAwesomeIcon}
                iconName={'user-circle-o'}
                iconColor={'#0052CC'}
                inputPadding={pxPhone(20)}
                labelHeight={pxPhone(24)}
                borderHeight={pxPhone(2)}
                inputStyle={{ color: 'black' }}
                autoCapitalize={'none'}
                autoCorrect={false}
                onFocus={() => setIsUserNameFocus(true)}
                onEndEditing={() => setIsUserNameFocus(false)}
                onChangeText={username => setState({ ...state, username })}
              />
            </View>
            <View style={
              state.password === '' && !isPasswordFocus && {
                borderColor: 'gray',
                paddingBottom: pxPhone(10),
                borderBottomWidth: pxPhone(1),
              }}>
              <Sae
                value={state.password}
                secureTextEntry
                label={'Password'}
                iconClass={FontAwesomeIcon}
                iconName={'lock'}
                iconColor={'#0052CC'}
                inputPadding={pxPhone(20)}
                labelHeight={pxPhone(24)}
                borderHeight={pxPhone(2)}
                inputStyle={{ color: 'black' }}
                autoCapitalize={'none'}
                autoCorrect={false}
                onFocus={() => setIsPasswordFocus(true)}
                onEndEditing={() => setIsPasswordFocus(false)}
                onChangeText={password => setState({ ...state, password })}
              />
            </View>
            <TouchableOpacity
              onPress={login}
              activeOpacity={0.75}
              style={{ marginTop: pxPhone(40), padding: pxPhone(12), backgroundColor: '#0052CC', alignItems: 'center', borderRadius: pxPhone(5) }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: pxPhone(20) }}>
                {'LOGIN'}
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', color: '#0052CC', fontSize: pxPhone(15), marginTop: pxPhone(18) }}>
              {'Forgot Password?'}
            </Text>
          </View>
          <Error error={state.error} />
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
  }
});
