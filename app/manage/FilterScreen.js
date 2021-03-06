import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { Hideo } from 'react-native-textinput-effects';
import { pxPhone } from '../../core/utils/utils';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { IconAdd, IconCalendar, IconClock, IconActivity } from '../assets/icons';
import Modal from 'react-native-modal';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import TimeLogService from '../services/timelog.service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Kaede } from 'react-native-textinput-effects';
import { TextInput, ToggleButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import ProjectService from '../services/project.service';
import { showToastWithGravityAndOffset } from '../../core/utils/utils'
import { useDispatch, useSelector } from 'react-redux';
import SelectPicker from '../components/picker/selectPicker.component';
import { da } from 'date-fns/locale';
import { Hr } from '../components/hr/hr.component';
import { ToggleInput } from '../components/toggleInput/toggleInputV1.component';
import { frequencyFilterData, statusFilterData, typeFilterData } from '../../core/constant/project';
import { onFilterSortProject } from '../../core/store/reducer/session/actions';



// interface ComponentProps extends TouchableOpacityProps 
//   invalid?: boolean;
//   title: string;
//   titleStyle?: StyleProp<TextStyle>;
//   data;
//   selectedTextStyle?: StyleProp<TextStyle>;
//   selectedValue: string | undefined;
//   onValueChange: (value: string | undefined) => void;
// }

export default FilterProject = ({ route, navigation }) => {
  const filterAndSortForm = useSelector(state => state.session.projectFilterAndSort);

  const dispatch = useDispatch();

  const onStatusFilterChange = (status) => {
    dispatch(onFilterSortProject({
      ...filterAndSortForm, filter: {
        ...filterAndSortForm.filter,
        status,
      }
    }));
  };

  const onTypeFilterChange = (type) => {
    dispatch(onFilterSortProject({
      ...filterAndSortForm, filter: {
        ...filterAndSortForm.filter,
        type,
      }
    }));
  }

  const onFrequencyFilterChange = (frequency) => {
    dispatch(onFilterSortProject({
      ...filterAndSortForm, filter: {
        ...filterAndSortForm.filter,
        frequency,
      }
    }));
  }

  return (
    <View style={styles.container}>
      <SelectPicker
        navigation={navigation}
        onValueChange={onStatusFilterChange}
        data={statusFilterData}
        selectedValues={filterAndSortForm.filter.status}
        title={'Status'} />
      <Hr />
      <SelectPicker
        navigation={navigation}
        onValueChange={onTypeFilterChange}
        data={typeFilterData}
        selectedValues={filterAndSortForm.filter.type}
        title={'Type'} />
      <Hr />
      <SelectPicker
        navigation={navigation}
        onValueChange={onFrequencyFilterChange}
        data={frequencyFilterData}
        selectedValues={filterAndSortForm.filter.frequency}
        title={'Frequency'} />
      <Hr />
      {/* <ToggleInput
        checked={value.check}
        onChange={(check) => setValue({ ...value, check })}
        title={'TOGGG'} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    margin: pxPhone(10),
  },
  picker: {
    borderWidth: pxPhone(1),
    borderColor: 'gray',
    width: '95%',
    height: pxPhone(57),
    borderRadius: pxPhone(3),
    alignSelf: 'center',
    margin: pxPhone(12),
  },
  pickerMask: {
    position: 'absolute',
    top: pxPhone(-10),
    backgroundColor: 'white',
    left: pxPhone(10),
    paddingHorizontal: pxPhone(5),
  }
});
