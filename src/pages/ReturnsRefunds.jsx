import React from 'react'

const ReturnsRefunds = () => {
  return (
    <div className='w-full max-w-4xl mx-auto px-8 py-10 md:px-14 md:py-14'>
        <h1 className='font-bold text-3xl md:text-4xl text-center text-primary mb-8'>Return and Refund Policy</h1>
        
        <div className='flex flex-col gap-8 text-base leading-relaxed'>
            <section>
                <h2 className='text-2xl font-semibold text-primary mb-4'>1. Eligibility for Return or Refund</h2>
                <p className='mb-4'>
                    You may request a return or refund within <strong>24 hours</strong> of receiving your order if any of the following applies:
                </p>
                <ul className='list-disc pl-6 space-y-2 mb-4'>
                    <li>You received the wrong item or fragrance.</li>
                    <li>The perfume arrived damaged.</li>
                    <li>You received a defective atomizer or broken bottle.</li>
                </ul>
                <p className='bg-primary/10 p-4 rounded-md italic'>
                    For hygiene and authenticity reasons, we do not accept returns or refunds on perfumes that have been opened, sprayed, or used, unless the issue falls into one of the categories above.
                </p>
            </section>

            <section>
                <h2 className='text-2xl font-semibold text-primary mb-4'>2. Non-Returnable Items</h2>
                <p className='mb-4'>
                    To maintain safety and product integrity, the following items cannot be returned or refunded:
                </p>
                <ul className='list-disc pl-6 space-y-2'>
                    <li>Opened or partially used perfumes</li>
                    <li>Perfume testers, samples, or decants</li>
                </ul>
            </section>

            <section>
                <h2 className='text-2xl font-semibold text-primary mb-4'>3. Return Process</h2>
                <p className='mb-4'>
                    If your order meets the above conditions, here's how to initiate a return:
                </p>
                <ol className='list-decimal pl-6 space-y-3'>
                    <li>
                        <strong>Contact us</strong> via WhatsApp or email within <strong>24 hours</strong> of receiving the item:
                        <div className='mt-2 space-y-1'>
                            <p className='flex items-center gap-2'>
                                <span>📧</span>
                                <a href='mailto:matrixscents@gmail.com' className='text-primary underline hover:no-underline'>
                                    matrixscents@gmail.com
                                </a>
                            </p>
                            <p className='flex items-center gap-2'>
                                <span>📱</span>
                                <a href='https://wa.me/2348060119051' className='text-primary underline hover:no-underline' target='_blank' rel='noopener noreferrer'>
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
                        You'll receive instructions and a return address.
                    </li>
                    <li>
                        Once the returned item is received and inspected, your refund or replacement will be processed within <strong>5–7 business days</strong>.
                    </li>
                </ol>
            </section>

            <section>
                <h2 className='text-2xl font-semibold text-primary mb-4'>4. Refund & Exchange Options</h2>
                <p className='mb-4'>
                    After inspection, you may choose:
                </p>
                <ul className='list-disc pl-6 space-y-2 mb-4'>
                    <li>A full refund (to your original payment method)</li>
                    <li>A replacement perfume (same or similar fragrance, subject to availability)</li>
                    <li>Store credit (usable on your next purchase)</li>
                </ul>
                <p className='bg-primary/10 p-4 rounded-md italic'>
                    Refunds will not include original delivery fees unless the error was from our end (e.g., wrong or damaged item).
                </p>
            </section>

            <section>
                <h2 className='text-2xl font-semibold text-primary mb-4'>5. Return Shipping Costs</h2>
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
                <h2 className='text-2xl font-semibold text-primary mb-4'>6. Product Authenticity Assurance</h2>
                <p className='bg-primary/10 p-4 rounded-md'>
                    All Matrix Scents perfumes are <strong>100% authentic</strong>, sourced directly from trusted suppliers. Unboxed perfumes may come without original retail boxes but contain the exact same fragrance found in boxed versions.
                </p>
            </section>

            <section>
                <h2 className='text-2xl font-semibold text-primary mb-4'>7. Final Notes</h2>
                <ul className='list-disc pl-6 space-y-2'>
                    <li>Refunds or replacements will be processed only after we receive and inspect the returned item.</li>
                    <li>Items returned without prior approval may be rejected or sent back to the customer.</li>
                    <li>Matrix Scents reserves the right to amend this policy at any time. Any updates will be reflected here and apply to future purchases.</li>
                </ul>
            </section>

            <div className='border-t-2 border-primary/30 pt-8 mt-8'>
                <p className='text-center text-lg text-primary font-semibold'>
                    Thank you for shopping with Matrix Scents!
                </p>
            </div>
        </div>
    </div>
  )
}

export default ReturnsRefunds

