// import React from 'react';
// import { ViewProps } from 'react-native';
// import {
//   withStyles,
//   ThemeType,
//   ThemedComponentProps,
// } from '@kitten/theme';
// import { linearGradientColors } from '@src/core/utils/constants';
// import LinearGradient from 'react-native-linear-gradient';

// export type ContainerLinearGradientProps = ViewProps & ThemedComponentProps;

// const ContainerLinearGradientComponent: React.FunctionComponent<ContainerLinearGradientProps> = (props) => {
//   const { themedStyle, style, ...restProps } = props;

//   return (
//     <LinearGradient
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0.5, y: 1 }}
//       colors={linearGradientColors}
//       style={[
//         themedStyle.container,
//         style,
//       ]}
//       {...restProps}>
//       {props.children}
//     </LinearGradient>
//   );
// };

// export const ContainerLinearGradient = withStyles(ContainerLinearGradientComponent, (theme: ThemeType) => ({
//   container: {
//     flex: 1,
//   },
// }));
