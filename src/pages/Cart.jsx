import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowUpRight, Minus, Plus, Trash2 } from 'lucide-react'
import { decrementItem, incrementItem, removeFromCart, selectCartItems, selectCartTotal } from '@/app/features/cartSlice'
import PageIntro from '@/components/PageIntro'

const money = amount => Number(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })

const Cart = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const dispatch = useDispatch()

  const proceedToCheckout = () => {
    if (!cartItems.length) return
    const itemList = cartItems.map(item => `*${item.productName}* - Qty: ${item.quantity} - ${money(item.productPrice * item.quantity)}`).join('\n')
    const message = encodeURIComponent(`Hello! I would like to place an order:\n\n${itemList}\n\nTotal: ${money(cartTotal)}`)
    window.open(`https://wa.me/2348060119051?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] text-[#30251f]">
      <PageIntro eyebrow="Your selection / Cart" title="Your little collection." description="Everything you have chosen, ready when you are." />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:py-20">
        {cartItems.length ? (
          <div className="min-w-0 divide-y divide-[#e3d7c9] border-t border-[#e3d7c9]">
            {cartItems.map(item => (
              <div key={item.id} className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center">
                <Link to={`/shop/${item.id}`} className="shrink-0 self-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075]"><img src={item.productImage} alt={item.productName} className="size-24 object-cover bg-[#eee6db] sm:size-28" /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/shop/${item.id}`} className="text-xl tracking-[-.03em] hover:text-[#a33075] [font-family:Georgia,'Times_New_Roman',serif]">{item.productName}</Link>
                  <p className="mt-1 text-sm text-[#776b60]">{money(item.productPrice)} each</p>
                  <div className="mt-4 inline-flex h-10 items-center border border-[#cbbcad] bg-white" aria-label={`Quantity for ${item.productName}`}>
                    <button type="button" onClick={() => dispatch(decrementItem(item.id))} aria-label={`Decrease quantity of ${item.productName}`} className="grid size-10 place-items-center hover:bg-[#eee7df] focus-visible:outline-2 focus-visible:outline-[#a33075]"><Minus size={15} /></button>
                    <span className="grid h-full min-w-10 place-items-center border-x border-[#cbbcad] text-sm">{item.quantity}</span>
                    <button type="button" onClick={() => dispatch(incrementItem(item.id))} aria-label={`Increase quantity of ${item.productName}`} className="grid size-10 place-items-center hover:bg-[#eee7df] focus-visible:outline-2 focus-visible:outline-[#a33075]"><Plus size={15} /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                  <p className="text-base font-semibold">{money(item.productPrice * item.quantity)}</p>
                  <button type="button" onClick={() => dispatch(removeFromCart(item.id))} aria-label={`Remove ${item.productName} from cart`} className="grid size-9 place-items-center text-[#a33075] hover:bg-[#f7e8ee] focus-visible:outline-2 focus-visible:outline-[#a33075]"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-start justify-center border border-[#e3d7c9] bg-white p-8">
            <h2 className="text-3xl tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">Your cart is empty.</h2>
            <p className="mt-3 text-sm text-[#776b60]">Your next favourite scent is waiting in the collection.</p>
            <Link to="/shop" className="mt-7 inline-flex items-center gap-2 border-b border-[#30251f] pb-1 text-sm font-semibold hover:text-[#a33075]">Explore the shop <ArrowUpRight size={16} /></Link>
          </div>
        )}
        <aside className="h-max border border-[#e3d7c9] bg-white p-6 sm:p-7">
          <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-[#a33075]">Order summary</p>
          <div className="mt-7 flex items-center justify-between border-b border-[#e3d7c9] pb-5"><span className="text-sm">Subtotal</span><span className="text-lg font-semibold">{money(cartTotal)}</span></div>
          <p className="mt-5 text-xs leading-5 text-[#776b60]">Delivery details are confirmed with you before your order is placed.</p>
          <button type="button" onClick={proceedToCheckout} disabled={!cartItems.length} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 bg-[#30251f] px-5 text-sm font-medium text-white hover:bg-[#50372f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075] disabled:cursor-not-allowed disabled:bg-[#b9b1a9]">Checkout on WhatsApp <ArrowUpRight size={17} /></button>
        </aside>
      </div>
    </main>
  )
}

export default Cart
