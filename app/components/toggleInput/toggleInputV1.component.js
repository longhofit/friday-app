import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import { pxPhone } from '../../../core/utils/utils';
import { theme } from '../../theme/appTheme';
import { textStyle } from '../styles/style';

// interface ComponentProps extends TouchableOpacityProps {
//   title: string;
//   titleStyle?: StyleProp<TextStyle>;
//   checked: boolean;
//   onChange: (valcheckedue: boolean) => void;
// }

// export type ToggleInputV1Props = ComponentProps & ThemedComponentProps;

export const ToggleInput = (props) => {
  const onChange = (checked) => {
    props.onChange(checked);
  };

  const { style, titleStyle } = props;

  return (
    <View
      style={[
        themedStyle.container,
        style,
      ]}>
      <Text
        style={[
          themedStyle.txtTitle,
          titleStyle,
        ]}>
        {props.title}
      </Text>
      <Switch
        trackColor={{
          false: themedStyle.track.color,
          true: '',
        }}
        value={props.checked}
        onValueChange={onChange}
      />
    </View>
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
  },
  track: {
    color: theme['color-dark-100'],
  },
})
