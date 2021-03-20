import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import SettingService from '../services/setting.service';
import {
  IconCalendar,
  IconEdit,
  IconUpArrow,
  IconDownArrow,
  IconDeletePolicy,
} from '../assets/icons';
import { pxPhone } from '../../core/utils/utils';
import ProjectService from '../services/project.service';
import Entypo from 'react-native-vector-icons/Entypo'

export default ProjectsScreen = (props) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    const projectService = new ProjectService();
    const data = await projectService.getProjects();
    setProjects(data.content);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {projects.map((item, index) => {
        return (
          <View
            key={index}
            style={styles.viewProject}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '75%' }}>
                <Text style={styles.name}>
                  {item.name}
                </Text>
              </View>
              <Entypo
                name={'dots-three-vertical'}
                size={pxPhone(15)}
                color={'gray'}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: pxPhone(11) }}>
              <View style={{ flex: 1 }}>
                <View>
                  <Text style={styles.label}>
                    {'Status'}
                  </Text>
                  <Text style={[styles.value, { color: item.status === 'NEW' ? 'red' : 'orange' }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <View>
                  <Text style={styles.label}>
                    {'Type'}
                  </Text>
                  <Text style={[styles.value,{color:'blue'}]}>
                    {item.type}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text style={styles.label}>
                    {'Code'}
                  </Text>
                  <Text style={[styles.value,{fontWeight:'bold'}]}>
                    {item.code}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.label}>
                  {'Prefix'}
                </Text>
                <Text style={[styles.value,{fontWeight:'bold'}]}>
                  {item.ticketPrefix}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>
                <Text style={{ color: 'gray', }}>
                  {'Owner: '}
                </Text>
                {`${item.owner}`}
              </Text>
              <Text>
                {item.timeLogFrequency}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: pxPhone(2),
  },
  status: {
    fontWeight: 'normal',
    fontSize: pxPhone(14),
  },
  name: {
    fontSize: pxPhone(18),
    fontWeight: 'bold',
  },
  viewProject: {
    padding: pxPhone(15),
    margin: pxPhone(10),
    // flexDirection: 'row',
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
  },
  label: {
    color: 'gray',
  },
  value: {
    marginTop: pxPhone(3),
  }
});
