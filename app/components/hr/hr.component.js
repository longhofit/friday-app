import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { pxPhone } from '../../../core/utils/utils';
import { theme } from '../../theme/appTheme';

export const Hr = (props) => {
  const { style } = props;

  return (
    <View
      style={[
        themedStyle.container,
        style,
      ]}
    />
  );
};

const themedStyle = StyleSheet.create({
  container: {
    height: pxPhone(1),
    backgroundColor: theme['color-dark-100'],
  },
})
