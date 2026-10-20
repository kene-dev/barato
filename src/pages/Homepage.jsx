import { getProductPrice } from '@/lib/productPricing';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowUpRight,
    Check,
    Plus,
    Search,
    Menu,
    ArrowRight,
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
import homeHero from '../assets/home-hero-editorial.jpg';
import categoryMen from '../assets/category-men-editorial.jpg';
import categoryWomen from '../assets/category-women-editorial.jpg';
import categoryUnisex from '../assets/category-unisex-editorial.jpg';
import { Link, useNavigate } from 'react-router';
import { useGetProductsQuery } from '@/app/features/api/productApiSlice';
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice';
import { useTranslation } from 'react-i18next';
import useDebounce from '@/hooks/useDebounce';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '@/app/features/cartSlice';

// Category image & description mapping by normalised name
const CATEGORY_META = {
    men: { description: 'Grounded & expressive', image: categoryMen },
    women: { description: 'Softness with character', image: categoryWomen },
    unisex: { description: 'Made for everyone', image: categoryUnisex },
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
        <section className="bg-[#f5efe7] pt-20 text-[#30251f]" aria-labelledby="home-hero-heading">
            <div className="mx-auto grid max-w-[1500px] lg:min-h-[650px] lg:grid-cols-[47%_53%]">
                <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 lg:py-20 xl:px-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <p className="mb-7 flex items-center gap-3 text-[11px] font-semibold tracking-[.24em] uppercase text-[#a33075]">
                            <span className="h-px w-8 bg-[#a33075]" /> The art of finding your scent
                        </p>
                        <h1 id="home-hero-heading" className="max-w-[720px] text-[clamp(3.5rem,7vw,7.2rem)] leading-[.91] tracking-[-.065em] [font-family:Georgia,'Times_New_Roman',serif]">
                            A little<br /><em className="font-normal text-[#a33075]">more you.</em>
                        </h1>
                        <p className="mt-8 max-w-md text-base leading-7 text-[#62554c] sm:text-lg">
                            Fragrances to wear close, give generously, and remember long after the day ends.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                            <button type="button" onClick={() => navigate('/shop')} className="inline-flex min-h-12 items-center gap-4 border border-[#30251f] bg-[#30251f] px-6 text-sm font-medium text-white shadow-[4px_4px_0_#f83dbe] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075]">
                                Shop the collection <ArrowUpRight size={17} />
                            </button>
                            <button type="button" onClick={() => navigate('/shop', { state: { category: 13 } })} className="border-b border-[#30251f] py-2 text-sm font-medium hover:text-[#a33075] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075]">
                                Explore men&apos;s scents
                            </button>
                        </div>
                    </motion.div>
                    <p className="mt-14 hidden border-t border-[#d6c9bb] pt-4 text-[11px] tracking-[.2em] uppercase text-[#76685d] lg:block">01 / A fragrance wardrobe for every mood</p>
                </div>
                <div className="relative min-h-[340px] overflow-hidden bg-[#e8d8c5] sm:min-h-[480px] lg:min-h-full">
                    <img src={homeHero} alt="Amber perfume bottle, linen and burgundy flower in afternoon light" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[70%_center] lg:object-[66%_center]" />
                    <div className="absolute right-5 bottom-5 border border-white/70 bg-[#faf7f2]/90 px-4 py-2 text-[10px] tracking-[.16em] uppercase text-[#30251f] backdrop-blur-sm sm:right-8 sm:bottom-8">Curated with feeling</div>
                </div>
            </div>
        </section>
    );
}

