import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { useGetProductsQuery } from '@/app/features/api/productApiSlice'
import useDebounce from '@/hooks/useDebounce'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'

function SearchModal({ isOpen, onClose, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [popularSearches] = useState([
    'Perfume',
    'Cologne',
    'Fragrance',
    'Designer Scents',
    'Luxury Perfumes'
  ])
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const navigate = useNavigate()
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Fetch search suggestions
  const { data: suggestionsData } = useGetProductsQuery({
    searchTerm: debouncedSearchTerm,
    page: 1,
    pageSize: 5,
    category: '',
    region: '',
    priceRange: [0, 600000]
  }, {
    skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2
  })

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Save search to history
  const saveToHistory = (term) => {
    if (!term.trim()) return

    const updatedHistory = [
      term,
      ...searchHistory.filter(item => item.toLowerCase() !== term.toLowerCase())
    ].slice(0, 5) // Keep only last 5 searches

    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }

  // Remove from history
  const removeFromHistory = (term, e) => {
    e.stopPropagation()
    const updatedHistory = searchHistory.filter(item => item !== term)
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }

  // Handle search submission
  const handleSearch = (term = searchTerm) => {
    if (!term.trim()) return

    saveToHistory(term)
    setShowSuggestions(false)

    if (onSearch) {
      onSearch(term)
    } else {
      navigate(`/search?q=${encodeURIComponent(term)}`)
    }

    if (searchInputRef.current) {
      searchInputRef.current.blur()
    }

    onClose()
  }

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(value.length > 0 || searchHistory.length > 0 || popularSearches.length > 0)
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      if (searchInputRef.current) {
        searchInputRef.current.blur()
      }
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestions = suggestionsData?.products || []
  const hasResults = suggestions.length > 0
  const showHistory = searchTerm.length === 0 && searchHistory.length > 0
  const showPopular = searchTerm.length === 0 && searchHistory.length === 0


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              {/* Header & Input */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Search Products</h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for perfumes, brands, or categories..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-cyan-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Integrated Content Area */}
              <div
                ref={suggestionsRef}
                className="flex-1 overflow-y-auto p-4 custom-scrollbar"
              >
                {searchTerm.length >= 2 ? (
                  <>
                    {/* Search Results */}
                    {hasResults ? (
                      <div className="space-y-4">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Products ({suggestions.length})
                        </div>
                        <div className="grid gap-2">
                          {suggestions.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                navigate(`/shop/${product.id}`)
                                onClose()
                              }}
                              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
                            >
                              <div className="size-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={product.productThumbnail || product.productImage || 'https://via.placeholder.com/150'}
                                  alt={product.productName}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-cyan-600 transition-colors truncate">
                                  {product.productName}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                                  {product.productDescription}
                                </p>
                                <p className="text-sm font-bold text-cyan-600">
                                  ₦{product.productPrice?.toLocaleString()}
                                </p>
                              </div>
                              <ArrowRight className="size-4 text-gray-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                            </div>
                          ))}
                        </div>
                        {suggestions.length >= 5 && (
                          <button
                            onClick={() => handleSearch()}
                            className="w-full py-4 mt-2 text-sm text-cyan-600 font-bold hover:bg-cyan-50 rounded-2xl transition-colors text-center"
                          >
                            View all results →
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="inline-flex items-center justify-center size-16 bg-gray-50 rounded-full mb-4">
                          <Search className="size-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No products found for &quot;{searchTerm}&quot;</p>
                        <button
                          onClick={() => handleSearch()}
                          className="mt-4 text-sm text-cyan-600 font-bold hover:underline"
                        >
                          Search anyway
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-8 p-2">
                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                          <Clock className="size-3" />
                          Recent Searches
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchHistory.map((term, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer transition-colors group"
                            >
                              <span
                                onClick={() => {
                                  setSearchTerm(term)
                                  handleSearch(term)
                                }}
                                className="text-sm text-gray-700"
                              >
                                {term}
                              </span>
                              <button
                                onClick={(e) => removeFromHistory(term, e)}
                                className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                        <TrendingUp className="size-3" />
                        Popular Searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchTerm(term)
                              handleSearch(term)
                            }}
                            className="px-4 py-2 text-sm bg-gray-50 hover:bg-cyan-500 hover:text-white text-gray-700 rounded-full transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchModal

