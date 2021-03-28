import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Hideo } from 'react-native-textinput-effects';
import { pxPhone } from '../../core/utils/utils';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { IconAdd, IconCalendar, IconClock, IconActivity, IconTicket} from '../assets/icons';
import Modal from 'react-native-modal';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import TimeLogService from '../services/timelog.service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { split } from 'lodash';
import moment from 'moment';
export default TimeLogEditScreen = (props) => {
  const itemSelect = props.route.params.itemSelect;
  const [isShowModalSelectActivity, setIsShowModalSelectActivity] = useState(false);
  const [isShowModalSelectTime, setIsShowModalSelectTime] = useState(false);
  const activitys = [
    {
        name: 'Development',
        value: 'DEVELOPMENT'
    },
    {
        name: 'Vacation',
        value: 'VACATION'
    },
    {
        name: 'Testing',
        value: 'TESTING'
    },
    {
        name: 'Analyze/Write specification',
        value: 'ANALYZE'
    },
    {
        name: 'Design Estimate workload',
        value: 'UI_DESIGN'
    },
    {
        name: 'Customer Meeting',
        value: 'EXT_MEETING'
    },
    {
        name: 'Internal Team Meeting',
        value: 'INT_MEETING'
    },
    {
        name: 'Management',
        value: 'MANAGEMENT'
    }
  ]
  const [description, setDescription] = useState(itemSelect.comment);
  const [isDescriptionFocus, setIsDescriptionFocus] = useState(false);
  const [activity, setActivity] = useState({
    name: '--Select activity--',
    value: itemSelect.activity
  });
  const [headerTicket, setHeaderTicket] = useState(itemSelect.projectCode);
  const [ticket, setTicket] = useState(itemSelect.ticket.replace(`${itemSelect.projectCode}-`, ''));
  var date = new Date(itemSelect.workDate + 'T' + itemSelect.startFrom);
  date.setHours(date.getHours() + date.getTimezoneOffset()/60)
  const [startDate, setStartDate] = useState(date);
  const [hours, setHours] = useState(parseInt(parseInt(itemSelect.duration) / 60));
  const [minutes, setMinutes] = useState(parseInt(parseInt(itemSelect.duration) % 60));
  const [showButtonSave, setShowButtonSave] = useState(false);
  useEffect(() => {
    activitys.map((item) => {
        if(item.value == itemSelect.activity){
            setActivity(item);
            return;
        }
    })
    if(hours < 10){setHours('0' + hours);}else{setHours('' + hours);}
    if(minutes < 10){setMinutes('0' + minutes);}else{setMinutes('' + minutes);}
  }, [])
  
  useEffect(() => {
    if((parseInt(hours)*60 + parseInt(minutes)) == 0
     || description == "" || activity.value == "" || ticket == "" || 
     hours.toString().length < 2 || minutes.toString().length < 2){
       setShowButtonSave(false);
     }
     else{
       setShowButtonSave(true);
     }
  }, [hours,minutes,description,activity,ticket])
  const renderTabSelectActivity = () => {
    return (
        <Modal
          onBackdropPress={() => setIsShowModalSelectActivity(false)}
          isVisible={isShowModalSelectActivity}
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
            <FlatList
                data={activitys}
                extraData={activitys}
                style={{marginBottom: pxPhone(10)}}
                renderItem={(items) => {
                    return renderDataSelectActivity(items.item);
                }}
            />
          </View>
        </Modal>
      );
  }
  const renderDataSelectActivity = (item) => {
    return(
        <TouchableOpacity style={{marginTop: pxPhone(10)}} 
        onPress={()=>{
            setActivity(item);
            setIsShowModalSelectActivity(false);
        }}>
            <Text style={{fontSize: pxPhone(17)}}>{item.name}</Text>
        </TouchableOpacity> 
    )
  }
  const onDatePress = (date) => {
    const newDate = new Date(date.dateString);
    setStartDate(newDate);
  };
  const onMonthChange = () => {

  };
  const onChangeSelectTime = (time) => {
    setIsShowModalSelectTime(false);
    if(time.type === 'set'){
      setStartDate(new Date(time.nativeEvent.timestamp));
    }
  }
  const onHoursChange = (text) => {
    setHours(text.replace(/[^0-9]/g, ''));
    if(parseInt(text) > 23){
      setHours(23);
    }
  }
  const onMinutesChange = (text) => {
    setMinutes(text.replace(/[^0-9]/g, ''))
    if(parseInt(text) > 59){
      setMinutes(59);
    }
  }
  const onPressSaveChange = () => {
    const timeLogService = new TimeLogService();
    const response = timeLogService.UpdateTimeEntry(JSON.stringify({
      workDate: format(startDate, "yyyy-MM-dd"),
      startFrom: format(startDate, "hh:mm:ss"),
      duration: parseInt(hours)*60 + parseInt(minutes),
      comment: description,
      activity: activity.value,
      ticket: headerTicket + '-' + ticket,
    }), itemSelect.id);
    response.then((res) => {
      Alert.alert(
        'Update successfully!',
        '',
        [
          { text: 'OK', onPress: () => {props.navigation.goBack();
                                        props.route.params.onGoBack()}}
        ],
        { cancelable: false }
      );
    })
    .catch((e) => {
      Alert.alert(
        'Can not Update!',
        '',
        [
          { text: 'OK'}
        ],
        { cancelable: false }
      );
      console.log('error:', e);
    });
    
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            borderColor: isDescriptionFocus ? '#5282C1' : 'gray',
            borderWidth: isDescriptionFocus ? pxPhone(2) : pxPhone(1),
            paddingHorizontal:pxPhone(1),
            paddingVertical: pxPhone(10),
          }}>
        <Hideo
            placeholder={'What have you worked on?'}
            value={description}
            iconClass={FontAwesomeIcon}
            iconName={'user-circle-o'}
            iconColor={isDescriptionFocus ? '#5282C1' : 'gray'}
            inputPadding={pxPhone(20)}
            labelHeight={pxPhone(24)}
            borderHeight={pxPhone(2)}
            iconSize={pxPhone(25)}
            inputStyle={{ color: 'black' }}
            autoCapitalize={'none'}
            autoCorrect={false}
            onFocus={() => setIsDescriptionFocus(true)}
            onEndEditing={() => setIsDescriptionFocus(false)}
            onChangeText={description => setDescription(description)}
            iconBackgroundColor={'stranpate'}
        />
      </View>
        <View style={styles.viewAddProject}>
          <TouchableOpacity>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {IconAdd({
                    width: pxPhone(25),
                    height: pxPhone(25),
                    marginRight: pxPhone(25),
                    tintColor: '#0052CC'
                })}
                <Text style={{fontSize: pxPhone(17), color: '#0052CC'}}>{itemSelect.name}</Text>
              </View> 
          </TouchableOpacity>
      </View>
        <TouchableOpacity style={styles.viewSelectActivity} onPress={() => setIsShowModalSelectActivity(true)}>
        {IconActivity({
            width: pxPhone(25),
            height: pxPhone(25),
            marginRight: pxPhone(25),
        })}
        <Text style={styles.textHeader}>{activity.name}</Text>
      </TouchableOpacity>
        <View style={styles.viewTicket}>
          {IconTicket({
            width: pxPhone(25),
            height: pxPhone(25),
            marginRight: pxPhone(25),
          })}
            <Text style={styles.textHeader}>{headerTicket + ' -'}</Text>
            <TextInput style={[styles.textHeader,{paddingVertical: pxPhone(0)}]} placeholder={'Ticket'} value={ticket} onChangeText={(text) => setTicket(text)}/>
        </View>
        <TouchableOpacity style={styles.viewStartDate} onPress={() => setIsShowModalSelectTime(true)}>
            {IconCalendar({
                width: pxPhone(25),
                height: pxPhone(25),
                marginRight: pxPhone(25),
            })}
            <Text style={styles.textHeader}>{format(startDate, "yyyy-MM-dd") + "  " + format(startDate, "HH:mm")}</Text>
        </TouchableOpacity>
        <View style={styles.viewDuration}>
        {IconClock({
            width: pxPhone(25),
            height: pxPhone(25),
            marginRight: pxPhone(25),
        })}
        <TextInput style={[styles.textHeader,{paddingVertical: pxPhone(0)}]} placeholder={'08'} value={hours} maxLength={2} onChangeText={(text) => onHoursChange(text)}/>
        <Text style={styles.textHeader}>:</Text>
        <TextInput style={[styles.textHeader,{paddingVertical: pxPhone(0)}]} placeholder={'00'} value={minutes} maxLength={2} onChangeText={(text) => onMinutesChange(text)}/>
      </View>
        <Calendar
        markingType={'multi-dot'}
        style={{
          width: '100%',
        }}
        markedDates={{[format(startDate, "yyyy-MM-dd")]:{ selected: true, selectedColor: '#9AC4F8' }}}
        theme={{
          calendarBackground: 'white',
          textSectionTitleColor: 'black',
          textSectionTitleDisabledColor: '#9AC4F8',
          selectedDayBackgroundColor: 'blue',
          selectedDayTextColor: 'white',
          textDisabledColor: '#9AC4F8',
          todayTextColor: 'blue',
          dayTextColor: 'black',
          dotColor: 'white',
          selectedDotColor: 'white',
          arrowColor: 'black',
          monthTextColor: 'black',
          indicatorColor: 'red',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
        }}
        onDayPress={(date) => onDatePress(date)}
        onMonthChange={(date) => onMonthChange(date.month, date.year)}
        hideArrows={false}
        hideExtraDays={true}
        disableMonthChange={false}
        firstDay={0}
        hideDayNames={true}
        onPressArrowLeft={subtractMonth => subtractMonth()}
        onPressArrowRight={addMonth => addMonth()}
        disableAllTouchEventsForDisabledDays={true}
        />
        {isShowModalSelectTime == true ?<DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode={'time'}
          is24Hour={true}
          display='spinner'
          onChange={time => onChangeSelectTime(time)}
        />: null}
      </ScrollView>
      {showButtonSave == true ? 
      <TouchableOpacity style={styles.buttonSave} onPress={onPressSaveChange}>
          <Text style={styles.textButton}>SAVE CHANGES</Text>
      </TouchableOpacity>
      : null}
      
      {renderTabSelectActivity()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc'
  },
  buttonSelectProject:{
    marginTop: pxPhone(10),
    alignItems: 'center',
    paddingVertical: pxPhone(10),
    borderWidth: pxPhone(1),
    borderColor: '#f6af42',
  },
  viewAddProject:{
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(20),
    borderWidth: pxPhone(0.5),
    borderColor: 'white',
    borderBottomColor: 'darkgray',
  },
  viewSelectActivity:{
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTicket:{
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStartDate:{
    flexDirection: 'row',
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(20),
    alignItems: 'center',
    borderWidth: pxPhone(0.5),
    borderColor: 'white',
    borderBottomColor: 'darkgray',
  },
  viewDuration:{
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(20),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: pxPhone(0.5),
    borderColor: 'white',
    borderBottomColor: 'darkgray',
  },
  textHeader:{
    fontSize: pxPhone(17)
  },
  buttonSave:{
    backgroundColor: "#0052cc",
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: pxPhone(20),
    marginRight: pxPhone(20),
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(10),
    borderRadius: pxPhone(8),
  },
  textButton:{
    color:'white',
    fontSize: pxPhone(17),
  }
  
});
