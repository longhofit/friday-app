import React, { useState } from 'react';
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
} from 'react-native';
import { signIn } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';


export default LoginScreen = (props) => {
  const [state, setState] = useState({
    username: '',
    password: '',
    progress: false,
    error: '',
  });


  const login = () => {
    console.log('run');
    setState({ ...state, progress: true });

    const { navigation } = props;

    signIn({ username: state.username, password: state.password })
      .then(token => {
        setState({
          progress: false,
          username: '',
          password: '',
          error: ''
        });
        navigation.navigate('Profile');
      })
      .catch(e => {
        setState({ ...state, progress: false, error: e.message });
      });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={state.progress}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Text style={styles.title}>Native Sign-In</Text>
        <Error error={state.error} />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <TextInput
              style={styles.textInput}
              placeholder="User Name"
              onChangeText={username => setState({ ...state, username: username })}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={password => setState({ ...state, password: password })}
            />
            <View style={{ marginTop: 40, height: 40 }}>
              <Button
                testID="loginButton"
                onPress={() => login()}
                title="Login"
              />
            </View>
          </View>
        </View>
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
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40,
    textAlign: 'center',
  }
});
