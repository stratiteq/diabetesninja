import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  signingIn: false,
  error: null,
  result: null,
  email: '',
});

export default function nameDoesntMatter(state = initialState, action = {}) {
  switch (action.type) {
    case types.SIGNUP_STARTED:
      return {
        ...state,
        error: null,
        signingIn: true,
        email: action.payload,
      };
    case types.SIGNUP_DONE:
      return {
        ...state,
        error: null,
        signingIn: false,
        email: action.payload,
      };
    case types.SIGNUP_ERROR: {
      return {
        ...state,
        signingIn: false,
        error: action.payload,
        email: '',
      };
    }
    default:
      return state;
  }
}
