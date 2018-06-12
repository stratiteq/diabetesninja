import { AsyncStorage } from 'react-native';
import * as storageKeys from '../../constants/storageKeys';
import * as types from './actionTypes';
import * as apptypes from '../app/actionTypes';
import * as bloodSugarTypes from '../bloodsugar/actionTypes';
import * as userLogTypes from '../userlog/actionTypes';
import * as externalDataTypes from '../externalUserData/actionTypes';
import Api from '../../utils/api';
import ninjatokenparser from '../../utils/ninjatokenparser';

export function setUser(user) {
  return { type: types.SET_USER, payload: user };
}

export function setLoggedInUser(user) {
  return { type: apptypes.SET_LOGGEDIN_USER, payload: user };
}

export function changeAppRoot(appRoot) {
  return { type: apptypes.ROOT_CHANGED, root: appRoot };
}

export function clearUserLog() {
  return { type: userLogTypes.CLEAR_USER_LOG };
}

export function clearBloodSugar() {
  return { type: bloodSugarTypes.BLOODSUGAR_CLEAR };
}

export function clearExternalData() {
  return { type: externalDataTypes.CLEAR_EXTERNAL_DATA };
}

async function deleteAccessToken() {
  try {
    await AsyncStorage.removeItem(storageKeys.TOKEN_REFRESH);

    await AsyncStorage.removeItem(storageKeys.TOKEN_EXPIRATION);
    await AsyncStorage.removeItem(storageKeys.INVITATION_CODE);

    await AsyncStorage.removeItem(storageKeys.TOKEN_BEARER);
  } catch (error) {
    // Catch error
  }
}

export function logout() {
  return async (dispatch) => {
    try {
      await deleteAccessToken();
      dispatch(changeAppRoot('login'));
      dispatch(clearUserLog());
      dispatch(clearBloodSugar());
      dispatch(clearExternalData());
    } catch (error) {
      // console.log(`failed to clear token from storage${JSON.stringify(error)}`);
    }
  };
}

export function forgottenPassword(emailAddressEntered, callback) {
  // console.log(`in redux attemptlogin ${loginCredentials}`);
  return (dispatch) => {
    dispatch({ type: types.FORGOT_PASSWORD_STARTED });
    Api.post('signin/ForgotPassword', {
      body: {
        emailAddress: emailAddressEntered,
      },
    })
      .then(() => {
        dispatch({ type: types.FORGOT_PASSWORD_DONE });
        callback({
          successFlag: true,
          feedbackMsg: `Ny inloggninskod skickad till '${emailAddressEntered}'`,
        });
      })
      .catch((error) => {
        dispatch({
          type: types.FORGOT_PASSWORD_ERROR,
          payload:
            `Misslyckades att skicka om lösenord. Försök igen senare${error}`,
        });
        callback({
          successFlag: false,
          feedbackMsg:
            `Misslyckades att skicka om lösenord. Försök igen senare${error}`,
        });
      });
  };
}

export function updateCurrentuser(userInfo) {
  const previousSelectedUser = AsyncStorage.getItem(
    storageKeys.SELECTED_USER_ID,
  );

  // console.log(`previous value ${previousSelectedUser}`);

  let previousSelectedUserOK = false;

  if (previousSelectedUser !== null) {
    // Check that still have access to this user
    if (previousSelectedUser === userInfo.UserId) previousSelectedUserOK = true;
    else {
      // Check new grants if still have access to selected users data
      userInfo.Granted.forEach((tempgrant) => {
        if (tempgrant.GrantUserId === previousSelectedUserOK) {
          previousSelectedUserOK = true;
        }
      });
    }
  }

  if (previousSelectedUser === null || !previousSelectedUserOK) {
    // Set selected user by rule.
    // 1) User with one grant - use grant user
    // 2) User with multiple grants - select grant 1
    // 3) User with no grant - use self

    let userIdToSet;
    let userNameToSet;

    if (userInfo.Granted.length >= 1) {
      userIdToSet = userInfo.Granted[0].GrantUserId;
      userNameToSet = userInfo.Granted[0].GrantUserFirstName;
    } else {
      userIdToSet = userInfo.UserId;
      userNameToSet = userInfo.FirstName;
    }

    try {
      AsyncStorage.setItem(storageKeys.SELECTED_USER_ID, userIdToSet);
      AsyncStorage.setItem(storageKeys.SELECTED_USER_NAME, userNameToSet);
    } catch (error) {
      // Catch this
    }
  }
}

