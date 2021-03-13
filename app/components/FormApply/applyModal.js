import React, {
  useEffect,
  useState,
} from 'react';
import { View, Text, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import Modal from 'react-native-modal';
import { pxPhone } from '../../../core/utils/utils'
import { leaveTypes, shift } from '../../../core/constant/menuSideBarConstant'
import {
  IconClose,
  IconWork,
  IconCalendar,
  IconNote,
  IconCheck,
} from '../../assets/icons';
import { Picker } from '@react-native-picker/picker'
import HomeService from '../../services/home.service';
import { Calendar } from 'react-native-calendars';


export default ApplyForm = (props) => {
  const { isShow, onClose, dateSelect } = props;
  const initForm = {
    type: 'unpaid',
    startDate: '',
    endDate: '',
    shift: 'ALLDAY',
    reason: '',
  };

  const [form, setForm] = useState(initForm);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState(undefined);

  const showToastWithGravityAndOffset = (text) => {
    ToastAndroid.showWithGravityAndOffset(
      text,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };;

  useEffect(() => {
    setForm({ ...form, startDate: dateSelect, endDate: dateSelect })
  }, [dateSelect])

  const onSubmit = (onSuccess) => {
    const homeService = new HomeService();
    homeService.applyLeave(form)
      .then(() => {
        onSuccess();
        showToastWithGravityAndOffset('Apply leave successfully');
        props.getAllRequest();
      })
      .catch(e => {
        showToastWithGravityAndOffset(e.message);
      });
    onClose();
  };

  const onCheckIconPress = () => {
    onSubmit(onClose);
  };

  const onCloseDatePicker = () => {
    setIsShowDatePicker(false);
  };

  const onFormClose = () => {
    onClose();
  };

  const onOpenDatePicker = (type) => {
    setDateType(type);
    setIsShowDatePicker(true);
  };

  const onDatePress = (date) => {
    dateType === 'startDate' ? setForm({ ...form, startDate: date.dateString }) : setForm({ ...form, endDate: date.dateString });
    onCloseDatePicker();
  };

  const renderDatePicker = () => {
    return (
      <Modal
        onBackdropPress={onCloseDatePicker}
        isVisible={isShowDatePicker}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ paddingTop: pxPhone(10) }}>
          <Calendar
            current={form.startDate}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: pxPhone(8),
              width: pxPhone(300),
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
            onPressArrowLeft={subtractMonth => subtractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            disableAllTouchEventsForDisabledDays={true}
            enableSwipeMonths={true}
            markedDates={dateType === 'startDate'
              ? ({
                [form.startDate]: { selected: true, selectedColor: '#9AC4F8' },
              })
              : ({
                [form.endDate]: { selected: true, selectedColor: '#9AC4F8' },
              })
            }
          />
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      onBackdropPress={onClose}
      isVisible={isShow}
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
        paddingVertical: pxPhone(10),
        width: '100%',
        alignItems: 'center',
      }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pxPhone(18) }}>
          {'Apply Leave'}
        </Text>
        <View style={{
          flexDirection: 'row',
          marginTop: pxPhone(12),
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: pxPhone(25),
        }}>
          <View style={{ width: pxPhone(40) }}>
            {IconWork({ width: pxPhone(20), height: pxPhone(20) })}
          </View>
          <View style={{ borderWidth: pxPhone(1), borderColor: '#BDBDBD', flex: 1, height: pxPhone(60), borderRadius: pxPhone(5) }}>
            <View style={{
              position: 'absolute',
              top: pxPhone(-10),
              backgroundColor: 'white',
              left: pxPhone(10),
              paddingHorizontal: pxPhone(5),
            }}>
              <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
                {'Leave Type'}
              </Text>
            </View>
            <Picker
              style={{ flex: 1 }}
              selectedValue={form.type}
              onValueChange={(value) =>
                setForm({ ...form, type: value })
              }>
              <Picker.Item label={leaveTypes.unpaid} value={'unpaid'} />
              <Picker.Item label={leaveTypes.annual} value="annual" />
              <Picker.Item label={leaveTypes.remote} value="remote" />
            </Picker>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: pxPhone(12),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ width: pxPhone(40) }}>
            {IconCalendar({ width: pxPhone(20), height: pxPhone(20) })}
          </View>
          <TouchableOpacity
            onPress={() => onOpenDatePicker('startDate')}
            activeOpacity={0.75}
            style={{
              borderWidth: pxPhone(1),
              borderColor: '#BDBDBD',
              flex: 1,
              height: pxPhone(60),
              borderRadius: pxPhone(5),
              justifyContent: 'center',
              paddingLeft: pxPhone(8),
            }}>
            <View
              style={{
                position: 'absolute',
                top: pxPhone(-10),
                backgroundColor: 'white',
                left: pxPhone(10),
                paddingHorizontal: pxPhone(5),
              }}>
              <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
                {'From'}
              </Text>
            </View>
            <Text style={{ fontSize: pxPhone(16) }}>
              {form.startDate}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: pxPhone(12),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ width: pxPhone(40) }}>
            {IconCalendar({ width: pxPhone(20), height: pxPhone(20) })}
          </View>
          <TouchableOpacity
            onPress={() => onOpenDatePicker('endDate')}
            activeOpacity={0.75}
            style={{
              borderWidth: pxPhone(1),
              borderColor: '#BDBDBD',
              flex: 1,
              height: pxPhone(60),
              borderRadius: pxPhone(5),
              justifyContent: 'center',
              paddingLeft: pxPhone(8),
            }}>
            <View
              style={{
                position: 'absolute',
                top: pxPhone(-10),
                backgroundColor: 'white',
                left: pxPhone(10),
                paddingHorizontal: pxPhone(5),
              }}>
              <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
                {'To'}
              </Text>
            </View>
            <Text style={{ fontSize: pxPhone(16) }}>
              {form.endDate}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row',
          marginTop: pxPhone(12),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{ width: pxPhone(40) }}>
            {IconWork({ width: pxPhone(20), height: pxPhone(20) })}
          </View>
          <View style={{ borderWidth: pxPhone(1), borderColor: '#BDBDBD', flex: 1, height: pxPhone(60), borderRadius: pxPhone(5) }}>
            <View style={{
              position: 'absolute',
              top: pxPhone(-10),
              backgroundColor: 'white',
              left: pxPhone(10),
              paddingHorizontal: pxPhone(5),
            }}>
              <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
                {'Shift'}
              </Text>
            </View>
            <Picker
              style={{ flex: 1 }}
              selectedValue={form.shift}
              onValueChange={(value) =>
                setForm({ ...form, shift: value })
              }>
              <Picker.Item label={shift.ALLDAY} value={'ALLDAY'} />
              <Picker.Item label={shift.MORNING} value={'MORNING'} />
              <Picker.Item label={shift.AFTERNOON} value={'AFTERNOON'} />
            </Picker>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: pxPhone(12),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ width: pxPhone(40) }}>
            {IconNote({ width: pxPhone(20), height: pxPhone(20) })}
          </View>
          <View
            style={{
              borderWidth: pxPhone(1),
              borderColor: '#BDBDBD',
              flex: 1,
              height: pxPhone(100),
              borderRadius: pxPhone(5),
              justifyContent: 'center',
              paddingLeft: pxPhone(8),
            }}>
            <View
              style={{
                position: 'absolute',
                top: pxPhone(-10),
                backgroundColor: 'white',
                left: pxPhone(10),
                paddingHorizontal: pxPhone(5),
              }}>
              <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
                {'Reason'}
              </Text>
            </View>
            <TextInput
              value={form.reason}
              onChangeText={text => setForm({ ...form, reason: text })}
              textAlignVertical={'top'}
              multiline
              style={{ flex: 1 }} />
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          marginTop: pxPhone(30),
          alignSelf: 'flex-end',
          width: pxPhone(90),
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onFormClose}>
            {IconClose({ width: pxPhone(34), height: pxPhone(34) })}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onCheckIconPress}
            style={{ marginLeft: pxPhone(12) }}>
            {IconCheck({ width: pxPhone(25), height: pxPhone(25), bottom: pxPhone(-2) })}
          </TouchableOpacity>
        </View>
        {renderDatePicker()}
      </View>
    </Modal>
  );
};