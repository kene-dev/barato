import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import editorialImage from '../assets/shop-editorial.jpg'

function About() {
  return (
    <main className="bg-[#f9f6f1] pt-20 text-[#30251f]">
      <section className="mx-auto grid max-w-[1450px] lg:min-h-[510px] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-14">
          <p className="mb-5 text-[11px] font-semibold tracking-[.22em] uppercase text-[#a33075]">Our story / Matrix Scents</p>
          <h1 className="max-w-xl text-[clamp(3rem,6vw,5.7rem)] leading-[.95] tracking-[-.06em] [font-family:Georgia,'Times_New_Roman',serif]">The beauty is in the scent.</h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-[#685b51]">We started Matrix Scents with a simple belief: everyone deserves to smell expensive, even when shopping on a budget.</p>
        </div>
        <div className="min-h-[310px] overflow-hidden bg-[#e8dbce] sm:min-h-[420px] lg:min-h-full">
          <img src={editorialImage} alt="An amber fragrance bottle with a burgundy flower" className="h-full w-full object-cover object-[66%_center]" />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.7fr] lg:gap-20 lg:py-28">
        <div>
          <p className="mb-4 text-[11px] font-semibold tracking-[.2em] uppercase text-[#a33075]">Why we began</p>
          <h2 className="text-4xl leading-[1.05] tracking-[-.05em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Luxury scents within reach.</h2>
        </div>
        <div className="space-y-6 text-base leading-8 text-[#62564e]">
          <p>We saw perfume lovers admiring designer scents from afar, saving screenshots, adding to wishlists, and saying, “One day.”</p>
          <p>But the price was not always about the perfume itself. Sometimes, it was about the box, the packaging, and the presentation.</p>
          <blockquote className="border-l-4 border-[#f83dbe] py-3 pl-6 text-2xl leading-snug text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">What if we removed the box, but kept the beauty?</blockquote>
          <p>That is how Matrix Scents was born: to make luxury fragrances accessible without the luxury price tag. Every unboxed perfume we sell is carefully sourced and handled with care.</p>
          <p>For us, it is about confidence made affordable, luxury made simple, and trust made possible.</p>
          <Link to="/shop" className="inline-flex items-center gap-3 border-b border-[#30251f] pb-1 text-sm font-semibold text-[#30251f] hover:text-[#a33075] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075]">Explore the collection <ArrowUpRight size={18} /></Link>
        </div>
      </section>
    </main>
  )
}

export default About