// Category Bento Component
function CategoryBento() {
    const { data: categories } = useGetCategoriesQuery({ searchTerm: '' });

    const getCategoryMeta = (name = '') => {
        const normalized = name.toLowerCase();
        if (/^men|^male/.test(normalized)) return CATEGORY_META.men;
        if (/^women|^ladies|^female/.test(normalized)) return CATEGORY_META.women;
        return CATEGORY_META.unisex;
    };

    return (
        <section className="bg-[#f9f6f1] py-20 text-[#30251f] sm:py-24" aria-labelledby="category-heading">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
                    <div>
                        <p className="mb-3 text-[11px] font-semibold tracking-[.22em] uppercase text-[#a33075]">The scent library</p>
                        <h2 id="category-heading" className="text-[clamp(2.6rem,5vw,4.8rem)] leading-[.98] tracking-[-.05em] [font-family:Georgia,'Times_New_Roman',serif]">Follow your instinct.</h2>
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-[#6e6258]">A collection for every side of you. Start wherever the mood takes you.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {categories?.map((category, index) => {
                        const meta = getCategoryMeta(category.categoryName);
                        return (
                            <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="min-w-0">
                                <Link to="/shop" state={{ category: category.id }} className="group relative block aspect-[4/5] overflow-hidden bg-[#ddcbbb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075] sm:aspect-[3/4]">
                                    <img src={meta.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1d1513]/85 via-transparent to-transparent" />
                                    <span className="absolute top-5 left-5 border border-white/70 px-3 py-1.5 text-[10px] tracking-[.14em] uppercase text-white">No. 0{index + 1}</span>
                                    <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-3 text-white sm:right-7 sm:bottom-7 sm:left-7">
                                        <div>
                                            <p className="mb-2 text-[11px] tracking-[.16em] uppercase text-[#f4d8e7]">{meta.description}</p>
                                            <h3 className="text-3xl leading-none tracking-[-.04em] capitalize sm:text-4xl [font-family:Georgia,'Times_New_Roman',serif]">{category.categoryName}</h3>
                                        </div>
                                        <span className="grid size-10 shrink-0 place-items-center border border-white/80 transition-colors group-hover:bg-white group-hover:text-[#30251f]" aria-hidden="true"><ArrowUpRight size={18} /></span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
                <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#d9cec0] pt-5 text-[11px] tracking-[.12em] uppercase text-[#74685e]">
                    <span>Chosen for the moments that stay</span><span>Find your kind of fragrance ↗</span>
                </div>
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
    const dispatch = useDispatch()
    const isInCart = useSelector(state => selectCartItems(state).some(item => item.id === product.id))
    const hasPreviousPrice = Number(product.originalPrice) > Number(product.price)
    const formatPrice = price => Number(price).toLocaleString('en-NG', {
        style: 'currency', currency: 'NGN', maximumFractionDigits: 0,
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="group flex h-full min-w-0 flex-col border border-[#e7dfd5] bg-[#faf7f2] p-2.5 pb-5 text-[#30251f]"
        >
            <div className="relative">
                <Link to={`/shop/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#eee8df] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ba167f]">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transform-none"
                    />
                    <span className="absolute right-3 bottom-3 grid size-9 place-items-center border border-[#30251f30] bg-[#faf7f2]" aria-hidden="true"><ArrowUpRight size={18} /></span>
                </Link>
                {product.featured && <span className="absolute top-4 -left-[5px] -rotate-5 bg-[#f83dbe] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase">Featured</span>}
            </div>
            <div className="flex flex-1 flex-col px-2 pt-5">
                <p className="mb-2 text-[10px] font-semibold tracking-[.18em] text-[#a33075] uppercase">{product.brand}</p>
                <h3 className="mb-5 text-[clamp(1.35rem,2vw,1.8rem)] leading-tight tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">
                    <Link to={`/shop/${product.id}`} className="hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ba167f]">{product.name}</Link>
                </h3>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#d9cec0] pt-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                        {hasPreviousPrice && <del className="text-xs text-[#796d63]">{formatPrice(product.originalPrice)}</del>}
                    </div>
                    <button
                        type="button"
                        disabled={isInCart}
                        onClick={() => dispatch(addToCart({ productImage: product.image, productName: product.name, productPrice: product.originalPrice, discountedPrice: product.price, id: product.id }))}
                        className={`inline-flex min-h-11 items-center gap-2 border px-3 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ba167f] ${isInCart ? 'cursor-not-allowed border-[#d1cbc5] bg-[#e6e2dd] text-[#716b65]' : 'border-[#30251f] bg-[#f83dbe] shadow-[3px_3px_0_#30251f] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-[3px] active:translate-y-[3px]'}`}
                    >
                        {isInCart ? 'In cart' : 'Add to cart'}
                        {isInCart ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                    </button>
                </div>
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
                    price: getProductPrice(product),
                    originalPrice: product.productPrice,
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
        <section className="bg-[#e8dbce] py-20 text-[#30251f] sm:py-24" aria-labelledby="newsletter-heading">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20 lg:px-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="mb-5 text-[11px] font-semibold tracking-[.22em] uppercase text-[#a33075]">A note from Matrix Scents</p>
                    <h2 id="newsletter-heading" className="max-w-xl text-[clamp(2.8rem,5vw,5rem)] leading-[.98] tracking-[-.055em] [font-family:Georgia,'Times_New_Roman',serif]">
                        Good things are <em className="font-normal text-[#a33075]">in the air.</em>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-7 text-[#62554c]">Get the first word on new fragrances, thoughtful finds, and special offers.</p>
                    <div className="mt-10 h-px max-w-md bg-[#cbb8a7]" />
                    <p className="mt-4 text-[11px] tracking-[.16em] uppercase text-[#76685d]">Your inbox, with a little more feeling</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="border border-[#d5c5b7] bg-[#faf7f2] p-6 shadow-[8px_8px_0_#d1baa7] sm:p-9">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {submitSuccess && <p role="status" className="border border-[#86a581] bg-[#e9f2e5] p-3 text-sm text-[#31552b]">You’re on the list. Look out for a note from us.</p>}
                        <div>
                            <label htmlFor="name" className="mb-2 block text-[11px] font-semibold tracking-[.14em] uppercase">First name</label>
                            <input {...register('name')} id="name" type="text" autoComplete="given-name" placeholder="Your first name" className="min-h-12 w-full border border-[#cdbdae] bg-white px-4 text-sm outline-none placeholder:text-[#8a7c72] focus-visible:border-[#a33075]" />
                            {errors.name && <p className="mt-2 text-sm text-[#a02e4f]">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-2 block text-[11px] font-semibold tracking-[.14em] uppercase">Email address</label>
                            <input {...register('email')} id="email" type="email" autoComplete="email" placeholder="you@example.com" className="min-h-12 w-full border border-[#cdbdae] bg-white px-4 text-sm outline-none placeholder:text-[#8a7c72] focus-visible:border-[#a33075]" />
                            {errors.email && <p className="mt-2 text-sm text-[#a02e4f]">{errors.email.message}</p>}
                        </div>
                        <button type="submit" disabled={isSubmitting} className="flex min-h-12 w-full items-center justify-between gap-3 bg-[#30251f] px-5 text-sm font-medium text-white transition-colors hover:bg-[#50372f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075] disabled:cursor-wait disabled:opacity-60">
                            {isSubmitting ? 'Subscribing…' : 'Join the list'} <ArrowUpRight size={18} aria-hidden="true" />
                        </button>
                        <p className="text-xs leading-5 text-[#75685d]">Occasional emails from Matrix Scents. Unsubscribe anytime.</p>
                    </form>
                </motion.div>
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
                            <h3 className="text-3xl font-bold mb-2">Matrix Scents</h3>
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
                                <span>Contact us through the site</span>
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
                            © 2026 Matrix Scents. All rights reserved.
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
    return (
        <div className="min-h-screen bg-[#f9f6f1]">
            <Hero />
            <CategoryBento />
            <Newsletter />
            <FeaturedProducts />

        </div>
    );
}
