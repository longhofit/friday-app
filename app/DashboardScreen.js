import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getAccessToken, getUser, clearTokens } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';
import jwt_decode from "jwt-decode";
import HomeService from './services/home.service';
import CalendarComponent from './components/calendar/calendar.component';
import { yyyMMddFormatter, getDatesBetweenDates } from '../core/formatters';
import { onSetToken } from '../core/store/reducer/session/actions';
import { onSetUser, onSetRole } from '../core/store/reducer/user/actions';

export default DashboardScreen = (props) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [dates, setDates] = useState([]);
  const session = useSelector(state => state.session);
  const userState = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setProgress(true);

    getUser()
      .then(user => {
        setProgress(false);
        dispatch(onSetUser({
          name: user.name,
          email: user.preferred_username,
          sub: user.sub,
          role: '',
        }))
        setUser(user);

      })
      .catch(e => {
        setProgress(false);
        setError(e.message);
      });

    getToken()
  }, []);

  useEffect(() => {
    const dateTemps = [];

    requests.forEach(request => {
      const dateBw = getDatesBetweenDates(request.startDate, request.endDate).map(date => { return yyyMMddFormatter(date) });

      dateBw.forEach((item, index) => {
        dateTemps.push({
          date: item,
          option: {
            color: '#70d7c7',
            textColor: 'white',
            startingDay: index === 0,
            endingDay: index === (dateBw.length - 1),
          },
        })
      });

    });

    setDates(dateTemps);
  }, [requests]);


  const getToken = () => {
    setProgress(false);
    getAccessToken()
      .then(token => {
        setProgress(false);
        dispatch(onSetToken(token.access_token));

        const decoded = jwt_decode(token.access_token);
        const role = decoded.groups.length > 1 ? 'HR' : 'Everyone';
        dispatch(onSetRole(role));

        const homeService = new HomeService();
        homeService.getAllRequest(token.access_token).then(data => {
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
      <ScrollView style={{ flex: 1, paddingBottom: 50 }} contentContainerStyle={styles.container}>
        <Spinner
          visible={progress}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Error error={error} />
        {user && (
          <View style={{ paddingLeft: 10 }}>
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
            <View style={{ flexDirection: 'row' }}>
              <Text>{`Token:\n${session.accessToken}`}</Text>
            </View>
          </View>
        )}
        <View style={{ flexDirection: 'column', marginTop: 10, paddingLeft: 20, width: 300, marginBottom: 10 }}>
          <View style={styles.tokenContainer}>
            <TouchableOpacity onPress={() => logout()}>
              <Text style={styles.tokenTitle}>Requests:</Text>
            </TouchableOpacity>

          </View>
        </View>
        <View style={{ width: '100%', height: 400 }}>
          <CalendarComponent
            requestDates={dates}
          />
        </View>

      </ScrollView>
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
    // flex: 1,
    // flexDirection: 'column',
    // backgroundColor: '#FFFFFF',
    // paddingBottom: 50,
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
