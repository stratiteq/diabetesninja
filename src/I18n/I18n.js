import I18n from 'react-native-i18n';

I18n.fallbacks = true;

// const languageCode = I18n.locale.substr(0, 2);

I18n.translations = {
  en: require('./english.json'),
  sv: require('./sv.json'),
};

export default I18n;
