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
import { pxPhone } from '../core/utils/utils';

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
        console.log(user);
        setProgress(false);
        dispatch(onSetUser({
          name: user.name,
          email: user.preferred_username,
          sub: user.sub,
          role: '',
        }))

        console.log(user)
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
      const { type } = request;
      const color = type === 'unpaid' ? '#1d0f52' : type === 'remote' ? '#b54b04' : '#1e8f18';

      dateBw.forEach((item, index) => {
        dateTemps.push({
          date: item,
          option: {
            color,
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

        getAllRequest();

      })
      .catch(e => {
        setProgress(false);
        setError(e.message);
      })
  }

  const getAllRequest = () => {
    const homeService = new HomeService();
    homeService.getAllRequest().then(data => {
      setRequests(data);
    });
  };

  const deleteLeaveRequest = (id) => {
    const homeService = new HomeService();
    homeService.deleteLeave(id)
      .then(data => {
        console.log(data);
        setRequests(requests.filter(request => request.id !== id));
      })
      .catch(e => console.log(e));
  };

  logout = () => {
    clearTokens()
      .then(() => {
        dispatch(onSetUser({
          name: '',
          email: '',
          sub: '',
          role: '',
        }))
        props.navigation.navigate('Login');
      })
      .catch(e => {
        setError(e.message);
      });
  }

  return (
    <>
      <StatusBar barStyle="default" />
      <ScrollView style={{ flex: 1, paddingBottom: 50 }} contentContainerStyle={styles.container}>
        <Spinner
          visible={progress}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Error error={error} />
        {user && (
          <View>
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
        <View style={{ flexDirection: 'column', marginTop: 10, width: 300, marginBottom: 10 }}>
          <View style={styles.tokenContainer}>
            <TouchableOpacity onPress={() => logout()}>
              <Text style={styles.tokenTitle}>{'Your leave:'}</Text>
            </TouchableOpacity>

          </View>
        </View>
        <View style={{ width: '100%', height: 400 }}>
          <CalendarComponent
            deleteLeaveRequest={deleteLeaveRequest}
            getAllRequest={getAllRequest}
            requestDates={dates}
            requests={requests}
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
    padding: pxPhone(16),
    // flex: 1,
    // flexDirection: 'column',
    // backgroundColor: '#FFFFFF',
    // paddingBottom: 50,
  },
  titleHello: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
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
