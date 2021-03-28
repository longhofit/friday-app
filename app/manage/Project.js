import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { isEmpty, pxPhone, showToastWithGravityAndOffset } from '../../core/utils/utils';
import ProjectService from '../services/project.service';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { frequencyEnum, statusEnum, typeEnum } from '../../core/constant/project';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { theme } from '../theme/appTheme';
import { textStyle } from '../components/styles/style';
import { onFilterSortProject } from '../../core/store/reducer/session/actions';
import { SearchInput } from '../components/input/inputV1.component';

export default ProjectsScreen = (props) => {
  const [projects, setProjects] = useState([]);
  const [projectSelected, setProjectSelected] = useState();
  const [isShow, setIsShow] = useState(false);
  const filterAndSortForm = useSelector(state => state.session.projectFilterAndSort);
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  const orderBy = (array, field) => {
    if (field === 'time') {
      return array;
    }
    return _.orderBy(array, [project => project[field].toLowerCase()], ['asc']);
  };

  useEffect(() => {
    getProjects();

    return () => {
      setProjectSelected(undefined);
    }
  }, []);

  const getProjects = async () => {
    const projectService = new ProjectService();
    const data = await projectService.getProjects();
    setProjects(data.content);
  };

  const onUpdateProjectSuccess = (newProject) => {
    let newProjects = projects.filter(item => item.code !== newProject.code);
    setProjects([newProject, ...newProjects])
    filterAndSortForm.sort.sortField === 'time' && scrollViewProject.current?.scrollTo({ x: 0 });
  };

  const onAddNewProjectSuccess = (newProject) => {
    setProjects([newProject, ...projects])
    filterAndSortForm.sort.sortField === 'time' && scrollViewProject.current?.scrollTo({ x: 0 });
  };

  const onAddNewPress = (project) => {
    props.navigation.navigate('ProjectAddNew', {
      project,
      onUpdateProjectSuccess: project ? onUpdateProjectSuccess : onAddNewProjectSuccess,
    });
  };

  const onArchived = async () => {
    try {
      const body = { ...projectSelected, status: 'ARCHIVED' }

      const projectService = new ProjectService();
      const data = await projectService.updateProject(body);

      onUpdateProjectSuccess(body)
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

      onUpdateProjectSuccess(body);
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

      onUpdateProjectSuccess(body)
      setProjectSelected(undefined);
    } catch (error) {
      showToastWithGravityAndOffset(error.message);
    }
  };

  const onViewPress = (id, projectName) => {
    console.log('projectName', projectName)
    onCloseModal();
    props.navigation.navigate('Members', { id, projectName });
  };

  const onCloseModal = () => {
    setIsShow(false);
  };

  const onItemPress = (project) => {
    const onAddOrEditProject = () => {
      onAddNewPress(project);
    };

    props.navigation.navigate('Members', { project, onAddOrEditProject });
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
          <TouchableOpacity onPress={() => onViewPress(projectSelected.code, projectSelected.name)}>
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

  const onRenderFilterOption = (title, onPress) => {
    return (
      <View style={styles.viewFilterOption}>
        <Text style={styles.textFilterOption}>
          {title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPress}>
          <AntDesign
            name={'closecircle'}
            size={pxPhone(12)}
            color={theme["color-dark-100"]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const scrollView = React.useRef(undefined);
  const scrollViewProject = React.useRef(undefined);

  const onRemoveFilter = (key) => {
    dispatch(onFilterSortProject({
      ...filterAndSortForm,
      filter: {
        ...filterAndSortForm.filter,
        [key]: ['ALL'],
      }
    }))
    scrollView.current?.scrollTo({ x: 0 });
    scrollViewProject.current?.scrollTo({ x: 0 });
  };

  const onRenderFilterOptions = () => {
    return (
      <ScrollView
        horizontal
        ref={scrollView}
        showsHorizontalScrollIndicator={false}
        style={styles.sectionFilterOption}>
        {!filterAndSortForm.filter.status.includes('ALL') && onRenderFilterOption(`${filterAndSortForm.filter.status.join(', ').toLowerCase()}`, () => {
          onRemoveFilter('status');
        })}
        {!filterAndSortForm.filter.type.includes('ALL') && onRenderFilterOption(`${filterAndSortForm.filter.type.join(', ').toLowerCase()}`, () => {
          onRemoveFilter('type')
        })}
        {!filterAndSortForm.filter.frequency.includes('ALL') && onRenderFilterOption(`${filterAndSortForm.filter.frequency.join(', ').toLowerCase()}`, () => {
          onRemoveFilter('frequency')
        })}
      </ScrollView>
    );
  };

  const filterCondition = (project) => {
    return (filterAndSortForm.filter.status.includes('ALL') || filterAndSortForm.filter.status.includes(project.status))
      && (filterAndSortForm.filter.type.includes('ALL') || filterAndSortForm.filter.type.includes(project.type))
      && (filterAndSortForm.filter.frequency.includes('ALL') || filterAndSortForm.filter.frequency.includes(project.timeLogFrequency));
  };

  const searchCondition = (project) => {
    return isEmpty(keyword)
      || project.name.toLowerCase().includes(keyword.toLowerCase())
      || project.code.toLowerCase().includes(keyword.toLowerCase());
  };

  const renderProject = (item, index, color) => {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onItemPress(item)}
        key={index}
        style={[
          styles.viewProject,
          (index === projects.length - 1) && { marginBottom: pxPhone(80) },
          (index === 0 && { marginTop: pxPhone(1) })
        ]}>
        <View style={[styles.vertical, { backgroundColor: color }]} />
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
                <Text numberOfLines={1} style={[styles.value, { ...textStyle.semibold }]}>
                  {item.code}
                </Text>
              </View>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={styles.label}>
                {'Prefix'}
              </Text>
              <Text numberOfLines={1} style={[styles.value, { ...textStyle.semibold }]}>
                {item.ticketPrefix}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: pxPhone(14), ...textStyle.semibold }}>
              {`${item.owner}`}
            </Text>
            <Text>
              {frequencyEnum[item.timeLogFrequency]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderProjects = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewProject}
        style={styles.container}>
        {projects && orderBy(projects.filter(filterCondition), filterAndSortForm.sort.sortField)
          .filter(searchCondition)
          .map((item, index) => {
            let color = theme[item.status];
            return renderProject(item, index, color);
          })}
      </ScrollView>
    )
  }

  const renderAddButton = () => {
    return (
      <TouchableOpacity
        onPress={() => onAddNewPress()}
        activeOpacity={0.75}
        style={styles.icon}>
        <FontAwesome5
          name={'plus'}
          size={pxPhone(20)}
          color={'white'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <React.Fragment>
      <View style={styles.sectionSearch}>
        <SearchInput
          keyword={keyword}
          placeholder={'Search by Name, Code'}
          onChangeText={setKeyword}
          onRemovePress={() => setKeyword('')}
        />
        {onRenderFilterOptions()}
      </View>
      {renderProjects()}
      {projectSelected && renderModal()}
      {renderAddButton()}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  status: {
    fontWeight: 'normal',
    fontSize: pxPhone(14),
  },
  name: {
    fontSize: pxPhone(16),
    ...textStyle.bold,
    color: 'black',
  },
  viewProject: {
    margin: pxPhone(7.5),
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
    fontSize: pxPhone(14),
    ...textStyle.regular,
  },
  value: {
    marginTop: pxPhone(3),
    fontSize: pxPhone(14),
    ...textStyle.regular,
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
    fontSize: pxPhone(16),
    ...textStyle.semibold,
  },
  sectionSearch: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  viewFilterOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: pxPhone(25),
    marginRight: pxPhone(10),
    paddingHorizontal: pxPhone(10),
    borderRadius: pxPhone(16.25),
    backgroundColor: theme['color-custom-2100'],
  },
  textFilterOption: {
    fontSize: pxPhone(12),
    marginRight: pxPhone(5),
    ...textStyle.regular,
  },
  sectionFilterOption: {
    width: '90%',
    marginBottom: pxPhone(7),
    marginTop: pxPhone(3),
  },
});
