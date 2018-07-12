import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  language: 'en',
  lowerBSLimit: 4.1,
  upperBSLimit: 10.0,
  insulinUnitsPerDay: 0,
  loading: false,
});

export default function settings(state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case types.SET_NEW_BS_LIMITS:
      return {
        ...state,
        lowerBSLimit: action.payload.lowerBSLimit,
        upperBSLimit: action.payload.upperBSLimit,
      };
    case types.SET_INSULIN_UNITS_PER_DAY:
      return {
        ...state,
        insulinUnitsPerDay: action.payload,
      };
    case types.LOADING_SETTINGS_START:
      return {
        ...state,
        loading: true,
      };
    case types.LOADING_SETTINGS_COMPLETE:
      return {
        ...state,
        loading: false,
        lowerBSLimit: action.payload.lowerBSLimit,
        upperBSLimit: action.payload.upperBSLimit,
        insulinUnitsPerDay: action.payload.insulinUnitsPerDay,
      };
    default:
      return state;
  }
}
