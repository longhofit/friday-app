import I18n from 'react-native-i18n';
import en from './languages/en';
import vi from './languages/vi';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

// If we do not want the framework to use the phone"s locale by default
I18n.locale = 'en';

// English language is the main language for fall back:
I18n.translations = {
  en,
  vi,
};

export default I18n;
