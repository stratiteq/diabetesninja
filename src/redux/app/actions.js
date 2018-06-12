import * as types from './actionTypes';
import ninjatokenparser from '../../utils/ninjatokenparser';

export function setLoggedInUser(user) {
  return { type: types.SET_LOGGEDIN_USER, payload: user };
}

export function changeAppRoot(appRoot) {
  return { type: types.ROOT_CHANGED, root: appRoot };
}

export function appInitialized() {
  return async (dispatch) => {
    try {
      const accessToken = await ninjatokenparser.getTokenFromStorageAsync();

      if (accessToken !== null) {
        const UserInfo = ninjatokenparser.parseJwt(accessToken.access_token);

        dispatch(setLoggedInUser(UserInfo));
        dispatch(changeAppRoot('loggedIn'));
        return;
      }
    } catch (error) {
      dispatch(changeAppRoot('login'));
    }

    dispatch(changeAppRoot('login'));
  };
}

export function login() {
  return async (dispatch) => {
    dispatch(changeAppRoot('loggedIn'));
  };
}

export function logout() {
  return async (dispatch) => {
    dispatch(changeAppRoot('login'));
  };
}

export function updateUserIfo(updateModel) {
  return async (dispatch) => {
    dispatch({
      type: types.UPDATE_ACCOUNT_NAME,
      firstName: updateModel.FirstName,
    });
  };
}

export function getPlatformInfoPayload(platformInfo) {
  return { type: types.PLATFORM_INFO, payload: platformInfo };
}

export function platformInitialized(platform) {
  return async (dispatch) => {
    dispatch(getPlatformInfoPayload(platform));
  };
}
