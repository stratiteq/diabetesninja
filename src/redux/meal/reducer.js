import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  tempMealData: [],
  currentlyLoggingCarbValue: false,
  mealSaveError: '',
});

export default function meal(state = initialState, action = {}) {
  switch (action.type) {
    case types.CARB_ADDED_TO_MEAL:
      return {
        ...state,
        tempMealData: state.tempMealData.concat([action.payload]),
      };
    case types.REMOVE_FOOD_FROM_MEAL:
      return {
        ...state,
        tempMealData: state.tempMealData.filter(
          obj => obj.key !== action.payload,
        ),
      };
    case types.UPDATE_MEAL_SAVE_STARTED:
      return {
        ...state,
        currentlyLoggingCarbValue: true,
      };
    case types.UPDATE_MEAL_SAVE_ERROR:
      return {
        ...state,
        mealSaveError: action.payload,
        currentlyLoggingCarbValue: false,
      };
    case types.CLEAR_TEMP_MEAL_LIST:
      return {
        ...state,
        tempMealData: [],
        currentlyLoggingCarbValue: false,
      };
    default:
      return state;
  }
}
