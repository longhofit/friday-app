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
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import ProjectService from '../services/project.service';
import { showToastWithGravityAndOffset } from '../../core/utils/utils'
import { useSelector } from 'react-redux';

export default MemberAddNew = ({ route, navigation }) => {
  const { id } = route.params;
  const employeeState = useSelector(state => state.employee.employees);

  const initForm = {
    employeeId: employeeState && employeeState[0].id,
    role: '',
    comment: '',
    onBoardDate: new Date(),
    offBoardDate: '',
    active: true,
  };

  const [form, setForm] = useState(initForm);
  const [isUpdate, setIsUpdate] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
            style={{ flex: 1, paddingLeft: pxPhone(16), justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: pxPhone(17), }}>
              {'Cancel'}
            </Text>
          </TouchableOpacity>
        );
      },
      headerRight: () => {
        return (
          <TouchableOpacity
            disabled={isInvalid()}
            activeOpacity={0.75}
            onPress={addNewMember}
            style={{ flex: 1, paddingRight: pxPhone(16), justifyContent: 'center', opacity: isInvalid() && 0.3 }}>
            <Text style={{ fontWeight: 'bold', fontSize: pxPhone(17), }}>
              {'Save'}
            </Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: {
        padding: 0,
      },
      headerTitle: isUpdate ? `Update member` : 'Add new member',
    });
  }, [navigation, form]);

  useEffect(() => {
    if (route.params) {
      const { project } = route.params;

      if (project) {
        setIsUpdate(true);
        setForm(project);
      };
    }
  }, [navigation])

  const isEmpty = (value) => {
    return value === '';
  };

  const isInvalid = () => {
    return isEmpty(form.role);
  };

  const setId = (employeeId) => {
    setForm({
      ...form,
      employeeId,
    });
  };

  const setRole = (role) => {
    setForm({
      ...form,
      role,
    });
  };

  const setComment = (comment) => {
    setForm({
      ...form,
      comment,
    });
  };

  const addNewMember = async () => {
    try {
      const projectService = new ProjectService();
      let data;
      if (isUpdate) {
        // data = await projectService.updateProject(form);
      } else {
        data = await projectService.addMember([form], id);
      }

      if (data) {
        navigation.navigate('Members');
        showToastWithGravityAndOffset('Add member successfully.')
      } else {
        showToastWithGravityAndOffset('Add member not successfully.')
      }
    } catch (error) {
      showToastWithGravityAndOffset(error.message)
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={styles.picker}>
          <View style={styles.pickerMask}>
            <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
              {'Employee'}
            </Text>
          </View>
          <Picker
            style={{ flex: 1 }}
            selectedValue={form.employeeId}
            onValueChange={setId}>
            {employeeState.map((item, index) => {
              return (
                <Picker.Item label={item.name} value={item.id} />
              )
            })}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          mode={'outlined'}
          label={'Role'}
          value={form.role}
          onChangeText={setRole}
        />
        <TextInput
          disabled={isUpdate}
          style={styles.input}
          mode={'outlined'}
          label={'Comment'}
          value={form.comment}
          onChangeText={setComment}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: pxPhone(20),
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
