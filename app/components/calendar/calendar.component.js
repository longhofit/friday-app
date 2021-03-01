import React, {
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';

// interface ComponentProps {
//   isDatePickerVisible: boolean;
//   showDatePicker: () => void;
//   hideDatePicker: () => void;
//   onDateConfirm: (date: string) => void;
//   date: string;
// }

export default CalendarComponent = (props) => {
  const [selectDay, setSelectDay] = useState({});

  // const [lastSelectDay, setLastSelectDay] = useState('');

  useEffect(() => {
    setSelectDay({});
    props.requestDates && props.requestDates.forEach((item, index) => {
      setSelectDay(prevState => { 
        return {
          ...prevState,
          [item.date]: item.option,
        };
      });
    });
  }, [props.requestDates]);

  const onMonthChange = (month, year) => {
    // props.onMonthChange && props.onMonthChange(month, year);
  };


  const onDatePress = (date) => {
    // props.onDateChange(date.dateString);

    // setSelectDay({
    //   ...selectDay,
    //   [date.dateString]: {
    //     ...selectDay[date.dateString],
    //     selectedColor: 'white',
    //     selected: true,
    //   },
    //   [lastSelectDay]: {
    //     ...selectDay[lastSelectDay],
    //     selected: false,
    //   },
    // });

    // setLastSelectDay(date.dateString);
  };


  return (
    <View style={{ width: '100%', height: 200 }}>
      <Calendar
        markingType={'period'}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          height: 350
        }}
        markedDates={selectDay}
        theme={{
          calendarBackground: '#d9e1e8',
          textSectionTitleColor: 'black',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: 'transparent',
          selectedDayTextColor: 'black',
          textDisabledColor: '#d9e1e8',
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
          // textDayFontSize: themedStyle.txtCalender.fontSize,
          // textMonthFontSize: themedStyle.txtCalender.fontSize,
          // textDayHeaderFontSize: themedStyle.txtCalender.fontSize,
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
    </View>
  );
};
