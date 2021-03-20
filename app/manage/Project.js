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
import AntDesign from 'react-native-vector-icons/AntDesign'

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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {projects.map((item, index) => {
          let color;
          switch (item.status) {
            case 'NEW':
              color = '#5584FF';
              break;
            case 'ARCHIVED':
              color = '#D86667';
              break;
            case 'SUSPEND':
              color = '#7D61C8';
              break;
            case 'RUNNING':
              color = 'green';
              break;
            default:
              break;
          }
          return (
            <View
              key={index}
              style={[styles.viewProject,(index===projects.length-1)&&{marginBottom:pxPhone(80)}]}>
              <View style={[styles.vertical, { backgroundColor: color }]}>
              </View>
              <View style={{ flex: 1, padding: pxPhone(12) }}>
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
                      <Text style={[styles.value, { color }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <View>
                      <Text style={styles.label}>
                        {'Type'}
                      </Text>
                      <Text style={[styles.value]}>
                        {item.type}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View>
                      <Text style={styles.label}>
                        {'Code'}
                      </Text>
                      <Text style={[styles.value, { fontWeight: 'bold' }]}>
                        {item.code}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.label}>
                      {'Prefix'}
                    </Text>
                    <Text style={[styles.value, { fontWeight: 'bold' }]}>
                      {item.ticketPrefix}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>
                    {`${item.owner}`}
                  </Text>
                  <Text>
                    {item.timeLogFrequency}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <AntDesign
        style={styles.icon}
        name={'pluscircle'}
        size={pxPhone(50)}
        color={'#3753C7'}
      />
    </View>
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
    fontSize: pxPhone(17),
    fontWeight: 'bold',
  },
  viewProject: {
    margin: pxPhone(10),
    flexDirection: 'row',
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
  },
  vertical: {
    width: pxPhone(5),
    height: '100%',
    borderTopLeftRadius: pxPhone(6),
    borderBottomStartRadius: pxPhone(6),
  },
  icon: {
    position: 'absolute',
    bottom:pxPhone(20),
    right:pxPhone(20),
  },
});
