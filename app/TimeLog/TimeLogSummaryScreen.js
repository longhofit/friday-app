import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {pxPhone} from '../../core/utils/utils';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import TimeLogService from '../services/timelog.service';
import moment from 'moment';
import _, {groupBy} from 'lodash';
import {IconCheck2} from '../assets/icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Checkbox} from 'react-native-paper';
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
  const [isShowModal, setIsShowModal] = useState(false);
  const [itemSelect, setItemSelect] = useState(null);
  const [listItemSelect, setListItemSelect] = useState([]);
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
        {isBulkEdit == true ? (
          item.status == 'NEW' ? (
            <View style={{justifyContent: 'center', marginRight: pxPhone(0), width: '10%'}}>
            <Checkbox
              status={item.checkbox ? 'checked' : 'unchecked'}
              onPress={() => {
                item.checkbox = !item.checkbox;
                setCheckedExtraData(!checkedExtraData);
                var newArray = listItemSelect;
                if(item.checkbox == true){
                  newArray.push(item.id);
                  setListItemSelect(newArray);
                }else{
                  var index = listItemSelect.indexOf(item.id);
                  if (index > -1) {
                    newArray.splice(index, 1);
                  }
                  setListItemSelect(newArray);
                }   
              }}
            />
            </View>
          ) : (<View style={{justifyContent: 'center', marginRight: pxPhone(0), width: '10%'}}></View>)
        ) : null}
        <View
        {...isBulkEdit == true ?null : null}
          style={isBulkEdit == true ? {
            marginVertical: pxPhone(10),
            marginRight: pxPhone(15),
            marginLeft: pxPhone(8),
            width: '85%',
          }:{
            marginVertical: pxPhone(10),
            marginRight: pxPhone(15),
            marginLeft: pxPhone(8),
            width: '95%',
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
                    tintColor: 'green',
                  })}
                </TouchableOpacity>
              ) : (IconCheck2({
                    width: pxPhone(25),
                    height: pxPhone(25),
                    marginLeft: pxPhone(15),
                    tintColor: 'darkgray',
                  }))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
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
      onGoBack: () => props.refreshData(),
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
            [{text: 'OK', onPress: () => props.refreshData()}],
            {cancelable: false},
          );
        })
        .catch((e) => {
          Alert.alert(
            'Can not delete!',
            '',
            [{text: 'OK'}],
            {cancelable: false},
          );
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
            {'total: ' + hours + ':' + minutes}
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
  },
  vertical: {
    width: pxPhone(5),
    borderTopLeftRadius: pxPhone(6),
    borderBottomStartRadius: pxPhone(6),
  },
});
