import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import SettingService from '../services/setting.service';
import {
  IconCalendar,
  IconEdit,
  IconUpArrow,
  IconDownArrow,
  IconDeletePolicy,
} from '../assets/icons';
import {pxPhone} from '../../core/utils/utils';
export default SettingScreen = (props) => {
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [newDayOff, setNewDayOff] = useState(0);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [itemHolidayOff, setItemHolidayOff] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [listHoliday, setListHoliday] = useState(null);
  useEffect(() => {
    const fetchPolicy = async () => {
      const settingService = new SettingService();
      const response = settingService.getPolicy();
      console.log("response.status:", response.status);
      response
        .then((res) => {
          const arrLeaveType = [
            {
              name: 'Annual leave',
              numberOfDays: res.consecutiveOff,
            },
            {
              name: 'Remote',
              numberOfDays: 0,
            },
          ];
          setNewDayOff(res.consecutiveOff);
          setLeaveType(arrLeaveType);
          let arrayHoliday = [];
          res.holidays.map((itemHoliday) => {
            const start = new Date(itemHoliday.start);
            const end = new Date(itemHoliday.end);
            const name = itemHoliday.name;
            const item = {
              name: name,
              start: start,
              end: end,
            };
            arrayHoliday.push(item);
            return 0;
          });
          setListHoliday(arrayHoliday);
        })
        .catch((e) => {
          console.log('error:', e);
        });
    };
    fetchPolicy();
  }, []);
  const renderLeaveTypes = (column) => {
    if (column.item.name === 'Annual leave') {
      return (
        <View style={styles.leaveDayItem}>
          {column.item.numberOfDays > 1 ? (
            <Text>
              {column.item.name} {column.item.numberOfDays} Days/Yearly
            </Text>
          ) : (
            <Text>
              {column.item.name} {column.item.numberOfDays} Day/Yearly
            </Text>
          )}
          <TouchableOpacity onPress={showModalUpdate}>
            {IconEdit({
              width: pxPhone(20),
              height: pxPhone(20),
              marginRight: pxPhone(5),
            })}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.leaveDayItem}>
          <Text>{column.item.name}</Text>
        </View>
      );
    }
  };
  const showModalUpdate = () => {
    setIsShowModalUpdate(true);
    setNewDayOff(leaveType[0].numberOfDays);
  };
  const renderTabUpdateLeaveTypes = () => {
    return (
      <Modal
        onBackdropPress={() => setIsShowModalUpdate(false)}
        isVisible={isShowModalUpdate}
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
            paddingVertical: pxPhone(10),
            width: '100%',
            backgroundColor: 'white',
          }}>
          <Text style={[styles.headerModal,{marginTop: pxPhone(10)}]}>Edit leave type</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: pxPhone(20),}}>
            <Text style={styles.textModal}>Leave type name:</Text>
            <Text style={[styles.textModal, {fontWeight: 'bold'}]}>
              Annual leave
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: pxPhone(20),
            }}>
            <Text style={styles.textModal}>Leave type balance:</Text>
            <Text style={styles.textModal}>{newDayOff}</Text>
            <View
              style={{
                flexDirection: 'column',
                alignSelf: 'center',
              }}>
              <TouchableOpacity onPress={setUpNewDayOff}>
                {IconUpArrow({width: pxPhone(15), height: pxPhone(15)})}
              </TouchableOpacity>
              <TouchableOpacity onPress={setDownNewDayOff}>
                {IconDownArrow({width: pxPhone(15), height: pxPhone(15)})}
              </TouchableOpacity>
            </View>
            <Text style={[styles.textModal, {fontWeight: 'bold'}]}>
              Days / Yearly
            </Text>
          </View>
          <View style={{flexDirection: 'row-reverse', marginTop: pxPhone(20), marginBottom: pxPhone(10)}}>
            <TouchableOpacity onPress={handleSaveDayOff}>
              <Text style={{marginRight: pxPhone(5), color: '#fac046'}}>SAVE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsShowModalUpdate(false)}>
              <Text style={{color: '#0052cc', marginRight: pxPhone(20)}}>
                BACK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const setUpNewDayOff = () => {
    if(newDayOff < 30){
      setNewDayOff(newDayOff + 1);
    }
  }
  const setDownNewDayOff = () => {
    if(newDayOff > 1){
      setNewDayOff(newDayOff - 1);
    }
  }
  const handleSaveDayOff = () => {
    let newArray = leaveType.slice();
    newArray[0].numberOfDays = newDayOff;
    setLeaveType(newArray);
    setIsShowModalUpdate(false);
  }
  const renderListHolidays = (column) => {
    var item = column.item;
    var timeDiff = Math.abs(
      column.item.end.getTime() - column.item.start.getTime(),
    );
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return (
      <View style={styles.holidaysItem}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <Text>{column.item.name}</Text>
            <Text style={styles.textDayOff}> {diffDays}</Text>
            {diffDays > 1 ? (
              <Text style={styles.textDayOff}> Days</Text>
            ) : (
              <Text style={styles.textDayOff}> Day</Text>
            )}
          </View>
          {diffDays > 1 ? (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: pxPhone(5)}}>
              {IconCalendar({
                width: pxPhone(25),
                height: pxPhone(25),
                marginRight: pxPhone(5),
              })}
              <Text>{column.item.start.toDateString().substring(0, 10)}</Text>
              {IconCalendar({
                width: pxPhone(25),
                height: pxPhone(25),
                marginRight: pxPhone(5),
                marginLeft: pxPhone(10),
              })}
              <Text>{column.item.end.toDateString().substring(0, 10)}</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: pxPhone(5)}}>
              {IconCalendar({
                width: pxPhone(25),
                height: pxPhone(25),
                marginRight: pxPhone(5),
              })}
              <Text>{column.item.start.toDateString().substring(0, 10)}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={(column) => showModalDelete(item)}>
          {IconDeletePolicy({
              width: pxPhone(20),
              height: pxPhone(20),
              marginRight: pxPhone(5),
          })}
        </TouchableOpacity>
      </View>
    );
  };
  const showModalDelete = (item) => {
    setIsShowModalDelete(true);
    setItemHolidayOff(item);
  };
  const renderTabDeleteHolidayOff = () => {
    return (
      <Modal
        onBackdropPress={() => setIsShowModalDelete(false)}
        isVisible={isShowModalDelete}
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
            paddingVertical: pxPhone(10),
            width: '100%',
            backgroundColor: 'white',
          }}>
          <Text style={[styles.headerModal,{marginTop: pxPhone(10)}]}>Delete Official Holiday</Text>
          <Text style={[styles.textModal, {marginTop: pxPhone(20),}]}>
            Are you sure want to delete this Holiday
          </Text>
          <View style={{flexDirection: 'row-reverse', marginTop: pxPhone(20), marginBottom: pxPhone(10)}}>
            <TouchableOpacity onPress={handleRemoveHoliday}>
              <Text style={{marginRight: pxPhone(5)}}>DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsShowModalDelete(false)}>
              <Text style={{color: '#0052cc', marginRight: pxPhone(20)}}>
                BACK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const handleRemoveHoliday = () => {
    if (itemHolidayOff != null) {
      let newListHoliday = listHoliday.slice();
      const index = listHoliday.indexOf(itemHolidayOff);
      if (index > -1) {
        newListHoliday.splice(index, 1);
        setItemHolidayOff(null);
        setListHoliday(newListHoliday);
        setIsShowModalDelete(false);
      }
    }
  };
  const onPressSaveChanges = () => {
    const settingService = new SettingService();
    const response = settingService.updatePolicy(JSON.stringify({ consecutiveOff: Number(leaveType[0].numberOfDays), holidays: listHoliday }));
    response.then(res=>{
      Alert.alert("Update policy successfully!");
    })
    .catch(e =>{
      console.log("error:",e);
    })
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{marginHorizontal: pxPhone(10)}}>
        <Text style={styles.textHeader}>Leave Types</Text>
        <FlatList
          data={leaveType}
          extraData={leaveType}
          style={{marginTop: pxPhone(20)}}
          renderItem={(item) => {
            return renderLeaveTypes(item);
          }}
        />
        <Text style={styles.textHeader}>Official Holidays</Text>
        <FlatList
          data={listHoliday}
          extraData={listHoliday}
          style={{marginTop: pxPhone(20), marginBottom: pxPhone(20)}}
          renderItem={(item) => {
            return renderListHolidays(item);
          }}
        />
      </View>
      <TouchableOpacity style={styles.buttonSave} onPress={onPressSaveChanges}>
          <Text style={styles.textButton}>SAVE CHANGES</Text>
      </TouchableOpacity>
      {renderTabDeleteHolidayOff()}
      {renderTabUpdateLeaveTypes()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  textHeader: {
    fontSize: pxPhone(20),
    marginTop: pxPhone(20),
    fontWeight: 'bold',
    borderWidth: pxPhone(1),
    borderColor: 'white',
    borderBottomColor: 'darkgray',
    padding: pxPhone(8),
  },
  leaveDayItem: {
    backgroundColor: 'white',
    borderRadius: pxPhone(6),
    paddingVertical: pxPhone(22.5),
    paddingHorizontal: pxPhone(10),
    marginTop: pxPhone(10),
    marginBottom: pxPhone(5),
    marginHorizontal: pxPhone(10),
    flexDirection: 'row',
    shadowColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(6),
    borderWidth: pxPhone(0.3), 
    elevation: 8,
  },
  holidaysItem: {
    backgroundColor: 'white',
    borderRadius: pxPhone(6),
    paddingVertical: pxPhone(10),
    paddingHorizontal: pxPhone(10),
    marginTop: pxPhone(10),
    marginBottom: pxPhone(5),
    marginHorizontal: pxPhone(10),
    flexDirection: 'row',
    shadowColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(6),
    borderWidth: pxPhone(0.3), 
    elevation: 8,
  },
  textDayOff: {
    color: '#0052cc',
  },
  buttonDelete: {
    justifyContent: 'center',
    marginRight: pxPhone(5),
  },
  headerModal: {
    fontSize: pxPhone(20),
    fontWeight: 'bold',
  },
  textModal: {
    fontSize: pxPhone(16),
  },
  buttonSave:{
    backgroundColor: "#0052cc",
    alignSelf: 'center',
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(10),
    marginBottom: pxPhone(20),
    borderRadius: pxPhone(10),
  },
  textButton:{
    color:'white',
    fontSize: pxPhone(17),
  }
});
