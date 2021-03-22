import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from '../components/Error';
import HomeService from '../services/home.service';
import CalendarComponent from '../components/calendar/calendar.component';
import ApplyForm from '../components/FormApply/applyModal';
import { yyyMMddFormatter, getDatesBetweenDates } from '../../core/formatters';
import { onSetUser } from '../../core/store/reducer/user/actions';
import { pxPhone } from '../../core/utils/utils';
import { leaveTypes } from '../../core/constant/menuSideBarConstant';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default DashboardScreen = (props) => {
  const [progress, setProgress] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [isShowAdd, setIsShowAdd] = useState();
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
        console.log('data re', data);
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
    <React.Fragment>
      <ScrollView contentContainerStyle={{ paddingBottom: pxPhone(70) }} style={{ flex: 1 }}>
        <StatusBar barStyle="default" />
        <View style={{ flex: 1 }} >
          <Spinner
            visible={progress}
            textStyle={styles.spinnerTextStyle}
            color={'#0066cc'}
          />
          <Error error={error} />
          {(
            <View style={{
              paddingLeft: pxPhone(12),
              marginTop: pxPhone(25),
              justifyContent: 'center',
              backgroundColor: 'white',
              width: '90%',
              borderRadius: pxPhone(6),
              shadowColor: '#000',
              shadowOffset: {
                width: pxPhone(3),
                height: pxPhone(4),
              },
              shadowOpacity: pxPhone(0.25),
              shadowRadius: pxPhone(6),
              elevation: 8,
              alignSelf: 'center',
              padding: pxPhone(20),
            }}>
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
          {requests.map((item, index) => {
            const color = item.type === 'unpaid' ? '#7E57C5' : item.type === 'remote' ? '#FF7043' : '#43A047';
            const months = [
              'Jan',
              'Feb',
              'Mar.',
              'Apr.',
              'May',
              'Jun.',
              'Jul.',
              'Aug.',
              'Sep.',
              'Oct.',
              'Nov.',
              'Dec.',
            ]
            return (
              <View style={{
                flexDirection: 'row',
                marginTop: pxPhone(20),
                width: '90%',
                backgroundColor: 'white',
                borderRadius: pxPhone(6),
                shadowColor: '#000',
                shadowOffset: {
                  width: pxPhone(3),
                  height: pxPhone(4),
                },
                height: pxPhone(80),
                shadowOpacity: pxPhone(0.25),
                shadowRadius: pxPhone(6),
                elevation: 8,
                alignSelf: 'center',
              }}>
                <View style={{ width: pxPhone(5), height: '100%', backgroundColor: color, borderTopLeftRadius: pxPhone(6), borderBottomLeftRadius: pxPhone(6) }}>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', borderRightColor: 'gray', borderRightWidth: pxPhone(0.5) }}>
                  <Text style={{ fontSize: pxPhone(15), fontWeight: 'bold' }}>
                    {item.startDate !== item.endDate
                      ? `${new Date(item.startDate).getDate() < 10 ? `0${new Date(item.startDate).getDate()}` : `${new Date(item.startDate).getDate()}`} - ${new Date(item.endDate).getDate() < 10 ? `0${new Date(item.endDate).getDate()}` : `${new Date(item.endDate).getDate()}`}`
                      : `${new Date(item.startDate).getDate() < 10 ? `0${new Date(item.startDate).getDate()}` : `${new Date(item.startDate).getDate()}`}`}
                  </Text>
                  <Text style={{ fontSize: pxPhone(15), fontWeight: 'bold' }}>
                    {`${months[new Date(item.startDate).getMonth()]}`}
                  </Text>
                </View>
                <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center', paddingHorizontal: pxPhone(15) }}>
                  <Text style={{ fontSize: pxPhone(14), fontWeight: 'bold' }}>
                    {leaveTypes[`${item.type}`]}
                  </Text>
                  <View style={{ height: pxPhone(0.25), width: '100%', backgroundColor: 'gray', marginVertical: pxPhone(5) }} />
                  <Text style={{ fontSize: pxPhone(15), color: 'gray' }}>
                    {`${new Date(item.startDate).toDateString()} - ${new Date(item.endDate).toDateString()}`}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
        <ApplyForm
          getAllRequest={getAllRequestLeave}
          isShow={isShowAdd}
          onClose={() => setIsShowAdd(false)}
          dateSelect={yyyMMddFormatter(new Date())}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={() => setIsShowAdd(true)}
        activeOpacity={0.75}
        style={styles.icon}>
        <FontAwesome5
          name={'plus'}
          size={pxPhone(20)}
          color={'white'}
        />
      </TouchableOpacity>
    </React.Fragment>
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
  },
  icon: {
    position: 'absolute',
    bottom: pxPhone(10),
    right: pxPhone(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3753C7',
    borderRadius: pxPhone(50 / 2),
    width: pxPhone(50),
    height: pxPhone(50),
  },
});
