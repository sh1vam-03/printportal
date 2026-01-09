import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PublicLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Help Center", path: "/help" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
            {/* Premium Glassmorphism Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="relative flex items-center justify-center h-10 w-10 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
                            PrintPortal
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                    ? "bg-brand-50 text-brand-700"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Return to App
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden relative">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>

                        {/* Mobile Dropdown */}
                        {isMobileMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-2 space-y-1 animate-in fade-in slide-in-from-top-4 z-50">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.path}
                                        onClick={() => {
                                            navigate(link.path);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.path
                                            ? "bg-brand-50 text-brand-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {link.name}
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white bg-gray-900 shadow-md hover:bg-gray-800"
                                >
                                    Return to App
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="bg-white border-t border-gray-100 pb-8 pt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-gray-900">PrintPortal</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                                Streamlining printing operations with secure, efficient, and trackable cloud-based solutions.
                            </p>
                        </div>



                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Resources & Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><button onClick={() => navigate('/privacy')} className="hover:text-brand-600 transition-colors">Privacy Policy</button></li>
                                <li><button onClick={() => navigate('/terms')} className="hover:text-brand-600 transition-colors">Terms of Service</button></li>
                                <li><button onClick={() => navigate('/help')} className="hover:text-brand-600 transition-colors">Help Center</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                        <p>&copy; {new Date().getFullYear()} PrintPortal. All rights reserved.</p>
                        <div className="flex gap-4">
                            <span>v1.0.0</span>
                            <span className="hidden md:inline">&bull;</span>
                            <span>Secure & Encrypted</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
