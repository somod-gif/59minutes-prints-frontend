"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle, FaHome, FaBoxOpen, FaListAlt, FaStar, FaStore, FaInfoCircle } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../utils/firebaseconfig";
import logo from "../../../public/images/brandimage.jpeg";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: <FaHome className="mr-2" /> },
  { label: "Products", href: "/Products", icon: <FaBoxOpen className="mr-2" /> },
  { label: "Categories", href: "/Pages/Categories", icon: <FaListAlt className="mr-2" /> },
  { label: "Features", href: "/Pages/Features", icon: <FaStar className="mr-2" /> },
  { label: "Become a Vendor", href: "/Vendor", icon: <FaStore className="mr-2" /> },
  { label: "About Us", href: "/Pages/About", icon: <FaInfoCircle className="mr-2" /> },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const pathname = usePathname();
  const auth = getAuth(app);

  // Cart count state with improved calculation
  const [cartCount, setCartCount] = useState(0);

  // Effect to handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // User authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Effect to update cart count whenever cartItems change
  useEffect(() => {
    // Calculate the total number of items in the cart
    const count = cartItems.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
    setCartCount(count);
    
    // Add visual feedback when items are added (optional)
    if (count > 0) {
      const cartIcons = document.querySelectorAll('.cart-icon');
      cartIcons.forEach(icon => {
        if (icon) {
          icon.classList.add('cart-pulse');
          setTimeout(() => {
            if (icon) icon.classList.remove('cart-pulse');
          }, 1000);
        }
      });
    }
  }, [cartItems]);

  // Effect to detect scrolling for navbar style change with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .cart-pulse, .animate-bounce {
            animation: none !important;
          }
        }
        
        .cart-pulse {
          animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .mobile-menu-transition {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        
        /* Improve iOS support */
        .smooth-scroll {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Fix for older Safari */
        @supports (-webkit-touch-callout: none) {
          .fixed-ios {
            position: fixed;
            width: 100%;
          }
        }
      `}</style>

      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 fixed-ios ${
          isScrolled 
            ? "bg-black bg-opacity-95 shadow-lg" 
            : "bg-black border-b border-yellow-400"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" aria-label="Go to homepage">
            <div className="relative overflow-hidden rounded-full border-2 border-yellow-400 transition-all duration-300 group-hover:border-white">
              <Image
                src={logo}
                alt="59Minutes Prints"
                width={40}
                height={40}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="font-bold text-xl hidden sm:block text-yellow-400 transition-colors duration-300 group-hover:text-white whitespace-nowrap">59Minutes Prints</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-grow">
            <div className="flex items-center space-x-1 lg:space-x-3 bg-gray-800 bg-opacity-50 rounded-full px-2 py-1">
              {NAV_LINKS.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center px-3 py-2 rounded-full text-sm lg:text-base transition-all duration-300 hover:bg-gray-700 ${
                    pathname === href 
                      ? "bg-yellow-500 text-black font-medium" 
                      : "text-white"
                  }`}
                >
                  <span className="hidden lg:inline-block">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  href="/Auth/Login"
                  className="text-white border border-yellow-400 px-4 py-2 rounded-full font-medium hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/Auth/Register"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-400 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/Clients/Cart"
                  className="relative p-2 rounded-full bg-gray-800 text-yellow-400 hover:bg-gray-700 transition-all duration-300"
                  aria-label="View cart"
                >
                  <FaShoppingCart size={20} className="cart-icon" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-full pl-2 pr-4 py-2 transition-all duration-300"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black">
                      <FaUserCircle size={20} />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {user?.displayName?.charAt(0).toUpperCase() || "Account"}
                    </span>
                  </button>
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 text-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-3 border-b border-gray-700 px-4">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium truncate">
                        {user?.email || "User"}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors"
                        role="menuitem"
                      >
                        <FaUserCircle className="mr-3 text-yellow-400" size={16} />
                        Profile
                      </Link>
                      <Link
                        href="/Clients/Dashboard"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors"
                        role="menuitem"
                      >
                        <FaBoxOpen className="mr-3 text-yellow-400" size={16} />
                        Dashboard
                      </Link>
                      <Link
                        href="/Inbox"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors"
                        role="menuitem"
                      >
                        <FaListAlt className="mr-3 text-yellow-400" size={16} />
                        Inbox
                      </Link>
                      <Link
                        href="/Help"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors"
                        role="menuitem"
                      >
                        <FaInfoCircle className="mr-3 text-yellow-400" size={16} />
                        Help
                      </Link>
                    </div>
                    <div className="border-t border-gray-700 py-2">
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition-colors"
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        <FiX className="mr-3" size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <Link
                href="/Clients/Cart"
                className="relative p-2 text-yellow-400"
                aria-label="View cart"
              >
                <FaShoppingCart size={20} className="cart-icon" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-full bg-gray-800 text-yellow-400 focus:outline-none hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 shadow-xl z-50 mobile-menu-transition overflow-y-auto smooth-scroll md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-yellow-400 font-bold text-xl">Menu</span>
          <button
            className="p-2 rounded-full bg-gray-800 text-yellow-400 hover:bg-gray-700 transition-colors"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4">
          {user && (
            <div className="mb-6 pb-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black">
                  <FaUserCircle size={24} />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[180px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <ul className="space-y-1">
            {NAV_LINKS.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center rounded-lg py-3 px-4 ${
                    pathname === href
                      ? "bg-yellow-500 text-black font-medium"
                      : "text-white hover:bg-gray-800"
                  } transition-colors`}
                  onClick={closeMobileMenu}
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Authentication Section */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            {!user ? (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/Auth/Login"
                  className="w-full py-3 border border-yellow-400 text-yellow-400 rounded-lg text-center font-medium hover:bg-yellow-400 hover:text-black transition-all"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  href="/Auth/Register"
                  className="w-full py-3 bg-yellow-500 text-black rounded-lg text-center font-medium hover:bg-yellow-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-medium px-2 uppercase mb-2">Account</p>
                <Link
                  href="/profile"
                  className="flex items-center rounded-lg py-3 px-4 text-white hover:bg-gray-800 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaUserCircle className="mr-3 text-yellow-400" size={16} />
                  Profile
                </Link>
                <Link
                  href="/Clients/Dashboard"
                  className="flex items-center rounded-lg py-3 px-4 text-white hover:bg-gray-800 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaBoxOpen className="mr-3 text-yellow-400" size={16} />
                  Dashboard
                </Link>
                <Link
                  href="/Clients/Cart"
                  className="flex items-center rounded-lg py-3 px-4 text-white hover:bg-gray-800 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaShoppingCart className="mr-3 text-yellow-400" size={16} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/Inbox"
                  className="flex items-center rounded-lg py-3 px-4 text-white hover:bg-gray-800 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaListAlt className="mr-3 text-yellow-400" size={16} />
                  Inbox
                </Link>
                <Link
                  href="/Help"
                  className="flex items-center rounded-lg py-3 px-4 text-white hover:bg-gray-800 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaInfoCircle className="mr-3 text-yellow-400" size={16} />
                  Help
                </Link>
                <button
                  className="flex items-center w-full text-left rounded-lg py-3 px-4 text-red-400 hover:bg-gray-800 transition-colors mt-2"
                  onClick={handleLogout}
                >
                  <FiX className="mr-3" size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden under navbar */}
      <div className="pt-16"></div>
    </>
  );
};

export default Navbar;