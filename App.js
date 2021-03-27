import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { View, LogBox, Text, Image } from 'react-native';
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
import AntDesign from 'react-native-vector-icons/AntDesign'
import { pxPhone } from './core/utils/utils.js';
import { useDispatch } from 'react-redux';
import { clearTokens } from '@okta/okta-react-native';
import { onSetUser } from './core/store/reducer/user/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import CreatePolicyScreen from './app/CreatePolicyScreen.js';
import ProfileScreen from './app/ProfileScreen.js';
import ReportsScreen from './app/vacation/ReportsScreen.js';
import { PersistGate } from 'redux-persist/lib/integration/react';
import TimeLogCreateScreen from './app/TimeLog/TimeLogCreateScreen.js';
import TimeLogScreen from './app/TimeLog/TimeLogScreen.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProjectsScreen from './app/manage/Project.js';
import ProjectAddNew from './app/manage/ProjectAddNew.js';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import TimeLogEditScreen from './app/TimeLog/TimeLogEditScreen.js';
import TimeLogReportScreen from './app/TimeLog/TimeLogReportScreen.js';
import ProjectMemberScreen from './app/manage/ProjectMemberScreen.js';
import MemberAddNew from './app/manage/MemberAddNew.js';
import { logo } from './app/assets/images';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FilterProject from './app/manage/FilterScreen.js';
import PickerComponent from './app/components/picker/picker.component.js';
import { DynamicStatusBar } from './app/components/dynamicStatusBar/dynamicStatusBar.component.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Feather from 'react-native-vector-icons/Feather';
import FilterTimeLog from './app/TimeLog/FilterScreen';
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
  const [focusDrawer, setFocusDrawer] = useState('Timelog');

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { authenticated } = await isAuthenticated();
      setAuthenticated(authenticated);
      setProgress(false);
    };

    setProgress(true);
    checkAuthStatus();
    return () => {
      //logout()
    };
  }, []);

  if (progress) {
    return (
      <Spinner
        overlayColor={'transparent'}
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
      console.log('log')
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
          props.navigation.navigate('login');
        })
        .catch((e) => { })
        .finally(() => {
          setProgress(false);
        });
    };

    return (
      <DrawerContentScrollView style={{ padding: 0, margin: 0 }}>
        <Image
          style={{
            width: pxPhone(50) * (446 / 160),
            height: pxPhone(50),
            alignSelf: 'center',
          }}
          source={logo.imageSource}
        />
        <DrawerItem
          focused={focusDrawer === 'Profile'}
          labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
          icon={() => myButton('user-circle-o')}
          label={'Profile'}
          onPress={() => {
            setFocusDrawer('Profile');
            props.navigation.navigate('Profile');
          }}
        />
        {menuItems &&
          menuItems.map((item, index) => {
            return (
              <React.Fragment>
                <DrawerItem
                  pressColor={'#0066cc'}
                  focused={focusDrawer === item.name}
                  labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
                  icon={() => myButton(item.iconName, focusDrawer === item.name ? '#0066cc' : 'black', item.name === 'Employees')}
                  key={index}
                  label={item.name}
                  onPress={() => {
                    setFocusDrawer(item.name);
                    props.navigation.navigate(item.name);
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
      </DrawerContentScrollView>
    );
  };

  const Tab = createBottomTabNavigator();

  const ManageTabNavigator = () => {
    return (
      <Tab.Navigator initialRouteName={'Project'}>
        <Tab.Screen
          name="Project"
          component={ProjectStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons
                name={'ios-newspaper-sharp'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Projects'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons
                name={'md-settings-sharp'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Setting'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Employees"
          component={EmployeesStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              console.log(color, focused, size);
              return myButton('users', color)
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Employees'}
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
            tabBarIcon: ({ color, focused, size }) => {
              return <Icon
                name={'calendar-o'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Absence'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return <Icon
                name={'line-chart'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Reports'}
              </Text>
            },
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
            headerRight: () => {
              return (
                <Feather
                  onPress={() => props.navigation.navigate('FilterAndSort')}
                  style={{ paddingRight: pxPhone(18) }}
                  name={'filter'}
                  size={pxPhone(25)}
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

        <Stack.Screen
          name="Members"
          component={ProjectMemberScreen}
          options={{
            title: 'Project members',
          }}
        />

        <Stack.Screen
          name="MemberAddNew"
          component={MemberAddNew}
          options={{
            title: 'Add new member',
          }}
        />
        <Stack.Screen
          name="FilterAndSort"
          component={FilterAndSortTab}
          options={{
            title: 'Filter and Sort',
          }}
        />
        <Stack.Screen
          name="Picker"
          component={PickerComponent}
        />
      </Stack.Navigator>
    );
  };

  const TabView = createMaterialTopTabNavigator();

  const FilterAndSortTab = () => {
    return (
      <TabView.Navigator
        tabBarOptions={{
          style: { backgroundColor: '#9AC4F8' },
        }}>
        <TabView.Screen name="Filter" component={FilterProject} />
        <TabView.Screen name="Sort" component={FilterProject} />
      </TabView.Navigator>
    );
  }

  const FilterAndSortTabTimeLog = () => {
    return (
      <TabView.Navigator
        tabBarOptions={{
          style: { backgroundColor: '#9AC4F8' },
        }}>
        <TabView.Screen name="Filter" component={FilterTimeLog} />
        <TabView.Screen name="Sort" component={FilterTimeLog} />
      </TabView.Navigator>
    );
  }

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
      <Tab.Navigator>
        <Tab.Screen
          name="TimeLog"
          component={TimelogStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return <Icon
                name={'clock-o'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'TimeLog'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Report"
          component={ReportTimelogStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return <Icon
                name={'line-chart'}
                size={size}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12) }}>
                {'Report'}
              </Text>
            },
          }}
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
            headerRight: () => {
              return (
                <Feather
                  onPress={() => props.navigation.navigate('FilterAndSortTimeLog')}
                  style={{ paddingRight: pxPhone(18) }}
                  name={'filter'}
                  size={pxPhone(25)}
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
        <Stack.Screen
          name="FilterAndSortTimeLog"
          component={FilterAndSortTabTimeLog}
          options={{
            title: 'Filter and Sort',
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
        initialRouteName={!authenticated ? 'login' : 'Manage'}
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
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <PersistGate
            persistor={persistor}>
            <DynamicStatusBar barStyle='light-content' />
            <NavigationContainer >
              <DrawerNavigator />
            </NavigationContainer>
          </PersistGate>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
