import React, {
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { pxPhone } from '../../../core/utils/utils';
import { theme } from '../../theme/appTheme';
import { ContainerView } from '../containerView/containerView.component';
import { Hr } from '../hr/hr.component';
import { textStyle } from '../styles/style';
import Icon from 'react-native-vector-icons/AntDesign';

// export interface PickerData {
//   value: string;
//   label: string;
//   resource?: string;
// }

// interface State {
//   headerTitle: string | undefined;
//   data: PickerData[] | undefined;
//   selectedValue: string | undefined;
// }

// type PickerProps = ThemedComponentProps & NavigationInjectedProps;

export default PickerComponent = ({ navigation, route }) => {
  const [state, setState] = useState({
    headerTitle: undefined,
    data: undefined,
    selectedValues: [],
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
            style={{ flex: 1, paddingLeft: pxPhone(16), justifyContent: 'center' }}>
            <Text style={themedStyle.txtButton}>
              {'Cancel'}
            </Text>
          </TouchableOpacity>
        );
      },
      headerRight: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onApply}
            style={{ flex: 1, paddingRight: pxPhone(16), justifyContent: 'center' }}>
            <Text style={themedStyle.txtButton}>
              {'Save'}
            </Text>
          </TouchableOpacity>
        );
      },
      headerTitle: route.params.headerTitle,
      headerTitleStyle: themedStyle.txtTitle,
    });
  }, [navigation, route, state.selectedValues]);


  useEffect(() => {
    const { headerTitle, data, selectedValues } = route.params;

    setState({
      headerTitle,
      data,
      selectedValues,
    });
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onApply = () => {
    console.log(state.selectedValues, 'selectedValues');
    route.params.onValueChange(state.selectedValues);
    onBackPress();
  };

  const onValuePicker = (value) => {
    if (value === 'ALL') {
      setState({ ...state, selectedValues: ['ALL'] });
    } else {
      let temp = state.selectedValues;
      temp = temp && temp.filter(item => item != 'ALL')

      if (temp && temp.includes(value)) {
        temp = temp && temp.filter(item => item !== value);
      } else {
        temp.push(value)
      }
      setState({ ...state, selectedValues: temp });
      console.log(temp)
    }
  }

  const renderItem = () => {
    return state.data.map((dataItem, index) => {
      return (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={themedStyle.btnItem}
            onPress={() => {
              onValuePicker(dataItem.value);
            }}>
            <Text
              style={[
                themedStyle.txtItemTitle,
                state.selectedValues.includes(dataItem.value) && themedStyle.txtItemTitleSelected,
              ]}>
              {dataItem.label}
            </Text>
            {state.selectedValues.includes(dataItem.value) &&
              <Icon
                name={'check'}
                size={pxPhone(20)}
                color={theme["color-active"]}
              />
            }
          </TouchableOpacity>
          <Hr />
        </React.Fragment>
      );
    });
  };

  return (
    <View style={themedStyle.container}>
      <ContainerView
        style={themedStyle.containerView}>
        {state.data && renderItem()}
      </ContainerView>
    </View>
  );
};

const themedStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    backgroundColor: 'white',
  },
  btnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pxPhone(67.5),
    paddingHorizontal: pxPhone(7.5),
  },
  txtItemTitle: {
    fontSize: pxPhone(16),
    ...textStyle.regular,
    color: 'black',
  },
  txtItemTitleSelected: {
    color: theme["color-active"],
  },
  icon: {
    width: pxPhone(30),
    height: pxPhone(30),
    tintColor: theme['color-custom-200'],
  },
  txtButton: {
    fontSize: pxPhone(16),
    ...textStyle.semibold,
    color: 'white',
  },
  txtTitle: {
    fontSize: pxPhone(18),
    ...textStyle.bold,
    color: 'white',
  },
})