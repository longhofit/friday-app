import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated
} from 'react-native';
import {pxPhone} from '../../core/utils/utils';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import TimeLogService from '../services/timelog.service';
import moment from 'moment';
import _, {groupBy} from 'lodash';
import {Checkbox} from 'react-native-paper';
import { textStyle } from '../components/styles/style';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default TimeLogSummaryScreen = (props) => {
  const [checked, setChecked] = useState(false);
  const [checkedExtraData, setCheckedExtraData] = useState(false);
  const newDate = new Date(props.item.date);
  const stringDate =
    moment(newDate).format('dddd') +
    ', ' +
    format(newDate, 'MMM') +
    ' ' +
    newDate.getDate();
    let totalTime = 0;
    props.item.data.map((item) => {
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
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [listItemSelect, setListItemSelect] = useState([]);
  const RenderRightActions = ({progress, dragX, onPressEdit, onPressDelete}) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
    });
    return (
      <View style={styles.viewEditDelete}>
        <TouchableOpacity style={styles.leftAction} onPress={onPressEdit}>
          <Icon
            name={'edit'}
            size={pxPhone(30)}
            color={'blue'}
            style={{marginRight: pxPhone(10)}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.leftAction} onPress={onPressDelete}>
          <Icon2
            name={'delete'}
            size={pxPhone(30)}
            color={'red'}
            style={{marginRight: pxPhone(10)}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderItemTimeLog = (item) => {
    var hours = parseInt(parseInt(item.duration) / 60);
    var minutes = parseInt(parseInt(item.duration) % 60);
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let color;
    let itemActivity;
    switch (item.activity) {
      case 'DEVELOPMENT':
        color = 'red';
        itemActivity = 'Development';
        break;
      case 'VACATION':
        color = 'blue';
        itemActivity = 'Vacation';
        break;
      case 'TESTING':
        color = 'green';
        itemActivity = 'Testing';
        break;
      case 'ANALYZE':
        color = '#e3f91c';
        itemActivity = 'Analyze/Write specification';
        break;
      case 'UI_DESIGN':
        color = 'orange';
        itemActivity = 'Design Estimate workload';
        break;
      case 'EXT_MEETING':
        color = 'pink';
        itemActivity = 'Customer Meeting';
        break;
      case 'INT_MEETING':
        color = 'gray';
        itemActivity = 'Internal Team Meeting';
        break;
      case 'MANAGEMENT':
        color = 'purple';
        itemActivity = 'Management';
        break;
      default:
        break;
    }
    return (
      <Swipeable
        childrenContainerStyle={styles.viewGroupByDay}
        renderRightActions={(progress, dragX) => (
          <RenderRightActions
            progress={progress}
            dragX={dragX}
            onPressEdit={() => onPressEditTimeLog(item)}
            onPressDelete={() => onPressDeleteTimeLog(item)}
          />
        )}>
        <View style={[styles.vertical, {backgroundColor: color}]}></View>
        {isBulkEdit == true ? (
          item.status == 'NEW' ? (
            <View
              style={{
                justifyContent: 'center',
                marginRight: pxPhone(0),
                width: '10%',
              }}>
              <Checkbox
                status={item.checkbox ? 'checked' : 'unchecked'}
                onPress={() => {
                  item.checkbox = !item.checkbox;
                  setCheckedExtraData(!checkedExtraData);
                  var newArray = listItemSelect;
                  if (item.checkbox == true) {
                    newArray.push(item.id);
                    setListItemSelect(newArray);
                  } else {
                    var index = listItemSelect.indexOf(item.id);
                    if (index > -1) {
                      newArray.splice(index, 1);
                    }
                    setListItemSelect(newArray);
                  }
                }}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                marginRight: pxPhone(0),
                width: '10%',
              }}></View>
          )
        ) : null}
        <View
          {...(isBulkEdit == true ? null : null)}
          style={
            isBulkEdit == true
              ? {
                  marginVertical: pxPhone(10),
                  marginRight: pxPhone(15),
                  marginLeft: pxPhone(8),
                  width: '85%',
                }
              : {
                  marginVertical: pxPhone(10),
                  marginRight: pxPhone(15),
                  marginLeft: pxPhone(8),
                  width: '95%',
                }
          }>
          <Text style={{fontSize: pxPhone(16), ...textStyle.bold}}>
            {item.name} - {item.projectOwner}
          </Text>
          <Text
            style={{fontSize: pxPhone(15), color: color, ...textStyle.regular}}>
            {itemActivity}
          </Text>
          <Text style={{fontSize: pxPhone(14), ...textStyle.regular}}>
            {item.comment}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: pxPhone(14), ...textStyle.semibold}}>
              {item.ticket}
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: pxPhone(14), ...textStyle.regular}}>
                {moment(item.startFrom, 'HH:mm:ss').format('hh:mm A')}
              </Text>
              <Text
                style={{
                  fontSize: pxPhone(14),
                  marginLeft: pxPhone(7),
                  ...textStyle.regular,
                }}>
                {hours + ':'}
              </Text>
              <Text style={{fontSize: pxPhone(14), ...textStyle.regular}}>
                {minutes}
              </Text>
              {item.status === 'NEW' ? (
                <TouchableOpacity onPress={(e) => onPressConfirm(e, item.id)}>
                  <AntDesign
                    name={'checkcircleo'}
                    size={pxPhone(25)}
                    style={{marginLeft: pxPhone(15)}}
                    color={'green'}
                  />
                </TouchableOpacity>
              ) : (
                <AntDesign
                  name={'checkcircleo'}
                  size={pxPhone(25)}
                  style={{marginLeft: pxPhone(15)}}
                  color={'darkgray'}
                />
              )}
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };
  const onPressEditTimeLog = (item) => {
    if (item.status == 'NEW') {
      props.navigation.navigate('TimeLogEdit', {
        itemSelect: item,
        onGoBack: () => props.refreshData(),
      });
    }else{
      Alert.alert(
        'This time entry could not be edit!',
        '',
        [{text: 'OK'}],
        {cancelable: false},
      );
    }
  };
  const onPressDeleteTimeLog = (item) => {
    const timeLogService = new TimeLogService();
    const response = timeLogService.DeleteTimeEntry(item.id);
    response
      .then((result) => {
        Alert.alert(
          'Delete successfully!',
          '',
          [{text: 'OK', onPress: () => props.refreshData()}],
          {cancelable: false},
        );
      })
      .catch((e) => {
        Alert.alert(
          'This time entry could not be delete!',
          '',
          [{text: 'OK'}],
          {cancelable: false},
        );
        console.log('error:', e);
      });
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
          [{text: 'OK', onPress: () => props.refreshData()}],
          {cancelable: false},
        );
      })
      .catch((e) => {
        console.log('error:', e);
      });
  };
  const onPressSelectAll = () => {
    var newArray = [];
    props.item.data.map(item => {
      item.checkbox = !checked;
      if(item.status == "NEW"){
        newArray.push(item.id);
      }
    })
    if(checked == false){
      setListItemSelect(newArray);
    }else{
      setListItemSelect([]);
    }
    setChecked(!checked);
  }
  const onPressConfirmAll = () => {
    const timeLogService = new TimeLogService();
    const response = timeLogService.ConfirmTimeEntry(
      JSON.stringify({timeEntryIds: listItemSelect}),
    );
    response
      .then((res) => {
        Alert.alert(
          'Confirm successfully!',
          '',
          [{text: 'OK', onPress: () => props.refreshData()}],
          {cancelable: false},
        );
      })
      .catch((e) => {
        Alert.alert(
          'Can not confirm!',
          '',
          [{text: 'OK'}],
          {cancelable: false},
        );
        console.log('error:', e);
      });
  }
  return (
    <View style={styles.container}>
      <View style={styles.viewHeaderGroupByDay}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            {isBulkEdit == true ? <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => onPressSelectAll()}
          /> : null}
          <Text style={styles.txtDate}>{stringDate}</Text>
          {listItemSelect.length == 0 ? null : <TouchableOpacity style={{marginLeft: pxPhone(3), alignItems: 'center'}}
          onPress={() => onPressConfirmAll()}>
            <Text style={{color:'#3753C7'}}>CONFIRM</Text>
          </TouchableOpacity>}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.txtDate}>
            {'Total: ' + hours + ':' + minutes}
          </Text>
          <TouchableOpacity
            style={{marginHorizontal: pxPhone(10)}}
            onPress={() => setIsBulkEdit(!isBulkEdit)}>
            <Icon name={'list-alt'} size={pxPhone(25)} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={props.item.data}
        extraData={checkedExtraData}
        renderItem={(item) => {
          return renderItemTimeLog(item.item);
        }}
      />
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
    marginBottom: pxPhone(10),
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
  txtDate: {
    fontSize: pxPhone(17),
    marginTop: pxPhone(5),
    marginBottom: pxPhone(3),
    paddingVertical: pxPhone(8),
    ...textStyle.extrabold
  },
  vertical: {
    width: pxPhone(5),
    borderTopLeftRadius: pxPhone(6),
    borderBottomStartRadius: pxPhone(6),
  },
  viewEditDelete:{
    flexDirection: 'row',
    alignItems: 'center',
  }
});
