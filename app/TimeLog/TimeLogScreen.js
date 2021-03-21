import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {pxPhone} from '../../core/utils/utils';
import {format} from 'date-fns';
import TimeLogService from '../services/timelog.service';
import moment from 'moment';
import _, {groupBy} from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TimeLogSummaryScreen from './TimeLogSummaryScreen';
export default TimeLogScreen = (props) => {
  const [startDate, setStartDate] = useState(
    new Date(
      moment()
        .subtract(0, 'weeks')
        .startOf('week')
        .isoWeekday(1)
        .format('YYYY-MM-DD'),
    ),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [resetData, setResetData] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setResetData(false);
      const timeLogService = new TimeLogService();
      const response = timeLogService.getTimeEntries(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
      );
      response
        .then((result) => {
          result.map((item) => {
            if (item.status === 'NEW') item.checkbox = false;
            else item.checkbox = true;
            return 1;
          })
          result.sort((a, b) => new Date(b.workDate) - new Date(a.workDate));
          const groupByDay = _.groupBy(result, function (item) {
            return moment(item.workDate).startOf('day').format('MM/DD/YYYY');
          });

          const arrayDays = _.map(groupByDay, (data, date) => ({date, data}));
          arrayDays.map((item) =>
            item.data.sort(
              (a, b) =>
                moment(a.startFrom, 'HH:mm:ss') -
                moment(b.startFrom, 'HH:mm:ss'),
            ),
          );
          const groupByWeek = _.groupBy(arrayDays, function (item) {
            const startWeek = moment(item.date)
              .startOf('isoweek')
              .startOf('day')
              .format('MMMM D');
            const endWeek = moment(item.date)
              .endOf('isoweek')
              .startOf('day')
              .format('MMMM D');
            let format = startWeek + ' - ' + endWeek;
            if (
              moment(item.date).startOf('isoweek').isSame(moment(), 'isoweek')
            )
              format = 'This Week';
            if (
              moment(item.date)
                .startOf('isoweek')
                .isSame(moment().subtract(7, 'd'), 'isoweek')
            )
              format = 'Last Week';
            return format;
          });
          const array = _.map(groupByWeek, (data, weekName) => ({
            weekName,
            data,
          }));
          setData(array);
        })
        .catch((e) => {
          console.log('error:', e);
        });
    };
    fetchData();
  }, [resetData]);
  const renderItemTimeLogByWeek = (item) => {
    return (
      <View>
        <Text style={styles.txtWeek}>{item.weekName}</Text>
        <FlatList
          data={item.data}
          extraData={item.data}
          renderItem={(item) => {
            return renderItemTimeLogByDate(item.item);
          }}
        />
      </View>
    );
  };
  const renderItemTimeLogByDate = (item) => {
    return (
      <View>
        <TimeLogSummaryScreen item={item} {...props} refreshData={refreshData}/>
      </View>
    );
  };
  const refreshData = () => {
    setResetData(true);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={data}
        extraData={data}
        style={{marginTop: pxPhone(10)}}
        renderItem={(item) => {
          return renderItemTimeLogByWeek(item.item);
        }}
      />
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('TimeLogCreate', {
            onGoBack: () => refreshData(),
          })
        }
        activeOpacity={0.75}
        style={styles.icon}>
        <FontAwesome name={'plus'} size={pxPhone(20)} color={'white'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  txtWeek: {
    fontSize: pxPhone(20),
    fontWeight: 'bold',
    marginTop: pxPhone(10),
    borderWidth: pxPhone(1),
    borderColor: 'white',
    borderBottomColor: 'darkgray',
    paddingVertical: pxPhone(8),
    marginHorizontal: pxPhone(15),
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
