import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { pxPhone, showToastWithGravityAndOffset } from '../../core/utils/utils';
import ProjectService from '../services/project.service';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity as Touch } from 'react-native-gesture-handler'
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default ProjectsScreen = (props) => {
  const [projects, setProjects] = useState([]);
  const isFocused = useIsFocused();
  const [projectSelected, setProjectSelected] = useState();
  const [isShow, setIsShow] = useState(false);

  const typeEnum = {
    CUSTOMER: 'Customer',
    INTERNAL: 'Internal',
  }

  const statusEnum = {
    NEW: 'New',
    ARCHIVED: 'Archived',
    SUSPEND: 'Suspend',
    RUNNING:'Running'
  }

  useEffect(() => {
    getProjects();

    return () => {
      setProjectSelected(undefined);
    }
  }, [isFocused]);

  const getProjects = async () => {
    const projectService = new ProjectService();
    const data = await projectService.getProjects();
    setProjects(data.content);
  };

  const onAddNewPress = () => {
    props.navigation.navigate('ProjectAddNew', {
      project: projectSelected,
    });
  };

  const onAddNewIconPress = () => {
    props.navigation.navigate('ProjectAddNew');
    setProjectSelected(undefined);
  };

  const onArchived = async () => {
    try {
      const body = { ...projectSelected, status: 'ARCHIVED' }

      const projectService = new ProjectService();
      const data = await projectService.updateProject(body);

      getProjects();
      setProjectSelected(undefined);
    } catch (error) {
      showToastWithGravityAndOffset(error.message);
    }
  };

  const onSuspend = async () => {
    try {
      const body = { ...projectSelected, status: 'SUSPEND' }

      const projectService = new ProjectService();
      const data = await projectService.updateProject(body);

      getProjects();
      setProjectSelected(undefined);
    } catch (error) {
      showToastWithGravityAndOffset(error.message);
    }
  };

  const onRunning = async () => {
    try {
      const body = { ...projectSelected, status: 'RUNNING' }

      const projectService = new ProjectService();
      const data = await projectService.updateProject(body);

      getProjects();
      setProjectSelected(undefined);
    } catch (error) {
      showToastWithGravityAndOffset(error.message);
    }
  };

  const onViewPress = (id) => {
    console.log(id);
    onCloseModal();
    props.navigation.navigate('Members', { id });
  };

  const onCloseModal = () => {
    setIsShow(false);
  };

  const onItemPress = (project) => {
    setProjectSelected(project)
    setIsShow(true);
  };

  const renderModal = () => {
    return (
      <Modal
        onBackdropPress={onCloseModal}
        isVisible={isShow}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.option}>
          <TouchableOpacity onPress={() => onViewPress(projectSelected.code)}>
            <Text
              style={[styles.txtOption, { color: 'orange' }]}>
              {'View members'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAddNewPress}>
            <Text
              style={[styles.txtOption, { color: 'red' }]}>
              {'Edit'}
            </Text>
          </TouchableOpacity>
          {projectSelected.status !== 'SUSPEND' && <TouchableOpacity
            onPress={onSuspend}
            style={{ paddingTop: pxPhone(7) }}>
            <Text style={[styles.txtOption, { color: '#7D61C8' }]}>
              {'Suspend'}
            </Text>
          </TouchableOpacity>}
          {projectSelected.status !== 'ARCHIVED' && <TouchableOpacity
            onPress={onArchived}
            style={{ paddingTop: pxPhone(7) }}>
            <Text style={[styles.txtOption, { color: '#D86667' }]}>
              {'Archive'}
            </Text>
          </TouchableOpacity>}
          {projectSelected.status !== 'RUNNING' && <TouchableOpacity
            onPress={onRunning}
            style={{ paddingTop: pxPhone(7) }}>
            <Text style={[styles.txtOption, { color: 'green' }]}>
              {'Running'}
            </Text>
          </TouchableOpacity>}
        </View>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onItemPress(item)}
              key={index}
              style={[styles.viewProject, (index === projects.length - 1) && { marginBottom: pxPhone(80) }]}>
              <View style={[styles.vertical, { backgroundColor: color }]}>
              </View>
              <View
                style={{ flex: 1, padding: pxPhone(12), }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 1, }}>
                  <View style={{ width: '75%' }}>
                    <Text style={styles.name}>
                      {item.name}
                    </Text>
                  </View>
                  {item.status !== 'ARCHIVED' && <Entypo
                    name={'dots-three-vertical'}
                    size={pxPhone(15)}
                    color={'gray'}
                  />}
                  {/* {projectSelected && (item.code === projectSelected.code)} */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: pxPhone(11) }}>
                  <View style={{ flex: 3 }}>
                    <View>
                      <Text
                        style={styles.label}>
                        {'Status'}
                      </Text>
                      <Text numberOfLines={1} style={[styles.value, { color }]}>
                        {statusEnum[item.status]}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 3, alignItems: 'flex-start' }}>
                    <View>
                      <Text style={[styles.label]}>
                        {'Type'}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[styles.value]}>
                        {typeEnum[item.type]}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 2, alignItems: 'center' }}>
                    <View>
                      <Text style={styles.label}>
                        {'Code'}
                      </Text>
                      <Text numberOfLines={1} style={[styles.value, { fontWeight: 'bold' }]}>
                        {item.code}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 2, alignItems: 'flex-end' }}>
                    <Text style={styles.label}>
                      {'Prefix'}
                    </Text>
                    <Text numberOfLines={1} style={[styles.value, { fontWeight: 'bold' }]}>
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
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {projectSelected && renderModal()}
      <TouchableOpacity
        onPress={onAddNewIconPress}
        activeOpacity={0.75}
        style={styles.icon}>
        <FontAwesome5
          name={'plus'}
          size={pxPhone(20)}
          color={'white'}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    bottom: pxPhone(10),
    right: pxPhone(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3753C7',
    borderRadius: pxPhone(50 / 2),
    width: pxPhone(50),
    height: pxPhone(50),
  },
  option: {
    paddingLeft: pxPhone(20),
    width: pxPhone(370),
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
  txtOption: {
    margin: pxPhone(10),
    fontSize: pxPhone(18),
  },
});
