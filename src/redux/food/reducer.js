import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  popularFoodList: [],
  foodGroupList: [],
  foodList: [],
  favoriteFoodList: [],
});

export default function bloodsugar(state = initialState, action = {}) {
  switch (action.type) {
    case types.POPULAR_FOOD_LOADED:
      return {
        ...state,
        popularFoodList: action.payload,
      };
    case types.FOODGROUP_LOADED:
      return {
        ...state,
        foodGroupList: action.payload,
      };
    case types.FOOD_LOADED:
      return {
        ...state,
        foodList: action.payload,
      };
    case types.FAVORITE_FOOD_LOADED:
      return {
        ...state,
        favoriteFoodList: action.payload,
      };
    default:
      return state;
  }
}
