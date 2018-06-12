import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';
import Api from '../../utils/api';
import ninjaTokenParser from '../../utils/ninjatokenparser';
import * as storageKeys from '../../constants/storageKeys';

function isInt(value) {
  return (
    !Number.isNaN(value) &&
    parseInt(Number(value), 10) === value &&
    !Number.isNaN(parseInt(value, 10))
  );
}

export function connectByInvitationCode(invitationCode, onSuccess) {
  return async (dispatch) => {
    dispatch({ type: types.ACCOUNT_CHANGE_STARTED });

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    const invitationCodeAsInt = parseInt(invitationCode, 10);
    if (!isInt(invitationCodeAsInt)) {
      dispatch({
        type: types.ACCOUNT_CHANGE_ERROR,
        payload: 'Försäkra dig om att Inbjudningskoden är en siffra',
      });
      return;
    }

    const parsedInvitationCode = parseInt(invitationCode, 10);

    Api.post('invitation', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: parsedInvitationCode,
    })
      .then(() => {
        dispatch({
          type: types.ACCOUNT_CHANGE_DONE,
          payload: parsedInvitationCode,
        });
        onSuccess();
      })
      .catch(() => {
        dispatch({
          type: types.ACCOUNT_CHANGE_ERROR,
          payload:
            'Oväntat fel inträffade under registrering, har du redan kopplat dig till den personen tidigare?',
        });
      });
  };
}

export function changePassword(currentPassword, password, onSuccess) {
  return async (dispatch) => {
    dispatch({ type: types.ACCOUNT_CHANGEPASSWORD_STARTED });

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    const storedEmailAddress = await AsyncStorage.getItem(storageKeys.LOGIN_LAST_EMAIL);

    Api.post('account/changepassword', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        emailAddress: storedEmailAddress,
        oldPassword: currentPassword,
        newPassword: password,
      },
    })
      .then((response) => {
        dispatch({
          type: types.ACCOUNT_CHANGEPASSWORD_DONE,
          status: response.status,
        });
        if (onSuccess !== null) onSuccess();
      })
      .catch(() => {
        dispatch({
          type: types.ACCOUNT_CHANGEPASSWORD_ERROR,
          payload:
            'Oväntat fel inträffade när lösenorder skulle bytas.',
        });
      });
  };
}

export function update(updateModel, onSuccess) {
  return async (dispatch) => {
    dispatch({ type: types.ACCOUNT_UPDATE_STARTED });

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    const storedEmailAddress = await AsyncStorage.getItem(storageKeys.LOGIN_LAST_EMAIL);

    Api.post('account/update', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: {
        emailAddress: storedEmailAddress,
        firstName: updateModel.FirstName,
      },
    })
      .then((response) => {
        dispatch({
          type: types.ACCOUNT_UPDATE_DONE,
          status: response.status,
        });
        if (onSuccess !== null) onSuccess();
      })
      .catch(() => {
        dispatch({
          type: types.ACCOUNT_UPDATE_ERROR,
          payload:
            'Oväntat fel inträffade när lösenorder skulle bytas.',
        });
      });
  };
}
