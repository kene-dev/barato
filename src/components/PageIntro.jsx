// eslint-disable-next-line react/prop-types
function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="border-b border-[#e5d9cc] bg-[#f1e7dc] px-5 pt-32 pb-12 text-[#30251f] sm:px-8 sm:pt-36 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-[11px] font-semibold tracking-[.22em] uppercase text-[#a33075]">{eyebrow}</p>
        <h1 className="max-w-3xl text-[clamp(2.75rem,6vw,5.5rem)] leading-[.97] tracking-[-.055em] [font-family:Georgia,'Times_New_Roman',serif]">{title}</h1>
        {description && <p className="mt-5 max-w-xl text-sm leading-7 text-[#685b51] sm:text-base">{description}</p>}
      </div>
    </div>
  )
}

export default PageIntro
