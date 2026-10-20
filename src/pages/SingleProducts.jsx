import { Link, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, ArrowUpRight, Check, Plus } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ProductCard from '@/components/ProductCard'
import { hasPreviousPrice } from '@/lib/productPricing'
import { addToCart, selectCartItems } from '@/app/features/cartSlice'
import { useGetProductsByCategoryQuery, useGetSingleProductQuery } from '@/app/features/api/productApiSlice'

const money = amount => Number(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })

function SingleProducts() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { data: product } = useGetSingleProductQuery(Number(id))
  const { data: relatedProducts } = useGetProductsByCategoryQuery(product?.productCategory, { skip: !product?.productCategory })
  const isInCart = useSelector(state => selectCartItems(state).some(item => item.id === product?.id))
  const isOnSale = hasPreviousPrice(product?.productPrice, product?.discountedPrice)

  return (
    <main className="min-h-screen bg-[#f9f6f1] pt-28 text-[#30251f]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Link to="/shop" className="mb-7 inline-flex items-center gap-2 text-xs font-semibold tracking-[.12em] uppercase text-[#a33075] hover:underline focus-visible:outline-2 focus-visible:outline-[#a33075]"><ArrowLeft size={15} /> Back to shop</Link>
        {product ? (
          <div className="grid gap-9 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/4.5] overflow-hidden border border-[#e3d7c9] bg-[#eee5db] sm:aspect-square">
              <img src={product.productImage} alt={product.productName} className="h-full w-full object-cover" />
              {isOnSale && <span className="absolute top-4 left-3 -rotate-5 bg-[#f83dbe] px-3 py-[5px] text-[10px] font-semibold tracking-[.06em] uppercase">On sale</span>}
            </div>
            <div className="flex flex-col justify-center pb-4">
              <p className="mb-5 text-[11px] font-semibold tracking-[.22em] uppercase text-[#a33075]">The fragrance collection</p>
              <h1 className="max-w-xl text-[clamp(2.75rem,5vw,5rem)] leading-[.98] tracking-[-.055em] [font-family:Georgia,'Times_New_Roman',serif]">{product.productName}</h1>
              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-2xl font-semibold">{money(isOnSale ? product.discountedPrice : product.productPrice)}</span>
                {isOnSale && <del className="text-sm text-[#8b7d72]">{money(product.productPrice)}</del>}
              </div>
              <div className="mt-8 border-t border-[#d9cec0] pt-7 text-sm leading-7 text-[#62564e]">{product.productDescription}</div>
              <button type="button" disabled={isInCart} onClick={() => dispatch(addToCart({ productImage: product.productImage, productName: product.productName, productPrice: product.productPrice, id: product.id }))} className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-[#30251f] bg-[#30251f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#50372f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075] disabled:cursor-not-allowed disabled:border-[#c9c2bb] disabled:bg-[#e6e2dd] disabled:text-[#716b65] sm:w-max">
                {isInCart ? <Check size={18} /> : <Plus size={18} />} {isInCart ? 'In cart' : 'Add to cart'}
              </button>
              <div className="mt-10 grid gap-4 border-t border-[#d9cec0] pt-6 text-sm text-[#62564e] sm:grid-cols-2">
                <p>Need help choosing? We are here to help.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 font-medium text-[#a33075] hover:underline">Ask us a question <ArrowUpRight size={16} /></Link>
              </div>
            </div>
          </div>
        ) : <div className="min-h-80 bg-[#eee5db]" aria-label="Loading product" />}
        {relatedProducts?.length > 0 && (
          <section className="border-t border-[#ded2c5] py-20 lg:mt-24" aria-labelledby="related-heading">
            <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-3 text-[11px] font-semibold tracking-[.2em] uppercase text-[#a33075]">More to discover</p><h2 id="related-heading" className="text-4xl tracking-[-.05em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Related scents.</h2></div></div>
            <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 4000 })]} className="mx-auto w-full">
              <CarouselContent>
                {relatedProducts.filter(item => item.id !== product?.id).slice(0, 5).map(item => <CarouselItem key={item.id} className="basis-[78%] sm:basis-1/2 lg:basis-1/4"><ProductCard {...item} /></CarouselItem>)}
              </CarouselContent>
              <CarouselNext className="hidden border-[#30251f] bg-[#30251f] text-white lg:flex" />
              <CarouselPrevious className="hidden border-[#30251f] bg-[#30251f] text-white lg:flex" />
            </Carousel>
          </section>
        )}
      </div>
    </main>
  )
}

export default SingleProducts
