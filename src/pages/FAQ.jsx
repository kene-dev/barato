import PageIntro from '@/components/PageIntro'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = () => {
  const faqs = [
    {
      question: "Are your perfumes original?",
      answer: "Yes! Every perfume we sell is 100% original and authentic, sourced from trusted distributors. We do not sell imitations, fillers, or counterfeit products."
    },
    {
      question: "Do you deliver nationwide?",
      answer: "We offer nationwide delivery — from Lagos to Abuja, Kano to Port Harcourt, and every other state in Nigeria."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery usually takes 1–3 working days within major cities and 3–5 days for other locations, depending on your state."
    },
    {
      question: "Can I pay on delivery?",
      answer: "Yes, we offer payment on delivery in selected cities. However, full payment before dispatch helps us process your order faster."
    },
    {
      question: "How long do your perfumes last?",
      answer: "Our perfumes are long-lasting, just like boxed originals. Longevity depends on your skin type, weather, and the perfume's concentration (EDP, EDT, or extrait)."
    },
    {
      question: "How can I contact Matrix Scents?",
      answer: "You can reach us via DM, WhatsApp, or the contact number on our page for orders, inquiries, or perfume recommendations."
    }
  ]

  return (
    <main className='min-h-screen bg-[#f9f6f1] text-[#30251f]'>
      <PageIntro eyebrow='Good to know / FAQ' title='A few things you may be wondering.' description='Find answers about our fragrances, orders, and delivery.' />
      <div className='mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20'>
        <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[#e3d7c9] bg-white px-5 transition-colors hover:border-[#c9aa97] md:px-7"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium text-[#30251f] hover:text-[#a33075] md:py-6 md:text-lg [&[data-state=open]]:text-[#a33075]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-[#685b51] md:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className='mx-auto max-w-4xl border-t border-[#ded2c5] px-5 py-10 sm:px-8'>
        <h2 className="text-3xl tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">Still have questions?</h2>
        <p className='mt-3 text-sm leading-7 text-[#685b51] md:text-base'>
          Feel free to reach out to us via{' '}
          <a
            href="https://www.instagram.com/matrix_scents"
            target="_blank"
            rel="noopener noreferrer"
            className='font-semibold text-[#a33075] hover:underline'
          >
            Instagram
          </a>
          {' '}or{' '}
          <a
            href="https://wa.me/2348060119051"
            target="_blank"
            rel="noopener noreferrer"
            className='font-semibold text-[#a33075] hover:underline'
          >
            WhatsApp
          </a>
        </p>
      </div>
    </main>
  )
}

export default FAQ
