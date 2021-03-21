import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Dimensions, ToastAndroid } from 'react-native';

// ios height: 768
// ios width: 1024
// 1.33333
const { height, width } = Dimensions.get('window');
export const hw = height > width;
const w = 1.3333333 / (width / height);
const h = 1.3333333 / (height / width);

const perWidthPhoneW = width / 414;
const perHeightPhoneW = height / 414;
const perWidthPhoneH = width / 896;
const perHeightPhoneH = height / 896;

export const pxPhone = (value) => {
  return height > width ? perWidthPhoneW * value : perHeightPhoneW * value;
};

export const pxPhoneH = (value) => {
  return height > width ? perHeightPhoneH * value : perWidthPhoneH * value;
};

export const isEmpty = (value) => {
  return (value === undefined || value === '');
};

export const fontSize = (value) => {
  if (!isTablet()) {
    return (hp(value) + wp(value) * 4) / 5;
  }

  if (hw) {
    return (hp(value) * 4 * h + wp(value)) / 5;
  } else {
    return (hp(value) + wp(value) * 4 * w) / 5;
  }
};

export const averageHW = (value) => {
  if (!isTablet()) {
    return (hp(value) + wp(value) * 4) / 5;
  }

  if (hw) {
    return (hp(value) * 4 * h + wp(value)) / 5;
  } else {
    return (hp(value) + wp(value) * 4 * w) / 5;
  }
};

// default: 812 x 375, iPhone 11 Pro
const percentageWidth = width / 375;

export const pxToPercentage = (value) => {
  return percentageWidth * value;
};


export const showToastWithGravityAndOffset = (text) => {
  ToastAndroid.showWithGravityAndOffset(
    text,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
};;