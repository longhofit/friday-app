import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import ProfileService from './services/profile.service';
import { pxPhone } from '../core/utils/utils';
import {
  IconAvatarAnonymous,
} from './assets/icons';
export default ProfileScreen = (props) => {
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const fetchData = () => {
      const profileService = new ProfileService();
      const response = profileService.getEmployee();
      response.then((res) => {
        console.log(res.employee);
        setUserInfo(res.employee);
      })
        .catch((e) => {
          console.log('error:', e);
        });
    };
    fetchData();
  }, []);
  const onPressSaveChanges = () => {
    const profileService = new ProfileService();
    const newSlackId = userInfo.slackId;
    const response = profileService.updateMySlackID(JSON.stringify({ "slackId": newSlackId }));
    response.then((res) => {
      Alert.alert("Update profile successfully!");
    })
      .catch((e) => {
        Alert.alert("something went wrong!");
        console.log('error:', e);
      });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewAvatar}>
        <TouchableOpacity>
          {IconAvatarAnonymous({
            width: pxPhone(150),
            height: pxPhone(150),
            borderRadius: pxPhone(75),
            backgroundColor: 'white',
          })}
        </TouchableOpacity>
      </View>
      <View style={styles.userInformation}>
        <View style={styles.itemInfo}>
          <Text style={styles.textHeader}>Name</Text>
          <Text style={styles.textValue}>{userInfo && userInfo.name}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.textHeader}>Phone Number</Text>
          <Text style={styles.textValue}>{userInfo && userInfo.phoneNumber}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.textHeader}>Date Of Birth</Text>
          <Text style={styles.textValue}>{userInfo && userInfo.dateOfBirth}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.textHeader}>SlackId</Text>
          <TextInput style={styles.textValue} value={userInfo && userInfo.slackId}
            onChangeText={(slackId) => setUserInfo({ ...userInfo, slackId: slackId })}></TextInput>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonSave} onPress={onPressSaveChanges}>
        <Text style={styles.textButton}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  viewAvatar: {
    width: '100%',
    height: pxPhone(250),
    backgroundColor: '#9AC4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: pxPhone(150),
    height: pxPhone(150),
    borderRadius: pxPhone(75),
    backgroundColor: 'white',
  },
  userInformation: {
    marginHorizontal: pxPhone(30),
    marginTop: pxPhone(10),
    marginBottom: pxPhone(30),
  },
  itemInfo: {
    marginTop: pxPhone(20),
  },
  textHeader: {
    color: 'darkgray',
  },
  textValue: {
    fontWeight: 'bold',
    fontSize: pxPhone(18),
    marginTop: pxPhone(5),
    borderWidth: pxPhone(1),
    borderColor: 'white',
    borderBottomColor: 'gray',
  },
  buttonSave: {
    marginBottom: pxPhone(30),
    marginTop: pxPhone(20),
    alignSelf: 'center',
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(8),
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#3753C7',
    borderRadius: pxPhone(5),
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: pxPhone(20),
    color: 'white',
  },
});
