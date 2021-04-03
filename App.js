import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { LogBox, Text, Image, StyleSheet } from 'react-native';
import { isAuthenticated } from '@okta/okta-react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './app/LoginScreen.js';
import DashboardScreen from './app/vacation/DashboardScreen.js';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { menuItems } from './core/constant/menuSideBarConstant';
import { store, persistor } from './core/store';
import EmployeesScreen from './app/manage/EmployeesScreen.js';
import SettingScreen from './app/manage/SettingScreen.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pxPhone } from './core/utils/utils.js';
import { useDispatch, useSelector } from 'react-redux';
import { clearTokens } from '@okta/okta-react-native';
import { onSetUser } from './core/store/reducer/user/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import CreatePolicyScreen from './app/CreatePolicyScreen.js';
import ProfileScreen from './app/ProfileScreen.js';
import ReportsScreen from './app/vacation/ReportsScreen.js';
import { PersistGate } from 'redux-persist/lib/integration/react';
import TimeLogCreateScreen from './app/TimeLog/TimeLogCreateScreen.js';
import TimeLogScreen from './app/TimeLog/TimeLogScreen.js';
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
import SortScreen from './app/manage/SortScreen.js';
import { textStyle } from './app/components/styles/style.js';
import SortTimeLog from './app/TimeLog/SortScreen.js';
import { theme } from './app/theme/appTheme.js';
import RNBootSplash from "react-native-bootsplash";

LogBox.ignoreAllLogs();

const screenOptionsDefault = (props) => {
  return (
    {
      headerStyle: styles.headerStyle,
      headerTitleAlign: 'center',
      headerTitleStyle: styles.txtTitle,
      headerLeft: () => {
        return (
          <Icon2
            onPress={() => props.navigation.openDrawer()}
            style={{ paddingLeft: pxPhone(18) }}
            name={'menu'}
            size={pxPhone(30)}
            color={'white'}
          />
        );
      },
    }
  )
}

