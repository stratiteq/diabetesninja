import { AsyncStorage } from 'react-native';
import moment from 'moment';
import * as storageKeys from '../../constants/storageKeys';
import * as types from './actionTypes';
import * as userLogTypes from '../userlog/actionTypes';

import { LOGTYPE_BLOODGLUCOSE } from '../../constants/logTypes';
import Api from '../../utils/api';
import ninjaTokenParser from '../../utils/ninjatokenparser';
import toastMessage from '../../utils/ToastMessage';

function isFloat(value) {
  return (
    !Number.isNaN(value) &&
    // eslint-disable-next-line eqeqeq
    parseFloat(Number(value)) == value &&
    !Number.isNaN(parseFloat(value, 10))
  );
}

// eslint-disable-next-line import/prefer-default-export
export function saveBloodSugar(bloodSugar, onValidationSuccess) {
  return async (dispatch) => {
    dispatch({ type: types.BLOODSUGAR_UPDATE_STARTED });

    if (!bloodSugar || !isFloat(bloodSugar.value)) {
      dispatch({
        type: types.BLOODSUGAR_ERROR,
      });
      toastMessage.showErrorMessage('Var god ange ett giltigt värde!');
      return;
    }

    const userIdFromStorage = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    onValidationSuccess();

    Api.post('UserLog', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        logType: LOGTYPE_BLOODGLUCOSE,
        userId: userIdFromStorage,
        bloodGlucose: bloodSugar.value,
        carbonHydrates: 0,
        mealDetails: [],
      },
    })
      .then((response) => {
        const logToAdd = {
          id: response.userLogId,
          date: moment
            .utc(response.createdDate)
            .local()
            .format('YYYY-MM-DDTHH:mm:ss'),
          logType: response.logType,
          value: response.bloodGlucose,
        };

        dispatch({ type: userLogTypes.ADD_TO_USER_LOG, payload: logToAdd });
        dispatch({
          type: types.BLOODSUGAR_UPDATED,
          payload: bloodSugar,
        });

        toastMessage.showInfoMessage('Blodsocker-värde sparat');
      })
      .catch((error) => {
        dispatch({
          type: types.BLOODSUGAR_ERROR,
        });

        if (error.status === 401 || error.status === 403) {
          toastMessage.showErrorMessage('Misslyckades med att spara blodsocker, testa att logga ut och in igen.');
        } else {
          toastMessage.showErrorMessage('Misslyckades med att spara blodsocker, testa igen.');
        }
      });
  };
}
