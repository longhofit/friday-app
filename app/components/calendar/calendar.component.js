import React, {
  useEffect,
  useState,
} from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { pxPhone } from '../../../core/utils/utils'
import { yyyMMddFormatter, getDatesBetweenDates } from '../../../core/formatters';
import { leaveTypes } from '../../../core/constant/menuSideBarConstant'
import { IconClose, IconDelete, IconWork } from '../../assets/icons';
import { Picker } from '@react-native-picker/picker'
import ApplyForm from '../FormApply/applyModal';


export default CalendarComponent = (props) => {
  const [selectDay, setSelectDay] = useState({});
  const [isShowLeaveDetail, setIsShowLeaveDetail] = useState(false);
  const [isShowApplyForm, setIsShowApplyForm] = useState(false);
  const [durations, setDurations] = useState([]);
  const { requests, requestDates } = props;
  const [requestSelected, setRequestSelected] = useState(undefined);
  const [dateSelected, setDateSelected] = useState('');

  useEffect(() => {
    setSelectDay({});
    requestDates && requestDates.forEach((item) => {
      setSelectDay(prevState => {
        return {
          ...prevState,
          [item.date]: item.option,
        };
      });
    });

    const durationsTemp = requests
      .map((request) => {
        const { startDate, endDate } = request;
        return getDatesBetweenDates(startDate, endDate)
          .map(date => { return yyyMMddFormatter(date) });
      })

    let durationsConvert = [];

    requests.forEach((item, index) => {
      durationsConvert.push({
        ...item,
        distance: durationsTemp[index],
      });
    })

    setDurations(durationsConvert);
  }, [props.requestDates]);

  const onDatePress = (date) => {
    setDateSelected(date.dateString);
    let request;

    durations.forEach((duration) => {
      const requestFind = duration.distance.find(item => item === date.dateString);
      if (requestFind) {
        request = duration;
      }
    });

    setRequestSelected(request);

    request ? setIsShowLeaveDetail(true) : setIsShowApplyForm(true);
  };

  const onCloseLeaveDetail = () => {
    setIsShowLeaveDetail(false);
  };

  const onDeleteLeave = () => {
    props.deleteLeaveRequest(requestSelected.id)
    onCloseLeaveDetail();
  };

  const renderLeaveDetail = () => {
    return (
      <Modal
        onBackdropPress={onCloseLeaveDetail}
        isVisible={isShowLeaveDetail}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: pxPhone(25),
          justifyContent: 'center',
          borderRadius: pxPhone(8),
          paddingVertical: pxPhone(10)
        }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pxPhone(15) }}>
            {'Leave Detail'}
          </Text>
          <View style={{ paddingTop: pxPhone(10) }}>
            {requestSelected && renderLeaveItem('Type', leaveTypes[requestSelected.type])}
          </View>
          {requestSelected && renderLeaveItem('Duration', `${requestSelected.startDate} to ${requestSelected.endDate}`)}
          {requestSelected && renderLeaveItem('Reason', requestSelected.reason)}
          <View style={{ flexDirection: 'row', marginTop: pxPhone(30), alignSelf: 'flex-end', }}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onDeleteLeave}>
              {IconDelete({ width: pxPhone(23), height: pxPhone(23) })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onCloseLeaveDetail}
              style={{ marginLeft: pxPhone(12) }}>
              {IconClose({ width: pxPhone(25), height: pxPhone(25) })}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const onCloseApplyForm = () => {
    setIsShowApplyForm(false);
  };

  const renderLeaveItem = (title, value) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: pxPhone(5) }}>
        <View style={{ width: pxPhone(70) }} >
          <Text style={{ fontWeight: 'bold' }}>
            {`${title}:`}
          </Text>
        </View>
        <View style={{ marginLeft: pxPhone(20) }}>
          <Text>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  const onMonthChange = () => {

  };

  return (
    <View style={{ width: '100%', flex: 1, backgroundColor: '#9AC4F8', justifyContent: 'center', marginTop: pxPhone(30) }}>
      <Calendar
        markingType={'period'}
        style={{
          height: pxPhone(400),
        }}
        markedDates={selectDay}
        theme={{
          calendarBackground: '#9AC4F8',
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
        onDayPress={onDatePress}
        onMonthChange={(date) => onMonthChange(date.month, date.year)}
        hideArrows={false}
        hideExtraDays={true}
        disableMonthChange={false}
        firstDay={0}
        hideDayNames={false}
        onPressArrowLeft={subtractMonth => subtractMonth()}
        onPressArrowRight={addMonth => addMonth()}
        disableAllTouchEventsForDisabledDays={true}
      />
      {renderLeaveDetail()}
      <ApplyForm
        getAllRequest={props.getAllRequest}
        isShow={isShowApplyForm}
        onClose={onCloseApplyForm}
        dateSelect={dateSelected}
      />
    </View>
  );
};
