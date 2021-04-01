import TouchID from 'react-native-touch-id';
import { theme } from '../../app/theme/appTheme';

const optionalConfigObjectForIsSupported = {
  unifiedErrors: true, // use unified error messages (default false)
  passcodeFallback: false,
};

const optionalConfigObjectForAuthenticate = {
  title: 'Authentication Required',  // Android
  imageErrorColor: theme["color-app"],
  sensorDescription: 'Touch sensor',  // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: true, // use unified error messages (default false)
  passcodeFallback: false,
  imageColor:theme["color-app"]
};

export const onCheckRecognizeSupported = (onResult) => {
  TouchID
    .isSupported(optionalConfigObjectForIsSupported)
    .then(biometryType => {
      if (biometryType === 'TouchID' || biometryType === 'FaceID') {
        // Touch ID is supported on iOS
        // Face ID is supported on iOS
        onResult(biometryType);
      } else if (biometryType === true) {
        // Touch ID is supported on Android
        onResult('TouchID');
      }
    })
    .catch(() => {
      onResult(undefined);
    });
};

export const onRequestRecognizeAuthentication = (onSuccess, onError) => {
  TouchID
    .authenticate('Sign In to Kite Metric', optionalConfigObjectForAuthenticate)
    .then((success) => {
      onSuccess();
      console.log('RecognizeAuthenticationSuccess:', success);
    })
    .catch((error) => {
      onError(error.code);
      console.log('RecognizeAuthenticationError:', error);
    });
};
