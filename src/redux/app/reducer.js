import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  root: undefined,
  loggedInUser: {},
  platformInfo: '',
});

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return { ...state, root: action.root };
    case types.SET_LOGGEDIN_USER:
    // console.log("in reducer");
    // console.log(action.payload);
      return { ...state, loggedInUser: action.payload };
    case types.PLATFORM_INFO:
      return {
        ...state,
        platformInfo: action.payload,
      };
    case types.UPDATE_ACCOUNT_NAME:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          FirstName: action.firstName,
        },
      };
    default:
      return state;
  }
}
