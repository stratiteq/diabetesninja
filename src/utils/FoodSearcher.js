import React from "react";
import Api from "./api";

class FoodSearcher {
  // const Images = [
  // require('../../img/Icon_Add_note.png'),
  // require('../../img/Icon_Log_Blood_Sugar.png')
  // ];

  static GetImageFromFoodGroup(index) {
    return "http://www.valleyspuds.com/wp-content/uploads/Russet-Potatoes-cut.jpg";
  }

  static SearchArticles(itemSearchString, callbackOnDone) {
    Api.get(`FoodSearch/0/50/${encodeURI(itemSearchString.trim())}`)
      .then(response => {
        //console.log(response);
        // map result
        const foods = response.map(foodRow => ({
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
          imageurl: this.GetImageFromFoodGroup(foodRow.foodGroupId),
          foodQty: [
            {
              value: foodRow.foodUnit1,
              carbEquivalent: foodRow.kh / foodRow.amount * foodRow.foodUnit1
            },
            {
              value: foodRow.foodUnit2,
              carbEquivalent: foodRow.kh / foodRow.amount * foodRow.foodUnit2
            },
            {
              value: foodRow.foodUnit3,
              carbEquivalent: foodRow.kh / foodRow.amount * foodRow.foodUnit3
            },
            {
              value: foodRow.foodUnit4,
              carbEquivalent: foodRow.kh / foodRow.amount * foodRow.foodUnit4
            },
            {
              value: foodRow.foodUnit5,
              carbEquivalent: foodRow.kh / foodRow.amount * foodRow.foodUnit5
            },
            {
              value: foodRow.foodUnit6,
              carbEquivalent: foodRow.kh / foodRow.amount * foodRow.foodUnit6
            }
          ]
        }));

        const foodSorted = foods.splice(0);
        foodSorted.sort(function(a,b ) {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });
        console.log(foodSorted);
        callbackOnDone({ successFlag: true, feedBackMsg: "", results: foodSorted });
      })
      .catch(error => {        
        callbackOnDone({
          successFlag: false,
          feedBackMsg: "Misslyckades med att söka artiklar",
          results: []
        });
      });
  }
}

export default FoodSearcher;
