import React from 'react';
import {
  StatusBar,
} from 'react-native';

// interface ComponentProps {
//   barStyle: StatusBarStyle;
// }

// export type DynamicStatusBarProps = ThemedComponentProps & ViewProps & ComponentProps;

export const DynamicStatusBar = (props) => {
  const getStatusBarContent = () => {
    if (props.barStyle === 'light-content') {
      return 'light-content';
    } else {
      return 'dark-content';
    }
  };

  const barStyle = getStatusBarContent();

  return (
    <StatusBar
      translucent
      backgroundColor={'transparent'}
      barStyle={barStyle}
    />
  );
};