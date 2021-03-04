/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { View, Text, LogBox } from 'react-native';
import { isAuthenticated } from '@okta/okta-react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoginScreen from './app/LoginScreen.js';
import DashboardScreen from './app/DashboardScreen.js';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { menuItems } from './core/constant/menuSideBarConstant'
import { store } from './core/store';
import EmployeesScreen from './app/EmployeesScreen.js';

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
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  const DrawerContent = (props) => {
    return (
      <DrawerContentScrollView>
        {menuItems && menuItems.map((item, index) => {
          return (
            <DrawerItem
              key={index}
              focused={index === 0}
              label={item}
              onPress={() => props.navigation.navigate(item)}
            />
          );
        })}
      </DrawerContentScrollView>
    );
  }



  const MainStackNavigator = () => {
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
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
          }}
        />
        <Stack.Screen
          name="Employees"
          component={EmployeesScreen}
          options={{
            title: 'Employees',
          }}
        />
      </Stack.Navigator>
    );
  }

  const DrawerNavigator = (props) => {
    return (
      <Drawer.Navigator
        drawerContent={DrawerContent}>
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            swipeEnabled: false,
          }}
        />
        <Drawer.Screen
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
