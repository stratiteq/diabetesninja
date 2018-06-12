import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  followersInvitationCode: -1,
  loading: false,
  updating: false,
  error: null,
  changePasswordError: null,
  changePasswordStatus: null,
  updatingError: null,
  updatingStatus: null,
});

export default function invite(state = initialState, action = {}) {
  switch (action.type) {
    case types.ACCOUNT_CHANGE_STARTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.ACCOUNT_CHANGE_DONE:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case types.ACCOUNT_CHANGE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.ACCOUNT_CHANGEPASSWORD_STARTED:
      return {
        ...state,
        updating: true,
        changePasswordError: null,
      };
    case types.ACCOUNT_CHANGEPASSWORD_DONE:
      return {
        ...state,
        updating: false,
        changePasswordStatus: action.status,
        changePasswordError: null,
      };
    case types.ACCOUNT_CHANGEPASSWORD_ERROR:
      return {
        ...state,
        updating: false,
        changePasswordError: action.payload,
      };
    case types.ACCOUNT_UPDATE_STARTED:
      return {
        ...state,
        updating: true,
        updatingError: null,
      };
    case types.ACCOUNT_UPDATE_DONE:
      return {
        ...state,
        updating: false,
        updatingError: null,
        updatingStatus: action.status,
      };
    case types.ACCOUNT_UPDATE_ERROR:
      return {
        ...state,
        updating: false,
        updatingError: action.payload,
      };
    default:
      return state;
  }
}