const App = () => {
  let roleUser = store.getState().user.role;
  const [progress, setProgress] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    RNBootSplash.hide({ fade: true }); // fade

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
        color={theme["color-app"]}
      />
    );
  }

  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();
  const Tab = createMaterialTopTabNavigator();

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

    const indexFocus = props.state.index;

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
        {menuItems &&
          menuItems.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <DrawerItem
                  focused={indexFocus === item.routeIndex}
                  activeTintColor={theme["color-app"]}
                  pressColor={theme["color-app"]}
                  labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
                  icon={({ color }) => <Icon name={item.iconName} size={pxPhone(22)} color={color} />}
                  key={index}
                  label={item.name}
                  onPress={() => {
                    item.name === 'Log out' ? logout() : props.navigation.navigate(item.name);
                  }}
                />
              </React.Fragment>
            );
          })}
      </DrawerContentScrollView>
    );
  };

  const ManageTabNavigator = () => {
    roleUser = store.getState().user.role;
    return (
      <Tab.Navigator
        tabBarOptions={{
          showIcon: true,
          activeTintColor: theme["color-active"],
          inactiveTintColor: 'gray',
          contentContainerStyle: { height: pxPhone(55) },
          indicatorStyle: { backgroundColor: theme["color-active"] },
        }}
        tabBarPosition={'bottom'}
        initialRouteName={'Project'}>
        <Tab.Screen
          name="Project"
          component={ProjectStack}
          options={{
            tabBarIcon: ({ color }) => {
              return <Ionicons
                name={'ios-newspaper-sharp'}
                size={pxPhone(22)}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold }}>
                {'Projects'}
              </Text>
            },
          }}
        />
        {(roleUser === 'hr' || roleUser === 'manage') && <Tab.Screen
          name="Settings"
          component={SettingStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons
                name={'md-settings-sharp'}
                size={pxPhone(23)}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold, paddingBottom: pxPhone(2) }}>
                {'Setting'}
              </Text>
            },
          }}
        />}
        {(roleUser === 'hr' || roleUser === 'manage') && <Tab.Screen
          name="Employees"
          component={EmployeesStack}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return <Icon name={'users'} size={pxPhone(20)} color={color} />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold, paddingBottom: pxPhone(2) }}>
                {'Employees'}
              </Text>
            },
          }}
        />}
      </Tab.Navigator>
    );
  };

  const VacationTabNavigator = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          showIcon: true,
          activeTintColor: theme["color-active"],
          inactiveTintColor: 'gray',
          contentContainerStyle: { height: pxPhone(55) },
        }}
        tabBarPosition={'bottom'}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color }) => {
              return <Icon
                name={'calendar-o'}
                size={pxPhone(22)}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold, paddingBottom: pxPhone(2) }}>
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
                style={{ bottom: pxPhone(-2) }}
                name={'line-chart'}
                size={pxPhone(22)}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold, paddingBottom: pxPhone(2) }}>
                {'Reports'}
              </Text>
            },
          }}
        />
      </Tab.Navigator>
    );
  };

  const TimelogTabNavigator = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          showIcon: true,
          activeTintColor: theme["color-active"],
          inactiveTintColor: 'gray',
          contentContainerStyle: { height: pxPhone(55) },
        }}
        tabBarPosition={'bottom'}>
        <Tab.Screen
          name="TimeLog"
          component={TimelogStack}
          options={{
            tabBarIcon: ({ color }) => {
              return <Icon
                name={'clock-o'}
                size={pxPhone(22)}
                color={color}
              />
            },
            tabBarLabel: ({ focused, color, position }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold, paddingBottom: pxPhone(2) }}>
                {'TimeLog'}
              </Text>
            },
          }}
        />
        <Tab.Screen
          name="Report"
          component={ReportTimelogStack}
          options={{
            tabBarIcon: ({ color }) => {
              return <Icon
                name={'line-chart'}
                size={pxPhone(22)}
                color={color}
              />
            },
            tabBarLabel: ({ color }) => {
              return <Text style={{ color, fontSize: pxPhone(12), ...textStyle.semibold, paddingBottom: pxPhone(2) }}>
                {'Report'}
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
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.txtTitle,
          ...TransitionPresets.SlideFromRightIOS,
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
                  color={'white'}
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
                  color={'white'}
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
            ...TransitionPresets.SlideFromRightIOS,
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
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="FilterAndSort"
          component={FilterAndSortTab}
          options={{
            title: 'Filter and Sort',
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="Picker"
          component={PickerComponent}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </Stack.Navigator>
    );
  };

  const FilterAndSortTab = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: styles.headerStyle,
          labelStyle: styles.txtTitleFilter,
        }}
      >
        <Tab.Screen name="Filter" component={FilterProject} />
        <Tab.Screen name="Sort" component={SortScreen} />
      </Tab.Navigator>
    );
  }

  const FilterAndSortTabTimeLog = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: styles.headerStyle,
          labelStyle: styles.txtTitleFilter,
        }}>
        <Tab.Screen name="Filter" component={FilterTimeLog} />
        <Tab.Screen name="Sort" component={SortTimeLog} />
      </Tab.Navigator>
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
          headerStyle: styles.headerStyle,
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

  const ReportTimelogStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.txtTitle,
          ...TransitionPresets.SlideFromRightIOS,
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
                  color={'white'}
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
                  color={'white'}
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
        <Stack.Screen
          name="Picker"
          component={PickerComponent}
        />
      </Stack.Navigator>
    );
  }

  const TimelogStack = (props) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,

          headerTitleAlign: 'center',
          headerTitleStyle: styles.txtTitle,
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
                  color={'white'}
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
    roleUser = useSelector(state => state.user.role);
    return (
      <Drawer.Navigator
        initialRouteName={!authenticated ? 'login' : 'Timelog'}
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
          name="Timelog"
          component={TimelogTabNavigator}
        />
        <Drawer.Screen
          name="Vacation"
          component={VacationStack}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Drawer.Screen
          name="Manage"
          component={ManageTabNavigator}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </Drawer.Navigator>
    );
  };

  const themeProvider = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: styles.headerStyle,
      accent: '#f1c40f',
    },
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={themeProvider}>
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

const styles = StyleSheet.create({
  txtTitle: {
    fontSize: pxPhone(18),
    ...textStyle.bold,
    color: 'white',
  },
  txtTitleFilter: {
    fontSize: pxPhone(16),
    ...textStyle.semibold,
    color: 'white',
  },
  headerStyle: {
    backgroundColor: theme["color-app"],
  },
});

export default App;
