import React from 'react';
import {
  Image,
} from 'react-native';


export const Icon = (source, style) => {
  return (
    <Image
      style={style}
      source={source.imageSource}
    />
  );
};
