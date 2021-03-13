import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { View, Text, LogBox } from 'react-native';
import { isAuthenticated } from '@okta/okta-react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './app/LoginScreen.js';
import DashboardScreen from './app/DashboardScreen.js';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { menuItems } from './core/constant/menuSideBarConstant'
import { store } from './core/store';
import EmployeesScreen from './app/EmployeesScreen.js';
import SettingScreen from './app/SettingScreen.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { pxPhone } from './core/utils/utils.js';
import { useDispatch } from 'react-redux';
import { clearTokens } from '@okta/okta-react-native';
import { onSetUser } from './core/store/reducer/user/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import CreatePolicyScreen from './app/CreatePolicyScreen.js';
import ProfileScreen from './app/ProfileScreen.js';
import Reports from './app/ReportsScreen.js';

LogBox.ignoreAllLogs()

const App = () => {
  const [progress, setProgress] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { authenticated } = await isAuthenticated();
      setAuthenticated(authenticated);
      setProgress(false);
    }

    setProgress(true);
    checkAuthStatus();
  }, []);

  if (progress) {
    return (
      <Spinner
        visible={progress}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    )
  }

  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  const myButton = (name, color) => {
    return (
      <Icon
        name={name}
        size={pxPhone(22)}
        color={color}
      />
    )
  };

  const DrawerContent = (props) => {
    const logout = () => {
      setProgress(true);

      clearTokens()
        .then(() => {
          props.dispatch(onSetUser({
            name: '',
            email: '',
            sub: '',
            role: '',
          }))
          props.navigation.navigate('Login');
        })
        .catch(e => {
        })
        .finally(() => {
          setProgress(false);
        });
    };

    return (
      <DrawerContentScrollView style={{ backgroundColor: '#9AC4F8' }}>
        <DrawerItem
          key={'profile'}
          labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(25) }}
          icon={() => myButton('user-circle-o')}
          label={'Profile'}
          onPress={() => {
            props.navigation.navigate("Profile");
          }}
        />
        <View key={'view1'} style={{ width: '100%', height: pxPhone(1), backgroundColor: '#F7F9FC' }} />
        {menuItems && menuItems.map((item, index) => {
          return (
            <React.Fragment>
              <DrawerItem
                labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
                icon={() => myButton(item.iconName)}
                key={index}
                label={item.name}
                onPress={() => {
                  props.navigation.navigate(item.name);
                }}
              />
              <View key={item.name} style={{ width: '100%', height: pxPhone(1), backgroundColor: '#F7F9FC' }} />
            </React.Fragment>
          );
        })}
        <DrawerItem
          key={'logout'}
          labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
          icon={() => myButton('power-off')}
          label={'Log out'}
          onPress={logout}
        />
        <View key={'view2'} style={{ width: '100%', height: pxPhone(1), backgroundColor: '#F7F9FC' }} />
      </DrawerContentScrollView>
    );
  }



  const MainStackNavigator = (props) => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#9AC4F8",
          },
          headerBackTitle: "Back",
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
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
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
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="Employees"
          component={EmployeesScreen}
          options={{
            title: 'Employees',
          }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            title: 'Setting',
          }}
        />
        <Stack.Screen
          name="Reports"
          component={Reports}
          options={{
            title: 'Reports',
          }}
        />
      </Stack.Navigator>
    );
  }

  const PolicyStackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#9AC4F8",
          },
          headerTintColor: "white",
          headerBackTitle: "Back",
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="CreatePolicy"
          component={CreatePolicyScreen}
          options={{
            title: 'Policy',
          }}
        />
      </Stack.Navigator>
    );
  }

  const DrawerNavigator = (props) => {
    const dispatch = useDispatch();

    return (
      <Drawer.Navigator
        drawerContent={props => DrawerContent({ ...props, dispatch: dispatch })}>
        <Drawer.Screen
          key={'login'}
          name="Login"
          component={LoginScreen}
          options={{
            swipeEnabled: false,
          }}
        />
        <Drawer.Screen
          key={'Policy'}
          name="Policy"
          component={PolicyStackNavigator}
        />
        <Drawer.Screen
          key={'Main'}
          name="Main"
          component={MainStackNavigator}
        />
      </Drawer.Navigator>
    );
  }


  return (
    <Provider store={store}>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </Provider>
  )
};

export default App;
