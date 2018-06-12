import I18n from 'react-native-i18n';
import * as types from './actionTypes';

// eslint-disable-next-line import/prefer-default-export
export function changeLanguage(language) {
  I18n.locale = language;
  return async (dispatch) => {
    dispatch({ type: types.CHANGE_LANGUAGE, payload: language });
  };
}
