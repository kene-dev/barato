import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { 
  Mail, 
  Phone, 
  Send, 
  MessageSquare,
  User,
  Instagram,
  MessageCircle
} from 'lucide-react'

// FormSpree endpoint - Replace with your FormSpree form ID
// 
// To set up FormSpree:
// 1. Go to https://formspree.io/ and create a free account
// 2. Create a new form and get your form ID
// 3. Replace 'YOUR_FORM_ID' below with your actual form ID
// Example: 'https://formspree.io/f/xpzgkqyz'
//
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyzbrbpk'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        setSubmitSuccess(true)
        reset()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'matrixscents@gmail.com',
      link: 'mailto:matrixscents@gmail.com',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+234 08060119051',
      link: 'tel:+2348060119051',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: 'Chat with us',
      link: 'https://wa.me/2348060119051',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Instagram,
      title: 'Follow Us',
      content: '@matrix_scents',
      link: 'https://www.instagram.com/matrix_scents',
      color: 'bg-pink-50 text-pink-600'
    }
  ]

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      {/* Hero Section */}
      <div className='w-full bg-primary/5 py-12 md:py-16 lg:py-20'>
        <div className='max-w-7xl mx-auto px-5 md:px-8 lg:px-14 text-center'>
          <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl text-primary mb-4'>
            Get In Touch
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
            Have a question or need help? We're here for you. Reach out and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-5 md:px-8 lg:px-14 py-10 md:py-16'>
        {/* Contact Info Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16'>
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className='group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary/30'
              >
                <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className='w-6 h-6' />
                </div>
                <h3 className='font-semibold text-lg text-gray-800 mb-2'>{info.title}</h3>
                <p className='text-sm text-gray-600 group-hover:text-primary transition-colors'>{info.content}</p>
                <div className='absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-300'></div>
              </a>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
          {/* Contact Form */}
          <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>Send us a Message</h2>
            </div>

            {submitSuccess && (
              <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-green-800 text-sm'>
                  ✓ Your message has been sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Name Field */}
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                  <User className='inline w-4 h-4 mr-1' />
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type='text'
                  id='name'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder='John Doe'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                  <Mail className='inline w-4 h-4 mr-1' />
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type='email'
                  id='email'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder='john@example.com'
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                  <Phone className='inline w-4 h-4 mr-1' />
                  Phone Number (Optional)
                </label>
                <input
                  {...register('phone')}
                  type='tel'
                  id='phone'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder='+234 800 000 0000'
                />
                {errors.phone && (
                  <p className='mt-1 text-sm text-red-600'>{errors.phone.message}</p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>
                  Subject *
                </label>
                <input
                  {...register('subject')}
                  type='text'
                  id='subject'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.subject
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder='What is this regarding?'
                />
                {errors.subject && (
                  <p className='mt-1 text-sm text-red-600'>{errors.subject.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  id='message'
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.message
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder='Tell us how we can help you...'
                />
                {errors.message && (
                  <p className='mt-1 text-sm text-red-600'>{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Sending...
                  </span>
                ) : (
                  <span className='flex items-center justify-center gap-2'>
                    <Send className='w-5 h-5' />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Additional Info Section */}
          <div className='space-y-6'>
            {/* Why Contact Us */}
            <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100'>
              <h3 className='text-xl md:text-2xl font-bold text-gray-800 mb-4'>Why Contact Us?</h3>
              <ul className='space-y-3 text-gray-600'>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Get personalized perfume recommendations</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Track your order status</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Report issues or concerns</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Learn about our products and services</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Provide feedback and suggestions</span>
                </li>
              </ul>
            </div>

            {/* Quick Response */}
            <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
                  <MessageCircle className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>Quick Response</h3>
              </div>
              <p className='text-gray-600 text-sm leading-relaxed'>
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent matters, please call us directly or reach out via WhatsApp for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

