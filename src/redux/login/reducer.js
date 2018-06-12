import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  logginIn: false,
  error: null,
  result: null,
  user: null,
  refreshingToken: false,
  refreshTokenError: null,
  latestRefresh: new Date('2000-01-01'),
  forgonPasswordLoading: false,
  forgotPasswordError: null,
});

export default function nameDoesntMatter(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN_STARTED:
      return { ...state, logginIn: true, error: null };
    case types.LOGIN_DONE:
      return { ...state, logginIn: false, result: action.payload };
    case types.LOGIN_ERROR: {
      return {
        ...state,
        logginIn: false,
        error: action.payload,
      };
    }
    case types.SET_USER:
      return {
        ...state,
        user: action.payload,
        logginIn: false,
        refreshingToken: false,
        refreshTokenError: null,
      };
    case types.TOKEN_REFRESH_STARTED:
      return {
        ...state,
        refreshingToken: true,
        refreshTokenError: null,
      };
    case types.TOKEN_REFRESH_ERROR:
      return {
        ...state,
        refreshingToken: false,
        refreshTokenError: action.payload,
      };
    case types.TOKEN_REFRESH_DONE:
      return {
        ...state,
        refreshingToken: false,
        refreshTokenError: null,
        latestRefresh: new Date(),
      };
    case types.FORGOT_PASSWORD_STARTED:
      return {
        ...state,
        forgonPasswordLoading: true,
        forgotPasswordError: null,
      };
    case types.FORGOT_PASSWORD_DONE:
      return {
        ...state,
        forgonPasswordLoading: false,
        forgotPasswordError: null,
      };
    case types.FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        forgonPasswordLoading: false,
        forgotPasswordError: action.payload,
      };
    default:
      return state;
  }
}
