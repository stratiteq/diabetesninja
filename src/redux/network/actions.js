import * as types from './actionTypes';

// eslint-disable-next-line import/prefer-default-export
export function changeIsConnectedState(isConnected) {
  return async (dispatch) => {
    dispatch({ type: types.CHANGE_NETWORK_CONNECTIVITY, payload: isConnected });
  };
}
