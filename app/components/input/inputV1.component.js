import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { isEmpty, pxPhone } from '../../../core/utils/utils';
import { theme } from '../../theme/appTheme';
import { textStyle } from '../styles/style';



export const SearchInput = ({ style, onChangeText, keyword, onRemovePress, ...restProps }) => {
  return (
    <View style={[
      styles.viewSearch,
      style,
    ]}>
      <AntDesign
        name={'search1'}
        size={pxPhone(15)}
        color={theme["color-dark-100"]}
      />
      <TextInput
        {...restProps}
        maxLength={256}
        value={keyword}
        autoCapitalize='none'
        style={styles.inputSearch}
        placeholderTextColor={theme["color-dark-100"]}
        onChangeText={onChangeText}
      />
      {!isEmpty(keyword) &&
        <AntDesign
          onPress={onRemovePress}
          name={'closecircle'}
          size={pxPhone(15)}
          color={theme["color-dark-100"]}
        />}
    </View>
  )
}

const styles = StyleSheet.create({
  viewSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: pxPhone(40),
    borderRadius: pxPhone(5),
    borderWidth: pxPhone(1),
    marginTop: pxPhone(13),
    marginBottom: pxPhone(5),
    paddingHorizontal: pxPhone(10),
    borderColor: theme["color-dark-100"]
  },
  inputSearch: {
    flex: 1,
    fontSize: pxPhone(14),
    marginHorizontal: pxPhone(5),
    color: theme['color-dark-1000'],
    ...textStyle.regular,
    padding: 0,
  },
})