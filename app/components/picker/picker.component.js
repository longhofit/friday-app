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

export default PickerComponent = ({ navigation, route, headerTitle }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Icon
            style={{paddingLeft:pxPhone(12)}}
            onPress={() => navigation.goBack()}
            name={'close'}
            size={pxPhone(22)}
            color={'black'}
          />
        );
      },
      headerTitle: route.params.headerTitle,
    });
  }, [navigation, route]);

  const [state, setState] = useState({
    headerTitle: undefined,
    data: undefined,
    selectedValue: undefined,
  });

  useEffect(() => {
    const { headerTitle, data, selectedValue } = route.params;

    setState({
      headerTitle,
      data,
      selectedValue,
    });
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onValueChanged = (value) => {
    route.params.onValueChange(value);
    onBackPress();
  };

  const renderIcon = (value) => {
    // if (value === state.selectedValue) {
    //   return IconCheckmark(themedStyle.icon);
    // }

    return null;
  };

  const renderItem = () => {
    return state.data.map((dataItem, index) => {
      return (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={themedStyle.btnItem}
            onPress={() => {
              onValueChanged(dataItem.value);
            }}>
            <Text
              style={[
                themedStyle.txtItemTitle,
                dataItem.value === state.selectedValue && themedStyle.txtItemTitleSelected,
              ]}>
              {dataItem.label}
            </Text>
            {dataItem.value === state.selectedValue &&
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
  },
  txtItemTitleSelected: {
    color: theme["color-active"],
  },
  icon: {
    width: pxPhone(30),
    height: pxPhone(30),
    tintColor: theme['color-custom-200'],
  },
})