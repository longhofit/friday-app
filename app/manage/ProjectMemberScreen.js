import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { isEmpty, pxPhone, showToastWithGravityAndOffset } from '../../core/utils/utils';
import ProjectService from '../services/project.service';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity as Touch } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux';
import { SearchInput } from '../components/input/inputV1.component';
import _, { set } from 'lodash'
import { yyyMMddFormatter } from '../../core/formatters';
import { textStyle } from '../components/styles/style';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { theme } from '../theme/appTheme';
import { ro } from 'date-fns/locale';

export default ProjectMemberScreen = ({ route, navigation }) => {
  const id = route.params.project.code;
  const [members, setMembers] = useState([]);
  const employeeState = useSelector(state => state.employee.employees);
  const [memberSelect, setMemberSelect] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={onEditPress}
            style={{ flex: 1, paddingRight: pxPhone(16), justifyContent: 'center', paddingBottom: pxPhone(4), }}>
            <AntDesign
              name={'edit'}
              size={pxPhone(22)}
              color={'white'}
            />
          </TouchableOpacity>
        );
      },
      headerTitle: route.params.project.name,
      headerTintColor: 'white',

    });
  }, [route]);


  useEffect(() => {
    getProjectMembers();

    return () => {
      setMembers([]);
    }
  }, [id])

  const onEditPress = () => {
    route.params.onAddOrEditProject();
  };

  const getProjectMembers = async () => {
    try {
      const projectService = new ProjectService();

      const data = await projectService.getProject(id);

      const membersTemp = [];

      console.log('employeeState', employeeState)

      data && data.members.forEach(item => {
        membersTemp.push({
          ...item,
          name: employeeState.find(employee => employee.id === item.member).name,
        });
      });

      setMembers(membersTemp);
    } catch (error) {
      console.log(error.message);
    }
  };

  const RenderRightActions = ({ progress, dragX, onPressEdit, onPressDelete, onPressLock, item }) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
    });
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.leftAction, { backgroundColor: theme["color-app"] }]}
          onPress={onPressEdit}>
          <Icon
            name={'edit'}
            size={pxPhone(24)}
            color={'white'}
            style={{ left: pxPhone(2), top: pxPhone(3) }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.leftAction, { backgroundColor: '#4D5BC8' }]}
          onPress={onPressLock}>
          <Fontisto
            name={item.active ? 'locked' : 'unlocked'}
            size={pxPhone(23)}
            color={'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.leftAction, { backgroundColor: '#D86667' }]}
          onPress={onPressDelete}>
          <Icon2
            name={'delete'}
            size={pxPhone(27)}
            color={'white'}
            style={{ top: pxPhone(1) }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // let row = [];
  // let prevOpenedRow;

  // const closeRow = (index) => {
  //   if (prevOpenedRow && prevOpenedRow !== row[index]) {
  //     prevOpenedRow.close();
  //   }
  //   prevOpenedRow = row[index];
  // }

  const renderMember = (item, index) => {
    let refMember;

    return (
      <Swipeable
        friction={2}
        ref={ref => refMember = ref}
        leftThreshold={80}
        rightThreshold={40}
        // ref={ref => row[index] = ref}
        // onSwipeableOpen={() => closeRow(index)}
        key={index}
        childrenContainerStyle={styles.memberItem}
        renderRightActions={(progress, dragX) => (
          <RenderRightActions
            item={item}
            progress={progress}
            dragX={dragX}
            onPressEdit={() => {
              onAddButtonPress(item);
              refMember.close();
            }}
            onPressDelete={() => {
              onDeleteMember(item);
              refMember.close();
            }}
            onPressLock={() => {
              onInactiveMember(item);
              refMember.close();
            }}
          />
        )}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => refMember.openRight()}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingVertical: pxPhone(5) }}>
            <Text style={styles.name}>
              {item.name}
            </Text>
            {/* <Entypo
              onPress={() => setMemberSelect(item)}
              name={'dots-three-vertical'}
              size={pxPhone(15)}
              color={'gray'}
            /> */}
            {memberSelect && memberSelect.member === item.member && <View style={styles.option}>
              <Touch onPress={onDeleteMember}>
                <Text
                  style={[styles.txtOption, { color: 'red' }]}>
                  {'Delete'}
                </Text>
              </Touch>
              {<Touch
                onPress={onInactiveMember}
                style={{ paddingTop: pxPhone(7) }}>
                <Text style={[styles.txtOption, { color: '#D86667' }]}>
                  {item.active ? 'Freeze' : 'Unfreeze'}
                </Text>
              </Touch>}
            </View>}
          </View>
          <Text style={styles.txtRole}>
            {item.role}
          </Text>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingVertical: pxPhone(5) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <AntDesign
                name={item.active ? 'check' : 'close'}
                size={pxPhone(15)}
                color={item.active ? 'green' : 'red'}
              />
              <Text style={[
                { color: item.active ? 'green' : 'red' },
                styles.txtStatus,
              ]}>
                {item.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <Text style={styles.txtLabel}>
              <Text style={{ color: 'gray' }}>
                {'Comment: '}
              </Text>
              {item.comment ? item.comment : 'None'}
            </Text>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.txtLabel}>
              <Text style={{ color: 'gray' }}>
                {'On Board: '}
              </Text>
              {item.onBoardDate}
            </Text>
            {<Text style={styles.txtLabel}>
              <Text style={{ color: 'gray' }}>
                {'Off Board: '}
              </Text>
              {item.offBoardDate ? item.offBoardDate : 'None'}
            </Text>}
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  };

  const onAddButtonPress = (member) => {
    navigation.navigate('MemberAddNew', { id, onAddMemmberSuccess, member, onUpdateMember });
  };

  const onAddMemmberSuccess = (member) => {
    setMembers([member, ...members]);
    setTimeout(() => {
      scrollView.current?.scrollTo({ x: 0 })
    }, 500);
  };

  const onRefresh = () => {
    getProjectMembers();
  };

  const onDeleteMember = async (item) => {
    try {
      const projectService = new ProjectService();
      await projectService.deleteMember(id, [item.member]);
      showToastWithGravityAndOffset('Delete successfully')
      setMemberSelect(undefined);
      const newMembers = members.filter(member => member.member !== item.member)
      setMembers(newMembers);
    } catch (error) {
      showToastWithGravityAndOffset(error.message);
    }
  };

  const onInactiveMember = async (item) => {
    try {
      const projectService = new ProjectService();
      let body = item;
      body = { ...body, active: !item.active, offBoardDate: item.active ? yyyMMddFormatter(new Date()) : '' };
      await projectService.updateMember([body], id);
      let newMembers = members.filter(item => item.member !== body.member);
      setMembers([body, ...newMembers]);
      scrollView.current?.scrollTo({ x: 0 })
      showToastWithGravityAndOffset('Update member successfully.')
      setMemberSelect(undefined);
    } catch (error) {
      showToastWithGravityAndOffset(error.message)
    }
  };

  const onUpdateMember = async (form, navigation) => {
    try {
      const projectService = new ProjectService();
      const data = await projectService.updateMember([form], id);
      if (data) {
        let newMembers = members.filter(item => item.member !== form.member);
        setMembers([form, ...newMembers]);
        setTimeout(() => {
          scrollView.current?.scrollTo({ x: 0 })
        }, 500);
        navigation.navigate('Members');
        showToastWithGravityAndOffset('Update member successfully.')
      } else {
        showToastWithGravityAndOffset('Update member not successfully.')
      }
    } catch (error) {
      showToastWithGravityAndOffset(error.message)
    }
  };

  const orderByDate = (members) => {
    // return _.orderBy(members, ['member'], ['desc']);
    return members.reverse();
  };

  const searchCondition = (member) => {
    return isEmpty(keyword)
      || member.name.toLowerCase().includes(keyword.toLowerCase())
      || member.role.toLowerCase().includes(keyword.toLowerCase());
  };

  const [keyword, setKeyword] = useState('');

  const scrollView = React.useRef(undefined);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SearchInput
        style={styles.searchInput}
        keyword={keyword}
        placeholder={'Search by Name, Role'}
        onChangeText={setKeyword}
        onRemovePress={() => setKeyword('')}
      />
      <ScrollView
        ref={scrollView}
        refreshControl={<RefreshControl
          refreshing={false}
          onRefresh={onRefresh}
        />}
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {members.length === 0 && <Text style={{ fontWeight: 'bold', fontSize: pxPhone(18), marginLeft: pxPhone(15), marginTop: pxPhone(15) }}>{'No members were found, go to adding new member.'}</Text>}
        <View style={{ paddingBottom: pxPhone(70) }}>
          {members.filter(searchCondition).map((item, index) => {
            return renderMember(item, index);
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => onAddButtonPress(undefined)}
        activeOpacity={0.75}
        style={styles.icon}>
        <FontAwesome5
          name={'plus'}
          size={pxPhone(20)}
          color={'white'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: pxPhone(2),
    backgroundColor: 'white',
  },
  icon: {
    position: 'absolute',
    bottom: pxPhone(10),
    right: pxPhone(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme["color-app"],
    borderRadius: pxPhone(50 / 2),
    width: pxPhone(50),
    height: pxPhone(50),
  },
  memberItem: {
    borderBottomWidth: pxPhone(1),
    borderColor: '#BDBDBD',
    padding: pxPhone(12),
    backgroundColor: 'white',
  },
  name: {
    fontSize: pxPhone(16),
    ...textStyle.bold,
    color: 'black',
  },
  option: {
    position: 'absolute',
    padding: pxPhone(12),
    right: pxPhone(10),
    top: pxPhone(22),
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
    zIndex: 1,
  },
  txtOption: {
    fontSize: pxPhone(14),
    textAlign: 'center',
  },
  searchInput: {
    width: '95%',
    alignSelf: 'center',
  },
  txtRole: {
    fontSize: pxPhone(14),
    ...textStyle.semibold,
    color: 'black',
  },
  txtStatus: {
    marginLeft: pxPhone(5),
    fontSize: pxPhone(14),
    ...textStyle.bold,
  },
  txtLabel: {
    color: 'black',
    fontSize: pxPhone(14),
    ...textStyle.regular,
  },
  viewEditDelete: {
    flexDirection: 'row',
  },
  leftAction: {
    height: '100%',
    justifyContent: 'center',
    width: pxPhone(70),
    alignItems: 'center',
  },
  txtAction: {
    color: 'white',
    fontSize: pxPhone(13),
    ...textStyle.regular,
  },
});
