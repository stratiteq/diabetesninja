import { AsyncStorage } from 'react-native';
import * as storageKeys from '../../constants/storageKeys';
import * as types from './actionTypes';
import Api from '../../utils/api';
import ninjaTokenParser from '../../utils/ninjatokenparser';

export function GetImageFromFoodGroup() {
  return 'http://www.valleyspuds.com/wp-content/uploads/Russet-Potatoes-cut.jpg';
}

function mapFood(foodRow) {
  return {
    name: foodRow.name,
    key: foodRow.foodId.toString(),
    foodGroupId: foodRow.foodGroupId,
    foodGroupName: foodRow.foodGroupName,
    unitId: foodRow.unitId,
    unitName: foodRow.unitName,
    weight: foodRow.weight,
    gramCarbs: foodRow.gramCarbs,
    CH: foodRow.kh,
    Qty: foodRow.amount,
    imageurl: GetImageFromFoodGroup(foodRow.foodGroupId),
    foodQty: [
      {
        value: foodRow.foodUnit1,
        carbEquivalent: (foodRow.kh / foodRow.amount) * foodRow.foodUnit1,
      },
      {
        value: foodRow.foodUnit2,
        carbEquivalent: (foodRow.kh / foodRow.amount) * foodRow.foodUnit2,
      },
      {
        value: foodRow.foodUnit3,
        carbEquivalent: (foodRow.kh / foodRow.amount) * foodRow.foodUnit3,
      },
      {
        value: foodRow.foodUnit4,
        carbEquivalent: (foodRow.kh / foodRow.amount) * foodRow.foodUnit4,
      },
      {
        value: foodRow.foodUnit5,
        carbEquivalent: (foodRow.kh / foodRow.amount) * foodRow.foodUnit5,
      },
      {
        value: foodRow.foodUnit6,
        carbEquivalent: (foodRow.kh / foodRow.amount) * foodRow.foodUnit6,
      },
    ],
  };
}

export function getPopularFood() {
  return async (dispatch) => {
    const userIdFromStorage = await AsyncStorage.getItem(
      storageKeys.SELECTED_USER_ID,
    );

    Api.getWithParams(`FoodSearch/favourites/${userIdFromStorage}/0/20`, {
      headers: {
        Authorization: `Bearer ${await ninjaTokenParser.getBearerTokenFromStorageAsync()}`,
      },
    })
      .then((response) => {
        const foods = response.map(foodRow => (mapFood(foodRow)));

        dispatch({ type: types.POPULAR_FOOD_LOADED, payload: foods });
      })
      .catch(() => {
      });
  };
}

export function getFavoriteFood() {
  return async (dispatch) => {
    let favorites = await AsyncStorage.getItem(storageKeys.SAVED_MEAL_FAVORITES);

    if (favorites == null) {
      favorites = [];
    }

    dispatch({ type: types.FAVORITE_FOOD_LOADED, payload: JSON.parse(favorites) });
  };
}

export function getFoodByFoodGroupId(foodGroupId) {
  return async (dispatch) => {
    Api.get(`FoodSearch/ByFoodGroupId/${foodGroupId}`)
      .then((response) => {
        const foods = response.map(foodRow => (mapFood(foodRow)));

        const foodSorted = foods.splice(0);
        try {
          foodSorted.sort((a, b) => {
            const x = a.name.toLowerCase();
            const y = b.name.toLowerCase();
            // eslint-disable-next-line no-nested-ternary
            return x < y ? -1 : x > y ? 1 : 0;
          });
        } catch (error) {
          // Catch this
        }

        dispatch({ type: types.FOOD_LOADED, payload: foodSorted });
      })
      .catch(() => {
      });
  };
}

export function deleteFavorite(favoriteItem) {
  return async (dispatch) => {
    const favorites = JSON.parse(await AsyncStorage.getItem(storageKeys.SAVED_MEAL_FAVORITES));
    const newFavs = favorites.filter(item => item.dbId !== favoriteItem.dbId);
    await AsyncStorage.setItem(storageKeys.SAVED_MEAL_FAVORITES, JSON.stringify(newFavs));
    dispatch({ type: types.FAVORITE_FOOD_LOADED, payload: newFavs });
  };
}

export function getFoodGroups() {
  return async (dispatch) => {
    Api.get('foodgroups')
      .then((response) => {
        const foodGroups = response.map(foodGroupRow => ({
          foodGroupId: foodGroupRow.foodGroupId,
          key: foodGroupRow.foodGroupId.toString(),
          name: foodGroupRow.name,
          numberOfFods: foodGroupRow.numberOfFods,
        }));
        foodGroups.splice(0, 0, { foodGroupId: -2, name: 'Mest använda' });
        foodGroups.splice(0, 0, { foodGroupId: -1, name: 'Mina favoriter' });

        dispatch({ type: types.FOODGROUP_LOADED, payload: foodGroups });
      })
      .catch(() => {
      });
  };
}
