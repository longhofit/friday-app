import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { pxPhone } from '../../core/utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import SelectPicker from '../components/picker/selectPicker.component';
import { Hr } from '../components/hr/hr.component';
import { onFilterSortTimeLog } from '../../core/store/reducer/session/actions';
export default FilterTimeLog = ({ route, navigation }) => {
  const filterAndSortForm = useSelector(state => state.session.timeLogFilterAndSort);
  const dispatch = useDispatch();
  const onProjectFilterChange = (project) => {
    dispatch(onFilterSortTimeLog({
      ...filterAndSortForm, filter: {
        ...filterAndSortForm.filter,
        project,
      }
    }));
  };

  const onActivityFilterChange = (activity) => {
    dispatch(onFilterSortTimeLog({
      ...filterAndSortForm, filter: {
        ...filterAndSortForm.filter,
        activity,
      }
    }));
  }


  return (
    <View style={styles.container}>
      <SelectPicker
        navigation={navigation}
        onValueChange={onProjectFilterChange}
        data={filterAndSortForm.menuFilter.project}
        selectedValues={filterAndSortForm.filter.project}
        title={'Project'} />
      <Hr />
      <SelectPicker
        navigation={navigation}
        onValueChange={onActivityFilterChange}
        data={filterAndSortForm.menuFilter.activity}
        selectedValues={filterAndSortForm.filter.activity}
        title={'Activity'} />
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
