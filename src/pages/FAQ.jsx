import React from 'react'
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
    <div className='w-full max-w-4xl mx-auto px-5 md:px-8 lg:px-14 py-10 md:py-14 2xl:px-24 2xl:py-24'>
      <h1 className='font-bold text-3xl md:text-4xl text-center text-primary mb-4 md:mb-8'>
        Frequently Asked Questions
      </h1>
      
      <p className='text-center text-base md:text-lg text-gray-600 mb-8 md:mb-12'>
        Find answers to common questions about our products and services
      </p>

      <div className='w-full'>
        <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-primary/20 rounded-lg px-4 md:px-6 bg-white shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-primary hover:text-primary/80 py-4 md:py-5 [&[data-state=open]]:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-gray-700 leading-relaxed pb-4 md:pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className='mt-12 md:mt-16 text-center'>
        <p className='text-base md:text-lg text-gray-600 mb-4'>
          Still have questions?
        </p>
        <p className='text-sm md:text-base text-gray-500'>
          Feel free to reach out to us via{' '}
          <a 
            href="https://www.instagram.com/matrix_scents" 
            target="_blank" 
            rel="noopener noreferrer"
            className='text-primary hover:underline font-semibold'
          >
            Instagram
          </a>
          {' '}or{' '}
          <a 
            href="https://wa.me/2348060119051" 
            target="_blank" 
            rel="noopener noreferrer"
            className='text-primary hover:underline font-semibold'
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}

export default FAQ

