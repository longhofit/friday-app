import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react'
import { pxPhone } from "../core/utils/utils";
import HomeService from "./services/home.service";
import { yyyMMddFormatter } from "../core/formatters";
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import EmployeesService from "./services/employees.service";
import { IconClose, IconDelete } from "./assets/icons";

export default Reports = () => {
  const initDateForm = {
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 3,
      new Date().getDate(),
    ),
    end: new Date(),
  }

  const [reportDate, setReportDate] = useState(initDateForm);
  const [dateList, setDateList] = useState([]);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeLeave, setEmployeeLeave] = useState([]);
  const [isShowSummaryDetail, setIsShowSummaryDetail] = useState(false);
  const [employeeSelected, setEmployeeSelected] = useState(undefined);

  const onCloseDatePicker = () => {
    setIsShowDatePicker(false);
  };

  useEffect(() => {
    const dateArray = [];
    const startDate = new Date(reportDate.start);
    const endDate = new Date(reportDate.end);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dateArray.push(new Date(date));
    }

    setDateList(dateArray);
  }, [reportDate])

  useEffect(() => {
    const employeesService = new EmployeesService();
    employeesService.getAllEmployee()
      .then(data => {
        setEmployees(data);
      })
      .catch(e => console.log(e));
  }, [])

  const onFilterReport = () => {
    const start = yyyMMddFormatter(reportDate.start);
    const end = yyyMMddFormatter(reportDate.end);

    const homeService = new HomeService();
    homeService.getAllRequestLeaveByDate({ start, end })
      .then(data => {
        const employeeLeaveTemp = [];

        employees.forEach(item => {
          let annual = 0;
          let remote = 0;
          let unpaid = 0;
          let dayOff = [];

          data.forEach(leave => {
            if (item.id === leave.employee.id) {
              const start = new Date(leave.startDate);
              const end = new Date(leave.endDate);

              if (leave.startDate === leave.endDate) {
                if (leave.shift === 'ALLDAY') {
                  switch (leave.type) {
                    case 'annual':
                      annual += 1;
                      dayOff.push({ [`${leave.startDate}`]: 'annual' })
                      break;
                    case 'remote':
                      remote += 1;
                      dayOff.push({ [`${leave.startDate}`]: 'remote' })
                      break;
                    case 'unpaid':
                      unpaid += 1;
                      dayOff.push({ [`${leave.startDate}`]: 'unpaid' })
                      break;
                    default:
                      break;
                  }
                } else {
                  switch (leave.type) {
                    case 'annual':
                      annual += 0.5;
                      dayOff.push({ [`${leave.startDate}`]: 'annual' })
                      break;
                    case 'remote':
                      remote += 0.5;
                      dayOff.push({ [`${leave.startDate}`]: 'remote' })
                      break;
                    case 'unpaid':
                      unpaid += 0.5;
                      dayOff.push({ [`${leave.startDate}`]: 'unpaid' })
                      break;
                    default:
                      break;
                  }
                }
              } else {
                for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
                  switch (leave.type) {
                    case 'annual':
                      annual += 1;
                      dayOff.push({ [yyyMMddFormatter(date)]: 'annual' })
                      break;
                    case 'remote':
                      remote += 1;
                      dayOff.push({ [yyyMMddFormatter(date)]: 'remote' })
                      break;
                    case 'unpaid':
                      unpaid += 1;
                      dayOff.push({ [yyyMMddFormatter(date)]: 'unpaid' })
                      break;
                    default:
                      break;
                  }
                }

                switch (leave.type) {
                  case 'annual':
                    annual += 1;
                    dayOff.push({ [`${leave.endDate}`]: 'annual' })
                    break;
                  case 'remote':
                    remote += 1;
                    dayOff.push({ [`${leave.endDate}`]: 'remote' })
                    break;
                  case 'unpaid':
                    unpaid += 1;
                    dayOff.push({ [`${leave.endDate}`]: 'unpaid' })
                    break;
                  default:
                    break;
                }
              }
            }
          });

          // dayOff.forEach(item => onsole.log(JSON.stringify(item)))

          const weekendCount = dateList.filter(date => date.getDay() === 0 || date.getDay() === 6).length;
          const dayOffCount = annual + unpaid;
          const workingDateCount = dateList.length - weekendCount - dayOffCount;

          employeeLeaveTemp.push({ employee: item, summary: { dayoff: dayOffCount, remote, dateWork: workingDateCount } })
        });

        setEmployeeLeave(employeeLeaveTemp);
      })
      .catch(e => console.log(e));
  };


  const onDatePress = (date) => {
    const dateSelect = new Date(date.year, date.month - 1, date.day);

    console.log(date);
    console.log(dateSelect.toLocaleDateString());

    dateType === 'startDate'
      ? setReportDate({ ...reportDate, start: dateSelect })
      : setReportDate({ ...reportDate, end: dateSelect })
    onCloseDatePicker();
  };


  const onOpenDatePicker = (type) => {
    setDateType(type);
    setIsShowDatePicker(true);
  };

  const onCloseLeaveDetail = () => {
    setIsShowSummaryDetail(false);
  };

  const onEmployeePress = (employee) => {
    setEmployeeSelected(employee);
    setIsShowSummaryDetail(true);
  };

  const renderLeaveItem = (title, value) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: pxPhone(5), paddingLeft: pxPhone(20) }}>
        <View style={{ width: pxPhone(120) }} >
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

  const renderLeaveSummaryDetail = () => {
    return (
      <Modal
        onBackdropPress={onCloseLeaveDetail}
        isVisible={isShowSummaryDetail}
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
          width: pxPhone(350),
        }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pxPhone(15) }}>
            {'Summary detail'}
          </Text>
          <View style={{ paddingTop: pxPhone(10) }}>
            {employeeSelected && renderLeaveItem('Employee', `${employeeSelected.employee.name}`)}
          </View>
          {employeeSelected && renderLeaveItem('Day Off', `${employeeSelected.summary.dayoff}`)}
          {employeeSelected && renderLeaveItem('Remote Day', `${employeeSelected.summary.remote}`)}
          {employeeSelected && renderLeaveItem('Working Day', `${employeeSelected.summary.dateWork}`)}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onCloseLeaveDetail}
            style={{ alignSelf: 'flex-end', marginTop: pxPhone(12) }}>
            {IconClose({ width: pxPhone(32), height: pxPhone(32) })}
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  const renderDatePicker = () => {
    const start = yyyMMddFormatter(reportDate.start);
    const end = yyyMMddFormatter(reportDate.end);

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
            current={dateType === 'startDate' ? yyyMMddFormatter(reportDate.start) : yyyMMddFormatter(reportDate.end)}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: pxPhone(8),
              width: pxPhone(370),
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
                [start]: { selected: true, selectedColor: '#9AC4F8' },
              })
              : ({
                [end]: { selected: true, selectedColor: '#9AC4F8' },
              })
            }
          />
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{
        marginTop: pxPhone(20),
        paddingVertical: pxPhone(18),
        width: '90%',
        backgroundColor: 'white',
        borderRadius: pxPhone(6),
        shadowColor: '#000',
        alignItems: 'center',
        shadowOffset: {
          width: pxPhone(3),
          height: pxPhone(4),
        },
        shadowOpacity: pxPhone(0.25),
        shadowRadius: pxPhone(6),
        elevation: 8,
        alignSelf: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '95%',
        }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32%'
            }}>

            <TouchableOpacity
              onPress={() => onOpenDatePicker('startDate')}
              activeOpacity={0.75}
              style={{
                borderWidth: pxPhone(1),
                borderColor: '#BDBDBD',
                flex: 1,
                height: pxPhone(40),
                borderRadius: pxPhone(5),
                justifyContent: 'center',
                alignItems: 'center',
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
                  {'Start Date'}
                </Text>
              </View>
              <Text style={{ fontSize: pxPhone(16) }}>
                {yyyMMddFormatter(reportDate.start)}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32%',
            }}>
            <TouchableOpacity
              onPress={() => onOpenDatePicker('endDate')}
              activeOpacity={0.75}
              style={{
                borderWidth: pxPhone(1),
                borderColor: '#BDBDBD',
                flex: 1,
                height: pxPhone(40),
                borderRadius: pxPhone(5),
                justifyContent: 'center',
                alignItems: 'center',
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
                  {'End Date'}
                </Text>
              </View>
              <Text style={{ fontSize: pxPhone(16) }}>
                {yyyMMddFormatter(reportDate.end)}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onFilterReport}
            style={{
              justifyContent: 'center',
              backgroundColor: '#3753C7',
              borderRadius: pxPhone(6),
              height: pxPhone(40),
              paddingHorizontal: pxPhone(15),
              shadowColor: '#3753C7',
              shadowOffset: {
                width: pxPhone(3),
                height: pxPhone(4),
              },
              shadowOpacity: pxPhone(0.25),
              shadowRadius: pxPhone(6),
              elevation: 8,
            }}>
            <Text style={{ fontWeight: '600', color: 'white', fontSize: pxPhone(12) }}>
              {'SHOW REPORT'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {employeeLeave.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: pxPhone(20),
            width: '90%',
            backgroundColor: 'white',
            borderRadius: pxPhone(6),
            shadowColor: '#000',
            shadowOffset: {
              width: pxPhone(3),
              height: pxPhone(4),
            },
            shadowOpacity: pxPhone(0.25),
            shadowRadius: pxPhone(6),
            elevation: 8,
            alignSelf: 'center',
            marginBottom: pxPhone(20),
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            paddingVertical: pxPhone(12),
            backgroundColor: '#E8ECF0',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                {'Num.'}
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                {'Employee'}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                {'Summary'}
              </Text>
            </View>
          </View>
          {employeeLeave.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => onEmployeePress(item)}
                activeOpacity={0.75}
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingVertical: pxPhone(12),
                  backgroundColor: index % 2 == 1 && '#E8ECF0',
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'center' }}>
                    {`${index + 1}`}
                  </Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={{ textAlign: 'center' }}>
                    {item.employee.name}
                  </Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ textAlign: 'center' }}>
                    {`${item.summary.dayoff}/${item.summary.remote}/${item.summary.dateWork}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}
      { renderDatePicker()}
      {renderLeaveSummaryDetail()}
    </View >
  );
};