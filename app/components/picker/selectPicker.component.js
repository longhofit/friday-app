import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { pxPhone } from '../../../core/utils/utils';
import { theme } from '../../theme/appTheme';
import { textStyle } from '../styles/style';
import Icon from 'react-native-vector-icons/FontAwesome';

// interface ComponentProps extends TouchableOpacityProps 
//   invalid?: boolean;
//   title: string;
//   titleStyle?: StyleProp<TextStyle>;
//   data;
//   selectedTextStyle?: StyleProp<TextStyle>;
//   selectedValue: string | undefined;
//   onValueChange: (value: string | undefined) => void;
// }

export default SelectPicker = (props) => {

  const onValueChange = (value) => {
    props.onValueChange(value);
  };

  const onButtonPress = () => {
    props.navigation.navigate('Picker', {
      headerTitle: props.title,
      data: props.data,
      selectedValues: props.selectedValues,
      onValueChange,
    });
  };

  const getLabelByValue = () => {
    const label = [];

    props.data.forEach(item => {
      if (props.selectedValues && props.selectedValues.includes(item.value)) {
        label.push(item.label);
      }
    });

    return label.join(', ');
  };

  const { style, titleStyle, selectedTextStyle } = props;

  return (
    <TouchableOpacity
      style={[
        themedStyle.container,
        style,
      ]}
      onPress={onButtonPress}>
      <Text
        style={[
          themedStyle.txtTitle,
          titleStyle,
          props.invalid && themedStyle.txtTitleInvalid,
        ]}>
        {props.title}
      </Text>
      <View style={themedStyle.viewSelected}>
        <Text
          style={[
            themedStyle.txtSelected,
            selectedTextStyle,
          ]}>
          {getLabelByValue()}
        </Text>
        <Icon
          style={{ marginLeft: pxPhone(7.5) }}
          name={'angle-right'}
          size={pxPhone(20)}
          color={theme['color-dark-100']}
        />
      </View>
    </TouchableOpacity>
  );
};

const themedStyle = StyleSheet.create({
  container: {
    height: pxPhone(67.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pxPhone(7.5),
  },
  viewSelected: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSelected: {
    fontSize: pxPhone(16),
    ...textStyle.regular,
  },
  txtTitle: {
    fontSize: pxPhone(16),
    ...textStyle.regular,
  },
  // txtTitleInvalid: {
  //   color: theme['text-danger-color'],
  // },
  // icon: {
  //   width: pxPhone(25),
  //   height: pxPhone(25),
  //   tintColor: theme['background-dark-color-1'],
  // },
})

