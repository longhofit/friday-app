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
import { useSelector } from 'react-redux';
import EmployeesService from './services/employees.service';

export default EmployeesScreen = (props) => {
  const [data, setData] = useState(null);
  const [reqData, setReqData] = useState(null);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const session = useSelector(state => state.session);
  const userState = useSelector(state => state.user);
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = session.accessToken;
      const employeesService = new EmployeesService();
      const response = employeesService.getAllEmployee(accessToken);
      response.then(res => {
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
      if(item.slackId) {
        count++;
      }
    })
    setData(newReqData);
    setReqData(reqDataArray);  
    if(count === newReqData.length) setIsSaveChanges(true);
        else setIsSaveChanges(false);
  }
  const onPressSaveChanges = () => {
    const accessToken = session.accessToken;
    const employeesService = new EmployeesService();
    const response = employeesService.updateSlackID(accessToken, JSON.stringify(reqData));
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
    fontSize: 20,
    marginTop: 30,
    marginLeft: 20,
  },
  viewTable:{
    borderRadius: 9,
    paddingVertical: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    borderWidth: 0.1,
    marginHorizontal: 20,
    marginTop: 30,
  },
  viewItemHeader:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewItem:{
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.1,
    paddingVertical: 10,
  },
  number:{
    width: '15%',
    textAlign: 'center',
    fontSize: 15,
  },
  employee:{
    width: '45%',
    textAlign: 'center',
    fontSize: 15,
  },
  slackId:{
    width: '50%',
    textAlign: 'center',
    fontSize: 15,
  },
  buttonSave:{
    backgroundColor: "#0052cc",
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textButton:{
    color:'white',
    fontSize: 17,
  }
});
