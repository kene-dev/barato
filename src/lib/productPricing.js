export const hasPreviousPrice = (productPrice, discountedPrice) => {
  return Number(discountedPrice) > 0 && Number(discountedPrice) < Number(productPrice)
}

export const getProductPrice = ({ productPrice, discountedPrice }) =>
  Number(hasPreviousPrice(productPrice, discountedPrice) ? discountedPrice : productPrice)
