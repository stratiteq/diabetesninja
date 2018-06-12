import { AsyncStorage } from 'react-native';
import moment from 'moment';
import * as storageKeys from '../../constants/storageKeys';
import * as types from './actionTypes';
import Api from '../../utils/api';
import ninjaTokenParser from '../../utils/ninjatokenparser';
import { LOGTYPE_BLOODGLUCOSE } from '../../constants/logTypes';

// eslint-disable-next-line import/prefer-default-export
export function resetExternalDataFromApi() {
  return async (dispatch, getState) => {
    dispatch({ type: types.RETRIEVE_EXTERNAL_DATA_STARTED });

    const userInfo = getState().app.loggedInUser;
    const fromDate = moment(new Date())
      .add(-1, 'year')
      .add(-1, 'day')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss');
    const toDate = moment(new Date())
      .add(-1, 'year')
      .add(-10, 'minute')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss');

    if (!userInfo) {
      dispatch({
        type: types.RETRIEVE_EXTERNAL_DATA_ERROR,
        retrievalError: 'Autentiserings-fel, testa att logga ut och in igen',
      });
      return;
    }

    let userDevice;
    if (userInfo.Granted.length >= 1) {
      userDevice = userInfo.Granted[0].GrantUserDevice;
    } else {
      userDevice = userInfo.UserDevice;
    }

    if (!userDevice || userDevice === 'None') {
      dispatch({
        type: types.RETRIEVE_EXTERNAL_DATA_DONE,
      });
      return;
    }

    const userIdFromStorage = await AsyncStorage.getItem(storageKeys.SELECTED_USER_ID);

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    Api.getWithParams(
      `ExternalUserLog/${userIdFromStorage}/date/${fromDate}/${toDate}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    )
      .then((response) => {
        const logsToAdd = [
          ...response.map(logEntry => ({
            id: moment
              .utc(logEntry.createdDate)
              .local()
              .add(1, 'year')
              .format('YYYYMMDDHHmmss'),
            date: moment
              .utc(logEntry.createdDate)
              .local()
              .add(1, 'year')
              .format('YYYY-MM-DDTHH:mm:ss'),
            logType: logEntry.logType,
            value: logEntry.value,
          })),
        ];

        const currentExternalDataEntries =
          getState().externalUserData.externalDataEntries.filter(
            event => event.logType === LOGTYPE_BLOODGLUCOSE);

        if (
          logsToAdd.length !== 0 &&
          (currentExternalDataEntries.length === 0 ||
            currentExternalDataEntries[0].date < logsToAdd[0].date)
        ) {
          dispatch({ type: types.SET_EXTERNAL_DATA, payload: logsToAdd });
        } else {
          dispatch({ type: types.RETRIEVE_EXTERNAL_DATA_DONE });
        }
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.RETRIEVE_EXTERNAL_DATA_ERROR,
            payload:
              'Fel vid hämtning av data. Har du en giltig inloggning till extern datakälla?',
          });
        } else {
          dispatch({
            type: types.RETRIEVE_EXTERNAL_DATA_ERROR,
            payload: 'Oväntat fel inträffade vid hämtning av data.',
          });
        }
      });
  };
}

function getDexComAuthCode(dexComAuthResponseUrl) {
  const error = dexComAuthResponseUrl.toString().match(/error=([^&]+)/);
  const code = dexComAuthResponseUrl.toString().match(/code=([^&]+)/)[1];

  return { code, error };
}

export function dexComRegistration(dexComAuthResponseUrl, onSuccess) {
  return async (dispatch, getState) => {
    const alreadyConnecting = getState().externalUserData
      .currentlyConnectingToDexcom;

    if (alreadyConnecting) {
      return;
    }

    dispatch({ type: types.DEXCOM_REGISTRATION_STARTED });

    const dexComAuthCode = getDexComAuthCode(dexComAuthResponseUrl);

    if (dexComAuthCode.error) {
      dispatch({
        type: types.DEXCOM_REGISTRATION_ERROR,
        payload: dexComAuthCode.error,
      });
    }

    const userIdFromStorage = await AsyncStorage.getItem(
      storageKeys.SELECTED_USER_ID,
    );

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    Api.post('DexComRegistration', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        userId: userIdFromStorage,
        dexComAuthCode: dexComAuthCode.code,
      },
    })
      .then(() => {
        dispatch({
          type: types.DEXCOM_REGISTRATION_COMPLETED,
        });

        onSuccess();
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.DEXCOM_REGISTRATION_ERROR,
            payload:
              'Fel vid koppling till DexCom. Har du en giltig inloggning till extern datakälla? Anslutning till DexCom kan bara ske från huvudkontot.',
          });
        } else {
          dispatch({
            type: types.DEXCOM_REGISTRATION_ERROR,
            payload: 'Oväntat fel vid koppling till DexCom.',
          });
        }
      });
  };
}

export function dexComDisconnect(onSuccess) {
  return async (dispatch, getState) => {
    if (getState().externalUserData.currentlyDisConnectingFromDexcom) {
      return;
    }

    dispatch({ type: types.DEXCOM_DISCONNECT_STARTED });

    const userIdFromStorage = await AsyncStorage.getItem(
      storageKeys.SELECTED_USER_ID,
    );

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    Api.delete(`DexComRegistration/${userIdFromStorage}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
      .then(() => {
        dispatch({
          type: types.DEXCOM_DISCONNECT_COMPLETED,
        });

        dispatch({
          type: types.CLEAR_EXTERNAL_DATA,
        });

        onSuccess();
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.DEXCOM_DISCONNECT_ERROR,
            payload:
              'Fel vid bortkoppling från DexCom. Har du en giltig inloggning till Dexcom? Anslutning till DexCom kan bara påverkas från huvudkontot.',
          });
        } else {
          dispatch({
            type: types.DEXCOM_DISCONNECT_ERROR,
            payload: 'Oväntat fel vid bortkoppling från DexCom.',
          });
        }
      });
  };
}
