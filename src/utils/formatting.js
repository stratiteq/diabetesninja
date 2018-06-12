export const toDecimalString = floatNumber => {
  if (Number.isInteger(floatNumber)) {
    return `${floatNumber}.0`;
  }
  return floatNumber.toString();
};

export { toDecimalString as default };
