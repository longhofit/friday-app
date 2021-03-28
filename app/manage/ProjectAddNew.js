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
import { statusEnum } from '../../core/constant/project';

export default ProjectAddNew = ({ route, navigation }) => {
  const initForm = {
    name: '',
    code: '',
    owner: '',
    ticketPrefix: '',
    projectBase: '',
    type: 'CUSTOMER',
    timeLogFrequency: 'EVERYDAY',
    status: "NEW",
  }

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
            onPress={addNewProject}
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
      headerTitle: isUpdate ? `Edit project` : 'Add new project',

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
    return isEmpty(form.name)
      || isEmpty(form.owner)
      || isEmpty(form.code)
      || isEmpty(form.ticketPrefix)
  };

  useEffect(() => {
    console.log('form', form)
  }, [form]);

  const setName = (name) => {
    setForm({
      ...form,
      name,
    });
  };

  const setCode = (code) => {
    setForm({
      ...form,
      code,
      ticketPrefix: code,
    });
  };

  const setTicket = (ticketPrefix) => {
    setForm({
      ...form,
      ticketPrefix,
    });
  };

  const setProjectBase = (projectBase) => {
    setForm({
      ...form,
      projectBase,
    });
  };

  const setOwner = (owner) => {
    setForm({
      ...form,
      owner,
    });
  };

  const setType = (type) => {
    setForm({
      ...form,
      type,
    });
  };

  const setFrequency = (timeLogFrequency) => {
    setForm({
      ...form,
      timeLogFrequency,
    });
  };

  const setStatus = (status) => {
    setForm({
      ...form,
      status,
    });
  };

  const addNewProject = async () => {
    try {
      const projectService = new ProjectService();
      let data;
      if (isUpdate) {
        data = await projectService.updateProject(form);
      } else {
        data = await projectService.createNewProject(form);
      }

      if (data) {
        route.params.onUpdateProjectSuccess(form);
        navigation.navigate('Project');
        showToastWithGravityAndOffset('Save project successfully.')
      } else {
        showToastWithGravityAndOffset('Save project not successfully.')
      }
    } catch (error) {
      showToastWithGravityAndOffset(error.message)
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          underlineColorAndroid={'red'}
          mode={'outlined'}
          label={'Project name'}
          value={form.name}
          onChangeText={setName}
        />
        <TextInput
          disabled={isUpdate}
          style={styles.input}
          underlineColorAndroid={'red'}
          mode={'outlined'}
          label={'Project code'}
          value={form.code}
          onChangeText={setCode}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid={'red'}
          mode={'outlined'}
          label={'Base'}
          value={form.projectBase}
          onChangeText={setProjectBase}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid={'red'}
          mode={'outlined'}
          label={'Owner'}
          value={form.owner}
          onChangeText={setOwner}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid={'red'}
          mode={'outlined'}
          label={'Ticket prefix'}
          value={form.ticketPrefix}
          onChangeText={setTicket}
        />
        <View style={styles.picker}>
          <View style={styles.pickerMask}>
            <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
              {'Type'}
            </Text>
          </View>
          <Picker
            style={{ flex: 1 }}
            selectedValue={form.type}
            onValueChange={setType}>
            <Picker.Item label={'Customer'} value={'CUSTOMER'} />
            <Picker.Item label={'Internal'} value="INTERNAL" />
          </Picker>
        </View>
        <View style={styles.picker}>
          <View style={styles.pickerMask}>
            <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
              {'Time Log Frequency'}
            </Text>
          </View>
          <Picker
            style={{ flex: 1 }}
            selectedValue={form.timeLogFrequency}
            onValueChange={setFrequency}
          >
            <Picker.Item label={'Everyday'} value={'EVERYDAY'} />
            <Picker.Item label={'Weekly'} value="WEEKLY" />
            <Picker.Item label={'Monthly'} value="MONTHLY" />
          </Picker>
        </View>
        {isUpdate && <View style={styles.picker}>
          <View style={styles.pickerMask}>
            <Text style={{ color: '#585858', fontSize: pxPhone(12) }}>
              {'Status'}
            </Text>
          </View>
          <Picker
            style={{ flex: 1 }}
            selectedValue={form.status}
            onValueChange={setStatus}
          >
            <Picker.Item label={'New'} value={'NEW'} />
            <Picker.Item label={'Suspend'} value={'SUSPEND'} />
            <Picker.Item label={'Archive'} value={'ARCHIVED'} />
            <Picker.Item label={'Running'} value={'RUNNING'} />
          </Picker>
        </View>}
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
