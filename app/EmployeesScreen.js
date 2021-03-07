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
} from 'react-native';
import { pxPhone } from '../core/utils/utils';
import EmployeesService from './services/employees.service';

export default EmployeesScreen = (props) => {
  const [data, setData] = useState(null);
  const [reqData, setReqData] = useState(null);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const employeesService = new EmployeesService();
      const response = employeesService.getAllEmployee();
      response.then(res => {
        console.log("res:", res);
        const reqDataArray = [];
          res.map((item) => 
            reqDataArray.push(
              {
                "employee" : item.id,
                "slackId" : item.slackId
              }
            )
          )
        setData(res);
        setReqData(reqDataArray);
      })
      .catch(e => {
        console.log("error:",e);
      })
    }
    fetchData();
  }, [])
  const onChangeSlackID = (id, slackId) => {
    const newReqData = data;
    let count = 0;
    const reqDataArray = [];
    newReqData.map((item) => {
      if(item.id === id){
        item.slackId = slackId.length > 0 ? slackId : null;
      }
      reqDataArray.push(
        {
          "employee" : item.id,
          "slackId" : item.slackId
        }
      )
      count++;
    })
    setData(newReqData);
    setReqData(reqDataArray);  
    if(count === newReqData.length) setIsSaveChanges(true);
        else setIsSaveChanges(false);
  }
  const onPressSaveChanges = () => {
    const employeesService = new EmployeesService();
    const response = employeesService.updateSlackID(JSON.stringify(reqData));
    response.then(res=>{
      const reqDataArray = [];
          res.map((item) => 
            reqDataArray.push(
              {
                "employee" : item.id,
                "slackId" : item.slackId
              }
            )
          )
        setData(res);
        setReqData(reqDataArray);
      setIsSaveChanges(false);
    })
    .catch(e =>{
      console.log("error:",e);
    })
  }
  const renderColumnEmployee = (column) => {
    return (<View style={styles.viewItem}>
      <Text style={styles.number}>{column.index + 1}</Text>
      <Text style={styles.employee}>{column.item.name}</Text>
      <TextInput style={styles.slackId} value={column.item.slackId} onChangeText={text => onChangeSlackID(column.item.id, text)}/>
    </View>
    );
  };
  return (
    <ScrollView style = {styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.textHeader}>Manage Employee</Text>
      
      <View style={styles.viewTable}>
        <View style={styles.viewItemHeader}>
          <Text style={styles.number}>Num</Text>
          <Text style={styles.employee}>Employee</Text>
          <Text style={styles.slackId}>SlackID</Text>
        </View>
        <FlatList 
          data={data}
          extraData={data}
          renderItem={(item) => {
            return renderColumnEmployee(item);
          }}
        />
        {isSaveChanges ? <TouchableOpacity style={styles.buttonSave} onPress={onPressSaveChanges}>
          <Text style={styles.textButton}>SAVE CHANGES</Text>
        </TouchableOpacity> : null}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // backgroundColor: '#FFFFFF',
    // paddingBottom: 50,
    backgroundColor: '#fafbfc'
  },
  textHeader: {
    fontSize: pxPhone(20),
    marginTop: pxPhone(30),
    marginLeft: pxPhone(20),
  },
  viewTable:{
    borderRadius: pxPhone(7),
    paddingVertical: pxPhone(10),
    paddingHorizontal: pxPhone(10),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(7),
    borderWidth: pxPhone(0.1),
    marginHorizontal: pxPhone(20),
    marginTop: pxPhone(30),
    marginBottom: pxPhone(20),
  },
  viewItemHeader:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewItem:{
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: pxPhone(0.1),
    paddingVertical: pxPhone(10),
  },
  number:{
    width: '15%',
    textAlign: 'center',
    fontSize: pxPhone(15),
  },
  employee:{
    width: '45%',
    textAlign: 'center',
    fontSize: pxPhone(15),
  },
  slackId:{
    width: '50%',
    textAlign: 'center',
    fontSize: pxPhone(15),
  },
  buttonSave:{
    backgroundColor: "#0052cc",
    alignSelf: 'center',
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(10),
    marginBottom: pxPhone(20),
  },
  textButton:{
    color:'white',
    fontSize: pxPhone(17),
  }
});
