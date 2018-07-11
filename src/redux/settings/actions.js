import I18n from 'react-native-i18n';
import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';
import ninjaTokenParser from '../../utils/ninjatokenparser';
import * as storageKeys from '../../constants/storageKeys';

import Api from '../../utils/api';


// eslint-disable-next-line import/prefer-default-export
export function changeLanguage(language) {
  I18n.locale = language;
  return async (dispatch) => {
    dispatch({ type: types.CHANGE_LANGUAGE, payload: language });
  };
}

export function setNewBSLimits(limits, onSuccess) {
  return async (dispatch) => {
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    const userIdFromStorage = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);

    Api.put(`UserSettings/UpdateMinAndMaxBloodSugarLimits/${userIdFromStorage}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        minBSMarkerLimit: limits.lowerBSLimit,
        maxBSMarkerLimit: limits.upperBSLimit,
      },
    })
      .then(() => {
        dispatch({ type: types.SET_NEW_BS_LIMITS, payload: limits });

        if (onSuccess !== null) onSuccess('');
      })
      .catch((error) => {
        // if (error.status === 401 || error.status === 403) {
        onSuccess(`Oväntat fel inträffade när blodsockervärden skulle sparas${error.status}`);
      });
  };
}


export function setInsulinUnitsPerDay(insulinUnitsPerDay, onSuccess) {

  return async (dispatch, getState) => {

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    const userIdSelf = getState().app.loggedInUser.UserId;

    Api.put(`UserSettings/UpdateTotalInsulinUnitsPerDay/${userIdSelf}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: insulinUnitsPerDay,
    })
      .then(() => {
        dispatch({ type: types.SET_INSULIN_UNITS_PER_DAY, payload: insulinUnitsPerDay });
        if (onSuccess !== null) onSuccess('');
      })
      .catch((error) => {
        dispatch({ type: types.SET_INSULIN_UNITS_PER_DAY, payload: 33 });
        if (onSuccess !== null) onSuccess('Oväntat fel inträffade när insulindoser skulle sparas');
      });
  };
}

function RemoveLocalStorageInsulinMigration() {
  AsyncStorage.removeItem(storageKeys.TOTALUNITS_INSULIN);
}

export function loadEffectiveUserSettings() {
  return async (dispatch, getState) => {
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    const userIdFollowing = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);
    const userIdSelf = getState().app.loggedInUser.UserId;
    const insulinUnitsFromStorageMain = await AsyncStorage.getItem(storageKeys.TOTALUNITS_INSULIN);  // Remove after migration grace period (i.e early 2019)

    dispatch({
      type: types.LOADING_SETTINGS_START,
      payload: {
        loggedInUser: userIdSelf,
        followsuser: userIdFollowing,
      },
    });

    Api.getWithParams(`UserSettings/effectiveUserSettings/${userIdFollowing}/${userIdSelf}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
      .then((response) => {
        dispatch({
          type: types.LOADING_SETTINGS_COMPLETE,
          payload: {
            lowerBSLimit: response.minBSMarkerLimit,
            upperBSLimit: response.maxBSMarkerLimit,
            insulinUnitsPerDay: response.totalUnitsOfInsulinPerDay,
          },
        });

        // Remove after migration grace period (i.e early 2019)
        if (insulinUnitsFromStorageMain !== null) {  
          const floatValue = parseFloat(insulinUnitsFromStorageMain);
          if (floatValue > 0) {
            dispatch(setInsulinUnitsPerDay(floatValue, null));
          }
          RemoveLocalStorageInsulinMigration();
        }
        // End migration script
      })
      .catch((error) => {
        // TODO: What to do?
      });
  };
}
