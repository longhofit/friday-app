import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { isEmpty, pxPhone, showToastWithGravityAndOffset } from '../../core/utils/utils';
import ProjectService from '../services/project.service';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity as Touch } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux';
import { SearchInput } from '../components/input/inputV1.component';
import _, { set } from 'lodash'
import { yyyMMddFormatter } from '../../core/formatters';

export default ProjectMemberScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [members, setMembers] = useState([]);
  const employeeState = useSelector(state => state.employee.employees);
  const [memberSelect, setMemberSelect] = useState();

  useEffect(() => {
    getProjectMembers();

    return () => {
      setMembers([]);
    }
  }, [id])

  const getProjectMembers = async () => {
    try {
      const projectService = new ProjectService();

      const data = await projectService.getProject(id);

      const membersTemp = [];

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

  const renderMember = (item, index) => {
    return (
      <View
        key={index}
        style={styles.memberItem}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingVertical: pxPhone(5) }}>
          <Text style={styles.name}>
            {item.name}
          </Text>
          <Entypo
            onPress={() => setMemberSelect(item)}
            name={'dots-three-vertical'}
            size={pxPhone(15)}
            color={'gray'}
          />
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
        <Text>
          {item.role}
        </Text>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingVertical: pxPhone(5) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <AntDesign
              name={item.active ? 'check' : 'close'}
              size={pxPhone(15)}
              color={item.active ? 'green' : 'red'}
            />
            <Text style={{ fontWeight: 'bold', color: item.active ? 'green' : 'red', marginLeft: pxPhone(5) }}>
              {item.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <Text >
            <Text style={{ color: 'gray' }}>
              {'Comment: '}
            </Text>
            {item.comment ? item.comment : 'None'}
          </Text>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text >
            <Text style={{ color: 'gray' }}>
              {'On Boarding: '}
            </Text>
            {item.onBoardDate}
          </Text>
          {<Text >
            <Text style={{ color: 'gray' }}>
              {'Off Boarding: '}
            </Text>
            {item.offBoardDate ? item.offBoardDate : 'None'}
          </Text>}
        </View>
      </View>
    )
  };

  const onAddButtonPress = () => {
    navigation.navigate('MemberAddNew', { id, onAddMemmberSuccess });
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

  const onDeleteMember = async () => {
    try {
      const projectService = new ProjectService();
      const data = await projectService.deleteMember(id, [memberSelect.member]);
      showToastWithGravityAndOffset('Delete successfully')
      setMemberSelect(undefined);
      const newMembers = members.filter(item => item.member !== memberSelect.member)
      setMembers(newMembers);
    } catch (error) {
      showToastWithGravityAndOffset(error.message);
    }
  };

  const onInactiveMember = async () => {
    try {
      const projectService = new ProjectService();
      let body = memberSelect;
      body = { ...body, active: !memberSelect.active, offBoardDate: memberSelect.active ? yyyMMddFormatter(new Date()) : '' };
      data = await projectService.updateMember([body], id);

      let newMembers = members.filter(item => item.member !== body.member);
      setMembers([body, ...newMembers]);
      scrollView.current?.scrollTo({ x: 0 })
      // navigation.navigate('Members');
      showToastWithGravityAndOffset('Update member successfully.')
      setMemberSelect(undefined);
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
        onPress={onAddButtonPress}
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
    backgroundColor: '#3753C7',
    borderRadius: pxPhone(50 / 2),
    width: pxPhone(50),
    height: pxPhone(50),
  },
  memberItem: {
    borderBottomWidth: pxPhone(1),
    borderColor: '#BDBDBD',
    padding: pxPhone(12),
  },
  name: {
    fontWeight: 'bold',
    fontSize: pxPhone(18),
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
});
