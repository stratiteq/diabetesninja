import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  language: 'en',
});

export default function settings(state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
}
