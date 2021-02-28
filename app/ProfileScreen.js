import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button
} from 'react-native';
import { getAccessToken, getUser, clearTokens, getUserFromIdToken } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';
import jwt_decode from "jwt-decode";
import HomeService from './services/home.service';

export default ProfileScreen = (props) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    props.navigation.setOptions(
      {
        headerLeft: () =>
          <Text onPress={() => logout()} style={styles.logoutButton}>Logout</Text>
      }
    );

    setProgress(true);

    getUser()
      .then(user => {
        setProgress(false);
        setUser(user);
        console.log(user)
      })
      .catch(e => {
        setProgress(false);
        setError(e.message);
      });

    getToken()

    return () => logout();
  }, []);


  const getToken = () => {
    setProgress(false);
    getAccessToken()
      .then(token => {
        const decoded = jwt_decode(token.access_token);
        setProgress(false);
        setAccessToken(token.access_token);
        console.log(token.access_token)
        const homeService = new HomeService();
        homeService.getAllRequest(token.access_token).then(data => {
          console.log(data);
          setRequests(data);
        });
      })
      .catch(e => {
        setProgress(false);
        setError(e.message);
      })
  }

  logout = () => {
    clearTokens()
      .then(() => {
        props.navigation.navigate('Login');
      })
      .catch(e => {
        setError(e.message);
      });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={progress}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Error error={error} />
        {user && (
          <View style={{ paddingLeft: 20, paddingTop: 20 }}>
            <Text style={styles.titleHello}>Hello {user.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text>Name: </Text>
              <Text>{user.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>Locale: </Text>
              <Text>{user.locale}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>Zone Info: </Text>
              <Text>{user.zoneinfo}</Text>
            </View>
          </View>
        )}
        <View style={{ flexDirection: 'column', marginTop: 20, paddingLeft: 20, width: 300 }}>
          <View style={styles.tokenContainer}>
            <Text style={styles.tokenTitle}>Requests:</Text>
            {requests.map((requests, index) => {
              return (
                <Text key={index} style={{ marginTop: 20 }} numberOfLines={5}>{`Start: ${requests.startDate} End: ${requests.endDate}`}</Text>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  logoutButton: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#0066cc'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  titleHello: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40
  },
  titleDetails: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 15,
    textAlign: 'center',
  },
  tokenContainer: {
    marginTop: 20
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
