export const hasPreviousPrice = (productPrice, originalPrice) =>
  Number(originalPrice) > Number(productPrice)
