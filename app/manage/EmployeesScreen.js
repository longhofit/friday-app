import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import { pxPhone } from '../../core/utils/utils';
import EmployeesService from '../services/employees.service';

export default EmployeesScreen = (props) => {
  const [data, setData] = useState(null);
  const [reqData, setReqData] = useState(null);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const employeesService = new EmployeesService();
      const response = employeesService.getAllEmployee();
      response.then(res => {
        const reqDataArray = [];
        res.map((item) =>
          reqDataArray.push(
            {
              "employee": item.id,
              "slackId": item.slackId
            }
          )
        )
        setData(res);
        setReqData(reqDataArray);
      })
        .catch(e => {
          console.log("error:", e);
        })
    }
    fetchData();
  }, [])
  const onChangeSlackID = (id, slackId) => {
    const newReqData = data;
    let count = 0;
    const reqDataArray = [];
    newReqData.map((item) => {
      if (item.id === id) {
        item.slackId = slackId.length > 0 ? slackId : null;
      }
      reqDataArray.push(
        {
          "employee": item.id,
          "slackId": item.slackId
        }
      )
      count++;
    })
    setData(newReqData);
    setReqData(reqDataArray);
    if (count === newReqData.length) setIsSaveChanges(true);
    else setIsSaveChanges(false);
  }
  const onPressSaveChanges = () => {
    const employeesService = new EmployeesService();
    const response = employeesService.updateSlackID(JSON.stringify(reqData));
    response.then(res => {
      const reqDataArray = [];
      res.map((item) =>
        reqDataArray.push(
          {
            "employee": item.id,
            "slackId": item.slackId
          }
        )
      )
      setData(res);
      setReqData(reqDataArray);
      setIsSaveChanges(false);
    })
      .catch(e => {
        console.log("error:", e);
      })
  }
  const renderColumnEmployee = (column) => {
    if (column.index % 2 == 0) {
      return (
        <View style={styles.viewItem}>
          <Text style={styles.number}>{column.index + 1}</Text>
          <Text style={styles.employee}>{column.item.name}</Text>
          {(column.item.slackId == null || column.item.slackId === "") ? <TextInput
            style={styles.slackId}
            value={"Enter slackID"}
            onChangeText={(text) => onChangeSlackID(column.item.id, text)}
          /> : <TextInput
              style={styles.slackId}
              value={column.item.slackId}
              onChangeText={(text) => onChangeSlackID(column.item.id, text)}
            />}
        </View>
      );
    } else {
      return (
        <View style={styles.viewItem2}>
          <Text style={styles.number}>{column.index + 1}</Text>
          <Text style={styles.employee}>{column.item.name}</Text>
          {(column.item.slackId === null || column.item.slackId === "") ? <TextInput
            style={styles.slackId}
            value={"Enter slackID"}
            onChangeText={(text) => onChangeSlackID(column.item.id, text)}
          /> : <TextInput
              style={styles.slackId}
              value={column.item.slackId}
              onChangeText={(text) => onChangeSlackID(column.item.id, text)}
            />}
        </View>
      );
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{
        marginTop: pxPhone(20),
        paddingVertical: pxPhone(18),
        width: '90%',
        backgroundColor: 'white',
        borderRadius: pxPhone(6),
        shadowColor: '#000',
        paddingLeft:pxPhone(20),
        shadowOffset: {
          width: pxPhone(3),
          height: pxPhone(4),
        },
        shadowOpacity: pxPhone(0.25),
        shadowRadius: pxPhone(6),
        elevation: 8,
        alignSelf: 'center',
      }}>
        <Text style={styles.textHeader}>Manage Employee</Text>
      </View>
      <View style={styles.viewTable}>
        <View style={styles.viewItemHeader}>
          <Text style={[styles.number, { fontWeight: 'bold', }]}>Num</Text>
          <Text style={[styles.employee, { fontWeight: 'bold', }]}>Employee</Text>
          <Text style={[styles.slackId, { fontWeight: 'bold', }]}>SlackID</Text>
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
    backgroundColor: '#fafbfc'
  },
  textHeader: {
    fontSize: pxPhone(20),
    fontWeight: 'bold',
  },
  viewTable: {
    borderRadius: pxPhone(7),
    paddingVertical: pxPhone(10),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: pxPhone(3),
      height: pxPhone(4),
    },
    shadowOpacity: pxPhone(0.25),
    shadowRadius: pxPhone(4),
    marginHorizontal: pxPhone(20),
    marginTop: pxPhone(30),
    marginBottom: pxPhone(20),
    elevation: 8,
  },

  viewItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pxPhone(10),

  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxPhone(5),
    backgroundColor: 'white',
    borderBottomColor: 'white',
    borderTopColor: 'white',
  },
  viewItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxPhone(5),
    backgroundColor: '#E8ECF0',
    borderBottomColor: 'white',
    borderTopColor: 'white',
  },
  number: {
    width: '15%',
    textAlign: 'center',
    fontSize: pxPhone(15),
  },
  employee: {
    width: '45%',
    textAlign: 'center',
    fontSize: pxPhone(15),
  },
  slackId: {
    width: '50%',
    textAlign: 'center',
    fontSize: pxPhone(15),
  },
  buttonSave: {
    backgroundColor: "#0052cc",
    alignSelf: 'center',
    paddingHorizontal: pxPhone(20),
    paddingVertical: pxPhone(10),
    marginBottom: pxPhone(20),
    borderRadius: pxPhone(10),
  },
  textButton: {
    color: 'white',
    fontSize: pxPhone(17),
  }
});
