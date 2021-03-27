import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { sortFieldEnunm } from '../../core/constant/project';
import { useDispatch, useSelector } from 'react-redux';
import { onFilterSortProject } from '../../core/store/reducer/session/actions';
import { Hr } from '../components/hr/hr.component';
import SelectedInput from '../components/selectedInput/selectedInputV1.component';

// interface ComponentProps {
//   initialSortFormData: PatientSortFormData;
//   onSortFormDataChange: (value: PatientSortFormData | undefined) => void;
// }

// export type PatientSortFormProps = ThemedComponentProps & ViewProps & ComponentProps; 

export default SortProject = (props) => {
  const filterAndSortForm = useSelector(state => state.session.projectFilterAndSort);
  const dispatch = useDispatch();
  const [form, setForm] = useState(filterAndSortForm.sort)

  const onSelectInputChange = (sortField) => {
    setForm({ sortField });
  };

  useEffect(() => {
    dispatch(onFilterSortProject({
      ...filterAndSortForm,
      sort: form,
    }));
  }, [form]);

  const { style, ...restProps } = props;

  return (
    <View
      style={[
        themedStyle.container,
        style,
      ]}
      {...restProps}>
      <SelectedInput
        title={'Last Update'}
        selected={form.sortField === sortFieldEnunm.time}
        onInputPress={() => {
          onSelectInputChange(sortFieldEnunm.time);
        }}
      />
      <Hr />
      <SelectedInput
        title={'Name'}
        selected={form.sortField === sortFieldEnunm.name}
        onInputPress={() => {
          onSelectInputChange(sortFieldEnunm.name);
        }}
      />
      <Hr />
      <SelectedInput
        title={'Code'}
        selected={form.sortField === sortFieldEnunm.code}
        onInputPress={() => {
          onSelectInputChange(sortFieldEnunm.code);
        }}
      />
      <Hr />
      <SelectedInput
        title={'Status'}
        selected={form.sortField === sortFieldEnunm.status}
        onInputPress={() => {
          onSelectInputChange(sortFieldEnunm.status);
        }}
      />
      <Hr />
    </View>
  );
};

const themedStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

