// import 'react-native-gesture-handler';
// import { Provider } from 'react-redux';
// import React, { useState, useEffect } from 'react';
// import { LogBox, Text, Image, StyleSheet } from 'react-native';
// import { isAuthenticated } from '@okta/okta-react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from './app/LoginScreen.js';
// import DashboardScreen from './app/vacation/DashboardScreen.js';
// import {
//   createDrawerNavigator,
//   DrawerItem,
//   DrawerContentScrollView,
// } from '@react-navigation/drawer';
// import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
// import { menuItems } from './core/constant/menuSideBarConstant';
// import { store, persistor } from './core/store';
// import EmployeesScreen from './app/manage/EmployeesScreen.js';
// import SettingScreen from './app/manage/SettingScreen.js';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import { pxPhone } from './core/utils/utils.js';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearTokens } from '@okta/okta-react-native';
// import { onSetUser } from './core/store/reducer/user/actions';
// import Spinner from 'react-native-loading-spinner-overlay';
// import CreatePolicyScreen from './app/CreatePolicyScreen.js';
// import ProfileScreen from './app/ProfileScreen.js';
// import ReportsScreen from './app/vacation/ReportsScreen.js';
// import { PersistGate } from 'redux-persist/lib/integration/react';
// import TimeLogCreateScreen from './app/TimeLog/TimeLogCreateScreen.js';
// import TimeLogScreen from './app/TimeLog/TimeLogScreen.js';
// import ProjectsScreen from './app/manage/Project.js';
// import ProjectAddNew from './app/manage/ProjectAddNew.js';
// import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
// import TimeLogEditScreen from './app/TimeLog/TimeLogEditScreen.js';
// import TimeLogReportScreen from './app/TimeLog/TimeLogReportScreen.js';
// import ProjectMemberScreen from './app/manage/ProjectMemberScreen.js';
// import MemberAddNew from './app/manage/MemberAddNew.js';
// import { logo } from './app/assets/images';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import FilterProject from './app/manage/FilterScreen.js';
// import PickerComponent from './app/components/picker/picker.component.js';
// import { DynamicStatusBar } from './app/components/dynamicStatusBar/dynamicStatusBar.component.js';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Feather from 'react-native-vector-icons/Feather';
// import FilterTimeLog from './app/TimeLog/FilterScreen';
// import SortScreen from './app/manage/SortScreen.js';
// import { textStyle } from './app/components/styles/style.js';
// import SortTimeLog from './app/TimeLog/SortScreen.js';
// import { theme } from './app/theme/appTheme.js';
// import RNBootSplash from "react-native-bootsplash";



// export default DrawerNavigator = ({ authenticated }) => {
//   const Drawer = createDrawerNavigator();
//   const dispatch = useDispatch();
//   roleUser = useSelector(state => state.user.role);

//   const DrawerContent = (props) => {
//     const logout = () => {
//       console.log('log')
//       setProgress(true);

//       clearTokens()
//         .then(() => {
//           props.dispatch(
//             onSetUser({
//               name: '',
//               email: '',
//               sub: '',
//               role: '',
//             }),
//           );
//           props.navigation.navigate('login');
//         })
//         .catch((e) => { })
//         .finally(() => {
//           setProgress(false);
//         });
//     };

//     const indexFocus = props.state.index;

//     return (
//       <DrawerContentScrollView style={{ padding: 0, margin: 0 }}>
//         <Image
//           style={{
//             width: pxPhone(50) * (446 / 160),
//             height: pxPhone(50),
//             alignSelf: 'center',
//           }}
//           source={logo.imageSource}
//         />
//         {menuItems &&
//           menuItems.map((item, index) => {
//             return (
//               <React.Fragment key={index}>
//                 <DrawerItem
//                   focused={indexFocus === item.routeIndex}
//                   activeTintColor={theme["color-app"]}
//                   pressColor={theme["color-app"]}
//                   labelStyle={{ fontWeight: 'bold', fontSize: pxPhone(18) }}
//                   icon={({ color }) => <Icon name={item.iconName} size={pxPhone(22)} color={color} />}
//                   key={index}
//                   label={item.name}
//                   onPress={() => {
//                     item.name === 'Log out' ? logout() : props.navigation.navigate(item.name);
//                   }}
//                 />
//               </React.Fragment>
//             );
//           })}
//       </DrawerContentScrollView>
//     );
//   };

//   return (
//     <Drawer.Navigator
//       initialRouteName={!authenticated ? 'login' : 'Timelog'}
//       drawerContent={(props) =>
//         DrawerContent({ ...props, dispatch: dispatch })
//       }>
//       <Drawer.Screen
//         key={'login'}
//         name={'login'}
//         component={LoginScreen}
//         options={{
//           swipeEnabled: false,
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           title: 'Profile',
//         }}
//       />
//       <Drawer.Screen
//         name="Timelog"
//         component={TimelogTabNavigator}
//       />
//       <Drawer.Screen
//         name="Vacation"
//         component={VacationStack}
//         options={{
//           ...TransitionPresets.SlideFromRightIOS,
//         }}
//       />
//       <Drawer.Screen
//         name="Manage"
//         component={ManageTabNavigator}
//         options={{
//           ...TransitionPresets.SlideFromRightIOS,
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };