import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useGetProductsQuery } from '@/app/features/api/productApiSlice'
import useDebounce from '@/hooks/useDebounce'
import { useTranslation } from 'react-i18next'

const SearchBar = ({ isMobile = false, onSearch }) => {
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
  const { t } = useTranslation()
  
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
    <div className="relative w-full">
      <div className={`relative flex items-center ${isMobile ? 'h-[40px]' : 'h-[50px]'}`}>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder={isMobile ? 'Search products..' : `${t('search products')}...`}
          className={`w-full ${
            isMobile 
              ? 'pl-4 pr-10 rounded-lg bg-white text-black placeholder-black/40 placeholder:text-xs outline-none ring-0 h-full'
              : 'pl-4 border-y border-l rounded-l-lg border-primary text-primary placeholder-primary/40 placeholder:text-xs focus:outline-none bg-white h-full'
          }`}
        />
        
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('')
              setShowSuggestions(false)
              if (searchInputRef.current) {
                searchInputRef.current.focus()
              }
            }}
            className={`absolute right-12 ${isMobile ? 'text-black' : 'text-primary'} hover:opacity-70 transition-opacity`}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isMobile ? (
          <Search 
            className="absolute right-3 w-4 h-4 text-black cursor-pointer" 
            onClick={() => handleSearch()}
          />
        ) : (
          <button
            onClick={() => handleSearch()}
            className="bg-primary text-white flex items-center justify-center rounded-r-lg h-full gap-3 px-6 text-sm hover:bg-primary/90 transition-colors"
          >
            <Search className="w-4 h-4" />
            {t('search')}
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[500px] overflow-y-auto"
        >
          {/* Search Results */}
          {hasResults && searchTerm.length >= 2 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Products ({suggestions.length})
              </div>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    navigate(`/shop/${product.id}`)
                    setShowSuggestions(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{product.productName}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{product.productDescription}</p>
                    <p className="text-xs font-semibold text-primary mt-1">
                      ₦{product.productPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {suggestions.length >= 5 && (
                <button
                  onClick={() => handleSearch()}
                  className="w-full px-3 py-2 text-sm text-primary font-semibold hover:bg-primary/5 transition-colors text-center"
                >
                  View all results →
                </button>
              )}
            </div>
          )}

          {/* No Results */}
          {!hasResults && searchTerm.length >= 2 && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No products found for "{searchTerm}"</p>
              <button
                onClick={() => handleSearch()}
                className="mt-2 text-sm text-primary font-semibold hover:underline"
              >
                Search anyway
              </button>
            </div>
          )}

          {/* Search History */}
          {showHistory && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 hover:bg-primary/5 cursor-pointer transition-colors group"
                >
                  <div
                    onClick={() => {
                      setSearchTerm(term)
                      handleSearch(term)
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-700">{term}</span>
                  </div>
                  <button
                    onClick={(e) => removeFromHistory(term, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove from history"
                  >
                    <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {showPopular && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 p-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(term)
                      handleSearch(term)
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Initial State - Show both history and popular if no search term */}
          {searchTerm.length === 0 && searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 p-2">
                {popularSearches.slice(0, 3).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(term)
                      handleSearch(term)
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar

