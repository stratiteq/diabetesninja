import * as types from './actionTypes';
import Api from '../../utils/api';

function isInt(value) {
  return (
    !Number.isNaN(value) &&
    // eslint-disable-next-line eqeqeq
    parseInt(Number(value), 10) == value &&
    !Number.isNaN(parseInt(value, 10))
  );
}

// eslint-disable-next-line import/prefer-default-export
export function attemptSignup(signUpCredentials, attemptSuceeded) {
  return (dispatch) => {
    const { email, firstName } = signUpCredentials;
    let { invitationCode } = signUpCredentials;

    if (email === '') {
      dispatch({ type: types.SIGNUP_ERROR, payload: 'Ange epostadress' });
      return;
    }

    if (invitationCode === '') {
      invitationCode = '0';
    }

    dispatch({ type: types.SIGNUP_STARTED, payload: email });

    if (!isInt(invitationCode)) {
      dispatch({
        type: types.SIGNUP_ERROR,
        payload: 'Make sure the Invitation Code is an integer',
      });
      return;
    }

    Api.post('signup', {
      headers: {
        Authorization: 'Bearer sddsdsdsd',
      },
      noBody: true,
      body: {
        firstName,
        email,
        invitationCode,
      },
    })
      .then(() => {
        attemptSuceeded();
        dispatch({
          type: types.SIGNUP_DONE,
          payload: email,
        });
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.SIGNUP_ERROR,
            payload:
              'Ett fel uppstod när du registrerade dig. Verifiera att du angett rätt epostadress och inbjudningskod.',
          });
        } else if (error.status === 412) {
          error.json().then((data) => {
            dispatch({
              type: types.SIGNUP_ERROR,
              payload: data,
            });
          });
        } else {
          dispatch({
            type: types.SIGNUP_ERROR,
            payload: 'Unexpected exception when signing up',
          });
        }
      });
  };
}
