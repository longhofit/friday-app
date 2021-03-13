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
  ToastAndroid,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';
import { imageBackground2, logo } from './assets/images';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import { pxPhone } from '../core/utils/utils';
import SettingService from './services/setting.service';

export default ForgotPasswordScreen = (props) => {
  const [Gmail, setGmail] = useState("");
  const [isGmailFocus, setIsGmailFocus] = useState(false);
  const onPressForgotPassword = () => {
    
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
          <View style={{ padding: pxPhone(30), paddingTop: pxPhone(60) }}>
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
            </View>
            <View
              style={Gmail === '' && !isGmailFocus && {
                borderBottomWidth: pxPhone(1),
                borderColor: 'gray',
                paddingBottom: pxPhone(10),
                marginTop: pxPhone(60),
              }}>
              <Sae
                value={Gmail}
                label={'Gmail'}
                iconClass={FontAwesomeIcon}
                iconName={'user-circle-o'}
                iconColor={'#0052CC'}
                inputPadding={pxPhone(20)}
                labelHeight={pxPhone(24)}
                borderHeight={pxPhone(2)}
                inputStyle={{ color: 'black' }}
                autoCapitalize={'none'}
                autoCorrect={false}
                onFocus={() => setIsGmailFocus(true)}
                onEndEditing={() => setIsGmailFocus(false)}
                onChangeText={gmail => setGmail(gmail)}
              />
            </View>
            <TouchableOpacity
              onPress={onPressForgotPassword}
              activeOpacity={0.75}
              style={{ marginTop: pxPhone(40), padding: pxPhone(12), backgroundColor: '#0052CC', alignItems: 'center', borderRadius: pxPhone(5) }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: pxPhone(20) }}>
                {'Reset via Email'}
              </Text>
            </TouchableOpacity>
            <Text style={{color: '#0052CC', fontSize: pxPhone(15), marginTop: pxPhone(18) }}>
              {'Back to login'}
            </Text>
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
  }
});