async function saveAccessToken(tokenInfo) {
  try {
    await AsyncStorage.setItem(
      storageKeys.TOKEN_REFRESH,
      tokenInfo.refresh_token,
    );

    await AsyncStorage.setItem(
      storageKeys.TOKEN_EXPIRATION,
      tokenInfo.expires_in,
    );

    await AsyncStorage.setItem(
      storageKeys.TOKEN_BEARER,
      tokenInfo.access_token,
    );
  } catch (error) {
    // Catch this
  }
}

async function storeEmailAddress(emailAddress) {
  try {
    await AsyncStorage.setItem(storageKeys.LOGIN_LAST_EMAIL, emailAddress);
  } catch (e) {
    // Catch this
  }
}

export function attemptlogin(loginCredentials) {
  return (dispatch) => {
    dispatch({ type: types.LOGIN_STARTED });

    if (loginCredentials.email === '') {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: 'Skriv in en e-postadress',
      });
      return;
    }

    if (loginCredentials.password === '') {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: 'Ange lösenord/aktiveringskod',
      });
      return;
    }

    Api.post('signin', {
      headers: {
        Authorization: 'Bearer sddsdsdsd',
      },
      body: {
        email: loginCredentials.email,
        password: loginCredentials.password,
      },
    })
      .then((response) => {
        storeEmailAddress(loginCredentials.email);
        saveAccessToken(response);

        const UserInfo = ninjatokenparser.parseJwt(response.access_token);
        updateCurrentuser(UserInfo);

        dispatch(setUser(UserInfo));
        dispatch(setLoggedInUser(UserInfo));
        dispatch({ type: apptypes.ROOT_CHANGED, root: 'loggedIn' });
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.LOGIN_ERROR,
            payload:
              'Inloggningen misslyckades. Kontrollera att du angav rätt epostadress och lösenord.',
          });
        } else if (error.status === 999) {
          dispatch({
            type: types.LOGIN_ERROR,
            payload: error.message,
          });
        } else {
          dispatch({
            type: types.LOGIN_ERROR,
            payload: 'Ett okänt fel skedde när du försökte logga in.',
          });
        }
      });
  };
}

export function attemptRefreshToken(onSuccess) {
  return async (dispatch) => {
    dispatch({ type: types.TOKEN_REFRESH_STARTED });
    const refreshToken = await ninjatokenparser.getRefreshTokenFromStorageAsync();
    if (!refreshToken) {
      dispatch({
        type: types.TOKEN_REFRESH_ERROR,
        payload: 'Token-format var inte giltigt.',
      });
      return;
    }

    Api.getWithParams('token', {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
      .then(async (response) => {
        await saveAccessToken(response);

        const UserInfo = ninjatokenparser.parseJwt(response.access_token);
        updateCurrentuser(UserInfo);

        dispatch(setUser(UserInfo));
        dispatch(setLoggedInUser(UserInfo));
        dispatch({ type: apptypes.ROOT_CHANGED, root: 'loggedIn' });
        dispatch({ type: types.TOKEN_REFRESH_DONE });

        return onSuccess();
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.TOKEN_REFRESH_ERROR,
            payload:
              'Error vid uppdatering av token. Testa att logga ut och in igen!',
          });
        } else {
          dispatch({
            type: types.TOKEN_REFRESH_ERROR,
            payload: 'Unexpected exception when logging in',
          });
        }
      });
  };
}

export function saveUser(user) {
  return async () => {
    try {
      await AsyncStorage.setItem(storageKeys.LOGGED_IN_USER, user);
    } catch (error) {
      // console.log(`failed to save user to storage${JSON.stringify(error)}`);
    }
  };
}
