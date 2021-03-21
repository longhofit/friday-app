import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {pxPhone} from '../../core/utils/utils';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import {Calendar} from 'react-native-calendars';
import TimeLogService from '../services/timelog.service';
import moment from 'moment';
import _, {groupBy} from 'lodash';
import TimeLogSummaryScreen from './TimeLogSummaryScreen';
export default TimeLogReportScreen = (props) => {
  const [startDate, setStartDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
    ),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [dateType, setDateType] = useState('');
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [data, setData] = useState(null);
  const onOpenDatePicker = (type) => {
    setDateType(type);
    setIsShowDatePicker(true);
  };
  const renderDatePicker = () => {
    return (
      <Modal
        onBackdropPress={() => setIsShowDatePicker(false)}
        isVisible={isShowDatePicker}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={{paddingTop: pxPhone(10)}}>
          <Calendar
            current={
              dateType === 'startDate'
                ? format(startDate, 'yyyy-MM-dd')
                : format(endDate, 'yyyy-MM-dd')
            }
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: pxPhone(8),
              width: pxPhone(370),
              height: pxPhone(370),
            }}
            theme={{
              calendarBackground: '#d9e1e8',
              textSectionTitleColor: 'black',
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: 'transparent',
              selectedDayTextColor: 'black',
              textDisabledColor: '#d9e1e8',
              todayTextColor: 'blue',
              dayTextColor: 'black',
              arrowColor: 'black',
              monthTextColor: 'black',
              indicatorColor: 'red',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
            }}
            onDayPress={onDatePress}
            hideArrows={false}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={0}
            hideDayNames={false}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            disableAllTouchEventsForDisabledDays={true}
            enableSwipeMonths={true}
            markedDates={
              dateType === 'startDate'
                ? {
                    [format(startDate, 'yyyy-MM-dd')]: {
                      selected: true,
                      selectedColor: '#9AC4F8',
                    },
                  }
                : {
                    [format(endDate, 'yyyy-MM-dd')]: {
                      selected: true,
                      selectedColor: '#9AC4F8',
                    },
                  }
            }
          />
        </View>
      </Modal>
    );
  };
  const onDatePress = (date) => {
    const newDate = new Date(startDate);
    newDate.setDate(date.day);
    newDate.setMonth(date.month - 1);
    newDate.setFullYear(date.year);
    dateType === 'startDate' ? setStartDate(newDate) : setEndDate(newDate);
    setIsShowDatePicker(false);
  };
  const onMonthChange = () => {};
  const onPressShowReport = () => {
    const timeLogService = new TimeLogService();
    const response = timeLogService.getTimeEntries(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
    );
    response
      .then((result) => {
        result.sort((a, b) => new Date(b.workDate) - new Date(a.workDate));
        const groupByDay = _.groupBy(result, function (item) {
          return moment(item.workDate).startOf('day').format('MM/DD/YYYY');
        });
        const arrayDays = _.map(groupByDay, (data, date) => ({date, data}));
        arrayDays.map((item) =>
          item.data.sort(
            (a, b) =>
              moment(a.startFrom, 'HH:mm:ss') - moment(b.startFrom, 'HH:mm:ss'),
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
          if (moment(item.date).startOf('isoweek').isSame(moment(), 'isoweek'))
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
        console.log('data:', array);
      })
      .catch((e) => {
        console.log('error:', e);
      });
  };
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
    const newDate = new Date(item.date);
    const stringDate =
      moment(newDate).format('dddd') +
      ', ' +
      format(newDate, 'MMM') +
      ' ' +
      newDate.getDate();
    let totalTime = 0;
    item.data.map((item) => {
      totalTime += item.duration;
    });
    var hours = parseInt(totalTime / 60);
    var minutes = parseInt(totalTime % 60);
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return (
      <View>
        <TimeLogSummaryScreen item={item} {...props}/>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.viewHeader}>
        <View style={styles.viewHeader2}>
          <View style={styles.viewDateStart}>
            <TouchableOpacity
              onPress={() => onOpenDatePicker('startDate')}
              activeOpacity={0.75}
              style={styles.buttonSelectDateStart}>
              <View style={styles.viewItemDateStart}>
                <Text style={{color: '#585858', fontSize: pxPhone(12)}}>
                  {'Start Date'}
                </Text>
              </View>
              <Text style={{fontSize: pxPhone(16)}}>
                {format(startDate, 'yyyy-MM-dd')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewDateEnd}>
            <TouchableOpacity
              onPress={() => onOpenDatePicker('endDate')}
              activeOpacity={0.75}
              style={styles.buttonSelectDateEnd}>
              <View style={styles.viewItemDateEnd}>
                <Text style={{color: '#585858', fontSize: pxPhone(12)}}>
                  {'End Date'}
                </Text>
              </View>
              <Text style={{fontSize: pxPhone(16)}}>
                {format(endDate, 'yyyy-MM-dd')}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPressShowReport}
            style={styles.buttonShowReport}>
            <Text
              style={{
                fontWeight: '600',
                color: 'white',
                fontSize: pxPhone(12),
              }}>
              {'SHOW REPORT'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        extraData={data}
        renderItem={(item) => {
          return renderItemTimeLogByWeek(item.item);
        }}
      />
      {renderDatePicker()}
      {renderModalSelect()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  viewHeader: {
    marginTop: pxPhone(20),
    paddingVertical: pxPhone(18),
    width: '90%',
    backgroundColor: 'white',
    borderRadius: pxPhone(6),
    shadowColor: '#000',
    alignItems: 'center',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(6),
    elevation: 8,
    alignSelf: 'center',
  },
  viewHeader2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  viewDateStart: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32%',
  },
  buttonSelectDateStart: {
    borderWidth: pxPhone(1),
    borderColor: '#BDBDBD',
    flex: 1,
    height: pxPhone(40),
    borderRadius: pxPhone(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewItemDateStart: {
    position: 'absolute',
    top: pxPhone(-10),
    backgroundColor: 'white',
    left: pxPhone(10),
    paddingHorizontal: pxPhone(5),
  },
  viewDateEnd: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32%',
  },
  buttonSelectDateEnd: {
    borderWidth: pxPhone(1),
    borderColor: '#BDBDBD',
    flex: 1,
    height: pxPhone(40),
    borderRadius: pxPhone(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewItemDateEnd: {
    position: 'absolute',
    top: pxPhone(-10),
    backgroundColor: 'white',
    left: pxPhone(10),
    paddingHorizontal: pxPhone(5),
  },
  buttonShowReport: {
    justifyContent: 'center',
    backgroundColor: '#3753C7',
    borderRadius: pxPhone(6),
    height: pxPhone(40),
    paddingHorizontal: pxPhone(15),
    shadowColor: '#3753C7',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(6),
    elevation: 8,
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
});
