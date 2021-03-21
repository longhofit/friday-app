import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {pxPhone} from '../../core/utils/utils';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import TimeLogService from '../services/timelog.service';
import moment from 'moment';
import _, {groupBy} from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {IconCheck2} from '../assets/icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Checkbox} from 'react-native-paper';
export default TimeLogScreen = (props) => {
  const [checked, setChecked] = React.useState(false);
  const [isBulkEdit, setIsBulkEdit] = useState(false);
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
  const [isShowModal, setIsShowModal] = useState(false);
  const [itemSelect, setItemSelect] = useState(null);
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
    item.data.map((item) => {
      item.checkTotalBox = false;
      return 1;
    })
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
    console.log("itemDate:", item);
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
        <View style={styles.viewHeaderGroupByDay}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text style={styles.txtDate}>{stringDate}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.txtDate}>
              {'total: ' + hours + ':' + minutes}
            </Text>
            <TouchableOpacity
              style={{marginHorizontal: pxPhone(10)}}
              onPress={() => {
                item.checkTotalBox = !item.checkTotalBox;
                
              }}>
              <Icon name={'list-alt'} size={pxPhone(25)} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={item.data}
          extraData={item.data}
          renderItem={(item) => {
            return renderItemTimeLog(item.item);
          }}
        />
      </View>
    );
  };
  const renderItemTimeLog = (item, checked) => {
    console.log("check:", checked)
    var hours = parseInt(parseInt(item.duration) / 60);
    var minutes = parseInt(parseInt(item.duration) % 60);
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let color;
    switch (item.activity) {
      case 'DEVELOPMENT':
        color = 'red';
        break;
      case 'VACATION':
        color = 'blue';
        break;
      case 'TESTING':
        color = 'green';
        break;
      case 'ANALYZE':
        color = 'yellow';
        break;
      case 'UI_DESIGN':
        color = 'orange';
        break;
      case 'EXT_MEETING':
        color = 'pink';
        break;
      case 'INT_MEETING':
        color = 'gray';
        break;
      case 'MANAGEMENT':
        color = 'purple';
        break;
      default:
        break;
    }
    return (
      <TouchableOpacity
        style={styles.viewGroupByDay}
        onPress={() => {
          setIsShowModal(true);
          setItemSelect(item);
        }}>
        <View style={[styles.vertical, {backgroundColor: color}]}></View>
        {checked == false ? <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />: null}
        <View
          style={{
            paddingVertical: pxPhone(10),
            paddingHorizontal: pxPhone(15),
          }}>
          <Text style={{fontSize: pxPhone(16), fontWeight: 'bold'}}>
            {item.name} - {item.projectOwner}
          </Text>
          <Text style={{fontSize: pxPhone(15), color: color}}>
            {item.activity}
          </Text>
          <Text style={{fontSize: pxPhone(14)}}>{item.comment}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: pxPhone(14)}}>{item.ticket}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: pxPhone(14)}}>
                {moment(item.startFrom, 'HH:mm:ss').format('hh:mm A')}
              </Text>
              <Text style={{fontSize: pxPhone(14), marginLeft: pxPhone(7)}}>
                {hours + ':'}
              </Text>
              <Text style={{fontSize: pxPhone(14)}}>{minutes}</Text>
              {item.status === 'NEW' ? (
                <TouchableOpacity onPress={(e) => onPressConfirm(e, item.id)}>
                  {IconCheck2({
                    width: pxPhone(25),
                    height: pxPhone(25),
                    marginLeft: pxPhone(15),
                    tintColor: '#3753C7',
                  })}
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const refreshData = () => {
    setResetData(true);
  };
  const renderModalSelect = () => {
    return (
      <Modal
        onBackdropPress={() => setIsShowModal(false)}
        isVisible={isShowModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: pxPhone(25),
            borderRadius: pxPhone(8),
            paddingVertical: pxPhone(15),
            width: '60%',
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: pxPhone(15),
              flexDirection: 'row',
            }}
            onPress={onPressEditTimeLog}>
            <Text style={{fontSize: pxPhone(20), color: 'blue'}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignSelf: 'center', flexDirection: 'row'}}
            onPress={onPressDeleteTimeLog}>
            <Text style={{fontSize: pxPhone(20), color: 'red'}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  const onPressEditTimeLog = () => {
    props.navigation.navigate('TimeLogEdit', {
      itemSelect: itemSelect,
      onGoBack: () => refreshData(),
    });
    setIsShowModal(false);
  };
  const onPressDeleteTimeLog = () => {
    if (itemSelect != null) {
      const timeLogService = new TimeLogService();
      const response = timeLogService.DeleteTimeEntry(itemSelect.id);
      response
        .then((result) => {
          Alert.alert(
            'Delete successfully!',
            '',
            [{text: 'OK', onPress: () => refreshData()}],
            {cancelable: false},
          );
        })
        .catch((e) => {
          console.log('error:', e);
        });
    }
    setIsShowModal(false);
  };
  const onPressConfirm = (e, id) => {
    e.stopPropagation();
    const timeLogService = new TimeLogService();
    const response = timeLogService.ConfirmTimeEntry(
      JSON.stringify({timeEntryIds: [id]}),
    );
    response
      .then((res) => {
        Alert.alert(
          'Confirm successfully!',
          '',
          [{text: 'OK', onPress: () => refreshData()}],
          {cancelable: false},
        );
      })
      .catch((e) => {
        console.log('error:', e);
      });
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
      {renderModalSelect()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  viewHeaderGroupByDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: pxPhone(15),
    alignItems: 'center',
  },
  viewGroupByDay: {
    backgroundColor: 'white',
    borderRadius: pxPhone(6),
    marginHorizontal: pxPhone(15),
    marginBottom: pxPhone(5),
    shadowColor: '#000',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(6),
    borderWidth: pxPhone(0.3),
    elevation: 8,
    flexDirection: 'row',
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
  txtDate: {
    fontSize: pxPhone(17),
    marginTop: pxPhone(5),
    marginBottom: pxPhone(3),
    paddingVertical: pxPhone(8),
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
  vertical: {
    width: pxPhone(5),
    borderTopLeftRadius: pxPhone(6),
    borderBottomStartRadius: pxPhone(6),
  },
});
