import { Route, Routes } from "react-router"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Shop from "./pages/Shop"
import SingleProducts from "./pages/SingleProducts"
import About from "./pages/About"
import Cart from "./pages/Cart"
import ReturnsRefunds from "./pages/ReturnsRefunds"
import FAQ from "./pages/FAQ"
import Contact from "./pages/Contact"
import SearchResults from "./pages/SearchResults"
import ErrorPage from "./pages/ErrorPage"
import AdminLayout from "./pages/admin/AdminLayout"
import Products from "./pages/admin/Products"
import Dashboard from "./pages/admin/Dashboard"
import Categories from "./pages/admin/Categories"
import Regions from "./pages/admin/Regions"
import { useEffect } from "react"
import supabase from "./app/supabaseClient"
import { clearAuthState, setAuthState } from "./app/features/authSlice"
import { useDispatch } from "react-redux"
import ProfilePage from "./pages/ProfilePage"
import Checkout from "./pages/Checkout"
import ProtectedPage from "./components/ProtectedPage"
import Homepage from "./pages/Homepage"



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);

        // Handle sign out and initial session events
        if (event === 'SIGNED_OUT') {
          dispatch(clearAuthState());
          return;
        }

        // Handle authenticated states
        if (session?.user) {
          console.log(session)
          dispatch(setAuthState({ id: session.user.id }));

        }
      }
    );

    // Cleanup function
    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);



  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />

        {/* AUTHENTICATION ROUTES */}
        <Route path='auth' >
          <Route index element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* PUBLIC ROUTES */}
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<SingleProducts />} />
        <Route path="about" element={<About />} />
        <Route path="cart" element={<Cart />} />
        <Route path="returns-refunds" element={<ReturnsRefunds />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="*" element={<ErrorPage />} />


        {/* AUTHENTICATED ROUTES */}
        <Route element={<ProtectedPage />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Route>

      <Route element={<ProtectedPage />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="regions" element={<Regions />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
