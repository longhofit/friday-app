import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { pxPhone } from '../../core/utils/utils';
import Modal from 'react-native-modal';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import TimeLogService from '../services/timelog.service';
import moment from 'moment';
import _, { groupBy } from 'lodash';
import TimeLogSummaryScreen from './TimeLogSummaryScreen';
import { useDispatch, useSelector } from 'react-redux';
import { onFilterSortTimeLog } from '../../core/store/reducer/session/actions';
import { textStyle } from '../components/styles/style';
import { typeData } from '../../core/constant/activity';
import { theme } from '../theme/appTheme';
import AntDesign from 'react-native-vector-icons/AntDesign'
export default TimeLogReportScreen = (props) => {
  const filterAndSortForm = useSelector(state => state.session.timeLogFilterAndSort);
  const dispatch = useDispatch();
  const scrollView = React.useRef(undefined);
  const initState = {
    filter: {
      project: ['ALL'],
      activity: ['ALL'],
    },
    menuFilter: {
      project: [{label: 'All', value: 'ALL'}],
      activity: [{label: 'All', value: 'ALL'}],
    },
  }
  useEffect(() => {
    dispatch(onFilterSortTimeLog(initState));
  }, [])
  
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
  const [raw, setRaw] = useState(null);
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
        style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ paddingTop: pxPhone(10) }}>
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
    const newDate = new Date(date.dateString);
    dateType === 'startDate' ? setStartDate(newDate) : setEndDate(newDate);
    setIsShowDatePicker(false);
  };
  const onMonthChange = () => { };
  const onPressShowReport = async() => {
    dispatch(onFilterSortTimeLog(initState));
    const timeLogService = new TimeLogService();
    const response = timeLogService.getTimeEntries(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
    );
    await response
      .then((result) => {
        setRaw(result);
        let arrayP = [];
        arrayP.push({label: 'All', value: 'ALL'});
        let arrayA = [];
        arrayA.push({label: 'All', value: 'ALL'});
        result.map((item) => {
          var indexP = arrayP.map(function(e) { return e.label; }).indexOf(item.name);
          if (indexP == -1) {
            arrayP.push({label: item.name, value: item.name});
          }

          var indexA = arrayA.map(function(e) { return e.value; }).indexOf(item.activity);
          if (indexA == -1) {
            typeData.forEach(itemTypeData => {
              if(itemTypeData.value == item.activity){
                arrayA.push({label: itemTypeData.name, value: item.activity});  
                return;
              }
            })
            // let valueItem;
            // switch (item.activity) {
            //   case 'DEVELOPMENT':
            //     valueItem = 'Development';
            //     break;
            //   case 'VACATION':
            //     valueItem = 'Vacation';
            //     break;
            //   case 'TESTING':
            //     valueItem = 'Testing';
            //     break;
            //   case 'ANALYZE':
            //     valueItem = 'Analyze/Write specification';
            //     break;
            //   case 'UI_DESIGN':
            //     valueItem = 'Design Estimate workload';
            //     break;
            //   case 'EXT_MEETING':
            //     valueItem = 'Customer Meeting';
            //     break;
            //   case 'INT_MEETING':
            //     valueItem = 'Internal Team Meeting';
            //     break;
            //   case 'MANAGEMENT':
            //     valueItem = 'Management';
            //     break;
            //   default:
            //     break;
            // }
            // arrayA.push({label: valueItem, value: item.activity});  
          }
        })
        const initState = {
          filter: {
            project: ['ALL'],
            activity: ['ALL'],
          },
          menuFilter: {
            project: arrayP,
            activity: arrayA,
          },
        }
        dispatch(onFilterSortTimeLog(initState));
        result.sort((a, b) => new Date(b.workDate) - new Date(a.workDate));
        const groupByDay = _.groupBy(result, function (item) {
          return moment(item.workDate).startOf('day').format('MM/DD/YYYY');
        });
        const arrayDays = _.map(groupByDay, (data, date) => ({ date, data }));
        arrayDays.map((item) =>
          item.data.sort(
            (a, b) =>
              moment(b.startFrom, 'HH:mm:ss') - moment(a.startFrom, 'HH:mm:ss'),
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
    return (
      <View>
        <TimeLogSummaryScreen item={item} {...props} refreshData={onPressShowReport} />
      </View>
    );
  };
  const handleFilter = async () => {
    const result = _.filter(raw, (item) => {
      return (
        (filterAndSortForm.filter.activity.includes('ALL') ||
          filterAndSortForm.filter.activity.includes(item.activity))
          && (filterAndSortForm.filter.project.includes('ALL') || filterAndSortForm.filter.project.includes(item.name)
      ));
    });
    const array = await groupingData(result);
    setData(array);
  };
  const groupingData = (array) => {
    array.sort((a, b) => new Date(b.workDate) - new Date(a.workDate));
    const groupByDay = _.groupBy(array, function (item) {
      return moment(item.workDate).startOf('day').format('MM/DD/YYYY');
    });
    const arrayDays = _.map(groupByDay, (data, date) => ({date, data}));
    arrayDays.map((item) =>
      item.data.sort(
        (a, b) =>
          moment(b.startFrom, 'HH:mm:ss') - moment(a.startFrom, 'HH:mm:ss'),
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
    const result = _.map(groupByWeek, (data, weekName) => ({weekName, data}));
    return result;
  };
  const onRenderFilterOption = (title, onPress) => {
    return (
      <View style={styles.viewFilterOption}>
        <Text style={styles.textFilterOption}>
          {title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPress}>
          <AntDesign
            name={'closecircle'}
            size={pxPhone(12)}
            color={theme["color-dark-100"]}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const onRemoveFilter = (key) => {
    dispatch(onFilterSortTimeLog({
      ...filterAndSortForm,
      filter: {
        ...filterAndSortForm.filter,
        [key]: ['ALL'],
      }
    }))
    scrollView.current?.scrollTo({ x: 0 });
  };
  const onRenderFilterOptions = () => {
    return (
      <ScrollView
        horizontal
        ref={scrollView}
        showsHorizontalScrollIndicator={false}
        style={styles.sectionFilterOption}>
        {!filterAndSortForm.filter.project.includes('ALL') && onRenderFilterOption(`${filterAndSortForm.filter.project.join(', ').toLowerCase()}`, () => {
          onRemoveFilter('project');
        })}
        {!filterAndSortForm.filter.activity.includes('ALL') && onRenderFilterOption(`${filterAndSortForm.filter.activity.join(', ').toLowerCase()}`, () => {
          onRemoveFilter('activity')
        })}
      </ScrollView>
    );
  };
  useEffect(() => {
    handleFilter();
  }, [filterAndSortForm])
  return (
    <View style={styles.container}>
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
      <View style={{marginHorizontal: pxPhone(15), marginVertical: pxPhone(10)}}>
        {onRenderFilterOptions()}
      </View>
      <FlatList
        data={data}
        extraData={data}
        renderItem={(item) => {
          return renderItemTimeLogByWeek(item.item);
        }}
      />
      {renderDatePicker()}
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
    backgroundColor: theme["color-app"],
    borderRadius: pxPhone(6),
    height: pxPhone(40),
    paddingHorizontal: pxPhone(15),
    shadowColor: theme["color-app"],
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
    ...textStyle.bold
  },
  viewFilterOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: pxPhone(25),
    marginRight: pxPhone(10),
    paddingHorizontal: pxPhone(10),
    borderRadius: pxPhone(16.25),
    backgroundColor: theme['color-custom-2100'],
  },
  textFilterOption: {
    fontSize: pxPhone(12),
    marginRight: pxPhone(5),
    ...textStyle.regular,
  },
  sectionFilterOption: {
    width: '90%',
  },
});
