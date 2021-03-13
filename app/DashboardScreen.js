import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, clearTokens } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';
import HomeService from './services/home.service';
import CalendarComponent from './components/calendar/calendar.component';
import { yyyMMddFormatter, getDatesBetweenDates } from '../core/formatters';
import { onSetUser } from '../core/store/reducer/user/actions';
import { pxPhone } from '../core/utils/utils';

export default DashboardScreen = (props) => {
  const [progress, setProgress] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [dates, setDates] = useState([]);
  const session = useSelector(state => state.session);
  const userState = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserInfo();

    getAllRequestLeave();
  }, [session.accessToken]);

  useEffect(() => {
    const dateTemps = [];

    requests.forEach(request => {
      const dateBw = getDatesBetweenDates(request.startDate, request.endDate).map(date => { return yyyMMddFormatter(date) });
      const { type } = request;
      const color = type === 'unpaid' ? '#7E57C2' : type === 'remote' ? '#FF7043' : '#43A047';

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

  const getUserInfo = () => {
    setProgress(true);
    getUser()
      .then(user => {
        dispatch(onSetUser({
          name: user.name,
          email: user.preferred_username,
          sub: user.sub,
          role: '',
        }));

        console.log(user)
      })
      .catch(e => {
        setError(e.message);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const getAllRequestLeave = () => {
    setProgress(true);
    const homeService = new HomeService();
    homeService.getAllMyRequest()
      .then(data => {
        setRequests(data);
      })
      .catch(e => {
        setError(e.message);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const showToastWithGravityAndOffset = (text) => {
    ToastAndroid.showWithGravityAndOffset(
      text,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };;

  const deleteLeaveRequest = (id) => {
    setProgress(true);
    const homeService = new HomeService();
    homeService.deleteLeave(id)
      .then(data => {
        showToastWithGravityAndOffset(data);
        setRequests(requests.filter(request => request.id !== id));
      })
      .catch(e => {
        showToastWithGravityAndOffset(e.message);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  return (
    <>
      <StatusBar barStyle="default" />
      <View style={{ flex: 1 }} >
        <Spinner
          visible={progress}
          textContent={'Loading ...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Error error={error} />
        {(
          <View style={{ paddingLeft: pxPhone(12), marginTop: pxPhone(15) }}>
            <Text style={styles.titleHello}>
              <Text style={{ color: 'black' }}>
                {'Hello '}
              </Text>
              {`${userState.name}`}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: pxPhone(12) }}>
              <Text style={{ fontWeight: 'bold', fontSize: pxPhone(18) }}>
                {`You have ${requests.length} leave ${requests.length <= 1 ? 'request' : 'requests'}.`}
              </Text>
            </View>
          </View>
        )}
        <CalendarComponent
          deleteLeaveRequest={deleteLeaveRequest}
          getAllRequest={getAllRequestLeave}
          requestDates={dates}
          requests={requests}
        />
      </View>
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
