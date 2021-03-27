import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
// import { Icon } from 'react-native-vector-icons/AntDesign';
import { pxPhone } from '../../../core/utils/utils';
import { theme } from '../../theme/appTheme';
import { textStyle } from '../styles/style';
import Icon from 'react-native-vector-icons/AntDesign';

// interface ComponentProps extends TouchableOpacityProps {
//   title: string;
//   titleStyle?: StyleProp<TextStyle>;
//   selected: boolean;
//   onInputPress: (selected: boolean) => void;
// }


export default SelectedInput = (props) => {
  console.log(props, 'asdasxxx');

  const onInputPress = () => {
    props.onInputPress(props.selected);
  };

  const { style, titleStyle } = props;

  return (
    <TouchableOpacity
      style={[
        themedStyle.container,
        style,
      ]}
      onPress={onInputPress}>
      <Text style={[
        themedStyle.txtTitle,
        props.selected && themedStyle.txtTitleSelected,
        titleStyle,
      ]}>
        {props.title}
      </Text>
      {props.selected &&
        <Icon
          name={'check'}
          size={pxPhone(20)}
          color={theme["color-active"]}
        />}
    </TouchableOpacity>
  );
};

const themedStyle = StyleSheet.create({
  container: {
    height: pxPhone(67.5),
    paddingHorizontal: pxPhone(7.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: pxPhone(16),
    ...textStyle.regular,
    color: 'black',
  },
  txtTitleSelected: {
    color: theme["color-active"]
  },
})
