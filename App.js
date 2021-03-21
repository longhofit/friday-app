import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { View, LogBox, Text } from 'react-native';
import { isAuthenticated } from '@okta/okta-react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './app/LoginScreen.js';
import DashboardScreen from './app/vacation/DashboardScreen.js';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { menuItems } from './core/constant/menuSideBarConstant';
import { store, persistor } from './core/store';
import EmployeesScreen from './app/manage/EmployeesScreen.js';
import SettingScreen from './app/manage/SettingScreen.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pxPhone } from './core/utils/utils.js';
import { useDispatch } from 'react-redux';
import { clearTokens } from '@okta/okta-react-native';
import { onSetUser } from './core/store/reducer/user/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import CreatePolicyScreen from './app/CreatePolicyScreen.js';
import ProfileScreen from './app/ProfileScreen.js';
import ReportsScreen from './app/vacation/ReportsScreen.js';
import { PersistGate } from 'redux-persist/lib/integration/react';
import TimeLogCreateScreen from './app/timeLog/TimeLogCreateScreen.js';
import TimeLogScreen from './app/timeLog/TimeLogScreen.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProjectsScreen from './app/manage/Project.js';
import ProjectAddNew from './app/manage/ProjectAddNew.js';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import TimeLogEditScreen from './app/timeLog/TimeLogEditScreen.js';
import TimeLogReportScreen from './app/timeLog/TimeLogReportScreen.js';

LogBox.ignoreAllLogs();

const screenOptionsDefault = (props) => {
  return (
    {
      headerStyle: {
        backgroundColor: '#9AC4F8',
      },
      headerTitleAlign: 'center',
      headerTitleStyle: { color: 'black', fontWeight: '800' },
      headerLeft: () => {
        return (
          <Icon2
            onPress={() => props.navigation.openDrawer()}
            style={{ paddingLeft: pxPhone(18) }}
            name={'menu'}
            size={pxPhone(30)}
            color={'black'}
          />
        );
      },
    }
  )
}

