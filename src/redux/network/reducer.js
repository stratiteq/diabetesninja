import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  isConnected: true,
});

export default function network(state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_NETWORK_CONNECTIVITY:
      return {
        ...state,
        isConnected: action.payload,
      };
    default:
      return state;
  }
}
