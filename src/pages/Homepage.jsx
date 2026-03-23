import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ShoppingCart,
    Search,
    Menu,
    ArrowRight,
    Star,
    Tag,
    Instagram,
    Facebook,
    Twitter,
    Mail,
    Phone,
    MapPin,
    X,
    Clock,
    TrendingUp,
} from 'lucide-react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router';
import { useGetProductsQuery } from '@/app/features/api/productApiSlice';
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice';
import { useTranslation } from 'react-i18next';
import useDebounce from '@/hooks/useDebounce';
import Header from '@/components/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/app/features/cartSlice';

// Category image & description mapping by normalised name
const CATEGORY_META = {
    men: {
        description: 'Bold & Sophisticated',
        image: 'https://images.unsplash.com/photo-1647507653704-bde7f2d6dbf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZXJmdW1lJTIwYm90dGxlJTIwbWluaW1hbHxlbnwxfHx8fDE3Njk5NDIyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    women: {
        description: 'Elegant & Captivating',
        image: 'https://images.unsplash.com/photo-1759793500110-e3cb1f0fe6ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGZyYWdyYW5jZSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzY5OTQyMjU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    unisex: {
        description: 'For Everyone',
        image: 'https://images.unsplash.com/photo-1760862652442-e8ff7ebdd2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzY5OTQyMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
};

const popularSearchesList = [
    'Dior Sauvage',
    'Chanel No. 5',
    'YSL Libre',
    'Tom Ford Oud',
    'Creed Aventus',
];

const footerSections = {
    shop: [
        { name: 'New Arrivals', href: '#' },
        { name: "Men's Fragrances", href: '#' },
        { name: "Women's Fragrances", href: '#' },
        { name: 'Best Sellers', href: '#' },
        { name: 'Gift Sets', href: '#' },
    ],
    support: [
        { name: 'Contact Us', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Shipping & Returns', href: '#' },
        { name: 'Track Order', href: '#' },
        { name: 'Size Guide', href: '#' },
    ],
    company: [
        { name: 'About Us', href: '#' },
        { name: 'Our Story', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
    ],
};

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
];

// ==================== COMPONENTS ====================

// Search Modal Component
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
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
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
                                                                    src={product.productThumbnail || product.image || 'https://via.placeholder.com/150'}
                                                                    alt={product.productName}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                                                                    {product.productName}
                                                                </p>
                                                                <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                                                                    {product.productDescription}
                                                                </p>
                                                                <p className="text-sm font-bold text-primary">
                                                                    ₦{product.productPrice?.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="size-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    ))}
                                                </div>
                                                {suggestions.length >= 5 && (
                                                    <button
                                                        onClick={() => handleSearch()}
                                                        className="w-full py-4 mt-2 text-sm text-primary font-bold hover:bg-red-50 rounded-2xl transition-colors text-center"
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
                                                    className="mt-4 text-sm text-primary font-bold hover:underline"
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
                                                        className="px-4 py-2 text-sm bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-full transition-all"
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

// Header Component


// Hero Section Component
function Hero() {
    const navigate = useNavigate();
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1760862652442-e8ff7ebdd2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzY5OTQyMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Luxury Perfumes"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 mb-6">
                            <Star className="size-5 text-primary fill-primary" />
                            <span className="text-primary font-medium">Premium Collection 2026</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                            Discover Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/40 to-primary/70">
                                Signature Scent
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                            Explore our curated collection of authentic designer fragrances. Luxury quality at
                            accessible prices, delivered to your door.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/shop')}
                                className="group px-8 py-4 bg-gradient-to-r from-[#C83232] via-red-600 to-red-800 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-[#C83232]/50 transition-shadow"
                            >
                                Explore Collection
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/shop', { state: { category: 13 } })}
                                className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors"
                            >
                                Shop Men's
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/shop', { state: { category: 14 } })}
                                className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors"
                            >
                                Shop Women's
                            </motion.button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 mt-16 pt-8 border-t border-white/20">
                            {[
                                { label: 'Premium Brands', value: '50+' },
                                { label: 'Happy Customers', value: '10K+' },
                                { label: 'Products', value: '500+' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
                >
                    <div className="w-1 h-2 bg-white/50 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}

// Category Bento Component
function CategoryBento() {
    const navigate = useNavigate();
    const { data: categories } = useGetCategoriesQuery({ searchTerm: '' });

    const handleCategoryClick = (categoryId) => {
        navigate('/shop', { state: { category: categoryId } });
    };

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-bold mb-4"
                    >
                        Shop by Category
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600"
                    >
                        Find your perfect match in our expertly curated collections
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories?.map((category, index) => {
                        const key = category.categoryName?.toLowerCase();
                        const meta = CATEGORY_META[key] ?? {
                            description: 'Explore Collection',
                            image: 'https://images.unsplash.com/photo-1745826420604-41187121dd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3Njk5NDIyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
                        };
                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleCategoryClick(category.id)}
                                className="group relative overflow-hidden cursor-pointer"
                            >
                                <div className="relative overflow-hidden bg-black h-[420px]">
                                    {/* Image */}
                                    <img
                                        src={meta.image}
                                        alt={category.categoryName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wider">
                                                {meta.description}
                                            </p>
                                            <h3 className="text-white font-bold mb-4 text-4xl md:text-5xl capitalize">
                                                {category.categoryName}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                                                <span className="font-medium">Explore</span>
                                                <ArrowRight className="size-5" />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Hover Border Effect */}
                                    <div className="absolute inset-0 border-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Features Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8 mt-16 p-8 bg-white border-l-4 border-primary"
                >
                    {[
                        { label: '100% Authentic', value: 'Guaranteed genuine products' },
                        { label: '24/7 Support', value: 'Expert advice anytime' },
                    ].map((feature) => (
                        <div key={feature.label} className="flex items-center gap-4">
                            <div className="size-2 bg-primary rounded-full" />
                            <div>
                                <p className="font-bold text-lg">{feature.label}</p>
                                <p className="text-gray-600 text-sm">{feature.value}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Promotions Component
function Promotions() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Promo Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden"
                >
                    <div className="relative h-[500px] md:h-[600px]">
                        {/* Background Image */}
                        <img
                            src="https://images.unsplash.com/photo-1760862652442-e8ff7ebdd2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzY5OTQyMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Promotion Banner"
                            className="w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-3xl px-8 md:px-16">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C83232] to-red-800">
                                        <Tag className="size-5 text-white" />
                                        <span className="text-white font-bold uppercase tracking-wider text-sm">
                                            Limited Time Offer
                                        </span>
                                    </div>

                                    {/* Main Text */}
                                    <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                                        Up to 40% Off
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C83232] via-red-400 to-red-300">
                                            Designer Fragrances
                                        </span>
                                    </h2>

                                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                                        Shop our exclusive collection of premium scents. Authentic products,
                                        unbeatable prices. Offer ends soon!
                                    </p>

                                    {/* CTA Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group px-8 py-4 bg-gradient-to-r from-[#C83232] via-red-600 to-red-800 text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl hover:shadow-[#C83232]/50 transition-shadow"
                                    >
                                        Shop Now
                                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Product Card Component
function ProductCard({ product, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch()

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative mb-4 overflow-hidden bg-gray-100">
                <div className="aspect-[3/4] relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Featured Badge */}
                    {product.featured && (
                        <div className="absolute top-4 left-4">
                            <div className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider">
                                Featured
                            </div>
                        </div>
                    )}

                    {/* Overlay with CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}

                            onClick={() => dispatch(addToCart({ productImage: product.image, productName: product.name, productPrice: product.price, id: product.id }))}
                            className="px-6 py-3 bg-white text-black font-semibold flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
                        >
                            <ShoppingCart className="size-5" />
                            Add to Cart
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <p className="text-sm text-gray-500 uppercase tracking-wider">{product.brand}</p>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-xl font-bold">{`₦${product.price?.toLocaleString()}`}</p>
            </div>
        </motion.div>
    );
}

// Featured Products Component
function FeaturedProducts() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetProductsQuery({
        page: 1,
        pageSize: 50, // Fetch more to get assorted brands
        searchTerm: '',
        category: '',
        region: '',
        priceRange: [0, 600000]
    });

    const featuredBrandsList = useMemo(() => {
        if (!data?.products) return [];

        const selected = [];
        const seenBrands = new Set();

        for (const product of data.products) {
            const brandId = product.productRegion;
            const brandName = product.regions?.regionName;

            // Limit to exactly 1 product per brand (region), up to 6 total
            if (brandId && brandName && !seenBrands.has(brandId)) {
                seenBrands.add(brandId);
                selected.push({
                    id: product.id,
                    name: product.productName,
                    brand: brandName,
                    price: product.productPrice,
                    image: product.productImage || 'https://images.unsplash.com/photo-1647507653704-bde7f2d6dbf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                    featured: true,
                });
            }
            if (selected.length >= 6) break;
        }

        return selected;
    }, [data?.products]);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-end justify-between mb-16">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-bold mb-4"
                        >
                            Featured Brands
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600"
                        >
                            One iconic scent from each of our luxury partners
                        </motion.p>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5 }}
                        onClick={() => navigate('/shop')}
                        className="hidden md:block text-lg font-semibold text-primary hover:text-red-700 underline underline-offset-4"
                    >
                        View All Products
                    </motion.button>
                </div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array(6).fill(null).map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-lg w-full" />
                        ))
                    ) : (
                        featuredBrandsList.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))
                    )}
                </div>

                {/* Mobile View All Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => navigate('/shop')}
                    className="md:hidden w-full mt-12 px-8 py-4 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors"
                >
                    View All Products
                </motion.button>
            </div>
        </section>
    );
}

const FORMSPREE_NEWSLETTER_ENDPOINT = 'https://formspree.io/f/mwvrdavg'; // Replace with actual endpoint later

const newsletterSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().min(2, 'First Name must be at least 2 characters')
});

// Newsletter Component
function Newsletter() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(newsletterSchema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitSuccess(false);

        try {
            const response = await fetch(FORMSPREE_NEWSLETTER_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                toast.success('Successfully subscribed to the newsletter!');
                setSubmitSuccess(true);
                reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to subscribe');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.message || 'Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30">
                                <p className="text-primary font-semibold text-sm uppercase tracking-wider">
                                    Stay Updated
                                </p>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                                Join Our Newsletter
                            </h2>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                Be the first to know about new arrivals, exclusive offers, and fragrance tips
                                from our experts.
                            </p>

                            <div className="flex gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary">5K+</p>
                                    <p className="text-sm text-gray-500">Subscribers</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">Weekly</p>
                                    <p className="text-sm text-gray-500">Updates</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {submitSuccess && (
                                <div className="p-4 bg-green-50/10 border border-green-500/30 rounded-lg">
                                    <p className="text-green-400 text-sm">
                                        ✓ Successfully subscribed to our newsletter!
                                    </p>
                                </div>
                            )}

                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                                >
                                    Email Address
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    id="email"
                                    placeholder="your.email@example.com"
                                    className={`w-full px-6 py-4 bg-white text-black font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                                        ? 'border-2 border-red-500 focus:ring-red-500'
                                        : 'focus:ring-primary border-transparent'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Name Input */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                                >
                                    First Name
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    id="name"
                                    placeholder="John"
                                    className={`w-full px-6 py-4 bg-white text-black font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.name
                                        ? 'border-2 border-red-500 focus:ring-red-500'
                                        : 'focus:ring-primary border-transparent'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full px-8 py-4 bg-gradient-to-r from-[#C83232] via-red-600 to-red-800 text-white font-bold flex items-center justify-center gap-2 hover:from-red-700 hover:to-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Subscribing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Subscribe Now
                                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </motion.button>

                            <p className="text-xs text-gray-500 leading-relaxed">
                                By subscribing, you agree to receive marketing emails from Luxury Scents.
                                Unsubscribe anytime.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// Footer Component
export function Footer() {
    return (
        <footer className="bg-white border-t-4 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 py-20">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div>
                            <h3 className="text-3xl font-bold mb-2">Luxury Scents</h3>
                            <p className="text-primary font-semibold">Within Reach</p>
                        </div>

                        <p className="text-gray-600 leading-relaxed max-w-md">
                            Experience authentic designer fragrances at accessible prices. Premium quality,
                            curated collections, delivered with care.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="size-5" />
                                <span>+234 806 011 9055</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="size-5" />
                                <span>hello@luxuryscents.ng</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="size-5" />
                                <span>Lagos, Nigeria</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 pt-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="size-12 border-2 border-black flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-colors"
                                    >
                                        <Icon className="size-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Shop Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            {footerSections.shop.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            {footerSections.support.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3">
                            {footerSections.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © 2026 Luxury Scents. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ==================== MAIN HOMEPAGE ====================
export default function Homepage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header scrollY={scrollY} />
            <Hero />
            <CategoryBento />
            <Newsletter />
            {/* <Promotions /> */}
            <FeaturedProducts />

        </div>
    );
}
