import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import SettingService from './services/setting.service';

export default SettingScreen = (props) => {
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [itemHolidayOff, setItemHolidayOff] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [listHoliday, setListHoliday] = useState(null);
  const session = useSelector((state) => state.session);
  useEffect(() => {
    const fetchPolicy = async () => {
      const accessToken = session.accessToken;
      const settingService = new SettingService();
      const response = settingService.getPolicy(accessToken);
      response
        .then((res) => {
          console.log('res:', res);
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
          <TouchableOpacity>
            <Image style={styles.imageButton} source={require('./edit.png')} />
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
            <View style={{flexDirection: 'row'}}>
              <Image
                style={[styles.imageButton, {marginRight: 5}]}
                source={require('./calendar.png')}
              />
              <Text>{column.item.start.toDateString().substring(0, 10)}</Text>
              <Image
                style={[styles.imageButton, {marginLeft: 10, marginRight: 5}]}
                source={require('./calendar.png')}
              />
              <Text>{column.item.end.toDateString().substring(0, 10)}</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Image
                style={[styles.imageButton, {marginRight: 5}]}
                source={require('./calendar.png')}
              />
              <Text>{column.item.start.toDateString().substring(0, 10)}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={(column) => showModalDelete(item)}>
          <Text>X</Text>
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
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          width: '90%',
        }}>
        <View style={{height: '40%'}}>
          <Text style={styles.headerModal}>Delete Official Holiday</Text>
          <Text style={styles.textModal}>
            Are you sure want to delete this Holiday
          </Text>
          <View style={{flexDirection: 'row-reverse', marginTop: 20}}>
            <TouchableOpacity onPress={handleRemoveHoliday}>
              <Text style={{marginRight: 10}}>DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsShowModalDelete(false)}>
              <Text style={{color: '#0052cc', marginRight: 10}}>BACK</Text>
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
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{marginHorizontal: 20}}>
        <Text style={styles.textHeader}>Leave Types</Text>
        <FlatList
          data={leaveType}
          extraData={leaveType}
          style={{marginTop: 20}}
          renderItem={(item) => {
            return renderLeaveTypes(item);
          }}
        />
        <Text style={styles.textHeader}>Official Holidays</Text>
        <FlatList
          data={listHoliday}
          extraData={listHoliday}
          style={{marginTop: 20, marginBottom: 20}}
          renderItem={(item) => {
            return renderListHolidays(item);
          }}
        />
      </View>
      {renderTabDeleteHolidayOff()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // backgroundColor: '#FFFFFF',
    // paddingBottom: 50,
    backgroundColor: '#fafbfc',
  },
  textHeader: {
    fontSize: 20,
    marginTop: 20,
  },
  leaveDayItem: {
    backgroundColor: '#2596be',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  holidaysItem: {
    backgroundColor: '#2596be',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDayOff: {
    color: '#0052cc',
  },
  buttonDelete: {
    justifyContent: 'center',
    marginRight: 5,
  },
  imageButton: {
    width: 15,
    height: 15,
  },
  headerModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textModal: {
    fontSize: 16,
    marginTop: 20,
  },
});
