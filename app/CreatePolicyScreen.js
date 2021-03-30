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
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {pxPhone} from '../core/utils/utils';
import CreatePolicyService from './services/create.policy.service';
export default CreatePolicyScreen = (props) => {
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [newDayOff, setNewDayOff] = useState(0);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [itemHolidayOff, setItemHolidayOff] = useState(null);
  const [leaveType, setLeaveType] = useState([
    {
      name: 'Annual leave',
      numberOfDays: 12,
    },
    {
      name: 'Remote',
      numberOfDays: 0,
    },
  ]);
  const [listHoliday, setListHoliday] = useState(null);
  useEffect(() => {
    const fetchHolidayData = async () => {
      const createPolicyService = new CreatePolicyService();
      const response = createPolicyService.getHolidayFromGoogle();
      response
        .then((res) => {
          const result = JSON.parse(res.request._response);
          const items = result.items;
          const year = new Date().getFullYear();
          let listHolidayInCurrentYear = [];
          items.map((item) => {
            const start = new Date(item.start.date);
            const end = new Date(item.end.date);
            const name = item.summary;
            const holiday = {
              name: name,
              start: start,
              end: end,
            };
            if (start.getFullYear() === year && end.getFullYear() === year) {
              listHolidayInCurrentYear.push(holiday);
            }
            return 0;
          });

          let arrayHoliday = [];
          for (let i = 0; i < listHolidayInCurrentYear.length; i++) {
            let flag = false;
            const holiday = listHolidayInCurrentYear[i];
            const start = holiday.start;
            let end = holiday.end;
            const name = holiday.name;
            for (let j = i + 1; j < listHolidayInCurrentYear.length; j++) {
              const nextHoliday = listHolidayInCurrentYear[j];
              if (name === nextHoliday.name) {
                flag = true;
                end = nextHoliday.end;
                i++;
              }
            }
            if (flag) {
              const newHoliday = {
                name: name,
                start: start,
                end: end,
              };
              arrayHoliday.push(newHoliday);
            } else arrayHoliday.push(holiday);
          }
          setListHoliday(arrayHoliday);
        })
        .catch((e) => {
          console.log('error:', e);
        });
    };
    fetchHolidayData();
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
            <Icon
              name={'edit'}
              size={pxPhone(25)}
              color={'black'}
              style={{marginRight: pxPhone(5)}}
            />
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
          <Text style={[styles.headerModal, {marginTop: pxPhone(10)}]}>
            Edit leave type
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: pxPhone(20),
            }}>
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
                <Icon
                  name={'angle-up'}
                  size={pxPhone(20)}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={setDownNewDayOff}>
                <Icon
                  name={'angle-down'}
                  size={pxPhone(20)}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.textModal, {fontWeight: 'bold'}]}>
              Days / Yearly
            </Text>
          </View>
          <View style={{flexDirection: 'row-reverse', marginTop: pxPhone(20)}}>
            <TouchableOpacity onPress={handleSaveDayOff}>
              <Text style={{marginRight: pxPhone(5), color: '#fac046'}}>
                SAVE
              </Text>
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
    if (newDayOff < 30) {
      setNewDayOff(newDayOff + 1);
    }
  };
  const setDownNewDayOff = () => {
    if (newDayOff > 1) {
      setNewDayOff(newDayOff - 1);
    }
  };
  const handleSaveDayOff = () => {
    let newArray = leaveType.slice();
    newArray[0].numberOfDays = newDayOff;
    setLeaveType(newArray);
    setIsShowModalUpdate(false);
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
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: pxPhone(5)}}>
              <Icon
                name={'calendar-o'}
                size={pxPhone(25)}
                color={'black'}
                style={{marginRight: pxPhone(5)}}
              />
              <Text>{column.item.start.toDateString().substring(0, 10)}</Text>
              <Icon
                name={'calendar-o'}
                size={pxPhone(25)}
                color={'black'}
                style={{marginRight: pxPhone(5), marginLeft: pxPhone(10),}}
              />
              <Text>{column.item.end.toDateString().substring(0, 10)}</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: pxPhone(5)}}>
              <Icon
                name={'calendar-o'}
                size={pxPhone(25)}
                color={'black'}
                style={{marginRight: pxPhone(5)}}
              />
              <Text>{column.item.start.toDateString().substring(0, 10)}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={(column) => showModalDelete(item)}>
          <Icon2
            name={'delete'}
            size={pxPhone(20)}
            color={'black'}
            style={{ marginRight: pxPhone(5) }}
          />
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
          <Text style={[styles.headerModal, {marginTop: pxPhone(10)}]}>
            Delete Official Holiday
          </Text>
          <Text style={[styles.textModal, {marginTop: pxPhone(20)}]}>
            Are you sure want to delete this Holiday
          </Text>
          <View style={{flexDirection: 'row-reverse', marginTop: pxPhone(20)}}>
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
  const onPressCreatePolicy = () => {
    const { navigation } = props;
    const createPolicyService = new CreatePolicyService();
    const response = createPolicyService.createPolicy(
      JSON.stringify({
        consecutiveOff: Number(leaveType[0].numberOfDays),
        holidays: listHoliday,
      }),
    );
    response
      .then((res) => {
        Alert.alert('Create policy successfully!');
        navigation.navigate('Main');
      })
      .catch((e) => {
        console.log('error:', e);
      });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{marginHorizontal: pxPhone(20)}}>
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
      <TouchableOpacity style={styles.buttonCreatePolicy} onPress={onPressCreatePolicy}>
        <Text style={styles.textButton}>Create policy</Text>
      </TouchableOpacity>
      {renderTabDeleteHolidayOff()}
      {renderTabUpdateLeaveTypes()}
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
    fontSize: pxPhone(20),
    marginTop: pxPhone(20),
  },
  leaveDayItem: {
    backgroundColor: '#9AC4F8',
    paddingHorizontal: pxPhone(10),
    paddingVertical: pxPhone(10),
    marginTop: pxPhone(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: pxPhone(6),
    alignItems: 'center',
  },
  holidaysItem: {
    backgroundColor: '#9AC4F8',
    paddingHorizontal: pxPhone(10),
    paddingVertical: pxPhone(10),
    marginTop: pxPhone(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: pxPhone(8),
    alignItems: 'center',
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
  buttonCreatePolicy: {
    backgroundColor: '#0052cc',
    alignSelf: 'center',
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(10),
    marginBottom: pxPhone(20),
  },
  textButton: {
    color: 'white',
    fontSize: pxPhone(17),
  },
});
