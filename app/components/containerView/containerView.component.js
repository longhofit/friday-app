import React from 'react';
import {
  ScrollView,
} from 'react-native';


export const ContainerView= (props) => {
  return (
    <ScrollView
      bounces={false}
      bouncesZoom={false}
      alwaysBounceVertical={false}
      alwaysBounceHorizontal={false}
      {...props}
    />
  );
};
