import { AsyncStorage } from 'react-native';
import moment from 'moment';
import * as storageKeys from '../../constants/storageKeys';
import {
  LOGTYPE_CUSTOMLOG,
  LOGTYPE_BLOODGLUCOSE,
  LOGTYPE_CARBONHYDRATE,
} from '../../constants/logTypes';
import * as types from './actionTypes';
import * as bloodSugarActionTypes from '../bloodsugar/actionTypes';

import Api from '../../utils/api';
import ninjaTokenParser from '../../utils/ninjatokenparser';
import toastMessage from '../../utils/ToastMessage';

export function saveNote(note) {
  return async (dispatch) => {
    const userIdFromStorage = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    Api.post('UserLog', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        logType: LOGTYPE_CUSTOMLOG,
        userId: userIdFromStorage,
        description: note.value,
      },
    })
      .then((response) => {
        const logToAdd = {
          id: response.userLogId,
          date: response.createdDate,
          logType: response.logType,
          value: response.description,
        };

        dispatch({ type: types.ADD_TO_USER_LOG, payload: logToAdd });
        toastMessage.showInfoMessage('Anteckning sparad');
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.NOTE_ERROR,
            payload: 'Ett fel uppstod när du försökte spara anteckningen.',
          });
          toastMessage.showErrorMessage('Misslyckades med att spara anteckning, testa att logga ut och in igen.');
          return;
        }

        dispatch({
          type: types.NOTE_ERROR,
          payload: 'Unexpected exception when logging value',
        });
        toastMessage.showErrorMessage('Misslyckades med att spara anteckning, testa igen.');
      });
  };
}


export function updateLogItem(item, success) {
  return async (dispatch) => {
    dispatch({ type: types.UPDATE_LOGITEM_STARTED });
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    Api.put(`UserLog/${item.id}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        logDate: item.date,
        bloodGlucose: item.bloodSugar,
      },
    })
      .then(() => {
        dispatch({ type: types.UPDATE_LOGITEM_DONE });
        success(true);
      })
      .catch((error) => {
        dispatch({ type: types.UPDATE_LOGITEM_ERROR });
        if (error.status === 401 || error.status === 403) {
          success(false);
          return;
        }
        success(false);
      });
  };
}

export function deleteLogItem(id, success) {
  return async (dispatch) => {
    dispatch({ type: types.DELETE_LOGITEM_STARTED });
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    Api.delete(`UserLog/${id}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
      .then(() => {
        dispatch({ type: types.DELETE_LOGITEM_DONE });
        success(true);
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({ type: types.DELETE_LOGITEM_ERROR });
          success(false);
          return;
        }
        dispatch({ type: types.DELETE_LOGITEM_ERROR });
        success(false);
      });
  };
}

function getValueFromLogEntry(logEntry) {
  if (logEntry.logType === LOGTYPE_BLOODGLUCOSE) {
    return logEntry.bloodGlucose;
  }
  if (logEntry.logType === LOGTYPE_CARBONHYDRATE) {
    return logEntry.carbonHydrates;
  }
  if (logEntry.logType === LOGTYPE_CUSTOMLOG) {
    return logEntry.description;
  }
  return null;
}

export function resetUserLogFromApi(fromDate) {
  const fromDateFormatted = moment.utc(fromDate).format('YYYY-MM-DDTHH:mm:ss');
  const toDateFormatted = null;

  return async (dispatch) => {
    dispatch({ type: types.RETRIEVE_USER_LOG_STARTED });
    const userIdFromStorage = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    Api.getWithParams(
      `UserLog/${userIdFromStorage}/date/${fromDateFormatted}/${toDateFormatted}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    )
      .then((response) => {
        const logsToAdd = [
          ...response.map(logEntry => ({
            id: logEntry.userLogId,
            date: moment
              .utc(logEntry.createdDate)
              .local()
              .format('YYYY-MM-DDTHH:mm:ss'),
            logType: logEntry.logType,
            value: getValueFromLogEntry(logEntry),
          })),
        ];

        const logsSortedByDate = logsToAdd.slice(0);
        // eslint-disable-next-line arrow-body-style
        logsSortedByDate.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        const newBloodSugarEntries =
          logsSortedByDate.filter(event => event.logType === LOGTYPE_BLOODGLUCOSE);

        dispatch({ type: types.SET_USER_LOG, payload: logsSortedByDate });
        dispatch({ type: types.RETRIEVE_USER_LOG_COMPLETED });

        if (newBloodSugarEntries.length !== 0) {
          dispatch({
            type: bloodSugarActionTypes.BLOODSUGAR_UPDATED,
            payload: newBloodSugarEntries[0],
          });
        }
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.RETRIEVE_USER_LOG_ERROR,
            payload:
              'Fel vid hämtning av data. Har du en giltig Invitation Code?',
          });
        } else {
          dispatch({
            type: types.RETRIEVE_USER_LOG_ERROR,
            payload: 'Oväntat fel inträffade vid hämtning av data.',
          });
        }
      });
  };
}

export function ClearLoggedMeal() {
  return (dispatch) => {
    dispatch({ type: types.MEAL_CLEARED });
  };
}

export function getLoggedMeal(userLogId) {
  return async (dispatch) => {
    const userIdFromStorage = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);

    Api.getWithParams(`Meal/${userIdFromStorage}/${userLogId}`, {
      headers: {
        Authorization: `Bearer ${await ninjaTokenParser.getBearerTokenFromStorageAsync()}`,
      },
    })
      .then((response) => {
        const foodList = response.map(food => food);
        dispatch({ type: types.MEAL_LOADED, payload: foodList });
      })
      .catch(() => {
        // console.error(error);
      });
  };
}
