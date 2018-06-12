import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  isPushOn: true,
  isPushSetupComplete: false,
  pushHandle: null,
  latestPushRegInfo: '',
});

export default function push(state = initialState, action = {}) {
  switch (action.type) {
    case types.PUSHHANDLE_RECEIVED:
      return {
        ...state,
        pushHandle: action.payload,
      };
    case types.LATEST_PUSH_REG_INFO:
      return {
        ...state,
        latestPushRegInfo: action.payload,
      };
    case types.TOGGLE_IS_PUSH_SETUP_COMPLETE:
      return {
        ...state,
        isPushSetupComplete: action.payload,
      };
    case types.TOGGLE_PUSH_ON:
      return {
        ...state,
        isPushOn: action.payload,
      };
    case types.NOTIFICATION_OPENED:
      return {
        ...state,
      };
    case types.NOTIFICATION_RECEIVED:
      return {
        ...state,
      };
    default:
      return state;
  }
}
