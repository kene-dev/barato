import PageIntro from '@/components/PageIntro'

const ReturnsRefunds = () => {
  return (
    <main className='min-h-screen bg-[#f9f6f1] text-[#30251f]'>
        <PageIntro eyebrow='Shop with confidence / Policies' title='Returns & refunds.' description='The important details, clearly explained.' />
        <div className='mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20'>
        
        <div className='flex flex-col gap-10 text-sm leading-7 text-[#62564e] sm:text-base sm:leading-8 [&_section]:border-b [&_section]:border-[#e2d6c9] [&_section]:pb-10'>
            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">1. Eligibility for Return or Refund</h2>
                <p className='mb-4'>
                    You may request a return or refund within <strong>24 hours</strong> of receiving your order if any of the following applies:
                </p>
                <ul className='list-disc pl-6 space-y-2 mb-4'>
                    <li>You received the wrong item or fragrance.</li>
                    <li>The perfume arrived damaged.</li>
                    <li>You received a defective atomizer or broken bottle.</li>
                </ul>
                <p className='border-l-4 border-[#f83dbe] bg-white p-5 italic'>
                    For hygiene and authenticity reasons, we do not accept returns or refunds on perfumes that have been opened, sprayed, or used, unless the issue falls into one of the categories above.
                </p>
            </section>

            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">2. Non-Returnable Items</h2>
                <p className='mb-4'>
                    To maintain safety and product integrity, the following items cannot be returned or refunded:
                </p>
                <ul className='list-disc pl-6 space-y-2'>
                    <li>Opened or partially used perfumes</li>
                    <li>Perfume testers, samples, or decants</li>
                </ul>
            </section>

            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">3. Return Process</h2>
                <p className='mb-4'>
                    If your order meets the above conditions, here&apos;s how to initiate a return:
                </p>
                <ol className='list-decimal pl-6 space-y-3'>
                    <li>
                        <strong>Contact us</strong> via WhatsApp or email within <strong>24 hours</strong> of receiving the item:
                        <div className='mt-2 space-y-1'>
                            <p className='flex items-center gap-2'>
                                <span>📧</span>
                                <a href='mailto:matrixscents@gmail.com' className='text-[#a33075] underline hover:no-underline'>
                                    matrixscents@gmail.com
                                </a>
                            </p>
                            <p className='flex items-center gap-2'>
                                <span>📱</span>
                                <a href='https://wa.me/2348060119051' className='text-[#a33075] underline hover:no-underline' target='_blank' rel='noopener noreferrer'>
                                    +234 08060119051
                                </a>
                            </p>
                        </div>
                    </li>
                    <li>
                        Include your order number, photo/video evidence, and a short explanation of the issue.
                    </li>
                    <li>
                        Our support team will review and approve eligible returns.
                    </li>
                    <li>
                        You&apos;ll receive instructions and a return address.
                    </li>
                    <li>
                        Once the returned item is received and inspected, your refund or replacement will be processed within <strong>5–7 business days</strong>.
                    </li>
                </ol>
            </section>

            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">4. Refund & Exchange Options</h2>
                <p className='mb-4'>
                    After inspection, you may choose:
                </p>
                <ul className='list-disc pl-6 space-y-2 mb-4'>
                    <li>A full refund (to your original payment method)</li>
                    <li>A replacement perfume (same or similar fragrance, subject to availability)</li>
                    <li>Store credit (usable on your next purchase)</li>
                </ul>
                <p className='border-l-4 border-[#f83dbe] bg-white p-5 italic'>
                    Refunds will not include original delivery fees unless the error was from our end (e.g., wrong or damaged item).
                </p>
            </section>

            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">5. Return Shipping Costs</h2>
                <ul className='list-disc pl-6 space-y-2'>
                    <li>
                        For wrong or damaged items, <strong>Matrix Scents will cover the cost of return shipping</strong>.
                    </li>
                    <li>
                        For change-of-mind cases (if accepted at our discretion), <strong>the customer bears the shipping cost</strong>.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">6. Product Authenticity Assurance</h2>
                <p className='border-l-4 border-[#f83dbe] bg-white p-5'>
                    All Matrix Scents perfumes are <strong>100% authentic</strong>, sourced directly from trusted suppliers. Unboxed perfumes may come without original retail boxes but contain the exact same fragrance found in boxed versions.
                </p>
            </section>

            <section>
                <h2 className="mb-5 text-2xl leading-tight tracking-[-.03em] text-[#30251f] sm:text-3xl [font-family:Georgia,'Times_New_Roman',serif]">7. Final Notes</h2>
                <ul className='list-disc pl-6 space-y-2'>
                    <li>Refunds or replacements will be processed only after we receive and inspect the returned item.</li>
                    <li>Items returned without prior approval may be rejected or sent back to the customer.</li>
                    <li>Matrix Scents reserves the right to amend this policy at any time. Any updates will be reflected here and apply to future purchases.</li>
                </ul>
            </section>

            <div className='pt-4'>
                <p className="text-2xl text-[#a33075] [font-family:Georgia,'Times_New_Roman',serif]">
                    Thank you for shopping with Matrix Scents!
                </p>
            </div>
        </div>
        </div>
    </main>
  )
}

export default ReturnsRefunds
