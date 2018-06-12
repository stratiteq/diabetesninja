import moment from "moment";

export const sortArrayByDate = array => {
  const sortedArray = array;

  for (let i = sortedArray.length - 1; i >= 0; i--) {
    for (let j = 1; j <= i; j++) {
      // Use moment to format dates before they are compared
      const aDate = moment(sortedArray[j - 1].startDateTime, moment.ISO_8601);
      const bDate = moment(sortedArray[j].startDateTime, moment.ISO_8601);
      if (aDate > bDate) {
        const temp = sortedArray[j - 1];
        sortedArray[j - 1] = sortedArray[j];
        sortedArray[j] = temp;
      }
    }
  }
  return sortedArray;
};

export { sortArrayByDate as default };