const App = () => {
  const [progress, setProgress] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { authenticated } = await isAuthenticated();
      setAuthenticated(authenticated);
      setProgress(false);
    };

    setProgress(true);
    checkAuthStatus();
  }, []);

  if (progress) {
    return (
      <Spinner
        visible={progress}
        textStyle={{ color: '#FFF' }}
        color={'#0066cc'}
      />
    );
  }

  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  const myButton = (name, color, isEmploy) => {
    return <Icon name={name} size={isEmploy ? pxPhone(18) : pxPhone(22)} color={color} />;
  };

  const DrawerContent = (props) => {
    const logout = () => {
      setProgress(true);

      clearTokens()
        .then(() => {
          props.dispatch(
            onSetUser({
              name: '',
              email: '',
              sub: '',
              role: '',
            }),
          );
          props.navigation.navigate('Login');
        })
        .catch((e) => { })
        .finally(() => {
          setProgress(false);
        });
    };

    return (
      <DrawerContentScrollView style={{}}>
        <DrawerItem
          labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
          icon={() => myButton('user-circle-o')}
          label={'Profile'}
          onPress={() => {
            props.navigation.navigate('Profile');
          }}
        />
        <View
          style={{
            width: '100%',
            height: pxPhone(1),
            backgroundColor: '#F7F9FC',
          }}
        />
        {menuItems &&
          menuItems.map((item, index) => {
            return (
              <React.Fragment>
                <DrawerItem
                  labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
                  icon={() => myButton(item.iconName, null, item.name === 'Employees')}
                  key={index}
                  label={item.name}
                  onPress={() => {
                    props.navigation.navigate(item.name);
                  }}
                />
                <View
                  style={{
                    width: '100%',
                    height: pxPhone(1),
                    backgroundColor: '#F7F9FC',
                  }}
                />
              </React.Fragment>
            );
          })}
        <DrawerItem
          labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
          icon={() => myButton('power-off')}
          label={'Log out'}
          onPress={logout}
        />
        <View
          style={{
            width: '100%',
            height: pxPhone(1),
            backgroundColor: '#F7F9FC',
          }}
        />
      </DrawerContentScrollView>
    );
  };

  const Tab = createBottomTabNavigator();

  const ManageTabNavigator = () => {
    return (
      <Tab.Navigator initialRouteName={'Project'}>
        <Tab.Screen
          name="Employees"
          component={EmployeesStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              console.log(color, focused, size);
              return myButton('users', color)
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Employees'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return <Ionicons
                name={'md-settings-sharp'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Setting'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Project"
          component={ProjectStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return <Ionicons
                name={'ios-newspaper-sharp'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Projects'}
              </Text>
            },
          }}
        />
      </Tab.Navigator>
    );
  };

  const VacationTabNavigator = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            title: 'Reports',
          }}
        />
      </Tab.Navigator>
    );
  };

  const ProjectStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#9AC4F8',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: { color: 'black', fontWeight: '800' },
        }}>
        <Stack.Screen
          name="Project"
          component={ProjectsScreen}
          options={{
            title: 'Projects',
            headerLeft: () => {
              return (
                <Icon2
                  onPress={() => props.navigation.openDrawer()}
                  style={{ paddingLeft: pxPhone(18) }}
                  name={'menu'}
                  size={pxPhone(30)}
                  color={'black'}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ProjectAddNew"
          component={ProjectAddNew}
          options={{
            title: 'Add new project',
          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={screenOptionsDefault(props)}>
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    );
  };

  const EmployeesStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={screenOptionsDefault(props)}>
        <Stack.Screen
          name="Employees"
          component={EmployeesScreen}
          options={{
            title: 'Employees',
          }}
        />
      </Stack.Navigator>
    );
  };

  const VacationStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={screenOptionsDefault(props)}>
        <Stack.Screen
          name="Vacation"
          component={VacationTabNavigator}
          options={{
            title: 'Vacation',
          }}
        />
      </Stack.Navigator>
    );
  };

  const PolicyStackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#9AC4F8',
          },
          headerTintColor: 'white',
          headerBackTitle: 'Back',
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="CreatePolicy"
          component={CreatePolicyScreen}
          options={{
            title: 'Policy',
          }}
        />
      </Stack.Navigator>
    );
  };

  const TimelogTabNavigator = () => {
    return (
      <Tab.Navigator
        tabBarOptions={
          {
            activeTintColor: '#0052CC',
            inactiveTintColor: 'black',
          }
        }>
        <Tab.Screen
          name="TimeLog"
          component={TimelogStack}
          options={
            {
              title: 'TimeLog',
              tabBarIcon: ({ tintColor }) => (
                <Icon name="clock-o" color={tintColor} size={pxPhone(20)} />
              ),
            }
          }
        />
        <Tab.Screen
          name="Report"
          component={ReportTimelogStack}
          options={
            {
              title: "Report",
              tabBarIcon: ({ focused, tintColor }) => (
                <Icon focused={focused} name="line-chart" color={tintColor} size={pxPhone(20)} />
              ),
            }
          }
        />
      </Tab.Navigator>
    );
  };

  const ReportTimelogStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#9AC4F8',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: { color: 'black', fontWeight: '800' },
        }}>
        <Stack.Screen
          name="Reports"
          component={TimeLogReportScreen}
          options={{
            title: 'Reports TimeLog',
            headerLeft: () => {
              return (
                <Icon2
                  onPress={() => props.navigation.openDrawer()}
                  style={{ paddingLeft: pxPhone(18) }}
                  name={'menu'}
                  size={pxPhone(30)}
                  color={'black'}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="TimeLogEdit"
          component={TimeLogEditScreen}
          options={{
            title: 'Edit Timelog',
          }}
        />
      </Stack.Navigator>
    );
  }

  const TimelogStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#9AC4F8',
          },
          
          headerTitleAlign: 'center',
          headerTitleStyle: { color: 'black', fontWeight: '800' },
        }}>
        <Stack.Screen
          name="TimeLog"
          component={TimeLogScreen}
          options={{
            title: 'TimeLog',
            headerLeft: () => {
              return (
                <Icon2
                  onPress={() => props.navigation.openDrawer()}
                  style={{ paddingLeft: pxPhone(18) }}
                  name={'menu'}
                  size={pxPhone(30)}
                  color={'black'}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="TimeLogCreate"
          component={TimeLogCreateScreen}
          options={{
            title: 'Create Timelog',
          }}
        />
        <Stack.Screen
          name="TimeLogEdit"
          component={TimeLogEditScreen}
          options={{
            title: 'Edit Timelog',
          }}
        />
      </Stack.Navigator>
    );
  };

  const DrawerNavigator = () => {
    const dispatch = useDispatch();

    return (
      <Drawer.Navigator
        initialRouteName={authenticated ? 'Manage' : 'login'}
        drawerContent={(props) =>
          DrawerContent({ ...props, dispatch: dispatch })
        }>
        <Drawer.Screen
          key={'login'}
          name={'login'}
          component={LoginScreen}
          options={{
            swipeEnabled: false,
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Drawer.Screen
          name="Vacation"
          component={VacationStack}
        />
        <Drawer.Screen
          name="Manage"
          component={ManageTabNavigator}
        />
        <Drawer.Screen
          name="Timelog"
          component={TimelogTabNavigator}
        />
      </Drawer.Navigator>
    );
  };

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3753C7',
      accent: '#f1c40f',
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <PersistGate
          persistor={persistor}>
          <NavigationContainer >
            <DrawerNavigator />
          </NavigationContainer>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

export default App;
