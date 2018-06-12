import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';
import Api from '../../utils/api';
import * as storageKeys from '../../constants/storageKeys';
import ninjaTokenParser from '../../utils/ninjatokenparser';

async function getLocalInvitationCode() {
  try {
    const invitationObject = JSON.parse(await AsyncStorage.getItem(storageKeys.INVITATION_CODE));

    if (invitationObject == null) return null;

    if (new Date(invitationObject.invitationCodeValidTo) < new Date()) {
      return null;
    }

    return invitationObject;
  } catch (error) {
    // console.log("failed to get invitationcode from localstorage");
    return null;
  }
}

export function getMyFollowers() {
  return async (dispatch) => {
    dispatch({ type: types.INVITATION_GET_FOLOWERS_STARTED });
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    Api.getWithParams('invitation/myFollowers', {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
      .then(async (response) => {
        dispatch({
          type: types.INVITATION_GET_FOLLOWERS_DONE,
          payload: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: types.INVITATION_GET_FOLLOWERS_ERROR,
          payload: error,
        });
      });
  };
}

export function removeFollower(user, success, failed) {
  return async (dispatch) => {
    dispatch({ type: types.INVITATION_GET_FOLOWERS_STARTED });
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();
    Api.delete(`invitation/RevokeFollower/${user.userId}`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
      .then(async (response) => {
        dispatch({
          type: types.INVITATION_GET_FOLLOWERS_DONE,
          payload: response,
        });
        success();
      })
      .catch((error) => {
        dispatch({
          type: types.INVITATION_GET_FOLLOWERS_ERROR,
          payload: error,
        });
        failed();
      });
  };
}

export function getInvitationCode() {
  return async (dispatch) => {
    dispatch({ type: types.INVITATION_CODE_STARTED });

    const invitation = await getLocalInvitationCode();

    if (invitation !== null) {
      dispatch({
        type: types.IVNITATION_CODE_DONE,
        payload: invitation.invitationCode,
      });
    } else {
      const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

      Api.getWithParams('invitation', {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then(async (response) => {
          await AsyncStorage.setItem(
            storageKeys.INVITATION_CODE,
            JSON.stringify(response),
          );
          dispatch({
            type: types.IVNITATION_CODE_DONE,
            payload: response.invitationCode,
          });
        })
        .catch((error) => {
          dispatch({
            type: types.INVITATION_CODE_ERROR,
            payload: error,
          });
        });
    }
  };
}
