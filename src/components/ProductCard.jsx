import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, selectCartItems } from '@/app/features/cartSlice'
import { ArrowUpRight, Check, Plus } from 'lucide-react'
import { hasPreviousPrice } from '@/lib/productPricing'

// eslint-disable-next-line react/prop-types
const ProductCard = ({ productImage, productName, productPrice, discountedPrice, id }) => {
  const dispatch = useDispatch()
  const isInCart = useSelector(state => selectCartItems(state).some(item => item.id === id))
  const formatPrice = (price) => Number(price).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  })
  const isOnSale = hasPreviousPrice(productPrice, discountedPrice)
  const focusStyle = 'focus-visible:outline-2 focus-visible:outline-[#ba167f] focus-visible:outline-offset-4'

  return (
    <article className="group flex h-full w-full min-w-0 flex-col border border-[#e7dfd5] bg-[#faf7f2] px-[9px] pt-[9px] pb-4 text-[#30251f]">
      <div className="relative">
        <Link
          to={`/shop/${id}`}
          className={`relative block aspect-[1/1.05] overflow-hidden bg-[#eee8df] ${focusStyle}`}
          aria-label={`View ${productName}`}
        >
          <img
            src={productImage}
            alt={productName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
          />
          <span className="absolute bottom-2.5 left-2.5 grid size-8 place-items-center border border-[#30251f30] bg-[#faf7f2] transition-colors hover:bg-[#30251f] hover:text-white motion-reduce:transition-none" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </Link>
        {isOnSale && (
          <span className="absolute top-3.5 -left-[5px] -rotate-5 bg-[#f83dbe] px-3 py-[5px] text-[10px] font-semibold tracking-[.06em] uppercase">
            On sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-[5px] pt-[15px]">
        <h3 className="mb-[13px] min-h-[2.4em] text-[21px] leading-[1.2] font-normal tracking-[-.035em] [overflow-wrap:anywhere]">
          <Link to={`/shop/${id}`} className={`[font-family:Georgia,'Times_New_Roman',serif] hover:underline hover:underline-offset-4 ${focusStyle}`}>
            {productName}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-3 border-t border-[#d9cec0] pt-[13px]">
          <div className="flex min-w-0 flex-col gap-0.5 [overflow-wrap:anywhere]">
            <span className="text-[13px] font-semibold tracking-[-.025em]">{discountedPrice && discountedPrice < productPrice ? formatPrice(discountedPrice) : formatPrice(productPrice)}</span>
            {isOnSale && <del className="text-[10px] text-[#796d63]">{formatPrice(productPrice)}</del>}
          </div>
          <button
            type="button"
            disabled={isInCart}
            className={`inline-flex min-h-11 items-center justify-center gap-[7px] border px-2.5 py-2 text-[11px] font-medium transition-[transform,box-shadow] duration-200 motion-reduce:transition-none ${focusStyle} ${isInCart
              ? 'cursor-not-allowed border-[#d1cbc5] bg-[#e6e2dd] text-[#716b65] shadow-none'
              : 'cursor-pointer border-[#30251f] bg-[#f83dbe] shadow-[3px_3px_0_#30251f] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#30251f] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
            }`}
            aria-label={isInCart ? `${productName} is already in cart` : `Add ${productName} to cart`}
            onClick={() => {
              if (!isInCart) dispatch(addToCart({ productImage, productName, productPrice, id }))
            }}
          >
            <span>{isInCart ? 'In cart' : 'Add to cart'}</span>
            {isInCart ? <Check size={16} aria-hidden="true" /> : <Plus size={16} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
