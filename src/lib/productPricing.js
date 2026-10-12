export const hasPreviousPrice = (productPrice, discountedPrice) => {
  return Number(discountedPrice) > 0 && Number(discountedPrice) < Number(productPrice)
}
